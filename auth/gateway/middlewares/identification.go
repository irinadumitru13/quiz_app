package middlewares

import (
	"bytes"
	"encoding/json"
	"io/ioutil"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

// IdentificationMiddleware provides user identification data
// based on an authorization bearer token.
type IdentificationMiddleware struct {
	getClaimsURL string
	client       *http.Client
}

// AccessDetails represents the information about the user provided
// through the token.
// Must be the same as in
// /odin-auth/session-manager/token-generator/token_generator.go!
// TODO: remove once the repository is public and import it directly.
type AccessDetails struct {
	UUID            string `json:"uuid"`
	UserId          uint64 `json:"uid"`
	UserName        string `json:"username"`
	UserPermissions uint64 `json:"permissions"`
}

// NewIdentificationMiddleware expects an URL to fetch user data from
// based on the authorization token and returns a new Identification Middleware.
func NewIdentificationMiddleware(getClaimsURL string) *IdentificationMiddleware {
	client := &http.Client{
		Timeout: time.Second * 10,
	}
	return &IdentificationMiddleware{getClaimsURL, client}
}

// Middleware generates a gin middleware handler.
func (m *IdentificationMiddleware) Middleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		if c.Request.Method == "OPTIONS" {
			c.Next()
			return
		}

		// Check the request URI and see if it starts with "/auth".
		// Any traffic going to the authentication service doesn't
		// require user identification so we just pass it to the next handler.
		URI := c.Request.RequestURI[1:]
		split := strings.Split(URI, "/")
		if split[0] == "auth" {
			c.Next()
			return
		}

		// Extract the authorization bearer and create a new request
		// containing the same header.
		bearer := c.GetHeader("Authorization")
		req, err := http.NewRequest("GET", m.getClaimsURL, nil)
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

		// Check if the user identification data was received.
		if resp.StatusCode != http.StatusOK {
			c.String(resp.StatusCode, string(body))
			c.Abort()
			return
		}

		var ad AccessDetails
		json.NewDecoder(bytes.NewBuffer(body)).Decode(&ad)

		// Add identification headers.
		c.Request.Header.Set("User-Session-Id", ad.UUID)
		c.Request.Header.Set("User-Name", ad.UserName)
		c.Request.Header.Set("User-Permissions", strconv.FormatUint(ad.UserPermissions, 10))

		c.Next()
	}
}
