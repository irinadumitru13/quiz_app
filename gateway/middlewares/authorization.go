package middlewares

import (
	"io/ioutil"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

type AuthorizationMiddleware struct {
	sessionManagerURL string
	client            *http.Client
}

func NewAuthorizationMiddleware(sessionManagerURL string) *AuthorizationMiddleware {
	client := &http.Client{
		Timeout: time.Second * 10,
	}
	return &AuthorizationMiddleware{sessionManagerURL, client}
}

func (m *AuthorizationMiddleware) Middleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		if c.Request.Method == "OPTIONS" {
			c.Next()
			return
		}

		URI := c.Request.RequestURI[1:]
		split := strings.Split(URI, "/")
		if split[0] == "auth" {
			c.Next()
			return
		}

		bearer := c.GetHeader("Authorization")

		req, err := http.NewRequest("GET", m.sessionManagerURL, nil)
		if err != nil {
			c.String(http.StatusInternalServerError, "internal error")
			c.Abort()
			return
		}

		req.Header.Add("Authorization", bearer)

		resp, err := m.client.Do(req)
		if err != nil {
			c.String(http.StatusInternalServerError, "internal error")
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

		c.Next()
	}
}
