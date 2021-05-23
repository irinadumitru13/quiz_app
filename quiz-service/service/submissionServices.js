const {
    sendRequest
} = require('../http-client');

const getSubmissionsByQuizName = async (quiz_name) => {
    console.info(`Sending request to IO to get all submissions for quiz ${quiz_name}...`);

    const options = {
        url: `http://${process.env.IO_SERVICE_API_ROUTE}/submissions/quiz/${quiz_name}`
    };

    return await sendRequest(options);
};

const getSubmissionsByUsername = async (user_name) => {
    console.info(`Sending request to IO to get all submissions for user ${user_name}...`);

    const options = {
        url: `http://${process.env.IO_SERVICE_API_ROUTE}/submissions/user/${user_name}`
    };

    return await sendRequest(options);
};

const addSubmission = async (quiz_name, username, score) => {
    console.info(`Sending request to IO to add submission for user ${username} and quiz ${quiz_name}...`);

    const options = {
        url: `http://${process.env.IO_SERVICE_API_ROUTE}/submissions`,
        method: 'POST',
        data: {
            quiz_name,
            username,
            score
        }
    }

    return await sendRequest(options);
}

const deleteSubmission = async (id) => {
    console.info(`Sending request to IO to delete the submission with id ${id}...`);

    const options = {
        url: `http://${process.env.IO_SERVICE_API_ROUTE}/submissions/${id}`,
        method: 'DELETE'
    }

    return await sendRequest(options);
};

module.exports = {
    getSubmissionsByQuizName,
    getSubmissionsByUsername,
    addSubmission,
    deleteSubmission
}