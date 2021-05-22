const GATEWAY = "http://localhost:8004";

const axios = require("axios").default;

/**
 * Attempts to login the user identified by username and password.
 *
 * @param {string} username The users username.
 * @param {string} password The usernames associated password.
 * @return {string} Session token associated with the user.
 * NOTE: on failure, the function throws an error.
 */
export async function login(username, password) {
  try {
    const response = await axios.post(
      `${GATEWAY}/auth/login`,
      JSON.stringify({
        username: username,
        password: password,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status !== 201) {
      const errText = response.data;
      throw new Error(errText);
    } else {
      const token = response.data;
      return token;
    }
  } catch (e) {
    throw new Error(e.response.data);
  }
}

/**
 * Attempts to register a new user with the provided credentials.
 *
 * @param {string} username The users username.
 * @param {string} password The usernames associated password.
 * NOTE: on failure, the function throws an error.
 */
export async function register(username, password) {
  try {
    const response = await axios.post(
      `${GATEWAY}/auth/register`,
      JSON.stringify({
        username: username,
        password: password,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status !== 201) {
      const errText = response.data;
      throw new Error(errText);
    }
  } catch (e) {
    throw new Error(e.response.data);
  }
}

/**
 * Fetch the available quizzes.
 *
 * @param {string} token Authorization token received on login.
 */
export async function getQuizzes(token) {
  try {
    const response = await axios.get(`${GATEWAY}/quiz/api/quiz`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status !== 200) {
      throw new Error("failed to fetch quizzes");
    } else {
      const data = response.data;
      return data.response;
    }
  } catch (e) {
    throw new Error("failed to fetch quizzes");
  }
}

/**
 * Fetch quiz by id.
 *
 * @param {string} token Authorization token received on login.
 * @param {integer} id The id of the quiz to fetch.
 */
export async function getQuizById(token, id) {
  try {
    const response = await axios.get(`${GATEWAY}/quiz/api/quiz/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status !== 200) {
      throw new Error("failed to fetch quizzes");
    } else {
      const data = response.data;
      return data.response;
    }
  } catch (e) {
    throw new Error("failed to fetch quizzes");
  }
}

/**
 * Attempt to create a new quiz
 *
 * @param {string} token Authorization token received on login.
 * @param {quiz} quiz The quiz structure.
 */
export async function postQuiz(token, quiz) {
  try {
    const response = await axios.post(
      `${GATEWAY}/quiz/api/quiz`,
      JSON.stringify({
        quiz_name: quiz.quiz_name,
        start_date: quiz.start_date.replace("T", " ").slice(0, -5),
        due_date: quiz.due_date.replace("T", " ").slice(0, -5),
        allocated_time: quiz.allocated_time,
        questions: quiz.questions,
      }),
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error("failed to create quiz");
    }
  } catch (e) {
    throw new Error("failed to create quiz");
  }
}

/**
 * Attempt to create a new question.
 *
 * @param {string} token Authorization token received on login.
 * @param {integer} quizId The id of the quiz to add the question to.
 * @param {string} question The question structure.
 */
export async function postQuestion(token, quizId, question) {
  try {
    const response = await axios.post(
      `${GATEWAY}/quiz/api/question`,
      JSON.stringify({
        quiz_id: quizId,
        question: question.question,
        answers: question.answers,
      }),
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error("failed to create question");
    } else {
      const data = response.data;
      return parseInt(data.response.question_id);
    }
  } catch (e) {
    throw new Error("failed to create question");
  }
}

/**
 * Attempt to create a new question.
 *
 * @param {string} token Authorization token received on login.
 * @param {integer} questionId The id of the question to add the answer to.
 * @param {answer} answer The question structure.
 */
export async function postAnswer(token, questionId, answer) {
  try {
    const response = await axios.post(
      `${GATEWAY}/quiz/api/answer`,
      JSON.stringify({
        question_id: questionId,
        answer: answer.answer,
        is_correct: answer.is_correct,
        points: answer.points,
      }),
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error("failed to create answer");
    } else {
      const data = response.data;
      return parseInt(data.response.answer_id);
    }
  } catch (e) {
    throw new Error("failed to create answer");
  }
}
