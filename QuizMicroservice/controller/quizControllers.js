const Router = require('express').Router();

const {
    ServerError
} = require('../errors');

const {
    getQuizzes,
    getQuizById,
    addQuiz,
    updateQuiz,
    deleteQuiz
} = require('../service/quizServices.js');

dateFormat = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/;

Router.get('/', async (req, res) => {
    const response = await getQuizzes();

    res.json(response);
});

Router.get('/:id', async (req, res) => {
    let {
        id
    } = req.params;

    id = parseInt(id);

    if (!id || id < 1) {
        throw new ServerError('Id should be a positive integer.', 400);
    }

    const response = await getQuizById(id);

    res.json(response);
});

Router.post('/', async (req, res) => {
    let {
        quiz_name,
        start_date,
        due_date,
        allocated_time,
        questions
    } = req.body;

    if (!quiz_name) {
        throw new ServerError('No quiz_name provided.', 400);
    }

    if (typeof quiz_name !== 'string') {
        throw new ServerError('quiz_name must be a string.', 400);
    }

    if (!start_date) {
        throw new ServerError('No start_date provided.', 400);
    }

    if (!dateFormat.test(start_date)) {
        throw new ServerError('start_date should be in the format yyyy-MM-dd HH:mm:SS', 400);
    }

    if (!due_date) {
        throw new ServerError('No due_date provided.', 400);
    }

    if (!dateFormat.test(due_date)) {
        throw new ServerError('due_date should be in the format yyyy-MM-dd HH:mm:SS', 400);
    }

    if (allocated_time !== undefined) {
        throw new ServerError('No allocated_time provided.', 400);
    }

    if (typeof allocated_time !== "number" || allocated_time < 1) {
        throw new ServerError("allocated_time should be a positive integer", 400);
    }

    if (!questions) {
        throw new ServerError('No questions provided.', 400);
    }

    if (questions.length === 0) {
        throw new ServerError('questions should be an array with at least one element.', 400);
    }

    for (let q_element of questions) {
        let {
            question,
            answers
        } = q_element;

        if (!q_element.hasOwnProperty('question')) {
            throw new ServerError('Questions should contain question field.', 400);
        }

        if (typeof question !== 'string') {
            throw new ServerError('question should be a string.', 400);
        }

        if (!q_element.hasOwnProperty('answers')) {
            throw new ServerError('Questions should contain answers field - array', 400);
        }

        for (let a_element of answers) {
            let {
                answer,
                is_correct,
                points
            } = a_element;

            if (!a_element.hasOwnProperty('answer')) {
                throw new ServerError('Answers should contain answer field.', 400);
            }

            if (typeof answer !== 'string') {
                throw new ServerError('answer should be a string.', 400);
            }

            if (!a_element.hasOwnProperty('is_correct')) {
                throw new ServerError('Answers should contain is_correct field.', 400);
            }

            if (typeof is_correct !== "boolean") {
                throw new ServerError('is_correct should be a boolean value.', 400);
            }

            if (!a_element.hasOwnProperty('points')) {
                throw new ServerError('Answers should contain points field.', 400);
            }

            if (typeof points !== "number") {
                throw new ServerError('points should be an integer.', 400);
            }
        }
    }

    const response = await addQuiz(quiz_name, start_date, due_date, allocated_time, questions);

    res.json(response);
});

Router.put('/:id', async (req, res) => {
    let {
        quiz_name,
        start_date,
        due_date,
        allocated_time,
        questions
    } = req.body;

    let {
        id
    } = req.params;

    id = parseInt(id);

    if (!id || id < 1) {
        throw new ServerError('Id should be a positive integer.', 400);
    }

    if (Object.keys(req.body).length === 0) {
        throw new ServerError(`Body can't be empty.`, 400);
    }

    if (quiz_name && typeof quiz_name !== 'string') {
        throw new ServerError('quiz_name must be a string.', 400);
    }

    if (start_date && !dateFormat.test(start_date)) {
        throw new ServerError('start_date should be in the format yyyy-MM-dd HH:mm:SS', 400);
    }

    if (due_date && !dateFormat.test(due_date)) {
        throw new ServerError('due_date should be in the format yyyy-MM-dd HH:mm:SS', 400);
    }

    if (allocated_time !== undefined && (typeof allocated_time !== "number" || allocated_time < 1)) {
        throw new ServerError("allocated_time should be a positive integer", 400);
    }

    if (questions) {
        if (questions.length === 0) {
            throw new ServerError('questions must contain at least one element.', 400);
        }

        for (let q_element of questions) {
            let {
                question_id,
                question,
                answers
            } = q_element;

            if (question_id === undefined) {
                throw new ServerError('No question_id provided.', 400);
            }

            if (Object.keys(q_element).length < 2) {
                throw new ServerError('If questions to be updated, at least question_id and another field to be provided.', 400);
            }

            if (question && typeof question !== 'string') {
                throw new ServerError('question must be a string.', 400);
            }

            if (answers) {
                if (answers.length === 0) {
                    throw new ServerError('answers must contain at least one element.', 400);
                }

                for (let a_element of answers) {
                    let {
                        answer_id,
                        answer,
                        is_correct,
                        points
                    } = a_element;

                    if (answer_id === undefined) {
                        throw new ServerError('No answer_id provided.', 400);
                    }

                    if (Object.keys(a_element).length < 2) {
                        throw new ServerError('If answers to be updated, at least answer_id and another field to be provided.', 400);
                    }

                    if (answer && typeof answer !== 'string') {
                        throw new ServerError('answer must be a string.', 400);
                    }

                    if (is_correct !== undefined && typeof is_correct !== 'boolean') {
                        throw new ServerError('is_correct must be a boolean.', 400);
                    }

                    if (points !== undefined && typeof points !== 'number') {
                        throw new ServerError('points must be an integer.', 400);
                    }
                }
            }
        }
    }

    const response = await updateQuiz(id, req.body);

    res.json(response);
});

Router.delete('/:id', async (req, res) => {
    let {
        id
    } = req.params;

    id = parseInt(id);

    if (!id || id < 1) {
        throw new ServerError('Id should be a positive integer.', 400);
    }

    await deleteQuiz(id);

    res.json();
});

module.exports = Router;