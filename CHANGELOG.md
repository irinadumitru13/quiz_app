# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.0.1] - 2021-05-09
### Added
- [Irina] database schema: tables regarding the quiz - QUIZ, QUESTIONS, ANSWERS, SUBMISSIONS.
- [Irina] IO Quiz Microservice: it interacts with the database
    - for quizzes: adding a new entry in QUIZ table, getting all entries from the table, getting all available quizzes, updating the entry in the table and deleting it;
    - for questions: adding a new entry in QUESTIONS table, getting all entries from the table, getting all questions from a quiz (by quiz_id), updating the entry in the table and deleting it;
    - for answers: adding a new entry in ANSWERS table, getting all entries from the table, getting all answers for a question (question_id), updating the entry in the table and deleting it;
    - for submissions: adding a new submission in SUBMISSIONS table, get all submissions regarding a quiz (quiz name), getting all submissions regarding a user (username) and deleting the entry.
- [Irina] New docker-compose file, in which the IO microservice, the database and adminer are included.
- [Andrei] New SQL IO adapter for the authentication service database.
- [Andrei] New session manager microservice that interacts with a Redis database to store session keys and information. This service is also used to validate session tokens for user authorization.
- [Andrei] New login manager microservice responsible for authenticating and registering new users. It interacts both with the SQL IO adapter and session manager. This is a publicly available service.
- [Andrei] Add basic saml support in the login manager for future use.
- [Andrei] New KrakenD fork to support OPTIONS routes (https://gitlab.com/idp-2021/odin-krakend).
- [Andrei] Add authorization middleware in the forked gateway version of KrakenD.
- [Andrei] New basic frontend for user authentication and registration.
- [Andrei] New docker-compose for the authentication stack.
