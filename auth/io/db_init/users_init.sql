CREATE TABLE IF NOT EXISTS users (
	id serial PRIMARY KEY,
	name VARCHAR ( 50 ) UNIQUE NOT NULL,
	password VARCHAR ( 100 ) NOT NULL
);

INSERT INTO users (name, password) VALUES ('da', 'a');
