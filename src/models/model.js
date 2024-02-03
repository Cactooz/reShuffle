import { fetchPlayer, fetchPlaylists } from '../fetch';
import { queryClient } from '../main';

export default {
	loggedIn: false,

	playlists: [],
	playlistsLoaded: false,

	playing: undefined,
	progress: undefined,
	isPlaying: undefined,
	playChange: undefined,

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

		//Only update isPlaying if the client didn't just do it
		if (this.playChange === undefined || Date.now() / 1000 > this.playChange + 1)
			this.isPlaying = player.is_playing;

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
};
