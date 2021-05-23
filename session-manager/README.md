# Session manager

The session manager is responsible for creating user sessions. A user session
is encoded as a `JWT` token and is stored in a `redis` database alongside
session information for the purposes of the sessions integrity.

## Exposed API

### POST /generate

Receive user information, generate a token based on them and store it in the
database.

- Status:
  - 201 CREATED if the session has bee created
  - 500 INTERNAL SERVER ERROR internal database validations have failed
- Request body:

```json
{
	"id": uint64,
	"username": string,
	"password": string,
	"permissions": uint64
}
```

The password is NOT stored in the session token or info by any means.

- Response body:

```
token: string
```

### GET /validate

This endpoint requires the `Authorization` header to contain `Bearer {token}`
in order to validate it.

- Status:
  - 200 OK if the token is valid
  - 401 UNAUTHORIZED if the token is invalid or not provided

### GET /claims

This endpoint requires the `Authorization` header to contain `Bearer {token}`
in order to validate it.

- Status:
  - 200 OK if the token is valid
  - 400 BAD REQUEST if no session info is available in the database
  - 401 UNAUTHORIZED if the token is invalid or not provided
