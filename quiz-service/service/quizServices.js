const {
    sendRequest
} = require('../http-client');

const getQuizzes = async () => {
    console.info(`Sending request to IO for all quizzes...`);

    const options = {
        url: `http://${process.env.IO_SERVICE_API_ROUTE}/quiz`
    }

    const quizzes = await sendRequest(options);

    // open, in the future, ended
    for (let quiz of quizzes.response) {
        if (quiz.hasOwnProperty('start_date') && quiz.hasOwnProperty('due_date')) {
            if (Date.now() < new Date(Date.parse(quiz.start_date))) {
                quiz.status = 'in the future';
            } else if (Date.now() > new Date(Date.parse(quiz.due_date))) {
                quiz.status = 'ended';
            } else {
                quiz.status = 'open';
            }

            delete quiz['start_date'];
            delete quiz['due_date'];
        }

        console.log(quiz);
    }

    return quizzes;
};

const getQuizById = async (id) => {
    console.info(`Sending request to IO for quiz ${id}...`);

    const options = {
        url: `http://${process.env.IO_SERVICE_API_ROUTE}/quiz/${id}`
    }

    return await sendRequest(options);
};

const addQuiz = async (quiz_name, start_date, due_date, allocated_time, questions) => {
    console.info(`Sending request to IO to add quiz with name ${quiz_name} ...`);

    const options = {
        url: `http://${process.env.IO_SERVICE_API_ROUTE}/quiz`,
        method: 'POST',
        data: {
            quiz_name,
            start_date,
            due_date,
            allocated_time,
            questions
        }
    }

    return await sendRequest(options);
}

const updateQuiz = async (id, payload) => {
    console.info(`Sending request to IO to update the quiz with id ${id}...`);

    const options = {
        url: `http://${process.env.IO_SERVICE_API_ROUTE}/quiz/${id}`,
        method: 'PUT',
        data: payload
    }

    return await sendRequest(options);
}

const deleteQuiz = async (id) => {
    console.info(`Sending request to IO to delete the quiz with id ${id}...`);

    const options = {
        url: `http://${process.env.IO_SERVICE_API_ROUTE}/quiz/${id}`,
        method: 'DELETE'
    }

    return await sendRequest(options);
};

module.exports = {
    getQuizzes,
    getQuizById,
    addQuiz,
    updateQuiz,
    deleteQuiz
}