CREATE TABLE IF NOT EXISTS QUIZ (
    quiz_id         SERIAL                              PRIMARY KEY,
    quiz_name       varchar     NOT NULL    UNIQUE,
    start_date      timestamp   NOT NULL,
    due_date        timestamp   NOT NULL,
    allocated_time  integer     NOT NULL
);

CREATE TABLE IF NOT EXISTS QUESTIONS (
    question_id              SERIAL                     PRIMARY KEY,
    quiz_id         integer,
    question        varchar     NOT NULL,

    CONSTRAINT fk_quiz_id
        FOREIGN KEY (quiz_id)
            REFERENCES QUIZ(quiz_id)
            ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ANSWERS (
    answer_id              SERIAL                       PRIMARY KEY,
    question_id     integer,
    answer          varchar     NOT NULL,
    is_correct      boolean     NOT NULL,
    points          integer     NOT NULL    DEFAULT 0,

    CONSTRAINT fk_question_id
        FOREIGN KEY (question_id)
            REFERENCES QUESTIONS(question_id)
            ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS SUBMISSIONS (
    submission_id              SERIAL                    PRIMARY KEY,
    quiz_name       varchar,
    username        varchar     NOT NULL,
    time_stamp      timestamp   NOT NULL    DEFAULT CURRENT_TIMESTAMP,
    score           integer     NOT NULL
);
