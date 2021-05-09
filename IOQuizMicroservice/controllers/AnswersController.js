const Router = require('express').Router();

const AnswersRepository = require('../repository/AnswersRepository.js');
const ServerError = require('../errors/ServerError.js');

const ResponseFilter = require('../filters/ResponseFilter.js');

Router.post('/', async (req, res) => {
    // could make model to verify input -> so that data types are ok :D
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