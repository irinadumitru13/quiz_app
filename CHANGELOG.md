# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1] - 2021-05-23

### Added

- **_[Andrei] GitLab CI_** pipeline that builds and stores the docker images
  in the GitLab container registry.
- **_[Andrei] Docker swarm_** properties to the `docker-compose.yml` file.
- **_[Andrei] Documentation_** a `README.md` file has been added for each
  service involved in the authentication and authorization stack.

## [0.0.11] - 2021-05-22

### Added

- **_[Andrei] Frontend_** create permission based routes.
- **_[Andrei] Frontend_** ended quizzes can not be edited through the UI.
- **_[Andrei] Frontend_** added `submit` button for the Quiz.
- **_[Andrei] Frontend_** added Submissions view to allow users to inspect
  their own submissions or others if allowed.
- **_[Andrei] Frontend_** add API calls for all the `quiz service` required
  endpoints.
- **_[Andrei] NGINX_** proxy all web interfaces through NGINX.

### Modified

- **_[Irina] IOQuizMicroservice_**: adding an answer will return only the id
  associated with that entry.
- **_[Irina] IOQuizMicroservice_**: adding a question will return the id
  associated with that entry, and the array of added answers.
- **_[Andrei] Docker compose_** add restart policy.
- **_[Andrei] Frontend_** fix clickable quiz bug.
- **_[Andrei] Frontend_** QuizEditor can both create a new quiz and modify
  an existing one.
- **_[Andrei] Frontend_** QuizList is now sorted by status.
- **_[Andrei] Frontend_** QuizPreview now allows a mentainer to see all
  submissions for it.
- **_[Andrei] Frontend_** UserInfo now also contains a small navigation menu
  that dynamically adapts to the users permission level.
- **_[Andrei] Gateway_** routes have been updated to be protected by a
  certain permission level.

## [0.0.10] - 2021-05-21

### Added

- **_[Irina] QuizMicroservice_**: add README for all endpoints, specifying
  HTTP Status Codes and request body and response body (where needed).
- **_[Andrei] Frontend_** add DateTimePicker component to select a date and time.
- **_[Andrei] Frontend_** add QuestionEditor component to display an editable
  question.
- **_[Andrei] Frontend_** add QuizEditor component to display an editable quiz.
- **_[Andrei] Frontend_** add Editor component to display a quiz edit page.
- **_[Andrei] Frontend_** add API calls for the quiz endpoint.

### Modified

- **_[Irina] IOQuizMicroservice_**: updateQuiz can incorporate questions and
  answers associated with it.
- **_[Irina] IOQuizMicroservice_**: updateQuestion can incorporate answers
  associated with it.
- **_[Irina] QuizMicroservice_**: add validation for all possible fields in
  the request body regarding updateQuiz and updateQuestion.
- **_[Andrei] Frontend_** styling.
- **_[Andrei] Frontend_** fix error propagation from API calls.

## [0.0.9] - 2021-05-20

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
- **_[Andrei] Frontend_** add Challenge component to display an ongoing quiz
  attempt.
- **_[Andrei] Frontend_** add QuizPreview component to display quiz related
  data such as name and status.
- **_[Andrei] Frontend_** add QuizList component to display a list of
  QuizPreviews.
- **_[Andrei] Frontend_** add `CLEAR` button in the Question component to remove
  the selected answer.
- **_[Andrei] Frontend_** API calls to the `quiz` API.
- **_[Andrei] Frontend_** add MenuAppBar component to provide a website header
  with logout functionality.
- **_[Andrei] User session_** permissions are associated to each session.
- **_[Andrei] Gateway_** the `quiz service` is added behind the gateway.

### Modified

- **_[Irina] IOQuizMicroservice_**: incorporate new column in POST and PUT
  methods associated with quizzes
- **_[Irina] IOQuizMicroservice_**: modify port from 3000 to 80
- **_[Irina] IOQuizMicroservice_**: modify base paths from _'/api/v1/\*'_
  to _'/api/\*'_
- **_[Irina] docker-compose_**: integrate new microservice - create new
  network so that IO and Business Logic can communicate
- **_[Irina] database schema_**: questions and answers are not UNIQUE
- **_[Irina] QuizMicroservice_**: refactor code, so different files for a
  specific object are used
- **_[Andrei] Frontend_** add comments for all the API calls.
- **_[Andrei] Frontend_** styling.
- **_[Andrei] Frontend_** Quiz now fetches a quiz based on URL params.
- **_[Andrei] Frontend_** API calls moved from `fetch` to `axios`.
- **_[Andrei] Docker compose_** the global docker-compose now contains all
  the services.

## [0.0.8] - 2021-05-19

### Added

