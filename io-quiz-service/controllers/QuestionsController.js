const Router = require('express').Router();

const QuestionsRepository = require('../repository/QuestionsRepository.js');
const AnswersRepository = require('../repository/AnswersRepository.js');
const ServerError = require('../errors/ServerError.js');

const {updateQuestion} = require('./updateEntities.js');

const ResponseFilter = require('../filters/ResponseFilter.js');

Router.post('/', async (req, res) => {
    if (!req.body.hasOwnProperty("quiz_id") || !req.body.hasOwnProperty("question") || !req.body.hasOwnProperty("answers")) {
        throw new ServerError("Body is incorrect.", 400);
    }

    let {
        quiz_id,
        question,
        answers
    } = req.body;

    const result = await QuestionsRepository.addAsync(quiz_id, question);

    if (answers) {
        result.answers = [];
    }

    for (let answer of answers) {
        if (!answer.hasOwnProperty("answer") || !answer.hasOwnProperty("is_correct") || !answer.hasOwnProperty("points"))
            throw new ServerError("Body is incorrect.", 400);
        const a_result = await AnswersRepository.addAsync(result.question_id, answer.answer, answer.is_correct, answer.points);

        result.answers.push(a_result);
    }

    ResponseFilter.setResponseDetails(res, 201, result, req.originalUrl);
});

Router.get('/', async (req, res) => {
    const result = await QuestionsRepository.getAllAsync();

    for await (let question of result) {
        question.answers = await AnswersRepository.getByQuestionIdAsync(question.question_id);
    }

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

    for await (let question of result) {
        question.answers = await AnswersRepository.getByQuestionIdAsync(question.question_id);
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

    let result = await updateQuestion(id, req_body);

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