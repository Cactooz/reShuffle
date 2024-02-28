import { fetchPlayer, fetchPlaylists, transferPlayback } from '../fetch';
import { queryClient } from '../main';

export default {
	loggedIn: false,
	loginState: false,
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

	setLoginState(state) {
		this.loginState = state;
	},

	logout() {
		localStorage.clear();
		queryClient.clear();
		this.clearModel();
	},

	clearModel() {
		this.loggedIn = false;
		this.loginState = false;
		this.player = undefined;
		this.playerLoaded = false;
		this.playerId = undefined;
		this.device = undefined;

		this.playlists = [];
		this.playlistsLoaded = false;
		this.executingPlay = false;
		this.executingNext = false;
		this.executingPrevious = false;
		this.executingPlayPause = false;

		this.playing = undefined;
		this.progress = undefined;
		this.isPlaying = undefined;
		this.playChange = undefined;

		this.shuffle = 0;

		this.queue = [];
		this.currentQueueTrack = 0;
		this.currentPlaylistId = undefined;
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
		const song = player.item;
		this.setMediaSession(song);
		this.playing = {
			id: song.id,
			artists: song.artists,
			duration: song.duration_ms,
			name: song.name,
			url: song.external_urls.spotify,
			image: song.album.images[2]?.url,
		};
		if (
			this.playing?.id === this.queue[this.currentQueueTrack + 1]?.id ||
			this.currentQueueTrack === this.queue.length - 1
		)
			this.incrementCurrentQueueTrack();
	},

	setPlayback(song, position, paused) {
		this.progress = position;
		this.isPlaying = !paused;
		this.setMediaSession(song);
		this.playing = {
			id: song.id,
			artists: song.artists,
			duration: song.duration,
			name: song.name,
			url: song.url,
			image: song.album.images[1]?.url,
		};
		if (
			this.playing?.id === this.queue[this.currentQueueTrack + 1]?.id ||
			this.currentQueueTrack === this.queue.length - 1
		)
			this.incrementCurrentQueueTrack();
	},

	setMediaSession(song) {
		navigator.mediaSession.metadata.title = song.name;
		navigator.mediaSession.metadata.artist = song.artists.map((artist) => artist.name).join(', ');
		navigator.mediaSession.metadata.album = song.album.name;
		navigator.mediaSession.metadata.artwork = song.album.images.map((image) => ({
			src: image.url,
			sizes: `${image.height}x${image.width}`,
			type: '',
		}));
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
	},

	decrementCurrentQueueTrack() {
		if (this.currentQueueTrack !== 0) this.currentQueueTrack--;
	},
};
