package saml

import (
	"context"
	"crypto/rsa"
	"crypto/tls"
	"crypto/x509"
	"fmt"
	"net/http"
	"net/url"

	"github.com/crewjam/saml/samlsp"
)

type ServiceProvider struct {
	name       string
	middleware *samlsp.Middleware
}

func hello(w http.ResponseWriter, r *http.Request) {
	cookie, _ := r.Cookie("token")
	fmt.Fprintf(w, "%s", cookie.Value)
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
