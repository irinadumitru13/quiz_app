const AnswersRepository = require("../repository/AnswersRepository.js");
const QuestionsRepository = require("../repository/QuestionsRepository.js");
const QuizRepository = require("../repository/QuizRepository.js");

const ServerError = require("../errors/ServerError");

const updateAnswer = async (id, req_body) => {
    let result;

    if (req_body.hasOwnProperty("question_id")) {
        if (req_body.hasOwnProperty("answer")) {
            if (req_body.hasOwnProperty("is_correct")) {
                if (req_body.hasOwnProperty("points")) {
                    result = await AnswersRepository.updateAllByIdAsync(id, req_body.question_id, req_body.answer, req_body.is_correct, req_body.points);
                } else {
                    result = await AnswersRepository.updateQuestionIdAnswerIsCorrectByIdAsync(id, req_body.question_id, req_body.answer, req_body.is_correct);
                }
            } else {
                if (req_body.hasOwnProperty("points")) {
                    result = await AnswersRepository.updateQuestionIdAnswerPointsByIdAsync(id, req_body.question_id, req_body.answer, req_body.points);
                } else {
                    result = await AnswersRepository.updateQuestionIdAnswerByIdAsync(id, req_body.question_id, req_body.answer);
                }
            }
        } else {
            if (req_body.hasOwnProperty("is_correct")) {
                if (req_body.hasOwnProperty("points")) {
                    result = await AnswersRepository.updateQuestionIdIsCorrectPointsByIdAsync(id, req_body.question_id, req_body.is_correct, req_body.points);
                } else {
                    result = await AnswersRepository.updateQuestionIdIsCorrectByIdAsync(id, req_body.question_id, req_body.is_correct);
                }
            } else {
                if (req_body.hasOwnProperty("points")) {
                    result = await AnswersRepository.updateQuestionIdPointsByIdAsync(id, req_body.question_id, req_body.points);
                } else {
                    result = await AnswersRepository.updateQuestionIdByIdAsync(id, req_body.question_id);
                }
            }
        }
    } else {
        if (req_body.hasOwnProperty("answer")) {
            if (req_body.hasOwnProperty("is_correct")) {
                if (req_body.hasOwnProperty("points")) {
                    result = await AnswersRepository.updateAnswerIsCorrectPointsByIdAsync(id, req_body.answer, req_body.is_correct, req_body.points);
                } else {
                    result = await AnswersRepository.updateAnswerIsCorrectByIdAsync(id, req_body.answer, req_body.is_correct);
                }
            } else {
                if (req_body.hasOwnProperty("points")) {
                    result = await AnswersRepository.updateAnswerPointsByIdAsync(id, req_body.answer, req_body.points);
                } else {
                    result = await AnswersRepository.updateAnswerByIdAsync(id, req_body.answer);
                }
            }
        } else {
            if (req_body.hasOwnProperty("is_correct")) {
                if (req_body.hasOwnProperty("points")) {
                    result = await AnswersRepository.updateIsCorrectPointsByIdAsync(id, req_body.is_correct, req_body.points);
                } else {
                    result = await AnswersRepository.updateIsCorrectByIdAsync(id, req_body.is_correct);
                }
            } else {
                if (req_body.hasOwnProperty("points")) {
                    result = await AnswersRepository.updatePointsByIdAsync(id, req_body.points);
                } else {
                    throw new ServerError("Body is incorrect.", 400);
                }
            }
        }
    }

    return result;
};

const updateQuestion = async (id, req_body) => {
    let result;
    let answers

    if (req_body.hasOwnProperty('answers')) {
        answers = req_body.answers;
        delete req_body['answers'];
    }

    if (req_body.hasOwnProperty("quiz_id")) {
        if (req_body.hasOwnProperty("question")) {
            result = await QuestionsRepository.updateAllByIdAsync(id, req_body.quiz_id, req_body.question);
        } else {
            result = await QuestionsRepository.updateQuizIdByIdAsync(id, req_body.quiz_id);
        }
    } else {
        if (req_body.hasOwnProperty("question")) {
            result = await QuestionsRepository.updateQuestionByIdAsync(id, req_body.question);
        } else {
            throw new ServerError("Body is incorrect.", 400);
        }
    }

    if (!result) {
        throw new ServerError(`Question with id ${id} does not exist!`, 404);
    }

    if (answers) {
        result.answers = [];

        for (let a_element of answers) {
            if (a_element.hasOwnProperty('answer_id')) {
                let answer_id = a_element.answer_id;
                delete a_element['answer_id'];

                let a_result = await updateAnswer(answer_id, a_element);

                if (!a_result) {
                    throw new ServerError(`Answer with id ${answer_id} does not exist!`, 404);
                }

                result.answers.push(a_result);
            }
        }
    }

    return result;
};

