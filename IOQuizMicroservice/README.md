# IOQuizMicroservice

## QUIZ endpoints
#### GET /quiz
- get all quizzes
- Status: 200 OK
- Response body:


    [
        {
            "quiz_id": int,
            "quiz_name": string,
            "due_date": timestamp - string,
            "allocated_time" - int
        }
    ]


#### GET /quiz/available
- get all available quizzes
- Status: 200 OK
- Response body:


    [
        {
            "quiz_id": int,
            "quiz_name": string,
            "due_date": timestamp - string,
            "allocated_time" - int
        }
    ]

#### GET /quiz/:id
- get the quiz with id
- Status: 200 OK or 404 NOT FOUND if there's no quiz with id in the database
- Response body:


    {
        "quiz_id": int,
        "quiz_name": string,
        "due_date": timestamp - string,
        "allocated_time": int.
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
    - 201 CREATED if OK
    - 400 BAD REQUEST if body is incorrect
    - 500 INTERNAL SERVER ERROR if constraints were violated
- Request body:


    {
        "quiz_name": string,
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

#### PUT /quiz/:id
- update the quiz with id
- Status:
    - 200 OK
    - 400 BAD REQUEST if body is incorrect
    - 500 INTERNAL SERVER ERROR if constraints were violated
- Request body:


    {
        "quiz_name": string,
        "due_date": timestamp - string,
        "allocated_time": int
    }

- the request body may contain any combination of those fields, as long as the body is not empty, which will result in error

#### DELETE /quiz/:id
- delete the quiz with id
- Status:
    - 204 NO CONTENT if OK
    - 404 NOT FOUND
    
## QUESTIONS endpoints
#### GET /questions
- get all questions
- Status: 200 OK
- Response body:


    [
        {
            "question_id": int,
            "quiz_id": int,
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


#### GET /questions/:quiz_id
- get all questions from quiz with id
- Status: 200 OK
- Response body:


    [
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

#### POST /questions
- insert a new question in the database
- Status:
  - 201 CREATED if OK
  - 400 BAD REQUEST if body is incorrect
  - 500 INTERNAL SERVER ERROR if constraints were violated
- Request body:


    {
        "quiz_id": int,
        "question": string,
        "answers": [
            {
                "answer": string,
                "is_correct": boolean,
                "points": int
            }
        ]
    }

#### PUT /questions/:id
- update the question with id
- Status:
  - 200 OK
  - 400 BAD REQUEST if body is incorrect
  - 500 INTERNAL SERVER ERROR if constraints were violated
- Request body:


    {
        "quiz_id": int,
        "question": string
    }

- the request body may contain any combination of those fields, as long as the body is not empty, which will result in error

#### DELETE /questions/:id
- delete the question with id
- Status:
  - 204 NO CONTENT if OK
  - 404 NOT FOUND


## ANSWERS endpoints
#### GET /answers
- get all answers
- Status: 200 OK
- Response body:


    [
        {
            "answer_id": int,
            "question_id": int,
            "answer": string,
            "is_correct": boolean,
            "points": int
        }
    ]

#### GET /answers/:question_id
- get all answers from question with id
- Status: 200 OK
- Response body:


    [
        {
            "answer_id": int,
            "answer": string,
            "is_correct": boolean,
            "points": int
        }
    ]

#### POST /answers
- insert a new answer in the database
- Status:
  - 201 CREATED if OK
  - 400 BAD REQUEST if body is incorrect
  - 500 INTERNAL SERVER ERROR if constraints were violated
- Request body:


    {
        "question_id": int,
        "answer": string,
        "is_correct": boolean,
        "points": int
    }

#### PUT /answers/:id
- update the answer with id
- Status:
  - 200 OK
  - 400 BAD REQUEST if body is incorrect
  - 500 INTERNAL SERVER ERROR if constraints were violated
- Request body:


    {
        "question_id": int,
        "answer": string,
        "is_correct": boolean,
        "points": int
    }

- the request body may contain any combination of those fields, as long as the body is not empty, which will result in error

#### DELETE /answer/:id
- delete the answer with id
- Status:
  - 204 NO CONTENT if OK
  - 404 NOT FOUND

## SUBMISSIONS endpoints
#### GET /submissions/quiz/:quiz_name
- get all submissions for the quiz with the name given as parameter
- Status: 200 OK
- Response body:


    [
        {
            "submission_id": int,
            "quiz_name": string,
            "username": string,
            "time_stamp": timestamp - string,
            "score": int
        }
    ]

#### GET /submissions/user/:username
- get all submissions for the user given as parameter
- Status: 200 OK
- Response body:


    [
        {
            "submission_id": int,
            "quiz_name": string,
            "username": string,
            "time_stamp": timestamp - string,
            "score": int
        }
    ]

#### POST /submissions
- insert a new submission in the database
- Status:
  - 201 CREATED if OK
  - 400 BAD REQUEST if body is incorrect
  - 500 INTERNAL SERVER ERROR if constraints were violated
- Request body:


    {
        "quiz_name": string,
        "username": string,
        "score": int
    }

#### DELETE /submissions/:id
- delete the submissions with id
- Status:
  - 204 NO CONTENT if OK
  - 404 NOT FOUND
  