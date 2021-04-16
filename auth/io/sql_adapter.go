package sql_adapter

import (
	"database/sql"
	"fmt"

	_ "github.com/go-sql-driver/mysql"
	"gopkg.in/hlandau/passlib.v1"
)

type Adapter struct {
	dbClient *sql.DB
}

type UserInfo struct {
	ID   int64  `json:"id"`
	Name string `json:"username"`
}

func NewAdapter(db *sql.DB) *Adapter {
	return &Adapter{
		dbClient: db,
	}
}

func (a *Adapter) UpdateUsername(username, password, newUsername string) (int64, error) {
	userInfo, err := a.CheckCredentials(username, password)
	if err != nil {
		return 0, err
	}

	query := `UPDATE users SET username = ? WHERE id = ?`
	res, err := a.dbClient.Exec(query, newUsername, userInfo.ID)
	if err != nil {
		return 0, err
	}

	return res.RowsAffected()
}

func (a *Adapter) UpdatePassword(username, password, newPassword string) (int64, error) {
	userInfo, err := a.CheckCredentials(username, password)
	if err != nil {
		return 0, err
	}

	encryptedPassword, err := passlib.Hash(newPassword)
	if err != nil {
		return 0, err
	}

	query := `UPDATE users SET password = ? WHERE id = ?`
	res, err := a.dbClient.Exec(query, encryptedPassword, userInfo.ID)
	if err != nil {
		return 0, err
	}

	return res.RowsAffected()
}

func (a *Adapter) CheckCredentials(username, password string) (*UserInfo, error) {
	var encryptedPassword string
	var userInfo UserInfo

	// Fetch the user information from the database.
	query := `SELECT id, password, name FROM users WHERE name = ?`
	row := a.dbClient.QueryRow(query, username)
	err := row.Scan(&userInfo.ID, &encryptedPassword, &userInfo.Name)
	if err != nil {
		return nil, err
	}

	_, err = passlib.Verify(password, encryptedPassword)
	if err != nil {
		return nil, err
	}

	return &userInfo, nil
}

func ConnectMySQL(user, password, host, db string, port int64) (*sql.DB, error) {
	// Build target host. Be carefull about special characters!
	target := fmt.Sprintf("%s:%s@tcp(%s:%d)/%s", user, password, host, port, db)

	// Establish connection to MySQL database.
	conn, err := sql.Open("mysql", target)
	if err != nil {
		return nil, err
	}

	// Check if the connection works.
	if err := conn.Ping(); err != nil {
		return nil, err
	}

	return conn, nil
}
