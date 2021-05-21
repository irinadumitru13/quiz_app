# QuizMicroservice (Business logic)

## Base path: quiz-service/api

## QUIZ endpoints
#### GET /quiz
- get all quizzes
- Status: 200 OK
- Response body:


    "response": [
        {
            "quiz_id": int,
            "quiz_name": string,
            "status": string
        }
    ]
- the status can be one of the values:
    - open
    - in the future
    - ended

#### GET /quiz/:id
- get the quiz with id
- id must be a positive integer
- Status: 200 OK or 404 NOT FOUND if there's no quiz with id in the database
- Response body:


    {
        "quiz_id": int,
        "quiz_name": string,
        "start_date": timestamp - string, (eg. "2021-05-19T12:36:22.000Z")
        "due_date": timestamp - string,
        "allocated_time": int,
        "questions": [
            {
                "question_id": int,
                "question": string,
                "answers: [
                    {
                        "answer_id": int,
                        "answer": string,
                        "is_correct": boolean,
                        "points": int
                    }
                ]
            }
        ]
    }

#### POST /quiz
- insert a new quiz in the database
- Status:
    - 200 OK
    - 400 BAD REQUEST if body is incorrect
    - 500 INTERNAL SERVER ERROR if error in IOQuizMicroservice
- Request body:


    {
        "quiz_name": string,
        "start_date": timestamp - string,
        "due_date": timestamp - string,
        "allocated_time": int.
        "questions": [
            {
                "question": string,
                "answers: [
                    {
                        "answer": string,
                        "is_correct": boolean,
                        "points": int
                    }
                ]
            }
        ]
    }
- types are validated
- dates MUST be in the format yyyy-MM-dd HH:mm:SS, otherwise error

#### PUT /quiz/:id
- update the quiz with id
- id must be a positive integer
- Status: 200 OK or 404 NOT FOUND if there's no quiz with id in the database
- May return 404 in case a question or answer with the given id doesn't exist in the database. 
  This shouldn't happen, because updating implies fetching the data from the DB in the first place.
- Request body:


    {
        "quiz_name": string,
        "start_date": timestamp - string,
        "due_date": timestamp - string,
        "allocated_time": int.
        "questions": [
            {
                "question_id": int,             // mandatory field
                "question": string,
                "answers: [
                    {
                        "answer_id": int,       // mandatory field
                        "answer": string,
                        "is_correct": boolean,
                        "points": int
                    }
                ]
            }
        ]
    }
- types are validated
- dates MUST be in the format yyyy-MM-dd HH:mm:SS, otherwise error
- if questions need to be updated too, question_id is a mandatory field with at least one other
  field to be updated
- if answers to question need to be updated, answer_id is a mandatory field with at least 
  one other field to be updated
- any combination of fields might be introduced, as long as questions have at least one 
  element that respects the rules stated above
  
#### DELETE /quiz/:id
- delete the quiz with id (also deletes on cascade the questions and answers associated with this quiz)
- id must be a positive integer
- Status: 200 OK or 404 NOT FOUND if there's no quiz with id in the database


## QUESTION endpoints
#### POST /question
- insert a new question in the database
- Status:
  - 200 OK
  - 400 BAD REQUEST if body is incorrect
  - 500 INTERNAL SERVER ERROR if error in IOQuizMicroservice
- Request body:


      {
          "quiz_id": int,
          "question": string,
          "answers: [
              {
                  "answer": string,
                  "is_correct": boolean,
                  "points": int
              }
          ]
      }
- types are validated

#### PUT /question/:id
- update the question with id
- id must be a positive integer
- Status: 200 OK or 404 NOT FOUND if there's no quiz with id in the database
- May return 404 in case an answer with the given id doesn't exist in the database.
  This shouldn't happen, because updating implies fetching the data from the DB in the first place.
- Request body:


      {
          "quiz_id": int,
          "question": string,
          "answers: [
              {
                  "answer_id": int,       // mandatory field
                  "answer": string,
                  "is_correct": boolean,
                  "points": int
              }
          ]
      }
- types are validated
- if answers need to be updated, answer_id is a mandatory field with at least one other field to be updated
- any combination of fields might be introduced, as long as answers have at least one
  element that respects the rules stated above

#### DELETE /question/:id
- delete the question with id (also deletes on cascade the answers associated with this question)
- id must be a positive integer
- Status: 200 OK or 404 NOT FOUND if there's no question with id in the database


## ANSWER endpoints
#### POST /answer
- insert a new answer in the database
- Status:
  - 200 OK
  - 400 BAD REQUEST if body is incorrect
  - 500 INTERNAL SERVER ERROR if error in IOQuizMicroservice
- Request body:


      {
          "question_id": int,
          "answer": string,
          "is_correct": boolean,
          "points": int
      }
- types are validated

#### PUT /answer/:id
- update the answer with id
- id must be a positive integer
- Status: 200 OK or 404 NOT FOUND if there's no answer with id in the database
- Request body:


      {
          "question_id": int,
          "answer": string,
          "is_correct": boolean,
          "points": int
      }
- types are validated
- any combination of fields might be introduced, as long as body is not empty

#### DELETE /answer/:id
- delete the answer with id
- id must be a positive integer
- Status: 200 OK or 404 NOT FOUND if there's no answer with id in the database


## SUBMISSION endpoints
#### GET /submission
- get all submissions for the username given in the header "User-Name"
- Status: 200 OK
- Response body:


    "response": [
        {
            "submission_id": int,
            "quiz_name": string,
            "username": string,
            "time_stamp": timestamp - string (eg. "2021-05-21T15:45:20.602Z"),
            "score": int
        }
    ]

#### GET /submission/quiz/:quiz_name
- get all submissions for the quiz named quiz_name
- id must be a positive integer
- Status: 200 OK
- Response body:


    "response": [
        {
            "submission_id": int,
            "quiz_name": string,
            "username": string,
            "time_stamp": timestamp - string (eg. "2021-05-21T15:45:20.602Z"),
            "score": int
        }
    ]

#### POST /submission
- insert a new submission for username given in header "User-Name" in the database
- Status:
  - 200 OK
  - 400 BAD REQUEST if body is incorrect
  - 500 INTERNAL SERVER ERROR if error in IOQuizMicroservice
- Request body:


    {
        "quiz_name": string,
        "score": int
    }
- types are validated

#### DELETE /submission/:id
- delete the submission with id
- id must be a positive integer
- Status: 200 OK or 404 NOT FOUND if there's no submission with id in the database
