# Login manager

The login manager uses a session manager and a user management service
to provide `login` and `register` functionality.

## Exposed API

### POST /auth/login

Attempt to login a user and generate a session token for him.

- Status:
  - 201 CREATED if the session has been created
  - 400 BAD REQUEST invalid credentials
  - 500 INTERNAL SERVER ERROR if constraints were violated
- Request body:

```json
{
	"username": string,
	"password": string
}
```

- Response body:

```
token: string
```

### POST /auth/register

Attempt to register a user.

- Status:
  - 201 CREATED if the session has been created
  - 400 BAD REQUEST username exists
  - 500 INTERNAL SERVER ERROR if constraints were violated
- Request body:

```json
{
	"username": string,
	"password": string
}
```