- **_[Andrei] Frontend_** UserInfo component to display user specific
  information.
- **_[Andrei] Frontend_** QuizSelections component to track quiz completion
  status.
- **_[Andrei] Frontend_** Question component to display a provided question.
- **_[Andrei] Frontend_** Quiz component to display multiple Questions and
  the associated QuizSelections.
- **_[Andrei] Frontend_** Cookies to store session information.
- **_[Andrei] Gateway_** monitoring through `influx` and `grafana`.
- **_[Andrei] Grafana_** KrakeD dashboard.
- **_[Andrei] Grafana_** Influxdb data source.
- **_[Andrei] InfluxDB_** for gateway metrics.
- **_[Andrei] Dockerfile_** for custom Grafana provisioning.
- **_[Andrei] Dockerfile_** for custom InfluxDB provisioning.

### Modified

- **_[Irina] database schema_**: columns id named as object_id
- **_[Irina] IOQuizMicroservice_**: get quiz will return all associated data with that quiz
- **_[Irina] IOQuizMicroservice_**: get question by id will return all associated data with that question
- **_[Andrei] Frontend_** revamped the Login and Register pages.
- **_[Andrei] Fix: identification middleware_** properly add headers.
- **_[Andrei] Docker compose_** add monitoring and format.

## [0.0.7] - 2021-05-17

### Added

- **_[Andrei] User identification middleware_** now used in the gateway.
- **_[Andrei] Utils_** for common functions used across gateway middlewares.

### Modified

- **_[Andrei] Token generator_** now supports JSON conversion on
  `AccessDetails`.
- **_[Andrei] Gateway_** improve readability.
- **_[Andrei] Docker compose_** format.

## [0.0.6] - 2021-05-09

### Added

- **_[Irina] database schema_**: tables regarding the quiz - QUIZ, QUESTIONS,
  ANSWERS, SUBMISSIONS.
- **_[Irina] IO Quiz Microservice_**: it interacts with the database
  - for quizzes: adding a new entry in QUIZ table, getting all entries from
    the table, getting all available quizzes, updating the entry in the
    table and deleting it;
  - for questions: adding a new entry in QUESTIONS table, getting all
    entries from the table, getting all questions from a quiz (by quiz_id),
    updating the entry in the table and deleting it;
  - for answers: adding a new entry in ANSWERS table, getting all entries
    from the table, getting all answers for a question (question_id), updating
    the entry in the table and deleting it;
  - for submissions: adding a new submission in SUBMISSIONS table, get all
    submissions regarding a quiz (quiz name), getting all submissions regarding
    a user (username) and deleting the entry.
- **_[Irina] New docker-compose file_**, in which the IO microservice, the
  database and adminer are included.

## [0.0.5] - 2021-05-05

### Added

- **_[Andrei] KrakenD fork_** to support OPTIONS routes
  [here](https://gitlab.com/idp-2021/).
- **_[Andrei] Authorization middleware_** for gateway authorization.
- **_[Andrei] Gateway_** base configuration for the authentication stack.

### Modified

- **_[Andrei] Docker-compose_** now contains the gateway.

## [0.0.4] - 2021-05-04

### Added

- **_[Andrei] Frontend_** basic login and register pages.
- **_[Andrei] SAML_** service provider.

### Modified

- **_[Andrei] Session manager_** modified JSON field from `user_id` to `id`.
- **_[Andrei] Login manager_** replaced cors middleware.

## [0.0.3] - 2021-04-28

### Added

- **_[Andrei] SQL adapter tests_** added for user creation.
- **_[Andrei] Token generator unit tests_** for method validation.

## [0.0.2] - 2021-04-27

### Added

- **_[Andrei] IO service_** to manipulate the user database.
- **_[Andrei] IO adapter_** Dockerfile.

### Modified

- **_[Andrei] SQL adapter_** has been updated to use the `prepare` statement.
- **_[Andrei] SQL adapter_** removed debug logs.
- **_[Andrei] SQL adapter tests_** have been updated.
- **_[Andrei] Docker-compose_** now contains the io-adapter service.

## [0.0.1] - 2021-04-24

### Added

- **_[Andrei] Token generator service_** to generate and validate `JWT` tokens.
- **_[Andrei] Session manager_** module has been created.
- **_[Andrei] Session manager_** Dockerfile.
- **_[Andrei] SQL adapter_** to manage an SQL type `user database`.
- **_[Andrei] SQL adapter unit tests_** for method validation.
- **_[Andrei] Docker-compose_** for the authentication stack.

### Modified

- **_[Andrei] Token generator service_** now uses a token validation
  middleware instead of a dedicated endpoint. Any endpoint can be protected
  with it now.
