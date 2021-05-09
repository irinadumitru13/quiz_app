const Router = require('express').Router();

const SubmissionsRepository = require('../repository/SubmissionsRepository.js');
const ServerError = require('../errors/ServerError.js');

const ResponseFilter = require('../filters/ResponseFilter.js');

Router.post('/', async (req, res) => {
    // could make model to verify input -> so that data types are ok :D
    if (!req.body.hasOwnProperty("quiz_name") || !req.body.hasOwnProperty("username")
        || !req.body.hasOwnProperty("score")) {
        throw new ServerError("Body is incorrect.", 400);
    }

    let {
        quiz_name,
        username,
        score
    } = req.body;

    const result = await SubmissionsRepository.addAsync(quiz_name, username, score);

    ResponseFilter.setResponseDetails(res, 201, result, req.originalUrl);
});

Router.get('/quiz/:quiz_name', async (req, res) => {
    let {
        quiz_name
    } = req.params;

    const result = await SubmissionsRepository.getByQuizNameAsync(quiz_name);

    if (!result) {
        throw new ServerError(`No submissions for quiz ${quiz_name} found`, 404);
    }

    ResponseFilter.setResponseDetails(res, 200, result);
});

Router.get('/user/:username', async (req, res) => {
    let {
        username
    } = req.params;

    const result = await SubmissionsRepository.getByUsernameAsync(username);

    if (!result) {
        throw new ServerError(`No submissions for username ${username} found`, 404);
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

    const result = await SubmissionsRepository.deleteByIdAsync(id);

    if (!result) {
        throw new ServerError(`Quiz with id ${id} does not exist!`, 404);
    }

    ResponseFilter.setResponseDetails(res, 204, "Entity deleted successfully");
});

module.exports = Router;

