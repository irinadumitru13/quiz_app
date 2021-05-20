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