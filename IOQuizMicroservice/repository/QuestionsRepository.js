const {
    queryAsync
} = require('../database/index.js');

const addAsync = async (quiz_id, question) => {
    console.info(`Adding question in database async...`);

    const questions = await queryAsync('INSERT INTO QUESTIONS (quiz_id, question) VALUES ($1, $2) RETURNING question_id',
        [quiz_id, question]);

    return questions[0];
};

const getAllAsync = async () => {
    console.info(`Getting all questions from database async...`);

    return await queryAsync('SELECT * FROM QUESTIONS');
};

const getByQuizIdAsync = async (quiz_id) => {
    console.info(`Getting the questions with quiz_id ${quiz_id} from database async...`);

    const questions = await queryAsync('SELECT question_id, question FROM QUESTIONS WHERE quiz_id = $1', [quiz_id]);

    return questions;
};

const updateAllByIdAsync = async (id, quiz_id, question) => {
    console.info(`Updating the question with id ${id} from database async...`);

    const questions =  await queryAsync('UPDATE QUESTIONS SET quiz_id = $1, question = $2 WHERE question_id = $3 RETURNING *',
        [quiz_id, question, id]);

    return questions[0];
};

const updateQuizIdByIdAsync = async (id, quiz_id) => {
    console.info(`Updating the question's quiz_id with id ${id} from database async...`);

    const questions =  await queryAsync('UPDATE QUESTIONS SET quiz_id = $1 WHERE question_id = $2 RETURNING *',
        [quiz_id, id]);

    return questions[0];
};

const updateQuestionByIdAsync = async (id, question) => {
    console.info(`Updating the question's text with id ${id} from database async...`);

    const questions =  await queryAsync('UPDATE QUESTIONS SET question = $1 WHERE question_id = $2 RETURNING *',
        [question, id]);

    return questions[0];
};

const deleteByIdAsync = async (id) => {
    console.info(`Deleting the question with id ${id} from database async...`);

    const quiz = await queryAsync('DELETE FROM QUESTIONS WHERE question_id = $1 RETURNING *', [id]);

    return quiz[0];
};

module.exports = {
    addAsync,
    getAllAsync,
    getByQuizIdAsync,
    updateAllByIdAsync,
    updateQuizIdByIdAsync,
    updateQuestionByIdAsync,
    deleteByIdAsync
}