package sql_adapter

import (
	"fmt"
	"strings"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	_ "github.com/go-sql-driver/mysql"
	"github.com/google/go-cmp/cmp"
	"gopkg.in/hlandau/passlib.v1"
)

type entry struct {
	id       int64
	password string
	username string
	err      error
}

func TestCheckCredentials(t *testing.T) {
	t.Parallel()

	tests := []struct {
		name          string
		row_result    *entry
		username      string
		password      string
		wantUserInfo  *UserInfo
		wantErrString string
	}{
		{
			name: "Test valid input",
			row_result: &entry{
				id:       1,
				password: "nothing_special",
				username: "nothing_special",
			},
			username: "nothing_special",
			password: "nothing_special",
			wantUserInfo: &UserInfo{
				ID:   1,
				Name: "nothing_special",
			},
		},
		{
			name: "Test wrong password",
			row_result: &entry{
				id:       1,
				password: "nothing_special",
				username: "nothing_special",
			},
			username:      "nothing_special",
			password:      "wrong_one",
			wantErrString: "invalid password",
		},
		{
			name: "Test wrong username",
			row_result: &entry{
				err: fmt.Errorf("no rows returned"),
			},
			username:      "wrong_one",
			password:      "nothing_special",
			wantErrString: "no rows returned",
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			db, mock, err := sqlmock.New()
			if err != nil {
				t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
			}
			defer db.Close()

			adapter := NewAdapter(db)

			if test.row_result.err != nil {
				prep := mock.ExpectPrepare("SELECT id, password, name FROM users WHERE name=?")
				prep.ExpectQuery().
					WithArgs(test.username).
					WillReturnError(test.row_result.err)
			} else {
				encrypted, err := passlib.Hash(test.row_result.password)
				if err != nil {
					t.Fatalf("failed to hash password %q", test.row_result.password)
				}

				row := sqlmock.NewRows([]string{"id", "password", "name"})

				if test.row_result != nil {
					row = row.AddRow(test.row_result.id, encrypted, test.row_result.username)
				}

				prep := mock.ExpectPrepare("SELECT id, password, name FROM users WHERE name=?")
				prep.ExpectQuery().
					WithArgs(test.username).
					WillReturnRows(row)
			}

			ui, err := adapter.CheckCredentials(test.username, test.password)

			if test.wantErrString == "" && err != nil {
				t.Fatalf("unexpected error: %s", err)
			}

			if err != nil && !strings.Contains(err.Error(), test.wantErrString) {
				t.Fatalf("got error %q; expected to contain %q", err, test.wantErrString)
			}

			if diff := cmp.Diff(ui, test.wantUserInfo); diff != "" {
				t.Fatalf("unexpected result diff: %v", diff)
			}

			// we make sure that all expectations were met
			if err := mock.ExpectationsWereMet(); err != nil {
				t.Errorf("there were unfulfilled expectations: %s", err)
			}
		})
	}
}

func TestUpdateUsername(t *testing.T) {
	t.Parallel()

	tests := []struct {
		name               string
		initial_row_result *entry
		username           string
		password           string
		loginFailed        bool
		newUsername        string
		wantRows           int64
		wantErrString      string
	}{
		{
			name: "Test valid input",
			initial_row_result: &entry{
				id:       1,
				password: "nothing_special",
				username: "nothing_special",
			},
			username:    "nothing_special",
			password:    "nothing_special",
			newUsername: "new_username",
			wantRows:    1,
		},
		{
			name: "Test invalid password",
			initial_row_result: &entry{
				id:       1,
				password: "nothing_special",
				username: "nothing_special",
			},
			username:      "nothing_special",
			password:      "wrong_one",
			loginFailed:   true,
			newUsername:   "new_username",
			wantErrString: "invalid password",
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			db, mock, err := sqlmock.New()
			if err != nil {
				t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
			}
			defer db.Close()

			adapter := NewAdapter(db)

			if test.initial_row_result.err != nil {
				prep := mock.ExpectPrepare("SELECT id, password, name FROM users WHERE name=?")

				prep.ExpectQuery().
					WithArgs(test.username).
					WillReturnError(test.initial_row_result.err)
			} else {
				encrypted, err := passlib.Hash(test.initial_row_result.password)
				if err != nil {
					t.Fatalf("failed to hash password %q", test.initial_row_result.password)
				}

				row := sqlmock.NewRows([]string{"id", "password", "name"})

				if test.initial_row_result != nil {
					row = row.AddRow(test.initial_row_result.id, encrypted, test.initial_row_result.username)
				}

				prep := mock.ExpectPrepare("SELECT id, password, name FROM users WHERE name=?")
				prep.ExpectQuery().
					WithArgs(test.username).
					WillReturnRows(row)

				if !test.loginFailed {
					prep := mock.ExpectPrepare("UPDATE users")
					prep.ExpectExec().
						WillReturnResult(sqlmock.NewResult(1, test.wantRows))
				}
			}

			rows, err := adapter.UpdateUsername(test.username, test.password, test.newUsername)

			if test.wantErrString == "" && err != nil {
				t.Fatalf("unexpected error: %s", err)
			}

			if err != nil && !strings.Contains(err.Error(), test.wantErrString) {
				t.Fatalf("got error %q; expected to contain %q", err, test.wantErrString)
			}

			if rows != test.wantRows {
				t.Fatalf("unexpected number of rows modifier; got %q want %q", rows, test.wantRows)
			}

			// we make sure that all expectations were met
			if err := mock.ExpectationsWereMet(); err != nil {
				t.Errorf("there were unfulfilled expectations: %s", err)
			}
		})
	}
}

