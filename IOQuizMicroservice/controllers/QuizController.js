const Router = require('express').Router();

const QuizRepository = require('../repository/QuizRepository.js');
const QuestionsRepository = require('../repository/QuestionsRepository.js');
const AnswersRepository = require('../repository/AnswersRepository.js');
const ServerError = require('../errors/ServerError.js');

const {updateQuiz} = require('./updateEntities.js');

const ResponseFilter = require('../filters/ResponseFilter.js');

Router.post('/', async (req, res) => {
    if (!req.body.hasOwnProperty("quiz_name") || !req.body.hasOwnProperty("start_date")
        || !req.body.hasOwnProperty("due_date") || !req.body.hasOwnProperty("allocated_time")
        || !req.body.hasOwnProperty("questions")) {
        throw new ServerError("Body is incorrect.", 400);
    }

    let {
        quiz_name,
        start_date,
        due_date,
        allocated_time,
        questions
    } = req.body;

    const result_quiz = await QuizRepository.addAsync(quiz_name, start_date, due_date, allocated_time);

    for (let question of questions) {
        if (!question.hasOwnProperty("question") || !question.hasOwnProperty("answers"))
            throw new ServerError("Body is incorrect.", 400);

        let result_question = await QuestionsRepository.addAsync(result_quiz.quiz_id, question.question);

        for (let answer of question.answers) {
            if (!answer.hasOwnProperty("answer") || !answer.hasOwnProperty("is_correct") || !answer.hasOwnProperty("points"))
                throw new ServerError("Body is incorrect.", 400);

            let result_answer = await AnswersRepository.addAsync(result_question.question_id, answer.answer, answer.is_correct, answer.points);
        }
    }

    ResponseFilter.setResponseDetails(res, 201, `Quiz ${result_quiz.quiz_id} added in the database`, req.originalUrl);
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

    result.questions = await QuestionsRepository.getByQuizIdAsync(id);

    for await (let question of result.questions) {
        if (question.hasOwnProperty("question_id"))
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

    let result = await updateQuiz(id, req_body);

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

