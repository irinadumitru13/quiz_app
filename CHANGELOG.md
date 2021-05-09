# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.0.1] - 2021-05-09
### Added
- [Irina] database schema: tables regarding the quiz - QUIZ, QUESTIONS, ANSWERS, SUBMISSIONS.
- [Irina] IO Quiz Microservice: it interacts with the database
    - for quizzes: adding a new entry in QUIZ table, getting all entries from the table, getting all available quizzes, updating the entry in the table and deleting it
    - for questions: adding a new entry in QUESTIONS table, getting all entries from the table, getting all questions from a quiz (by quiz_id), updating the entry in the table and deleting it
    - for answers: adding a new entry in ANSWERS table, getting all entries from the table, getting all answers for a question (question_id), updating the entry in the table and deleting it
    - for submissions: adding a new submission in SUBMISSIONS table, get all submissions regarding a quiz (quiz name), getting all submissions regarding a user (username) and deleting the entry
- [Irina] a docker-compose file, in which the IO microservice, the database and adminer are included
    
