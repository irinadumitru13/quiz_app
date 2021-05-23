const {
    queryAsync
} = require('../database/index.js');

const addAsync = async (quiz_name, start_date, due_date, allocated_time) => {
    console.info(`Adding quiz in database async...`);

    const quizzes = await queryAsync('INSERT INTO QUIZ (quiz_name, start_date, due_date, allocated_time) VALUES ($1, $2, $3, $4) RETURNING *',
        [quiz_name, start_date, due_date, allocated_time]);

    return quizzes[0];
};

const getAllAsync = async () => {
    console.info(`Getting all quizzes from database async...`);

    return await queryAsync('SELECT quiz_id, quiz_name, start_date, due_date FROM QUIZ');
};

const getAllAvailable = async () => {
    console.info('Getting all available quizzes from database async...');

    return await queryAsync('SELECT quiz_id, quiz_name FROM QUIZ WHERE CURRENT_TIMESTAMP BETWEEN start_date AND due_date');
};

const getByIdAsync = async (id) => {
    console.info(`Getting the quiz with id ${id} from database async...`);

    const quizzes = await queryAsync('SELECT * FROM QUIZ WHERE quiz_id = $1', [id]);

    return quizzes[0];
};

const updateAllByIdAsync = async (id, quiz_name, start_date, due_date, allocated_time) => {
    console.info(`Updating the quiz with id ${id} from database async...`);

    const quiz =  await queryAsync('UPDATE QUIZ SET quiz_name = $1, start_date = $2, due_date = $3, allocated_time = $4 WHERE quiz_id = $5 RETURNING *',
        [quiz_name, start_date, due_date, allocated_time, id]);

    return quiz[0];
};

const updateQuizNameByIdAsync = async (id, quiz_name) => {
    console.info(`Updating the quiz's quiz_name with id ${id} from database async...`);

    const quiz =  await queryAsync('UPDATE QUIZ SET quiz_name = $1 WHERE quiz_id = $2 RETURNING *',
        [quiz_name, id]);

    return quiz[0];
};

const updateStartDateByIdAsync = async (id, start_date) => {
    console.info(`Updating the quiz's start_date with id ${id} from database async...`);

    const quiz =  await queryAsync('UPDATE QUIZ SET start_date = $1 WHERE quiz_id = $2 RETURNING *',
        [start_date, id]);

    return quiz[0];
};

const updateDueDateByIdAsync = async (id, due_date) => {
    console.info(`Updating the quiz's due_date with id ${id} from database async...`);

    const quiz =  await queryAsync('UPDATE QUIZ SET due_date = $1 WHERE quiz_id = $2 RETURNING *',
        [due_date, id]);

    return quiz[0];
};

const updateAllocatedTimeByIdAsync = async (id, allocated_time) => {
    console.info(`Updating the quiz's allocated_time with id ${id} from database async...`);

    const quiz =  await queryAsync('UPDATE QUIZ SET allocated_time = $1 WHERE quiz_id = $2 RETURNING *',
        [allocated_time, id]);

    return quiz[0];
};

const updateQuizNameStartDateByIdAsync = async (id, quiz_name, start_date) => {
    console.info(`Updating the quiz's quiz_name, start_date with id ${id} from database async...`);

    const quiz =  await queryAsync('UPDATE QUIZ SET quiz_name = $1, start_date = $2 WHERE quiz_id = $3 RETURNING *',
        [quiz_name, start_date, id]);

    return quiz[0];
};

const updateQuizNameDueDateByIdAsync = async (id, quiz_name, due_date) => {
    console.info(`Updating the quiz's quiz_name, due_date with id ${id} from database async...`);

    const quiz =  await queryAsync('UPDATE QUIZ SET quiz_name = $1, due_date = $2 WHERE quiz_id = $3 RETURNING *',
        [quiz_name, due_date, id]);

    return quiz[0];
};

const updateQuizNameAllocatedTimeByIdAsync = async (id, quiz_name, allocated_time) => {
    console.info(`Updating the quiz's quiz_name, allocated_time with id ${id} from database async...`);

    const quiz =  await queryAsync('UPDATE QUIZ SET quiz_name = $1, allocated_time = $2 WHERE quiz_id = $3 RETURNING *',
        [quiz_name, allocated_time, id]);

    return quiz[0];
};

