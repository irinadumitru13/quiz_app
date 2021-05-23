# Gateway

The main focus of the gateway is to securely expose the backend API.

## Dropping requests

Any request targeted to an endpoint not prefixed with `/auth/` will be
dropped if the token provided in the `Authorization` header is invalid or
expired. The `middlewares/authorization.go` middleware will not forward
any request found in the previously mentioned categories.

## User identification

User identification is done with the help of the token provided through the
`Authorization` header. A `session-manager` is used to provide session specific
information based on the token and the following headers are added to the
request by the `middlewares/identification.go` middleware.

The following headers are added:

- `User-Name`: a unique string represented by the users `username`.
- `User-Session-Id`: a unique string representing the sessions `UUID`.
- `User-Permissions`: permission level that will be used by the
  permissions middleware.

## User permissions

The current implementation allows endpoint protection for 3 categories of
permission levels:

- permission level `0`: any unprotected endpoint.
- permission level `5`: any endpoint prefixed with `/mentainer`.
- permission level `10`: any endpoint prefixed with `/admin`.

The permissions are handled in the `middlewares/permissions.go` middleware
implementation.

## Metrics

The gateway exports metrics to `influx` and can be examined using `grafana`.
