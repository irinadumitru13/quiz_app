const Router = require('express').Router();

const {
    ServerError
} = require('../errors');

const {
    addAnswer,
    updateAnswer,
    deleteAnswer
} = require('../service/answerServices.js');

Router.post('/', async (req, res) => {
    let {
        question_id,
        answer,
        is_correct,
        points
    } = req.body;

    if (question_id === undefined) {
        throw new ServerError('No question_id provided.', 400);
    }

    if (typeof question_id !== 'number' || question_id < 1) {
        throw new ServerError('question_id must be a positive integer.', 400);
    }

    if (!answer) {
        throw new ServerError('No answer provided.', 400);
    }

    if (typeof answer !== 'string') {
        throw new ServerError('answer must be a string.', 400);
    }

    if (is_correct === undefined) {
        throw new ServerError('No is_correct provided.', 400);
    }

    if (typeof is_correct !== "boolean") {
        throw new ServerError('is_correct should be a boolean value.', 400);
    }

    if (points === undefined) {
        throw new ServerError('No points provided', 400);
    }

    if (typeof points !== "number") {
        throw new ServerError('points should be an integer.', 400);
    }

    const response = await addAnswer(question_id, answer, is_correct, points);

    res.json(response);
});

Router.put('/:id', async (req, res) => {
    let {
        question_id,
        answer,
        is_correct,
        points
    } = req.body;

    let {
        id
    } = req.params;

    id = parseInt(id);

    if (!id || id < 1) {
        throw new ServerError('Id should be a positive integer.', 400);
    }

    if (question_id !== undefined && (typeof question_id !== 'number' || question_id < 1)) {
        throw new ServerError('question_id must be a positive integer.', 400);
    }

    if (answer && typeof answer !== 'string') {
        throw new ServerError('answer must be a string.', 400);
    }

    if (is_correct !== undefined && typeof is_correct !== 'boolean') {
        throw new ServerError('is_correct must be a string.', 400);
    }

    if (points !== undefined && typeof points !== 'number') {
        throw new ServerError('points must be an integer.', 400);
    }

    let payload = {};

    if (question_id !== undefined) {
        payload['question_id'] = question_id;
    }

    if (answer) {
        payload['answer'] = answer;
    }

    if (is_correct !== undefined) {
        payload['is_correct'] = is_correct;
    }

    if (points !== undefined) {
        payload['points'] = points;
    }

    if (Object.keys(payload).length === 0) {
        throw new ServerError(`Body can't be empty.`, 400);
    }

    const response = await updateAnswer(id, payload);

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

    await deleteAnswer(id);

    res.json();
});

module.exports = Router;