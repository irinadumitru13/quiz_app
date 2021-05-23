package token_generator

import (
	"strings"
	"testing"
)

const secret = "some_secret_value"
const fakeSecret = "some_fake_secret"

func TestCreateToken(t *testing.T) {
	t.Parallel()

	tests := []struct {
		name          string
		userID        uint64
		userName      string
		wantErrString string
	}{
		{
			name:     "Create token",
			userID:   1,
			userName: "Rick the pickle",
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			tg := &TokenGenerator{}

			_, err := tg.CreateToken(test.userID, test.userName)
			if test.wantErrString == "" && err != nil {
				t.Fatalf("unexpected error: %s", err)
			}

			if err != nil && !strings.Contains(err.Error(), test.wantErrString) {
				t.Fatalf("got error %q; expected to contain %q", err, test.wantErrString)
			}
		})
	}
}

func TestValidateToken(t *testing.T) {
	t.Parallel()

	tests := []struct {
		name          string
		userID        uint64
		userName      string
		wantErrString string
	}{
		{
			name:     "Valid token",
			userID:   1,
			userName: "Rick the pickle",
		},
		{
			name:          "Fake token",
			userID:        1,
			userName:      "Rick the pickle",
			wantErrString: "signature",
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			real := &TokenGenerator{secret: secret}
			fake := &TokenGenerator{secret: fakeSecret}

			token, err := real.CreateToken(test.userID, test.userName)
			if test.wantErrString == "" && err != nil {
				t.Fatalf("unexpected error: %s", err)
			}

			if test.wantErrString == "" {
				err = real.ValidateToken(token.Token)
			} else {
				err = fake.ValidateToken(token.Token)
			}

			if err == nil && test.wantErrString != "" {
				t.Fatalf("got error %q; expected to contain %q", err, test.wantErrString)
			}

			if err != nil && !strings.Contains(err.Error(), test.wantErrString) {
				t.Fatalf("got error %q; expected to contain %q", err, test.wantErrString)
			}
		})
	}
}
