package main

import (
	"bytes"
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"time"

	"odin-login-manager/saml"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gopkg.in/validator.v2"
)

type UserCredentials struct {
	UserID   uint64 `json:"id"`
	UserName string `json:"username" validate:"min=5,max=50,regexp=^[a-zA-Z0-9]*$"`
	Password string `json:"password" validate:"min=8,max=50"`
}

var sessionManagerURL = "localhost"
var ioAdapterURL = "localhost"

func getEnvWithDefault(key, fallback string) string {
	if e, ok := os.LookupEnv(key); ok {
		return e
	}
	return fallback
}

func setupRouter() *gin.Engine {
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"POST"},
		AllowHeaders:     []string{"Origin", "Content-Type"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	r.POST("/auth/login", localLoginPOST)
	r.POST("/auth/register", localRegisterPOST)

	return r
}

func main() {
	sessionManagerURL = getEnvWithDefault("SESSION_MANAGER", "session-manager")
	ioAdapterURL = getEnvWithDefault("IO_ADAPTER", "io-adapter")
	port := getEnvWithDefault("PORT", "8000")

	samlPort := getEnvWithDefault("SAML_PORT", "8003")
	samlIDP := getEnvWithDefault("SAML_IDP", "https://samltest.id/saml/idp")
	samlRoot := getEnvWithDefault("SAML_ROOT", "http://localhost:"+samlPort)
	samlName := getEnvWithDefault("SAML_NAME", "myservice")

	log.Printf("Using session-manager at %q", sessionManagerURL)
	log.Printf("Using io-adapter at %q", ioAdapterURL)

	r := setupRouter()
	samlSP, err := saml.NewServiceProvider(samlName, samlIDP, samlRoot)
	if err != nil {
		log.Fatal(err)
	}

	go r.Run(":" + port)
	samlSP.Run(":" + samlPort)
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
