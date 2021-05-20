const GATEWAY = "http://localhost:8004";

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
