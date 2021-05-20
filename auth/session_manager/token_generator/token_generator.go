package token_generator

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis/v7"
	"github.com/twinj/uuid"
)

const (
	invalidClaimsError = "invalid claims"
)

// TokenDetails is used to identify a token and it's expiry date.
type TokenDetails struct {
	Token   string
	Uuid    string
	Expires int64
}

// AccessDetails represents the information about the user provided
// through the token.
type AccessDetails struct {
	Uuid           string `json:"uuid"`
	UserId         uint64 `json:"uid"`
	UserName       string `json:"username"`
	UserPermission uint64 `json:"permissions"`
}

type TokenGenerator struct {
	db             *redis.Client
	expirationTime time.Duration
	secret         string
}

type redisEntry struct {
	UserId         uint64
	UserName       string
	UserPermission uint64
}

func NewTokenGenerator(redisDNS string, expiration time.Duration, secret string) (*TokenGenerator, error) {
	tg := &TokenGenerator{
		expirationTime: expiration,
		secret:         secret,
	}

	tg.db = redis.NewClient(&redis.Options{
		Addr: redisDNS,
	})
	_, err := tg.db.Ping().Result()
	if err != nil {
		return nil, err
	}

	return tg, nil
}

// CreateToken takes in user information and encodes it in a token.
func (g *TokenGenerator) CreateToken(userId uint64, userName string, permissions uint64) (*TokenDetails, error) {
	td := &TokenDetails{}
	td.Expires = time.Now().Add(g.expirationTime).Unix()
	td.Uuid = uuid.NewV4().String()

	claims := jwt.MapClaims{}
	claims["authorized"] = true
	claims["uuid"] = td.Uuid
	claims["user_id"] = userId
	claims["user_name"] = userName
	claims["user_permissions"] = permissions
	claims["exp"] = td.Expires

	var err error
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	if td.Token, err = token.SignedString([]byte(g.secret)); err != nil {
		return nil, err
	}

	return td, nil
}

// CreateSession takes in user information and the token details it is tied to
// and creates an entry in the Redis database for later session validation.
func (g *TokenGenerator) CreateSession(userId uint64, userName string, userPermissions uint64, td *TokenDetails) error {
	// Convert Unix to UTC
	t := time.Unix(td.Expires, 0)
	now := time.Now()

	re := &redisEntry{
		UserId:         userId,
		UserName:       userName,
		UserPermission: userPermissions,
	}

	// Encode the RedisEntry as a json to store in the db.
	p, err := json.Marshal(re)
	if err != nil {
		return err
	}

	// Save session to Redis
	if err := g.db.Set(td.Uuid, p, t.Sub(now)).Err(); err != nil {
		return err
	}
	return nil
}

// VerifySignature checks if the token is signed with the appropriate secret
// and returns it in case of success.
func (g *TokenGenerator) VerifySignature(tokenString string) (*jwt.Token, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %s", token.Header["alg"])
		}
		return []byte(g.secret), nil
	})
	if err != nil {
		return nil, err
	}

	return token, nil
}

// ValidateToken verifies if a given token was created by the TokenGenerator.
func (g *TokenGenerator) ValidateToken(tokenString string) error {
	token, err := g.VerifySignature(tokenString)
	if err != nil {
		return err
	}

	if _, ok := token.Claims.(jwt.Claims); !ok || !token.Valid {
		return fmt.Errorf("invalid token")
	}

	return nil
}

// GetAccessDetails returns user information stored in the token if it is valid.
func (g *TokenGenerator) GetAccessDetails(tokenString string) (*AccessDetails, error) {
	token, err := g.VerifySignature(tokenString)
	if err != nil {
		return nil, err
	}

	if err := g.ValidateToken(tokenString); err != nil {
		return nil, err
	}

	claims := token.Claims.(jwt.MapClaims)
	uuid, ok := claims["uuid"].(string)
	if !ok {
		return nil, fmt.Errorf(invalidClaimsError)
	}
	username, ok := claims["user_name"].(string)
	if !ok {
		return nil, fmt.Errorf(invalidClaimsError)
	}

	userId, err := strconv.ParseUint(fmt.Sprintf("%.f", claims["user_id"]), 10, 64)
	if err != nil {
		return nil, err
	}

	return &AccessDetails{
		Uuid:     uuid,
		UserId:   userId,
		UserName: username,
	}, nil
}

// ValidateSession verifies if a given AccessDetails structure is present in the Redis session
// database. If not, the session might have expired or was fabricated by somebody else.
func (g *TokenGenerator) ValidateSession(ad *AccessDetails) (*AccessDetails, error) {
	p, err := g.db.Get(ad.Uuid).Result()
	if err != nil {
		return nil, err
	}

	re := &redisEntry{}
	if err := json.Unmarshal([]byte(p), re); err != nil {
		return nil, err
	}

	return &AccessDetails{
		Uuid:     ad.Uuid,
		UserId:   re.UserId,
		UserName: re.UserName,
	}, nil
}

func ExtractToken(bearer string) (string, error) {
	split := strings.Split(bearer, " ")
	if len(split) != 2 {
		return "", fmt.Errorf("no token provided")
	}

	return split[1], nil
}

func (g *TokenGenerator) TokenValidationMiddleware(c *gin.Context) {
	bearer := c.GetHeader("Authorization")
	token, err := ExtractToken(bearer)
	if err != nil {
		c.String(http.StatusUnauthorized, err.Error())
		c.Abort()
		return
	}

	if err := g.ValidateToken(token); err != nil {
		c.String(http.StatusUnauthorized, err.Error())
		c.Abort()
		return
	}

	ad, err := g.GetAccessDetails(token)
	if err != nil {
		c.String(http.StatusNotFound, err.Error())
		c.Abort()
		return
	}

	if _, err := g.ValidateSession(ad); err != nil {
		c.String(http.StatusUnauthorized, err.Error())
		c.Abort()
		return
	}

	c.Next()
}
