const Router = require('express').Router();

const {
    ServerError
} = require('./errors');

const {
    getQuizzes,
    getQuizById,
    addQuiz,

} = require('./services.js');

dateFormat = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/;

Router.get('/quiz', async (req, res) => {
    const quizzes = await getQuizzes();

    res.json(quizzes);
});

Router.get('/quiz/:id', async (req, res) => {
    let {
        id
    } = req.params;

    id = parseInt(id);

    if (!id || id < 1) {
        throw new ServerError('Id should be a positive integer.', 400);
    }

    const quiz = await getQuizById(id);

    res.json(quiz);
});

Router.post('/quiz', async(req, res) => {
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

    if (!start_date) {
        throw new ServerError('No start_date provided.', 400);
    }

    if (!due_date) {
        throw new ServerError('No due_date provided.', 400);
    }

    if (!dateFormat.test(start_date) || !dateFormat.test(due_date)) {
        throw new ServerError('Dates should be in the format yyyy-MM-dd HH:mm:SS', 400);
    }

    if (!allocated_time || typeof allocated_time !== "number" || allocated_time < 1) {
        throw new ServerError("allocated_time should be a positive integer", 400);
    }

    if (!questions || questions.length === 0) {
        throw new ServerError('questions should be an array', 400);
    }

    for (let q_element of questions) {
        if (!q_element.hasOwnProperty('question')) {
            throw new ServerError('Questions should contain question field.', 400);
        }

        if (!q_element.hasOwnProperty('answers')) {
            throw new ServerError('Questions should contain answers field - array', 400);
        }

        let {
            question,
            answers
        } = q_element;

        for (let a_element of answers) {
            if (!a_element.hasOwnProperty('answer')) {
                throw new ServerError('Answers should contain answer field.', 400);
            }

            if (!a_element.hasOwnProperty('is_correct')) {
                throw new ServerError('Answers should contain is_correct field.', 400);
            }

            if (!a_element.hasOwnProperty('points')) {
                throw new ServerError('Answers should contain points field.', 400);
            }

            let {
                answer,
                is_correct,
                points
            } = a_element;

            if (typeof is_correct !== "boolean") {
                throw new ServerError('is_correct should be a boolean value.', 400);
            }

            if (typeof points !== "number") {
                throw new ServerError('points should be an integer.', 400);
            }
        }
    }

    const id = await addQuiz(quiz_name, start_date, due_date, allocated_time, questions);

    res.json(id);
});

module.exports = Router;