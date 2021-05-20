const Router = require('express')();

const AnswersController = require('./controller/answerControllers.js');
const QuestionsController = require('./controller/questionControllers.js');
const QuizController = require('./controller/quizControllers.js');
const SubmissionsController = require('./controller/submissionControllers.js');

Router.use('/answer', AnswersController);
Router.use('/question', QuestionsController);
Router.use('/quiz', QuizController);
Router.use('/submission', SubmissionsController);

module.exports = Router;