package main

import (
	"log"
	"os"
	"strconv"

	"odin-gateway/middlewares"

	"github.com/devopsfaith/krakend/config"
	"github.com/devopsfaith/krakend/logging"
	"github.com/devopsfaith/krakend/proxy"
	"github.com/devopsfaith/krakend/router"
	"github.com/gin-gonic/gin"

	krakendgin "github.com/devopsfaith/krakend/router/gin"
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

	c := middlewares.NewAuthorizationMiddleware(sessionValidationURL)
	m := c.Middleware()

	mws := []gin.HandlerFunc{m}

	routerFactory := krakendgin.NewFactory(krakendgin.Config{
		Engine:         gin.Default(),
		ProxyFactory:   customProxyFactory{logger, proxy.DefaultFactory(logger)},
		Logger:         logger,
		HandlerFactory: krakendgin.EndpointHandler,
		Middlewares:    mws,
		RunServer:      router.RunServer,
	})

	routerFactory.New().Run(serviceConfig)
}

// customProxyFactory adds a logging middleware wrapping the internal factory
type customProxyFactory struct {
	logger  logging.Logger
	factory proxy.Factory
}

// New implements the Factory interface
func (cf customProxyFactory) New(cfg *config.EndpointConfig) (p proxy.Proxy, err error) {
	p, err = cf.factory.New(cfg)
	if err == nil {
		p = proxy.NewLoggingMiddleware(cf.logger, cfg.Endpoint)(p)
	}
	return
}
