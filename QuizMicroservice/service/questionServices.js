const {
    sendRequest
} = require('../http-client');

// const getQuizzes = async () => {
//     console.info(`Sending request to IO for all quizzes...`);
//
//     const options = {
//         url: `http://${process.env.IO_SERVICE_API_ROUTE}/quiz`
//     }
//
//     const quizzes = await sendRequest(options);
//
//     // open, in the future, ended
//     for (let quiz of quizzes.response) {
//         if (quiz.hasOwnProperty('start_date') && quiz.hasOwnProperty('due_date')) {
//             if (Date.now() < new Date(Date.parse(quiz.start_date))) {
//                 quiz.status = 'in the future';
//             } else if (Date.now() > new Date(Date.parse(quiz.due_date))) {
//                 quiz.status = 'ended';
//             } else {
//                 quiz.status = 'open';
//             }
//
//             delete quiz['start_date'];
//             delete quiz['due_date'];
//         }
//
//         console.log(quiz);
//     }
//
//     return quizzes;
// };
//
// const getQuizById = async (id) => {
//     console.info(`Sending request to IO for quiz ${id}...`);
//
//     const options = {
//         url: `http://${process.env.IO_SERVICE_API_ROUTE}/quiz/${id}`
//     }
//
//     return await sendRequest(options);
// };

const addQuestion = async (quiz_id, question, answers) => {
    console.info(`Sending request to IO to add question ${question} for quiz_id ${quiz_id}...`);

    const options = {
        url: `http://${process.env.IO_SERVICE_API_ROUTE}/questions`,
        method: 'POST',
        data: {
            quiz_id,
            question,
            answers
        }
    }

    return await sendRequest(options);
}

const updateQuestion = async (id, payload) => {
    console.info(`Sending request to IO to update the question with id ${id}...`);

    const options = {
        url: `http://${process.env.IO_SERVICE_API_ROUTE}/questions/${id}`,
        method: 'PUT',
        data: payload
    }

    return await sendRequest(options);
}

const deleteQuestion = async (id) => {
    console.info(`Sending request to IO to delete the question with id ${id}...`);

    const options = {
        url: `http://${process.env.IO_SERVICE_API_ROUTE}/questions/${id}`,
        method: 'DELETE'
    }

    return await sendRequest(options);
};

module.exports = {
    // getQuizzes,
    // getQuizById,
    addQuestion,
    updateQuestion,
    deleteQuestion
}