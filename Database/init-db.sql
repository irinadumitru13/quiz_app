CREATE TABLE IF NOT EXISTS QUIZ (
    id              SERIAL                              PRIMARY KEY,
    q_name          varchar     NOT NULL    UNIQUE,
    due_date        timestamp   NOT NULL,
    allocated_time  integer     NOT NULL
);

CREATE TABLE IF NOT EXISTS QUESTIONS (
    id              SERIAL                              PRIMARY KEY,
    quiz_id         integer,
    question        varchar     NOT NULL    UNIQUE,

    CONSTRAINT fk_quiz_id
        FOREIGN KEY (quiz_id)
            REFERENCES QUIZ(id)
            ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ANSWERS (
    id              SERIAL                              PRIMARY KEY,
    question_id     integer,
    answer          varchar     NOT NULL    UNIQUE,
    is_correct      boolean     NOT NULL,
    points          integer     NOT NULL    DEFAULT 0,

    CONSTRAINT fk_question_id
        FOREIGN KEY (question_id)
            REFERENCES QUESTIONS(id)
            ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS SUBMISSIONS (
    id              SERIAL                              PRIMARY KEY,
    quiz_name       varchar,
    username        varchar     NOT NULL,
    time_stamp      timestamp   NOT NULL    DEFAULT CURRENT_TIMESTAMP,
    score           integer     NOT NULL
);
