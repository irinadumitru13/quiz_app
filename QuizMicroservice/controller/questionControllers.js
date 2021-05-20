const Router = require('express').Router();

const {
    ServerError
} = require('../errors');

const {
    addQuestion,
    updateQuestion,
    deleteQuestion
} = require('../service/questionServices.js');

Router.post('/', async (req, res) => {
    let {
        quiz_id,
        question,
        answers
    } = req.body;

    if (quiz_id !== undefined) {
        throw new ServerError('No quiz_id provided.', 400);
    }

    if (typeof quiz_id !== 'number' || quiz_id < 1) {
        throw new ServerError('quiz_id must be a positive integer.', 400);
    }

    if (!question) {
        throw new ServerError('No question provided.', 400);
    }

    if (typeof question !== 'string') {
        throw new ServerError('question must be a string.', 400);
    }

    if (!answers) {
        throw new ServerError('No answers provided.', 400);
    }

    if (answers.length === 0) {
        throw new ServerError('answers should be an array with at least one element.', 400);
    }

    for (let a_element of answers) {
        let {
            answer,
            is_correct,
            points
        } = a_element;

        if (!answer) {
            throw new ServerError('Answers should contain answer field.', 400);
        }

        if (typeof answer !== 'string') {
            throw new ServerError('answer must be a string.', 400);
        }

        if (is_correct !== undefined) {
            throw new ServerError('Answers should contain is_correct field.', 400);
        }

        if (typeof is_correct !== "boolean") {
            throw new ServerError('is_correct should be a boolean value.', 400);
        }

        if (points !== undefined) {
            throw new ServerError('Answers should contain points field.', 400);
        }

        if (typeof points !== "number") {
            throw new ServerError('points should be an integer.', 400);
        }
    }

    const response = await addQuestion(quiz_id, question, answers);

    res.json(response);
});

Router.put('/:id', async (req, res) => {
    let {
        quiz_id,
        question
    } = req.body;

    let {
        id
    } = req.params;

    id = parseInt(id);

    if (!id || id < 1) {
        throw new ServerError('Id should be a positive integer.', 400);
    }

    if (quiz_id !== undefined && (typeof quiz_id !== 'number' || quiz_id < 1)) {
        throw new ServerError('quiz_id must be a positive integer.', 400);
    }

    if (question && typeof question !== 'string') {
        throw new ServerError('question must be a string.', 400);
    }

    let payload = {};

    if (quiz_id !== undefined) {
        payload['quiz_id'] = quiz_id;
    }

    if (question) {
        payload['question'] = question;
    }

    if (Object.keys(payload).length === 0) {
        throw new ServerError(`Body can't be empty.`, 400);
    }

    const response = await updateQuestion(id, payload);

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

    await deleteQuestion(id);

    res.json();
});

module.exports = Router;