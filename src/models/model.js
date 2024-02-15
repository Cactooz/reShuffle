import { fetchPlayer, fetchPlaylists } from '../fetch';
import { queryClient } from '../main';

export default {
	loggedIn: false,
	player: undefined,
	playerLoaded: false,
	device: undefined,

	playlists: [],
	playlistsLoaded: false,

	playing: undefined,
	progress: undefined,
	isPlaying: undefined,
	playChange: undefined,

	shuffle: 0,

	setLoggedIn(state) {
		this.loggedIn = state;
	},

	logout() {
		localStorage.clear();
		queryClient.clear();
		this.playlists = [];
		this.playlistsLoaded = false;
		this.loggedIn = false;
	},

	setPlayer(player) {
		this.player = player;
		this.playerLoaded = true;
	},

	setDevice(id, name, volume) {
		this.device = {
			id,
			name,
			volume,
		};
	},

	async setPlaylists() {
		await fetchPlaylists();
		this.playlists = queryClient.getQueryData('playlists');
		this.playlistsLoaded = true;
	},

	setIsPlaying(state) {
		this.isPlaying = state;
		this.playChange = Date.now() / 1000;
	},

	async getPlayback() {
		const player = await fetchPlayer();

		if (player === undefined) {
			this.playing = {
				artists: [],
				duration: undefined,
				name: undefined,
				playlist: undefined,
				url: undefined,
				image: undefined,
			};

			return;
		}

		//Only update isPlaying if the client didn't just do it
		if (this.playChange === undefined || Date.now() / 1000 > this.playChange + 1)
			this.isPlaying = player.is_playing;

		const device = player.device;
		this.device = {
			id: device.id,
			name: device.name,
			volume: device.volume_percent / 100,
		};

		this.progress = player.progress_ms;
		const item = player.item;
		this.playing = {
			artists: item.artists,
			duration: item.duration_ms,
			name: item.name,
			playlist: player.context.uri,
			url: item.external_urls.spotify,
			image: item.album.images[2]?.url,
		};
	},

	setPlayback(item, position, paused) {
		this.progress = position;
		this.isPlaying = !paused;
		this.playing = item;
	},

	setShuffle(id) {
		this.shuffle = id;
		localStorage.setItem('shuffle', id);
	},
};
