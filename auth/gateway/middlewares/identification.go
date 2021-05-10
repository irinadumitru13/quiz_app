package middlewares

import (
	"bytes"
	"encoding/json"
	"io/ioutil"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

type IdentificationMiddleware struct {
	getClaimsURL string
	client       *http.Client
}

// AccessDetails represents the information about the user provided
// through the token.
// Must be the same as in token_generator.go!
type AccessDetails struct {
	Uuid     string `json:"uuid"`
	UserId   uint64 `json:"uid"`
	UserName string `json:"username"`
}

func NewIdentificationMiddleware(getClaimsURL string) *IdentificationMiddleware {
	client := &http.Client{
		Timeout: time.Second * 10,
	}
	return &IdentificationMiddleware{getClaimsURL, client}
}

func (m *IdentificationMiddleware) Middleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		URI := c.Request.RequestURI[1:]
		split := strings.Split(URI, "/")
		if split[0] == "auth" {
			c.Next()
			return
		}

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

		if resp.StatusCode != http.StatusOK {
			c.String(resp.StatusCode, string(body))
			c.Abort()
			return
		}

		var ad AccessDetails
		json.NewDecoder(bytes.NewBuffer(body)).Decode(&ad)

		// Add identification headers.
		// TODO(seritandrei): change uuid to userid
		c.Header("User-ID", ad.Uuid)
		c.Header("User-Name", ad.UserName)

		c.Next()
	}
}
