package main

import (
	"context"
	"crypto/rsa"
	"crypto/tls"
	"crypto/x509"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"os"

	"github.com/crewjam/saml/samlsp"
)

type ServiceProvider struct {
	name       string
	middleware *samlsp.Middleware
}

var sessionManagerURL string

func getEnvWithDefault(key, fallback string) string {
	if e, ok := os.LookupEnv(key); ok {
		return e
	}
	return fallback
}

// TODO(seritandrei): add token and session generation
func hello(w http.ResponseWriter, r *http.Request) {
	cookie, _ := r.Cookie("token")
	fmt.Fprintf(w, "%s", cookie.Value)
}

func main() {
	sessionManagerURL := getEnvWithDefault("SESSION_MANAGER", "session-manager")
	samlPort := getEnvWithDefault("SAML_PORT", "8003")
	samlIDP := getEnvWithDefault("SAML_IDP", "https://samltest.id/saml/idp")
	samlRoot := getEnvWithDefault("SAML_ROOT", "http://localhost:"+samlPort)
	samlName := getEnvWithDefault("SAML_NAME", "myservice")

	log.Printf("Using session-manager at %q", sessionManagerURL)

	samlSP, err := NewServiceProvider(samlName, samlIDP, samlRoot)
	if err != nil {
		log.Fatal(err)
	}

	samlSP.Run(":" + samlPort)
}

func NewServiceProvider(name, idp, root string) (*ServiceProvider, error) {
	keyPair, err := tls.LoadX509KeyPair(name+".cert", name+".key")
	if err != nil {
		return nil, err
	}
	keyPair.Leaf, err = x509.ParseCertificate(keyPair.Certificate[0])
	if err != nil {
		return nil, err
	}

	idpMetadataURL, err := url.Parse(idp)
	if err != nil {
		return nil, err
	}
	idpMetadata, err := samlsp.FetchMetadata(context.Background(), http.DefaultClient, *idpMetadataURL)
	if err != nil {
		return nil, err
	}

	rootURL, err := url.Parse(root)
	if err != nil {
		return nil, err
	}

	samlSP, err := samlsp.New(samlsp.Options{
		URL:         *rootURL,
		Key:         keyPair.PrivateKey.(*rsa.PrivateKey),
		Certificate: keyPair.Leaf,
		IDPMetadata: idpMetadata,
	})
	if err != nil {
		return nil, err
	}
	return &ServiceProvider{
		name:       name,
		middleware: samlSP,
	}, nil
}

func (s *ServiceProvider) Run(port string) {
	app := http.HandlerFunc(hello)
	http.Handle("/saml/", s.middleware)
	http.Handle("/", s.middleware.RequireAccount(app))
	http.ListenAndServe(port, nil)
}
