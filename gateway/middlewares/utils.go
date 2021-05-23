package middlewares

import (
	"fmt"
	"strings"
)

func ExtractToken(bearer string) (string, error) {
	split := strings.Split(bearer, " ")
	if len(split) != 2 {
		return "", fmt.Errorf("no token provided")
	}

	return split[1], nil
}
