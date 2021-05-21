const Router = require('express').Router();

const AnswersRepository = require('../repository/AnswersRepository.js');
const ServerError = require('../errors/ServerError.js');

const {updateAnswer} = require('./updateEntities.js');

const ResponseFilter = require('../filters/ResponseFilter.js');

Router.post('/', async (req, res) => {
    if (!req.body.hasOwnProperty("question_id") || !req.body.hasOwnProperty("answer")
        || !req.body.hasOwnProperty("is_correct") || !req.body.hasOwnProperty("points")) {
        throw new ServerError("Body is incorrect.", 400);
    }

    let {
        question_id,
        answer,
        is_correct,
        points
    } = req.body;

    const result = await AnswersRepository.addAsync(question_id, answer, is_correct, points);

    ResponseFilter.setResponseDetails(res, 201, result, req.originalUrl);
});

// this might not be necessary
Router.get('/', async (req, res) => {
    const result = await AnswersRepository.getAllAsync();

    ResponseFilter.setResponseDetails(res, 200, result);
});

Router.get('/:question_id', async (req, res) => {
    let {
        question_id
    } = req.params;

    question_id = parseInt(question_id);

    if (!question_id || question_id < 1) {
        throw new ServerError("Question ID should be a positive integer", 400);
    }

    const result = await AnswersRepository.getByQuestionIdAsync(question_id);

    ResponseFilter.setResponseDetails(res, 200, result);
});

Router.put('/:id', async (req, res) => {
    let {
        id
    } = req.params;

    id = parseInt(id);

    if (!id || id < 1) {
        throw new ServerError("Id should be a positive integer", 400);
    }

    let req_body = req.body;

    let result = await updateAnswer(id, req_body);

    if (!result) {
        throw new ServerError(`Answer with id ${id} does not exist!`, 404);
    }

    ResponseFilter.setResponseDetails(res, 200, result);
});

Router.delete('/:id', async (req, res) => {
    let {
        id
    } = req.params;

    id = parseInt(id);

    if (!id || id < 1) {
        throw new ServerError("Id should be a positive integer", 400);
    }

    const result = await AnswersRepository.deleteByIdAsync(id);

    if (!result) {
        throw new ServerError(`Answer with id ${id} does not exist!`, 404);
    }

    ResponseFilter.setResponseDetails(res, 204, "Entity deleted successfully");
});

module.exports = Router;