package main

import (
	"net/http"
	"os"
	"strconv"

	sa "odin-io/sql_adapter"

	"github.com/gin-gonic/gin"
)

var sqlAdapter *sa.Adapter

type UserCredentials struct {
	UserName string `json:"username"`
	Password string `json:"password"`
}

func getEnvWithDefault(key, fallback string) string {
	if e, ok := os.LookupEnv(key); ok {
		return e
	}
	return fallback
}

func setupRouter() *gin.Engine {
	r := gin.Default()

	r.POST("/register", registerUserPOST)

	return r
}

func main() {
	var err error

	sqlPort, err := strconv.ParseInt(getEnvWithDefault("SQL_PORT", "5432"), 10, 64)
	if err != nil {
		panic(err)
	}
	sqlHost := getEnvWithDefault("SQL_HOST", "postgres")
	sqlUser := getEnvWithDefault("SQL_USER", "admin")
	sqlPassword := getEnvWithDefault("SQL_PASSWORD", "some_strong_password")
	sqlDB := getEnvWithDefault("SQL_DATABASE", "default")

	sqlConn, err := sa.ConnectPostgreSQL(sqlUser, sqlPassword, sqlHost, sqlDB, sqlPort)
	if err != nil {
		panic(err)
	}

	sqlAdapter = sa.NewAdapter(sqlConn)

	r := setupRouter()

	port := getEnvWithDefault("PORT", "8000")
	r.Run(":" + port)
}

func registerUserPOST(c *gin.Context) {
	var uc UserCredentials

	if err := c.ShouldBindJSON(&uc); err != nil {
		c.String(http.StatusInternalServerError, "failed to serve request, please retry")
		c.Abort()
		return
	}

	ui, err := sqlAdapter.CreateUser(uc.UserName, uc.Password)
	if err != nil {
		c.String(http.StatusBadRequest, err.Error())
		c.Abort()
		return
	}

	c.JSON(http.StatusCreated, ui)
}
