const LOGIN_API = "http://localhost:8004"

export async function login(username, password) {
	try {
		const response = await fetch(`${LOGIN_API}/auth/login`, {
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
		const response = await fetch(`${LOGIN_API}/auth/register`, {
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
