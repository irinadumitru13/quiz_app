package main

import (
	"fmt"
	"net/http"
	"os"
	"time"

	tg "odin-session-manager/token_generator"

	"github.com/gin-gonic/gin"
)

type UserCredentials struct {
	UserID      uint64 `json:"id"`
	UserName    string `json:"username"`
	Password    string `json:"password"`
	Permissions uint64 `json:"permissions"`
}

var tokenGenerator *tg.TokenGenerator

func getEnvWithDefault(key, fallback string) string {
	if e, ok := os.LookupEnv(key); ok {
		return e
	}
	return fallback
}

func setupRouter() *gin.Engine {
	r := gin.Default()

	r.POST("/generate", generateTokenPOST)

	authorized := r.Group("/")
	authorized.Use(tokenGenerator.TokenValidationMiddleware)
	{
		authorized.GET("/validate", validateTokenGET)
		authorized.GET("/claims", tokenClaimsGET)
	}

	return r
}

func main() {
	var err error

	redisDNS := getEnvWithDefault("REDIS_DNS", "redis")
	redisPort := getEnvWithDefault("REDIS_PORT", "6379")
	redisConn := fmt.Sprintf("%s:%s", redisDNS, redisPort)

	ts := getEnvWithDefault("TOKEN_SECRET", "some_powerfull_stuff")

	tokenGenerator, err = tg.NewTokenGenerator(redisConn, time.Hour, ts)
	if err != nil {
		panic(err)
	}

	r := setupRouter()

	port := getEnvWithDefault("PORT", "8000")
	r.Run(":" + port)
}

func generateTokenPOST(c *gin.Context) {
	var uc UserCredentials

	if err := c.ShouldBindJSON(&uc); err != nil {
		c.String(http.StatusInternalServerError, "failed to serve request, please retry")
		return
	}

	td, err := tokenGenerator.CreateToken(uc.UserID, uc.UserName, uc.Permissions)
	if err != nil {
		c.String(http.StatusInternalServerError, "failed to generate token, please retry")
		return
	}

	if err = tokenGenerator.CreateSession(uc.UserID, uc.UserName, uc.Permissions, td); err != nil {
		c.String(http.StatusInternalServerError, "failed to generate token, please retry")
		return
	}

	c.String(http.StatusCreated, td.Token)
}

func validateTokenGET(c *gin.Context) {
	c.String(http.StatusOK, "ok")
}

func tokenClaimsGET(c *gin.Context) {
	bearer := c.GetHeader("Authorization")
	token, err := tg.ExtractToken(bearer)
	if err != nil {
		c.String(http.StatusBadGateway, err.Error())
		c.Abort()
		return
	}

	ad, err := tokenGenerator.GetAccessDetails(token)
	if err != nil {
		c.String(http.StatusBadRequest, err.Error())
		c.Abort()
		return
	}

	c.JSON(http.StatusOK, ad)
}
