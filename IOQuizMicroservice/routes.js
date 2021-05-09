const Router = require('express')();

const AnswersController = require('./controllers/AnswersController.js');
const QuestionsController = require('./controllers/QuestionsController.js');
const QuizController = require('./controllers/QuizController.js');
const SubmissionsController = require('./controllers/SubmissionsController.js');

Router.use('/v1/answers', AnswersController);
Router.use('/v1/questions', QuestionsController);
Router.use('/v1/quiz', QuizController);
Router.use('/v1/submissions', SubmissionsController);

module.exports = Router;