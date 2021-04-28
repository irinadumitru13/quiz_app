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

type ModifyUserCredentials struct {
	UserName    string `json:"username"`
	Password    string `json:"password"`
	NewUserName string `json:"new_username"`
	NewPassword string `json:"new_password"`
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
	r.POST("/check_credentials", checkCredentialsPOST)
	r.POST("/update_credentials", updateCredentialsPOST)

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

func checkCredentialsPOST(c *gin.Context) {
	var uc UserCredentials

	if err := c.ShouldBindJSON(&uc); err != nil {
		c.String(http.StatusBadRequest, err.Error())
		c.Abort()
		return
	}

	ui, err := sqlAdapter.CheckCredentials(uc.UserName, uc.Password)
	if err != nil {
		c.String(http.StatusBadRequest, err.Error())
		c.Abort()
		return
	}

	c.JSON(http.StatusOK, ui)
}

func updateCredentialsPOST(c *gin.Context) {
	var uc ModifyUserCredentials

	if err := c.ShouldBindJSON(&uc); err != nil {
		c.String(http.StatusBadRequest, err.Error())
		c.Abort()
		return
	}

	ret := &UserCredentials{
		UserName: uc.UserName,
		Password: uc.Password,
	}

	if uc.NewUserName != "" && uc.NewUserName != uc.UserName {
		if _, err := sqlAdapter.UpdateUsername(uc.UserName, uc.Password, uc.NewUserName); err != nil {
			c.String(http.StatusBadRequest, err.Error())
			c.Abort()
			return
		}
		ret.UserName = uc.NewUserName
	}

	if uc.NewPassword != "" && uc.NewPassword != uc.Password {
		if _, err := sqlAdapter.UpdatePassword(uc.UserName, uc.Password, uc.NewPassword); err != nil {
			c.String(http.StatusBadRequest, err.Error())
			c.Abort()
			return
		}
		ret.Password = uc.NewPassword
	}

	c.JSON(http.StatusOK, ret)
}

func registerUserPOST(c *gin.Context) {
	var uc UserCredentials

	if err := c.ShouldBindJSON(&uc); err != nil {
		c.String(http.StatusBadRequest, err.Error())
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
