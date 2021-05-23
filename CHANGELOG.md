# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.0.1] - 2021-05-09
### Added
- **_[Irina] database schema_**: tables regarding the quiz - QUIZ, QUESTIONS, ANSWERS, SUBMISSIONS.
- **_[Irina] IO Quiz Microservice_**: it interacts with the database
    - for quizzes: adding a new entry in QUIZ table, getting all entries from the table, getting all available quizzes, updating the entry in the table and deleting it;
    - for questions: adding a new entry in QUESTIONS table, getting all entries from the table, getting all questions from a quiz (by quiz_id), updating the entry in the table and deleting it;
    - for answers: adding a new entry in ANSWERS table, getting all entries from the table, getting all answers for a question (question_id), updating the entry in the table and deleting it;
    - for submissions: adding a new submission in SUBMISSIONS table, get all submissions regarding a quiz (quiz name), getting all submissions regarding a user (username) and deleting the entry.
- **_[Irina] New docker-compose file_**, in which the IO microservice, the database and adminer are included.
- **_[Andrei] New SQL IO adapter_** for the authentication service database.
- **_[Andrei] New session manager microservice_** that interacts with a Redis database to store session keys and information. This service is also used to validate session tokens for user authorization.
- **_[Andrei] New login manager microservice_** responsible for authenticating and registering new users. It interacts both with the SQL IO adapter and session manager. This is a publicly available service.
- **_[Andrei] Add basic saml support_** in the login manager for future use.
- **_[Andrei] New KrakenD fork_** to support OPTIONS routes (https://gitlab.com/idp-2021/odin-krakend).
- **_[Andrei] Add authorization middleware_** in the forked gateway version of KrakenD.
- **_[Andrei] New basic frontend_** for user authentication and registration.
- **_[Andrei] New docker-compose_** for the authentication stack.

## [0.0.2] - 2021-05-19
### Modified
- **_[Irina] database schema_**: columns id named as object_id
- **_[Irina] IOQuizMicroservice_**: get quiz will return all associated data with that quiz
- **_[Irina] IOQuizMicroservice_**: get question by id will return all associated data with that question

## [0.0.3] - 2021-05-20
### Added
- **_[Irina] database schema_**: add column start_date in QUIZ table
- **_[Irina] IOQuizMicroservice_**: add README, so endpoints are documented
- **_[Irina] QuizMicroservice_**: create microservice
- **_[Irina] QuizMicroservice_**: add endpoints for getting quizzes, getting quiz by id and adding quiz
- **_[Irina] QUizMicroservice_**: add cors
- **_[Irina] QuizMicroservice_**: add endpoints for:
  - QUIZ - updateQuizById and deleteQuizById
  - QUESTIONS - addQuestion, updateQuestionById and deleteQuestionById
  - ANSWERS - addAnswer, updateAnswerById and deleteAnswerById
  - SUBMISSIONS - getSubmissionsByQuizName, getSubmissionsByUserName, addSubmission, deleteSubmissionById

### Modified
- **_[Irina] IOQuizMicroservice_**: incorporate new column in POST and PUT methods associated with quizzes
- **_[Irina] IOQuizMicroservice_**: modify port from 3000 to 80
- **_[Irina] IOQuizMicroservice_**: modify base paths from *'/api/v1/\*'* to *'/api/\*'*
- **_[Irina] docker-compose_**: integrate new microservice - create new network so that IO and Business Logic can communicate
- **_[Irina] database schema_**: questions and answers are not UNIQUE
- **_[Irina] QuizMicroservice_**: refactor code, so different files for a specific object are used


## [0.0.4] - 2021-05-21
### Added
- **_[Irina] QuizMicroservice_**: add README for all endpoints, specifying HTTP Status Codes and request body and response body (where needed)

### Modified
- **_[Irina] IOQuizMicroservice_**: updateQuiz can incorporate questions and answers associated with it
- **_[Irina] IOQuizMicroservice_**: updateQuestion can incorporate answers associated with it
- **_[Irina] QuizMicroservice_**: add validation for all possible fields in the request body regarding updateQuiz and updateQuestion

## [0.0.5] - 2021-05-22
### Modified
- **_[Irina] IOQuizMicroservice_**: adding an answer will return only the id associated with that entry
- **_[Irina] IOQuizMicroservice_**: adding a question will return the id associated with that entry, and the array of added answers