const updateQuiz = async (id, req_body) => {
    let result;
    let questions;

    if (req_body.hasOwnProperty('questions')) {
        questions = req_body.questions;
        delete req_body['questions'];
    }

    if (req_body.hasOwnProperty("quiz_name")) {
        if (req_body.hasOwnProperty("start_date")) {
            if (req_body.hasOwnProperty("due_date")) {
                if (req_body.hasOwnProperty("allocated_time")) {
                    result = await QuizRepository.updateAllByIdAsync(
                        id, req_body.quiz_name, req_body.start_date, req_body.due_date, req_body.allocated_time);
                } else {
                    result = await QuizRepository.updateQuizNameStartDateDueDateByIdAsync(
                        id, req_body.quiz_name, req_body.start_date, req_body.due_date);
                }
            } else {
                if (req_body.hasOwnProperty("allocated_time")) {
                    result = await QuizRepository.updateQuizNameStartDateAllocatedTimeByIdAsync(
                        id, req_body.quiz_name, req_body.start_date, req_body.allocated_time);
                } else {
                    result = await QuizRepository.updateQuizNameStartDateByIdAsync(
                        id, req_body.quiz_name, req_body.start_date);
                }
            }
        } else {
            if (req_body.hasOwnProperty("due_date")) {
                if (req_body.hasOwnProperty("allocated_time")) {
                    result = await QuizRepository.updateQuizNameDueDateAllocatedTimeByIdAsync(
                        id, req_body.quiz_name, req_body.due_date, req_body.allocated_time);
                } else {
                    result = await QuizRepository.updateQuizNameDueDateByIdAsync(
                        id, req_body.quiz_name, req_body.due_date);
                }
            } else {
                if (req_body.hasOwnProperty("allocated_time")) {
                    result = await QuizRepository.updateQuizNameAllocatedTimeByIdAsync(
                        id, req_body.quiz_name, req_body.allocated_time);
                } else {
                    result = await QuizRepository.updateQuizNameByIdAsync(id, req_body.quiz_name);
                }
            }
        }
    } else {
        if (req_body.hasOwnProperty("start_date")) {
            if (req_body.hasOwnProperty("due_date")) {
                if (req_body.hasOwnProperty("allocated_time")) {
                    result = await QuizRepository.updateStartDateDueDateAllocatedTimeByIdAsync(
                        id, req_body.start_date, req_body.due_date, req_body.allocated_time);
                } else {
                    result = await QuizRepository.updateStartDateDueDateByIdAsync(
                        id, req_body.start_date, req_body.due_date);
                }
            } else {
                if (req_body.hasOwnProperty("allocated_time")) {
                    result = await QuizRepository.updateStartDateAllocatedTimeByIdAsync(
                        id, req_body.start_date, req_body.allocated_time);
                } else {
                    result = await QuizRepository.updateStartDateByIdAsync(
                        id, req_body.start_date);
                }
            }
        } else {
            if (req_body.hasOwnProperty("due_date")) {
                if (req_body.hasOwnProperty("allocated_time")) {
                    result = await QuizRepository.updateDueDateAllocatedTimeByIdAsync(
                        id, req_body.due_date, req_body.allocated_time);
                } else {
                    result = await QuizRepository.updateDueDateByIdAsync(
                        id, req_body.due_date);
                }
            } else {
                if (req_body.hasOwnProperty("allocated_time")) {
                    result = await QuizRepository.updateAllocatedTimeByIdAsync(
                        id, req_body.allocated_time);
                } else {
                    throw new ServerError('Body is incorrect.', 400);
                }
            }
        }
    }

    if (!result) {
        throw new ServerError(`Quiz with id ${id} does not exist!`, 404);
    }

    if (questions) {
        result.questions = [];

        for (let q_element of questions) {
            if (q_element.hasOwnProperty('question_id')) {
                let question_id = q_element.question_id;
                delete q_element['question_id'];

                let q_result = await updateQuestion(question_id, q_element);

                if (!q_result) {
                    throw new ServerError(`Question with id ${question_id} does not exist!`, 404);
                }

                result.questions.push(q_result);
            }
        }
    }

    return result;
};

module.exports = {
    updateAnswer,
    updateQuestion,
    updateQuiz
};