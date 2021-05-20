const GATEWAY = "http://localhost:8004";
// TODO(seritandrei): change to the proper location after the docker-compose merge.
const TMP_QUIZ_PATH = "http://localhost:3002/api";

/**
 * Attempts to login the user identified by username and password.
 *
 * @param {string} username The users username.
 * @param {string} password The usernames associated password.
 * @return {string} Session token associated with the user.
 * NOTE: on failure, the function throws an error.
 */
export async function login(username, password) {
  const response = await fetch(`${GATEWAY}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  });

  if (response.status !== 201) {
    const errText = await response.text();
    throw new Error(errText);
  } else {
    const token = await response.text();
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
  const response = await fetch(`${GATEWAY}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  });

  if (response.status !== 201) {
    const errText = await response.text();
    throw new Error(errText);
  }
}

/**
 * Fetch the available quizzes.
 */
export async function getQuizzes() {
  const response = await fetch(`${TMP_QUIZ_PATH}/quiz`, {
    method: "GET",
  });

  if (response.status !== 200) {
    throw new Error("failed to fetch quizzes");
  } else {
    const data = await response.json();
    return data.response;
  }
}

/**
 * Fetch quiz by id.
 *
 * @param {integer} id The id of the quiz to fetch.
 */
export async function getQuizById(id) {
  const response = await fetch(`${TMP_QUIZ_PATH}/quiz/${id}`, {
    method: "GET",
  });

  if (response.status !== 200) {
    throw new Error("failed to fetch quizzes");
  } else {
    const data = await response.json();
    return data.response;
  }
}

/**
 * Attempt to create a new quiz
 *
 * @param {string} name The name of the quiz.
 * @param {timestamp} start_date The date at which the quiz becomes available.
 * @param {timestamp} due_date The date at which the quiz becomes unavailable.
 * @param {integer} allocated_time The available amount of time to solve.
 * @param {question} questions A list of questions.
 */
export async function postQuiz(
  name,
  start_date,
  due_date,
  allocated_time,
  questions
) {
  const response = await fetch(`${TMP_QUIZ_PATH}/quiz`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: name,
      start_date: start_date,
      due_date: due_date,
      allocated_time: allocated_time,
      questions: questions,
    }),
  });

  if (response.status !== 200) {
    throw new Error("failed to create quiz");
  }
}
