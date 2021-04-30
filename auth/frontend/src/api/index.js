const BASE_API_URL = 'http://localhost:8002'

export async function login(username, password) {
	try {
		const response = await fetch(`${BASE_API_URL}/auth/login`, {
			method: 'POST',
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				username: username,
				password: password,
			})
		})

		if (response.status !== 201) {
			const errText = await response.text();
			throw new Error(errText)
		} else {
			const token = await response.text();
			return token;
		}
	} catch (e) {
		throw e
	}
}

export async function register(username, password) {
	try {
		const response = await fetch(`${BASE_API_URL}/auth/register`, {
			method: 'POST',
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				username: username,
				password: password,
			})
		})

		if (response.status !== 201) {
			const errText = await response.text();
			throw new Error(errText)
		} else {
			const token = await response.text();
			return token;
		}
	} catch (e) {
		throw e
	}
}
