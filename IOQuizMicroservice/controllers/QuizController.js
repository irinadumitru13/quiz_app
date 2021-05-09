const Router = require('express').Router();

const QuizRepository = require('../repository/QuizRepository.js');
const ServerError = require('../errors/ServerError.js');

const ResponseFilter = require('../filters/ResponseFilter.js');

Router.post('/', async (req, res) => {
    // could make model to verify input -> so that data types are ok :D
    if (!req.body.hasOwnProperty("quiz_name") || !req.body.hasOwnProperty("due_date")
        || !req.body.hasOwnProperty("allocated_time")) {
        throw new ServerError("Body is incorrect.", 400);
    }

    let {
        quiz_name,
        due_date,
        allocated_time
    } = req.body;

    const result = await QuizRepository.addAsync(quiz_name, due_date, allocated_time);

    ResponseFilter.setResponseDetails(res, 201, result, req.originalUrl);
});

Router.get('/', async (req, res) => {
    const result = await QuizRepository.getAllAsync();

    ResponseFilter.setResponseDetails(res, 200, result);
});

Router.get('/available', async (req, res) => {
    const result = await QuizRepository.getAllAvailable();

    ResponseFilter.setResponseDetails(res, 200, result);
});

Router.get('/:id', async (req, res) => {
    let {
        id
    } = req.params;

    id = parseInt(id);

    if (!id || id < 1) {
        throw new ServerError("Id should be a positive integer", 400);
    }

    const result = await QuizRepository.getByIdAsync(id);

    if (!result) {
        throw new ServerError(`Quiz with id ${id} does not exist!`, 404);
    }

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

    if (req_body.hasOwnProperty("quiz_name")) {
        if (req_body.hasOwnProperty("due_date")) {
            if (req_body.hasOwnProperty("allocated_time")) {
                result = await QuizRepository.updateAllByIdAsync(id, req_body.quiz_name, req_body.due_date, req_body.allocated_time);
            } else {
                result = await QuizRepository.updateQuizNameDueDateByIdAsync(id, req_body.quiz_name, req_body.due_date);
            }
        } else {
            if (req_body.hasOwnProperty("allocated_time")) {
                result = await QuizRepository.updateQuizNameAllocatedTimeByIdAsync(id, req_body.quiz_name, req_body.allocated_time);
            } else {
                result = await QuizRepository.updateQuizNameByIdAsync(id, req_body.quiz_name);
            }
        }
    } else {
        if (req_body.hasOwnProperty("due_date")) {
            if (req_body.hasOwnProperty("allocated_time")) {
                result = await QuizRepository.updateDueDateAllocatedTimeByIdAsync(id, req_body.due_date, req_body.allocated_time);
            } else {
                result = await QuizRepository.updateDueDateByIdAsync(id, req_body.due_date);
            }
        } else {
            if (req_body.hasOwnProperty("allocated_time")) {
                result = await QuizRepository.updateAllocatedTimeByIdAsync(id, req_body.allocated_time);
            } else {
                throw new ServerError("Body is incorrect.", 400);
            }
        }
    }

    if (!result) {
        throw new ServerError(`Quiz with id ${id} does not exist!`, 404);
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

    const result = await QuizRepository.deleteByIdAsync(id);

    if (!result) {
        throw new ServerError(`Quiz with id ${id} does not exist!`, 404);
    }

    ResponseFilter.setResponseDetails(res, 204, "Entity deleted successfully");
});

module.exports = Router;
