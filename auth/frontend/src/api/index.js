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

  console.log(response);

  if (response.status !== 201) {
    const errText = response.data;
    throw new Error(errText);
  } else {
    const token = response.data;
    return token;
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
}

/**
 * Fetch the available quizzes.
 *
 * @param {string} token Authorization token received on login.
 */
export async function getQuizzes(token) {
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
}

/**
 * Fetch quiz by id.
 *
 * @param {string} token Authorization token received on login.
 * @param {integer} id The id of the quiz to fetch.
 */
export async function getQuizById(token, id) {
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
}

/**
 * Attempt to create a new quiz
 *
 * @param {string} token Authorization token received on login.
 * @param {string} name The name of the quiz.
 * @param {timestamp} start_date The date at which the quiz becomes available.
 * @param {timestamp} due_date The date at which the quiz becomes unavailable.
 * @param {integer} allocated_time The available amount of time to solve.
 * @param {question} questions A list of questions.
 */
export async function postQuiz(
  token,
  name,
  start_date,
  due_date,
  allocated_time,
  questions
) {
  const response = await axios.post(
    `${GATEWAY}/auth/register`,
    JSON.stringify({
      name: name,
      start_date: start_date,
      due_date: due_date,
      allocated_time: allocated_time,
      questions: questions,
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
}
