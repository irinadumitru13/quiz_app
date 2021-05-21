const Router = require('express').Router();

const {
    ServerError
} = require('../errors');

const {
    getSubmissionsByQuizName,
    getSubmissionsByUsername,
    addSubmission,
    deleteSubmission
} = require('../service/submissionServices.js');

Router.get('/', async (req, res) => {
    let user_name = req.header('User-Name');

    if (!user_name) {
        throw new ServerError('User-Name header missing.', 400);
    }

    const submissions = await getSubmissionsByUsername(user_name);

    res.json(submissions);
});

Router.get('/quiz/:quiz_name', async (req, res) => {
    let {
        quiz_name
    } = req.params;

    if (!quiz_name) {
        throw new ServerError('quiz_name must be a path parameter.', 400);
    }

    const response = await getSubmissionsByQuizName(quiz_name);

    res.json(response);
});

Router.post('/', async (req, res) => {
    let {
        quiz_name,
        score
    } = req.body;

    let user_name = req.header('User-Name');

    if (!user_name) {
        throw new ServerError('User-Name header missing.', 400);
    }

    if (!quiz_name) {
        throw new ServerError('No quiz_name provided.', 400);
    }

    if (!score) {
        throw new ServerError('No score provided.', 400);
    }

    if (typeof score !== 'number') {
        throw new ServerError('score must be an integer.', 400);
    }

    const response = await addSubmission(quiz_name, user_name, score);

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

    await deleteSubmission(id);

    res.json();
});

module.exports = Router;