const {
    queryAsync
} = require('../database/index.js');

// updates to already submitted results can't be made, no updates implemented

const addAsync = async (quiz_name, username, score) => {
    console.info(`Adding submission in database async...`);

    const questions = await queryAsync('INSERT INTO SUBMISSIONS (quiz_name, username, score) VALUES ($1, $2, $3) RETURNING *',
        [quiz_name, username, score]);

    return questions[0];
};

const getByQuizNameAsync = async (quiz_name) => {
    console.info(`Getting all submissions with quiz_name ${quiz_name} from database async...`);

    return await queryAsync('SELECT * FROM SUBMISSIONS WHERE quiz_name LIKE $1', [quiz_name]);
};

const getByUsernameAsync = async (username) => {
    console.info(`Getting all submissions with username ${username} from database async...`);

    return await queryAsync('SELECT * FROM SUBMISSIONS WHERE username LIKE $1', [username]);
};

const deleteByIdAsync = async (id) => {
    console.info(`Deleting the submission with submission_id ${id} from database async...`);

    const quiz = await queryAsync('DELETE FROM SUBMISSIONS WHERE submission_id = $1 RETURNING *', [id]);

    return quiz[0];
};

module.exports = {
    addAsync,
    getByQuizNameAsync,
    getByUsernameAsync,
    deleteByIdAsync
}