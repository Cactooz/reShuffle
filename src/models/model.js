import { fetchPlayer, fetchPlaylists, playPlaylist, transferPlayback } from '../fetch';
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
	executingNext: false,
	executingPrevious: false,
	executingPlayPause: false,

	playing: undefined,
	progress: undefined,
	isPlaying: undefined,
	playChange: undefined,

	shuffle: parseInt(localStorage.getItem('shuffle')) || 0,

	queue: [],
	currentQueueTrack: 0,
	currentPlaylistId: undefined,

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

	setExecutingNext(state) {
		this.executingNext = state;
	},

	setExecutingPrevious(state) {
		this.executingPrevious = state;
	},

	setExecutingPlayPause(state) {
		this.executingPlayPause = state;
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
		if (player === undefined || player.item === null) {
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
			id: item.id,
			artists: item.artists,
			duration: item.duration_ms,
			name: item.name,
			url: item.external_urls.spotify,
			image: item.album.images[2]?.url,
		};
		if (this.playing?.id === this.queue[this.currentQueueTrack + 1]?.id)
			this.incrementCurrentQueueTrack();
	},

	setPlayback(item, position, paused) {
		this.progress = position;
		this.isPlaying = !paused;
		this.playing = item;
		if (this.playing?.id === this.queue[this.currentQueueTrack + 1]?.id)
			this.incrementCurrentQueueTrack();
	},

	setShuffle(id) {
		this.shuffle = id;
		localStorage.setItem('shuffle', id);
	},

	setQueue(queue) {
		this.queue = queue;
		this.currentQueueTrack = 0;
	},

	setCurrentPlaylistId(id) {
		this.currentPlaylistId = id;
	},

	async incrementCurrentQueueTrack() {
		if (this.currentQueueTrack !== this.queue.length - 1) this.currentQueueTrack++;
		else {
			playPlaylist(`spotify:playlist:${this.currentPlaylistId}`, this.queue.length, this);
			setTimeout(() => {
				this.executingNext = false;
			}, 500);
		}
	},

	decrementCurrentQueueTrack() {
		if (this.currentQueueTrack !== 0) this.currentQueueTrack--;
	},
};
