package main

import (
	"bytes"
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"gopkg.in/validator.v2"
)

type UserCredentials struct {
	UserID     uint64 `json:"id"`
	UserName   string `json:"username" validate:"min=5,max=50,regexp=^[a-zA-Z0-9]*$"`
	Password   string `json:"password" validate:"min=8,max=50"`
	Permission uint64 `json:"permissions"`
}

var sessionManagerURL string
var ioAdapterURL string

func getEnvWithDefault(key, fallback string) string {
	if e, ok := os.LookupEnv(key); ok {
		return e
	}
	return fallback
}

func CORS() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

func setupRouter() *gin.Engine {
	r := gin.Default()

	r.Use(CORS())

	r.POST("/auth/login", localLoginPOST)
	r.POST("/auth/register", localRegisterPOST)

	return r
}

func main() {
	sessionManagerURL = getEnvWithDefault("SESSION_MANAGER", "session-manager")
	ioAdapterURL = getEnvWithDefault("IO_ADAPTER", "io-adapter")
	port := getEnvWithDefault("PORT", "8000")

	log.Printf("Using session-manager at %q", sessionManagerURL)
	log.Printf("Using io-adapter at %q", ioAdapterURL)

	r := setupRouter()

	r.Run(":" + port)
}

func localLoginPOST(c *gin.Context) {
	var uc UserCredentials

	if err := c.ShouldBindJSON(&uc); err != nil {
		c.String(http.StatusBadRequest, "malformed JSON")
		c.Abort()
		return
	}

	if errs := validator.Validate(uc); errs != nil {
		c.String(http.StatusBadRequest, "failed to validate user credentials")
		c.Abort()
		return
	}

	// Send credential validation request
	json_data, err := json.Marshal(uc)
	if err != nil {
		c.String(http.StatusBadRequest, "malformed JSON")
		c.Abort()
		return
	}

	resp, err := http.Post(ioAdapterURL+"/check_credentials", "application/json", bytes.NewBuffer(json_data))
	if err != nil {
		c.String(http.StatusInternalServerError, "failed to check_credentials")
		c.Abort()
		return
	}

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		c.String(http.StatusInternalServerError, "failed to decode body")
		c.Abort()
		return
	}

	if resp.StatusCode != http.StatusOK {
		c.String(resp.StatusCode, string(body))
		c.Abort()
		return
	}

	// Send session token request
	json.NewDecoder(bytes.NewBuffer(body)).Decode(&uc)
	json_data, err = json.Marshal(uc)
	if err != nil {
		c.String(http.StatusBadRequest, "malformed JSON")
		c.Abort()
		return
	}

	resp, err = http.Post(sessionManagerURL+"/generate", "application/json", bytes.NewBuffer(json_data))
	if err != nil {
		c.String(http.StatusInternalServerError, "failed to generate session token")
		c.Abort()
		return
	}

	body, err = ioutil.ReadAll(resp.Body)
	if err != nil {
		c.String(http.StatusInternalServerError, "failed to decode body")
		c.Abort()
		return
	}
	if resp.StatusCode != http.StatusCreated {
		c.String(resp.StatusCode, string(body))
		c.Abort()
		return
	}

	c.String(resp.StatusCode, string(body))
}

func localRegisterPOST(c *gin.Context) {
	var uc UserCredentials

	if err := c.ShouldBindJSON(&uc); err != nil {
		c.String(http.StatusBadRequest, "malformed JSON")
		c.Abort()
		return
	}

	if err := validator.Validate(uc); err != nil {
		c.String(http.StatusBadRequest, "failed to validate user credentials")
		c.Abort()
		return
	}

	// Send register request
	json_data, err := json.Marshal(uc)
	if err != nil {
		c.String(http.StatusBadRequest, "malformed JSON")
		c.Abort()
		return
	}

	resp, err := http.Post(ioAdapterURL+"/register", "application/json", bytes.NewBuffer(json_data))
	if err != nil {
		c.String(http.StatusInternalServerError, "failed to register")
		c.Abort()
		return
	}

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		c.String(http.StatusInternalServerError, "failed to decode body")
		c.Abort()
		return
	}

	if resp.StatusCode != http.StatusCreated {
		c.String(resp.StatusCode, string(body))
		c.Abort()
		return
	}

	// Read response user info
	json.NewDecoder(bytes.NewBuffer(body)).Decode(&uc)

	c.JSON(resp.StatusCode, uc)
}
