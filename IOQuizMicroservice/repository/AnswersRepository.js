const {
    queryAsync
} = require('../database/index.js');

const addAsync = async (question_id, answer, is_correct, points) => {
    console.info(`Adding answer in database async...`);

    const answers = await queryAsync('INSERT INTO ANSWERS (question_id, answer, is_correct, points) VALUES ($1, $2, $3, $4) RETURNING answer_id',
        [question_id, answer, is_correct, points]);

    return answers[0];
};

// this might not be necessary
const getAllAsync = async () => {
    console.info(`Getting all answers from database async...`);

    return await queryAsync('SELECT * FROM ANSWERS');
};

const getByQuestionIdAsync = async (question_id) => {
    console.info(`Getting the answers with question_id ${question_id} from database async...`);

    return await queryAsync('SELECT answer_id, answer, is_correct, points FROM ANSWERS WHERE question_id = $1', [question_id]);
};

const updateAllByIdAsync = async (id, question_id, answer, is_correct, points) => {
    console.info(`Updating the answer with id ${id} from database async...`);

    const answers =  await queryAsync('UPDATE ANSWERS SET question_id = $1, answer = $2, is_correct = $3, points = $4  WHERE answer_id = $5 RETURNING *',
        [question_id, answer, is_correct, points, id]);

    return answers[0];
};

const updateQuestionIdByIdAsync = async (id, question_id) => {
    console.info(`Updating the answer's question_id with id ${id} from database async...`);

    const answers =  await queryAsync('UPDATE ANSWERS SET question_id = $1 WHERE answer_id = $2 RETURNING *',
        [question_id, id]);

    return answers[0];
};

const updateAnswerByIdAsync = async (id, answer) => {
    console.info(`Updating the answer's text with id ${id} from database async...`);

    const answers =  await queryAsync('UPDATE ANSWERS SET answer = $1 WHERE answer_id = $2 RETURNING *',
        [answer, id]);

    return answers[0];
};

const updateIsCorrectByIdAsync = async (id, is_correct) => {
    console.info(`Updating the answer's is_correct with id ${id} from database async...`);

    const answers =  await queryAsync('UPDATE ANSWERS SET is_correct = $1 WHERE answer_id = $2 RETURNING *',
        [is_correct, id]);

    return answers[0];
};

const updatePointsByIdAsync = async (id, points) => {
    console.info(`Updating the answer's points with id ${id} from database async...`);

    const answers =  await queryAsync('UPDATE ANSWERS SET points = $1 WHERE answer_id = $2 RETURNING *',
        [points, id]);

    return answers[0];
};

const updateQuestionIdAnswerByIdAsync = async (id, question_id, answer) => {
    console.info(`Updating the answer's question_id, text with id ${id} from database async...`);

    const answers =  await queryAsync('UPDATE ANSWERS SET question_id = $1, answer = $2 WHERE answer_id = $3 RETURNING *',
        [question_id, answer, id]);

    return answers[0];
};

const updateQuestionIdIsCorrectByIdAsync = async (id, question_id, is_correct) => {
    console.info(`Updating the answer's question_id, is_correct with id ${id} from database async...`);

    const answers =  await queryAsync('UPDATE ANSWERS SET question_id = $1, is_correct = $2 WHERE answer_id = $3 RETURNING *',
        [question_id, is_correct, id]);

    return answers[0];
};

const updateQuestionIdPointsByIdAsync = async (id, question_id, points) => {
    console.info(`Updating the answer's question_id, points with id ${id} from database async...`);

    const answers =  await queryAsync('UPDATE ANSWERS SET question_id = $1, points = $2 WHERE answer_id = $3 RETURNING *',
        [question_id, points, id]);

    return answers[0];
};

const updateAnswerIsCorrectByIdAsync = async (id, answer, is_correct) => {
    console.info(`Updating the answer's text, is_correct with id ${id} from database async...`);

    const answers =  await queryAsync('UPDATE ANSWERS SET answer = $1, is_correct = $2 WHERE answer_id = $3 RETURNING *',
        [answer, is_correct, id]);

    return answers[0];
};

const updateAnswerPointsByIdAsync = async (id, answer, points) => {
    console.info(`Updating the answer's text, points with id ${id} from database async...`);

    const answers =  await queryAsync('UPDATE ANSWERS SET answer = $1, points = $2 WHERE answer_id = $3 RETURNING *',
        [answer, points, id]);

    return answers[0];
};

const updateIsCorrectPointsByIdAsync = async (id, is_correct, points) => {
    console.info(`Updating the answer's is_correct, points with id ${id} from database async...`);

    const answers =  await queryAsync('UPDATE ANSWERS SET is_correct = $1, points = $2 WHERE answer_id = $3 RETURNING *',
        [is_correct, points, id]);

    return answers[0];
};

const updateQuestionIdAnswerIsCorrectByIdAsync = async (id, question_id, answer, is_correct) => {
    console.info(`Updating the answer's question_id, text, is_correct with id ${id} from database async...`);

    const answers =  await queryAsync('UPDATE ANSWERS SET question_id = $1, answer = $2, is_correct = $3 WHERE answer_id = $4 RETURNING *',
        [question_id, answer, is_correct, id]);

    return answers[0];
};

const updateQuestionIdAnswerPointsByIdAsync = async (id, question_id, answer, points) => {
    console.info(`Updating the answer's question_id, text, points with id ${id} from database async...`);

    const answers =  await queryAsync('UPDATE ANSWERS SET question_id = $1, answer = $2, points = $3 WHERE answer_id = $4 RETURNING *',
        [question_id, answer, points, id]);

    return answers[0];
};

const updateQuestionIdIsCorrectPointsByIdAsync = async (id, question_id, is_correct, points) => {
    console.info(`Updating the answer's question_id, is_correct, points with id ${id} from database async...`);

    const answers =  await queryAsync('UPDATE ANSWERS SET question_id = $1, is_correct = $2, points = $3 WHERE answer_id = $4 RETURNING *',
        [question_id, is_correct, points, id]);

    return answers[0];
};

const updateAnswerIsCorrectPointsByIdAsync = async (id, answer, is_correct, points) => {
    console.info(`Updating the answer's text, is_correct, points with id ${id} from database async...`);

    const answers =  await queryAsync('UPDATE ANSWERS SET answer = $1, is_correct = $2, points = $3 WHERE answer_id = $4 RETURNING *',
        [answer, is_correct, points, id]);

    return answers[0];
};

const deleteByIdAsync = async (id) => {
    console.info(`Deleting the answer with id ${id} from database async...`);

    const quiz = await queryAsync('DELETE FROM ANSWERS WHERE answer_id = $1 RETURNING *', [id]);

    return quiz[0];
};

module.exports = {
    addAsync,
    getAllAsync,
    getByQuestionIdAsync,
    updateAllByIdAsync,
    updateQuestionIdByIdAsync,
    updateAnswerByIdAsync,
    updateIsCorrectByIdAsync,
    updatePointsByIdAsync,
    updateQuestionIdAnswerByIdAsync,
    updateQuestionIdIsCorrectByIdAsync,
    updateQuestionIdPointsByIdAsync,
    updateAnswerIsCorrectByIdAsync,
    updateAnswerPointsByIdAsync,
    updateIsCorrectPointsByIdAsync,
    updateQuestionIdAnswerIsCorrectByIdAsync,
    updateQuestionIdAnswerPointsByIdAsync,
    updateQuestionIdIsCorrectPointsByIdAsync,
    updateAnswerIsCorrectPointsByIdAsync,
    deleteByIdAsync
}