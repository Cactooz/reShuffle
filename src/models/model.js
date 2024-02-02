import { fetchPlaylists } from '../fetch';
import { queryClient } from '../main';

export default {
	loggedIn: false,

	playlists: [],
	playlistsLoaded: false,

	playing: undefined,

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

	setPlaying(playlist) {
		this.playing = playlist;
	},
};
