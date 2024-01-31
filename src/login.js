const redirectUri = 'http://localhost:5173/player';
const clientId = import.meta.env.VITE_CLIENT_ID;

export async function authRedirect() {
	const verifier = generateCodeVerifier(128);
	const challenge = await generateCodeChallenge(verifier);

	const scope =
		'user-read-private playlist-read-private user-read-currently-playing user-modify-playback-state user-read-playback-state';

	localStorage.setItem('verifier', verifier);

	const params = {
		client_id: clientId,
		response_type: 'code',
		redirect_uri: redirectUri,
		scope,
		code_challenge_method: 'S256',
		code_challenge: challenge,
	};

	const authUrl = new URL('https://accounts.spotify.com/authorize');
	authUrl.search = new URLSearchParams(params).toString();
	window.location.href = authUrl.toString();
}

function generateCodeVerifier(length) {
	let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.';
	const values = crypto.getRandomValues(new Uint8Array(length));
	return values.reduce((acc, x) => acc + possible[x % possible.length], '');
}

async function generateCodeChallenge(codeVerifier) {
	const data = new TextEncoder().encode(codeVerifier);
	const digest = await window.crypto.subtle.digest('SHA-256', data);
	return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=+$/, '');
}

export function getToken(model) {
	//Check if token already exists and skip login
	const expire = localStorage.getItem('tokenExpire');
	if (!model.loggedIn && expire) {
		const time = Math.floor(Date.now() / 1000);
		if (time < expire) {
			const token = localStorage.getItem('accessToken');
			if (token) updateLogin(expire - time);
		} else {
			//Refresh the token if it has expired
			const token = localStorage.getItem('refreshToken');
			if (token) refreshToken(token).then(() => updateLogin(token, 50 * 60));
		}
	}

	function updateLogin(time) {
		model.setLoggedIn(true);
		setTimeout(handleTokenRefresh, time * 1000);
	}

	//Refresh token every 50th minute
	function handleTokenRefresh() {
		const token = localStorage.getItem('refreshToken');
		if (token) refreshToken(token);

		setTimeout(handleTokenRefresh, 60 * 50 * 1000);
	}

	//Get access token
	const code = new URLSearchParams(window.location.search).get('code');
	if (code && !model.loggedIn) {
		getAccessToken(code).then(() => {
			window.history.replaceState({}, document.title, '/player');
			model.setLoggedIn(true);
			setTimeout(handleTokenRefresh, 60 * 50 * 1000);
		});
	}
}

async function getAccessToken(code) {
	const verifier = localStorage.getItem('verifier');

	const body = {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams({
			client_id: clientId,
			grant_type: 'authorization_code',
			code,
			redirect_uri: redirectUri,
			code_verifier: verifier,
		}),
	};

	const response = await fetch('https://accounts.spotify.com/api/token', body);
	const json = await response.json();

	setLocalStorage(json.access_token, json.refresh_token);
}

async function refreshToken(refreshToken) {
	const body = {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams({
			client_id: clientId,
			grant_type: 'refresh_token',
			refresh_token: refreshToken,
		}),
	};
	const response = await fetch('https://accounts.spotify.com/api/token', body);
	const json = await response.json();

	setLocalStorage(json.access_token, json.refresh_token);
}

function setLocalStorage(accessToken, refreshToken) {
	localStorage.setItem('accessToken', accessToken);
	localStorage.setItem('refreshToken', refreshToken);
	localStorage.setItem('tokenExpire', Math.floor(Date.now() / 1000) + 3000);
}
