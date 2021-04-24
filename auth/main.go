package main

import (
	"fmt"
	"net/http"
	"strings"
	"time"

	tg "quiz-auth/token_generator"

	"github.com/gin-gonic/gin"
)

type UserCredentials struct {
	UserID   uint64 `json:"user_id"`
	UserName string `json:"username"`
	Password string `json:"password"`
}

type Token struct {
	Token string `json:"token"`
}

func setupRouter() *gin.Engine {
	r := gin.Default()

	r.POST("/generate", generateTokenPOST)
	r.GET("/validate", validateTokenGET)

	return r
}

var tokenGenerator *tg.TokenGenerator

func main() {
	fmt.Println("Bla bla bla")

	var err error
	tokenGenerator, err = tg.NewTokenGenerator("localhost:6379", time.Hour, "dadadaotelu")
	if err != nil {
		panic(err)
	}

	r := setupRouter()
	r.Run(":8000")
}

func generateTokenPOST(c *gin.Context) {
	var uc UserCredentials

	if err := c.ShouldBindJSON(&uc); err != nil {
		c.String(http.StatusInternalServerError, "failed to serve request, please retry")
		return
	}

	td, err := tokenGenerator.CreateToken(uc.UserID, uc.UserName)
	if err != nil {
		c.String(http.StatusInternalServerError, "failed to generate token, please retry")
		return
	}

	if err = tokenGenerator.CreateSession(uc.UserID, uc.UserName, td); err != nil {
		c.String(http.StatusInternalServerError, "failed to generate token, please retry")
		return
	}

	c.JSON(http.StatusCreated, Token{Token: td.Token})
}

func validateTokenGET(c *gin.Context) {
	token := c.GetHeader("Authorization")
	if token == "" {
		c.String(http.StatusForbidden, "no Authorization token provided")
		return
	}

	splitToken := strings.Split(token, " ")
	token = splitToken[1]

	if err := tokenGenerator.ValidateToken(token); err != nil {
		c.String(http.StatusUnauthorized, err.Error())
		return
	}

	ad, err := tokenGenerator.GetAccessDetails(token)
	if err != nil {
		c.String(http.StatusNotFound, err.Error())
		return
	}

	if _, err := tokenGenerator.ValidateSession(ad); err != nil {
		c.String(http.StatusNotFound, err.Error())
		return
	}

	c.String(http.StatusOK, "ok")
}
