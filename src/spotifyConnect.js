import { transferPlayback } from './fetch';

export default function connectPlayer(model) {
	window.onSpotifyWebPlaybackSDKReady = () => {
		let setVolume = localStorage.getItem('volume');
		if (setVolume === null || typeof setVolume !== 'number') {
			setVolume = 0.5;
			localStorage.setItem('volume', setVolume);
		}

		const player = new Spotify.Player({
			name: import.meta.env.VITE_PLAYER_NAME,
			getOAuthToken: (cb) => {
				cb(localStorage.getItem('accessToken'));
			},
			volume: setVolume,
		});

		player.addListener('ready', ({ device_id }) => {
			console.log('Spotify Connect Ready');

			model.getPlayback().then(() => {
				if (model.device.active === false || model.device.name === import.meta.env.VITE_PLAYER_NAME)
					transferPlayback(device_id);
			});

			model.setDevice(device_id, import.meta.env.VITE_PLAYER_NAME, setVolume);
			model.setPlayer(player, device_id);
		});

		player.addListener('not_ready', () => {
			console.log('Spotify Connect Offline');
		});

		player.addListener('initialization_error', ({ message }) => {
			console.error('Spotify Connect Initialization Error:', message);
		});

		player.addListener('authentication_error', ({ message }) => {
			console.error('Spotify Connect Authentication Error:', message);
		});

		player.addListener('account_error', ({ message }) => {
			console.error('Spotify Connect Account Error:', message);
			if (message === 'This functionality is restricted to premium users only') {
				model.logout();
				model.setLoginState('free');
			}
		});

		player.connect().then((success) => {
			if (success) {
				console.log('Spotify Connect Connected');
			}
		});

		player.activateElement();
	};
}
