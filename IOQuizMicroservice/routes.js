const Router = require('express')();

const AnswersController = require('./controllers/AnswersController.js');
const QuestionsController = require('./controllers/QuestionsController.js');
const QuizController = require('./controllers/QuizController.js');
const SubmissionsController = require('./controllers/SubmissionsController.js');

Router.use('/answers', AnswersController);
Router.use('/questions', QuestionsController);
Router.use('/quiz', QuizController);
Router.use('/submissions', SubmissionsController);

module.exports = Router;