func TestUpdatePassword(t *testing.T) {
	t.Parallel()

	tests := []struct {
		name               string
		initial_row_result *entry
		username           string
		password           string
		loginFailed        bool
		newPassword        string
		wantRows           int64
		wantErrString      string
	}{
		{
			name: "Test valid input",
			initial_row_result: &entry{
				id:       1,
				password: "nothing_special",
				username: "nothing_special",
			},
			username:    "nothing_special",
			password:    "nothing_special",
			newPassword: "new_password",
			wantRows:    1,
		},
		{
			name: "Test invalid password",
			initial_row_result: &entry{
				id:       1,
				password: "nothing_special",
				username: "nothing_special",
			},
			username:      "nothing_special",
			password:      "wrong_one",
			loginFailed:   true,
			newPassword:   "new_username",
			wantErrString: "invalid password",
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			db, mock, err := sqlmock.New()
			if err != nil {
				t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
			}
			defer db.Close()

			adapter := NewAdapter(db)

			if test.initial_row_result.err != nil {
				prep := mock.ExpectPrepare("SELECT id, password, name FROM users WHERE name=?")
				prep.ExpectQuery().
					WithArgs(test.username).
					WillReturnError(test.initial_row_result.err)
			} else {
				encrypted, err := passlib.Hash(test.initial_row_result.password)
				if err != nil {
					t.Fatalf("failed to hash password %q", test.initial_row_result.password)
				}

				row := sqlmock.NewRows([]string{"id", "password", "name"})

				if test.initial_row_result != nil {
					row = row.AddRow(test.initial_row_result.id, encrypted, test.initial_row_result.username)
				}

				prep := mock.ExpectPrepare("SELECT id, password, name FROM users WHERE name=?")
				prep.ExpectQuery().
					WithArgs(test.username).
					WillReturnRows(row)
				if !test.loginFailed {
					prep := mock.ExpectPrepare("UPDATE users")
					prep.ExpectExec().
						WillReturnResult(sqlmock.NewResult(1, test.wantRows))
				}
			}

			rows, err := adapter.UpdatePassword(test.username, test.password, test.newPassword)

			if test.wantErrString == "" && err != nil {
				t.Fatalf("unexpected error: %s", err)
			}

			if err != nil && !strings.Contains(err.Error(), test.wantErrString) {
				t.Fatalf("got error %q; expected to contain %q", err, test.wantErrString)
			}

			if rows != test.wantRows {
				t.Fatalf("unexpected number of rows modifier; got %q want %q", rows, test.wantRows)
			}

			// we make sure that all expectations were met
			if err := mock.ExpectationsWereMet(); err != nil {
				t.Errorf("there were unfulfilled expectations: %s", err)
			}
		})
	}
}

