package main

import (
	"context"
	"log"
	"os"
	"strconv"

	"odin-gateway/middlewares"

	"github.com/devopsfaith/krakend/config"
	"github.com/devopsfaith/krakend/logging"
	"github.com/devopsfaith/krakend/proxy"
	"github.com/devopsfaith/krakend/router"
	"github.com/gin-gonic/gin"

	metricsgin "github.com/devopsfaith/krakend-metrics/gin"
	krakendgin "github.com/devopsfaith/krakend/router/gin"
	influxdb "github.com/letgoapp/krakend-influx"

	_ "github.com/devopsfaith/krakend-opencensus/exporter/influxdb"
)

func getEnvWithDefault(key, fallback string) string {
	if e, ok := os.LookupEnv(key); ok {
		return e
	}
	return fallback
}

func main() {
	portString := getEnvWithDefault("PORT", "8000")
	logLevel := getEnvWithDefault("LOG_LEVEL", "ERROR")
	debugString := getEnvWithDefault("DEBUG", "false")
	configFile := getEnvWithDefault("CONFIG", "/etc/krakend/configuration.json")
	sessionValidationURL := getEnvWithDefault("SESSION_VALIDATION_URL", "http://session-manager:8000/validate")
	userClaimsURL := getEnvWithDefault("USER_CLAIMS_URL", "http://session-manager:8000/claims")

	port, err := strconv.Atoi(portString)
	if err != nil {
		log.Fatal(err)
	}

	debug, err := strconv.ParseBool(debugString)
	if err != nil {
		log.Fatal(err)
	}

	parser := config.NewParser()
	serviceConfig, err := parser.Parse(configFile)
	if err != nil {
		log.Fatal("ERROR:", err.Error())
	}

	serviceConfig.Debug = serviceConfig.Debug || debug
	serviceConfig.Port = port

	logger, err := logging.NewLogger(logLevel, os.Stdout, "[KRAKEND]")
	if err != nil {
		log.Fatal("ERROR:", err.Error())
	}

	sessionValidator := middlewares.NewAuthorizationMiddleware(sessionValidationURL)
	sessionValidatorMiddleware := sessionValidator.Middleware()

	userIdentification := middlewares.NewIdentificationMiddleware(userClaimsURL)
	userIdentificationMiddleware := userIdentification.Middleware()

	permissionLevelValidator := middlewares.NewPermissionsMiddleware()
	permissionLevelValidatorMiddleware := permissionLevelValidator.Middleware()

	ctx := context.Background()
	metric := metricsgin.New(ctx, serviceConfig.ExtraConfig, logger)

	if err := influxdb.New(ctx, serviceConfig.ExtraConfig, metric, logger); err != nil {
		log.Fatal("ERROR:", err.Error())
	}

	pf := proxy.NewDefaultFactory(metric.DefaultBackendFactory(), logger)

	mws := []gin.HandlerFunc{sessionValidatorMiddleware, userIdentificationMiddleware, permissionLevelValidatorMiddleware}

	routerFactory := krakendgin.NewFactory(krakendgin.Config{
		Engine:         gin.Default(),
		ProxyFactory:   customProxyFactory{logger, metric.ProxyFactory("pipe", pf)},
		Logger:         logger,
		HandlerFactory: metric.NewHTTPHandlerFactory(krakendgin.EndpointHandler),
		Middlewares:    mws,
		RunServer:      router.RunServer,
	})

	routerFactory.New().Run(serviceConfig)
}

// customProxyFactory adds a logging middleware wrapping the internal factory.
type customProxyFactory struct {
	logger  logging.Logger
	factory proxy.Factory
}

// New implements the Factory interface.
func (cf customProxyFactory) New(cfg *config.EndpointConfig) (p proxy.Proxy, err error) {
	p, err = cf.factory.New(cfg)
	if err == nil {
		p = proxy.NewLoggingMiddleware(cf.logger, cfg.Endpoint)(p)
	}
	return
}
