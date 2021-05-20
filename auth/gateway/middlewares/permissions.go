package middlewares

import (
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

var protections = map[string]uint64{
	"admin":     10,
	"mentainer": 5,
	"ip":        0,
}

type PermissionsMiddleware struct {
	client *http.Client
}

func NewPermissionsMiddleware() *PermissionsMiddleware {
	client := &http.Client{
		Timeout: time.Second * 10,
	}
	return &PermissionsMiddleware{client}
}

func (m *PermissionsMiddleware) Middleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		URI := c.Request.RequestURI[1:]
		split := strings.Split(URI, "/")
		if split[0] == "auth" {
			c.Next()
			return
		}

		permissions := c.Request.Header.Get("User-Permissions")
		permissionLevel, err := strconv.ParseUint(permissions, 10, 64)
		if err != nil {
			log.Println(err)
			c.String(http.StatusInternalServerError, "not allowed")
			c.Abort()
			return
		}

		if requiredPermissionLevel, ok := protections[split[0]]; ok && requiredPermissionLevel > permissionLevel {
			c.String(http.StatusUnauthorized, "not allowed")
			c.Abort()
			return
		}

		c.Next()
	}
}
