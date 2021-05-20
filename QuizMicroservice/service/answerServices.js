const {
    sendRequest
} = require('../http-client');

const addAnswer = async (question_id, answer, is_correct, points) => {
    console.info(`Sending request to IO to add answer ${answer} for question_id ${question_id}...`);

    const options = {
        url: `http://${process.env.IO_SERVICE_API_ROUTE}/answers`,
        method: 'POST',
        data: {
            question_id,
            answer,
            is_correct,
            points
        }
    }

    return await sendRequest(options);
}

const updateAnswer = async (id, payload) => {
    console.info(`Sending request to IO to update the answer with id ${id}...`);

    const options = {
        url: `http://${process.env.IO_SERVICE_API_ROUTE}/answers/${id}`,
        method: 'PUT',
        data: payload
    }

    return await sendRequest(options);
}

const deleteAnswer = async (id) => {
    console.info(`Sending request to IO to delete the answer with id ${id}...`);

    const options = {
        url: `http://${process.env.IO_SERVICE_API_ROUTE}/answers/${id}`,
        method: 'DELETE'
    }

    return await sendRequest(options);
};

module.exports = {
    addAnswer,
    updateAnswer,
    deleteAnswer
}