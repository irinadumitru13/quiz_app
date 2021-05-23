# IO login manager

The service is responsible of exposing an open API to handle users from a
SQL type database.

## Exposed API

### POST /register

Attempt to register a new user and create it the database.

- Status:
  - 201 CREATED if the user been created
  - 400 BAD REQUEST username already exists
- Request body:

```json
{
	"username": string,
	"password": string
}
```

- Response body:

```json
{
	"id": uint64,
	"username": string,
	"permissions": uint64
}
```

### POST /check_credentials

Attempt to register a user.

- Status:
  - 200 OK valid credentials
  - 400 BAD REQUEST invalid credentials
- Request body:

```json
{
	"username": string,
	"password": string
}
```

- Response body:

```json
{
	"id": uint64,
	"username": string,
	"permissions": uint64
}
```

### POST /update_credentials

Attempt to update a users credentials. The username and password can be updated
both at the same time or only one of them.

- Status:
  - 200 OK if the new credentials have been returned
  - 400 BAD REQUEST invalid credentials
- Request body:

```json
{
	"username": string,
	"password": string,
	"new_username": string,	// optional
	"new_password": string	//optional
}
```

- Response body:

```json
{
	"username": string,
	"password": string
}
```
