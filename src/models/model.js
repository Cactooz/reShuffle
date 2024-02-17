import { fetchPlayer, fetchPlaylists, transferPlayback } from '../fetch';
import { queryClient } from '../main';

export default {
	loggedIn: false,
	player: undefined,
	playerLoaded: false,
	playerId: undefined,
	device: undefined,

	playlists: [],
	playlistsLoaded: false,
	executingPlay: false,

	playing: undefined,
	progress: undefined,
	isPlaying: undefined,
	playChange: undefined,

	shuffle: 0,

	queue: [],
	currentQueueTrack: 0,

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

	setPlayer(player, id) {
		this.player = player;
		this.playerLoaded = true;
		this.playerId = id;
	},

	setDevice(id, name, volume) {
		this.device = {
			active: true,
			id,
			name,
			volume,
		};
	},

	setExecutingPlay(state) {
		this.executingPlay = state;
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
			transferPlayback(this.playerId);
			return this.setDevice(
				this.playerId,
				import.meta.env.VITE_PLAYER_NAME,
				localStorage.getItem('volume'),
			);
		}

		//Only update isPlaying if the client didn't just do it
		if (this.playChange === undefined || Date.now() / 1000 > this.playChange + 1)
			this.isPlaying = player.is_playing;

		const device = player.device;
		this.device = {
			active: device.is_active,
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

	setQueue(queue) {
		this.queue = queue;
		this.currentQueueTrack = 0;
	},

	incrementCurrentQueueTrack() {
		this.currentQueueTrack++;
	},
};
