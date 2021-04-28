package sql_adapter

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/go-sql-driver/mysql"
	_ "github.com/lib/pq"
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

	query, err := a.dbClient.Prepare(`UPDATE users SET name=$1 WHERE id=$2`)
	if err != nil {
		return 0, err
	}

	res, err := query.Exec(newUsername, userInfo.ID)
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

	query, err := a.dbClient.Prepare(`UPDATE users SET password=$1 WHERE id=$2`)
	if err != nil {
		return 0, err
	}

	res, err := query.Exec(encryptedPassword, userInfo.ID)
	if err != nil {
		return 0, err
	}

	return res.RowsAffected()
}

func (a *Adapter) CheckCredentials(username, password string) (*UserInfo, error) {
	var encryptedPassword string
	var userInfo UserInfo

	// Fetch the user information from the database.
	query, err := a.dbClient.Prepare(`SELECT id, password, name FROM users WHERE name=$1`)
	if err != nil {
		return nil, err
	}

	row := query.QueryRow(username)
	err = row.Scan(&userInfo.ID, &encryptedPassword, &userInfo.Name)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("invalid username or password")
		}
		return nil, err
	}

	_, err = passlib.Verify(password, encryptedPassword)
	if err != nil {
		return nil, err
	}

	return &userInfo, nil
}

func (a *Adapter) CheckUsername(username string) (string, error) {
	query, err := a.dbClient.Prepare(`SELECT name FROM users WHERE name=$1`)
	if err != nil {
		return "", err
	}

	row := query.QueryRow(username)
	err = row.Scan(&username)
	if err != nil {
		return username, nil
	}

	return "", fmt.Errorf("username already exists")
}

func (a *Adapter) CreateUser(username, password string) (*UserInfo, error) {
	username, err := a.CheckUsername(username)
	if err != nil {
		return nil, err
	}

	encryptedPassword, err := passlib.Hash(password)
	if err != nil {
		return nil, err
	}

	query, err := a.dbClient.Prepare(`INSERT INTO users (name, password) VALUES ($1, $2)`)
	if err != nil {
		return nil, err
	}

	log.Println(username, encryptedPassword)
	_, err = query.Exec(username, encryptedPassword)
	if err != nil {
		return nil, err
	}

	return a.CheckCredentials(username, password)
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

func ConnectPostgreSQL(user, password, host, db string, port int64) (*sql.DB, error) {
	psqlconn := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable", host, port, user, password, db)

	conn, err := sql.Open("postgres", psqlconn)
	if err != nil {
		return nil, err
	}

	err = conn.Ping()
	if err != nil {
		return nil, err
	}

	return conn, nil
}
