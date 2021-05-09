const Router = require('express').Router();

const QuestionsRepository = require('../repository/QuestionsRepository.js');
const ServerError = require('../errors/ServerError.js');

const ResponseFilter = require('../filters/ResponseFilter.js');

Router.post('/', async (req, res) => {
    // could make model to verify input -> so that data types are ok :D
    if (!req.body.hasOwnProperty("quiz_id") || !req.body.hasOwnProperty("question")) {
        throw new ServerError("Body is incorrect.", 400);
    }

    let {
        quiz_id,
        question
    } = req.body;

    const result = await QuestionsRepository.addAsync(quiz_id, question);

    ResponseFilter.setResponseDetails(res, 201, result, req.originalUrl);
});

Router.get('/', async (req, res) => {
    const result = await QuestionsRepository.getAllAsync();

    ResponseFilter.setResponseDetails(res, 200, result);
});

Router.get('/:quiz_id', async (req, res) => {
    let {
        quiz_id
    } = req.params;

    quiz_id = parseInt(quiz_id);

    if (!quiz_id || quiz_id < 1) {
        throw new ServerError("Id should be a positive integer", 400);
    }

    const result = await QuestionsRepository.getByQuizIdAsync(quiz_id);

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
    let result;

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

    const result = await QuestionsRepository.deleteByIdAsync(id);

    if (!result) {
        throw new ServerError(`Question with id ${id} does not exist!`, 404);
    }

    ResponseFilter.setResponseDetails(res, 204, "Entity deleted successfully");
});

module.exports = Router;