const updateStartDateDueDateByIdAsync = async (id, start_date, due_date) => {
    console.info(`Updating the quiz's start_date, due_date with id ${id} from database async...`);

    const quiz =  await queryAsync('UPDATE QUIZ SET start_date = $1, due_date = $2 WHERE quiz_id = $3 RETURNING *',
        [start_date, due_date, id]);

    return quiz[0];
};

const updateStartDateAllocatedTimeByIdAsync = async (id, start_date, allocated_time) => {
    console.info(`Updating the quiz's start_date, allocated_time with id ${id} from database async...`);

    const quiz =  await queryAsync('UPDATE QUIZ SET start_date = $1, allocated_time = $2 WHERE quiz_id = $3 RETURNING *',
        [due_date, allocated_time, id]);

    return quiz[0];
};

const updateDueDateAllocatedTimeByIdAsync = async (id, due_date, allocated_time) => {
    console.info(`Updating the quiz's due_date, allocated_time with id ${id} from database async...`);

    const quiz =  await queryAsync('UPDATE QUIZ SET due_date = $1, allocated_time = $2 WHERE quiz_id = $3 RETURNING *',
        [due_date, allocated_time, id]);

    return quiz[0];
};

const updateQuizNameStartDateDueDateByIdAsync = async (id, quiz_name, start_date, due_date) => {
    console.info(`Updating the quiz's quiz_name, start_date, due_date with id ${id} from database async...`);

    const quiz =  await queryAsync('UPDATE QUIZ SET quiz_name = $1, start_date = $2, due_date = $3 WHERE quiz_id = $4 RETURNING *',
        [quiz_name, start_date, due_date, id]);

    return quiz[0];
};

const updateQuizNameStartDateAllocatedTimeByIdAsync = async (id, quiz_name, start_date, allocated_time) => {
    console.info(`Updating the quiz's quiz_name, start_date, allocated_time with id ${id} from database async...`);

    const quiz =  await queryAsync('UPDATE QUIZ SET quiz_name = $1, start_date = $2, allocated_time = $3 WHERE quiz_id = $4 RETURNING *',
        [quiz_name, start_date, allocated_time, id]);

    return quiz[0];
};

const updateQuizNameDueDateAllocatedTimeByIdAsync = async (id, quiz_name, due_date, allocated_time) => {
    console.info(`Updating the quiz's quiz_name, due_date, allocated_time with id ${id} from database async...`);

    const quiz =  await queryAsync('UPDATE QUIZ SET quiz_name = $1, due_date = $2, allocated_time = $3 WHERE quiz_id = $4 RETURNING *',
        [quiz_name, due_date, allocated_time, id]);

    return quiz[0];
};

const updateStartDateDueDateAllocatedTimeByIdAsync = async (id, start_date, due_date, allocated_time) => {
    console.info(`Updating the quiz's start_date, due_date, allocated_time with id ${id} from database async...`);

    const quiz =  await queryAsync('UPDATE QUIZ SET start_date = $1, due_date = $2, allocated_time = $3 WHERE quiz_id = $4 RETURNING *',
        [start_date, due_date, allocated_time, id]);

    return quiz[0];
};

const deleteByIdAsync = async (id) => {
    console.info(`Deleting the quiz with id ${id} from database async...`);

    const quiz = await queryAsync('DELETE FROM QUIZ WHERE quiz_id = $1 RETURNING *', [id]);

    return quiz[0];
};

module.exports = {
    addAsync,
    getAllAsync,
    getAllAvailable,
    getByIdAsync,
    updateAllByIdAsync,
    updateQuizNameByIdAsync,
    updateStartDateByIdAsync,
    updateDueDateByIdAsync,
    updateAllocatedTimeByIdAsync,
    updateQuizNameStartDateByIdAsync,
    updateQuizNameDueDateByIdAsync,
    updateQuizNameAllocatedTimeByIdAsync,
    updateStartDateDueDateByIdAsync,
    updateStartDateAllocatedTimeByIdAsync,
    updateDueDateAllocatedTimeByIdAsync,
    updateQuizNameStartDateDueDateByIdAsync,
    updateQuizNameStartDateAllocatedTimeByIdAsync,
    updateQuizNameDueDateAllocatedTimeByIdAsync,
    updateStartDateDueDateAllocatedTimeByIdAsync,
    deleteByIdAsync
}