func TestCheckUsername(t *testing.T) {
	t.Parallel()

	tests := []struct {
		name          string
		username      string
		sqlError      error
		wantUsername  string
		wantErrString string
	}{
		{
			name:          "Test existing username",
			username:      "nothing_special",
			wantUsername:  "",
			wantErrString: "username already exists",
		},
		{
			name:         "Test new username",
			username:     "nothing_special",
			wantUsername: "nothing_special",
		},
		{
			name:          "Test SQL no rows returned error",
			username:      "nothing_special",
			sqlError:      fmt.Errorf("no rows returned"),
			wantUsername:  "nothing_special",
			wantErrString: "no rows returned",
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			db, mock, err := sqlmock.New()
			if err != nil {
				t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
			}
			defer db.Close()

			adapter := NewAdapter(db)

			if test.sqlError != nil {
				prep := mock.ExpectPrepare("SELECT name FROM users WHERE name=?")
				prep.ExpectQuery().
					WithArgs(test.username).
					WillReturnError(test.sqlError)
			} else {
				row := sqlmock.NewRows([]string{"name"})

				if test.wantErrString != "" {
					row = row.AddRow(test.username)
				}

				prep := mock.ExpectPrepare("SELECT name FROM users WHERE name=?")
				prep.ExpectQuery().
					WithArgs(test.username).
					WillReturnRows(row)
			}

			u, err := adapter.CheckUsername(test.username)

			if test.wantErrString == "" && err != nil {
				t.Fatalf("unexpected error: %s", err)
			}

			if err != nil && !strings.Contains(err.Error(), test.wantErrString) {
				t.Fatalf("got error %q; expected to contain %q", err, test.wantErrString)
			}

			if u != test.wantUsername {
				t.Fatalf("unexpected username: want %s got %s", test.wantUsername, u)
			}

			// we make sure that all expectations were met
			if err := mock.ExpectationsWereMet(); err != nil {
				t.Errorf("there were unfulfilled expectations: %s", err)
			}
		})
	}
}

func TestCreateUser(t *testing.T) {
	t.Parallel()

	tests := []struct {
		name           string
		row_result     *entry
		username       string
		password       string
		sqlError       error
		wantUserInfo   *UserInfo
		usernameExists bool
		wantErrString  string
	}{
		{
			name: "Test valid input",
			row_result: &entry{
				id:       1,
				password: "nothing_special",
				username: "nothing_special",
			},
			username: "nothing_special",
			password: "nothing_special",
			wantUserInfo: &UserInfo{
				ID:   1,
				Name: "nothing_special",
			},
			usernameExists: false,
		},
		{
			name:           "Test already existing username",
			username:       "nothing_special",
			password:       "nothing_special",
			usernameExists: true,
			wantErrString:  "username already exists",
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			db, mock, err := sqlmock.New()
			if err != nil {
				t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
			}
			defer db.Close()

			adapter := NewAdapter(db)

			if test.sqlError != nil {
				prep := mock.ExpectPrepare("SELECT name FROM users WHERE name=?")
				prep.ExpectQuery().
					WithArgs(test.username).
					WillReturnError(test.sqlError)
			} else {
				row := sqlmock.NewRows([]string{"name"})

				if test.wantErrString != "" {
					row = row.AddRow(test.username)
				}

				prep := mock.ExpectPrepare("SELECT name FROM users WHERE name=?")
				prep.ExpectQuery().
					WithArgs(test.username).
					WillReturnRows(row)

				if !test.usernameExists {
					prep := mock.ExpectPrepare("INSERT INTO users")
					prep.ExpectExec().
						WithArgs(test.username, sqlmock.AnyArg()).
						WillReturnResult(sqlmock.NewResult(1, 1))

					enc, err := passlib.Hash(test.row_result.password)
					if err != nil {
						t.Fatalf("couldn't hash password: %s", err)
					}

					row := sqlmock.NewRows([]string{"id", "password", "name"}).
						AddRow(test.row_result.id, enc, test.row_result.username)

					prep = mock.ExpectPrepare("SELECT id, password, name FROM users WHERE name=?")
					prep.ExpectQuery().
						WithArgs(test.username).
						WillReturnRows(row)
				}
			}

			ui, err := adapter.CreateUser(test.username, test.password)

			if test.wantErrString == "" && err != nil {
				t.Fatalf("unexpected error: %s", err)
			}

			if err != nil && !strings.Contains(err.Error(), test.wantErrString) {
				t.Fatalf("got error %q; expected to contain %q", err, test.wantErrString)
			}

			if diff := cmp.Diff(ui, test.wantUserInfo); diff != "" {
				t.Fatalf("unexpected result diff: %v", diff)
			}

			// we make sure that all expectations were met
			if err := mock.ExpectationsWereMet(); err != nil {
				t.Errorf("there were unfulfilled expectations: %s", err)
			}
		})
	}
}
