import { observer } from 'mobx-react-lite';

import PlaylistView from '../views/playlistsView';

import { playPlaylist } from '../fetch';

export default observer(function playlistPresenter({ model }) {
	function play(playlist, total) {
		model.setExecutingPlay(true);
		playPlaylist(playlist, total, model);
	}

	if (model.loggedIn && !model.playlistsLoaded) model.setPlaylists();

	if (!model.loggedIn) return <p>Logging in...</p>;
	if (!model.playlistsLoaded) return <p>Loading playlists...</p>;

	return <PlaylistView playlists={model.playlists} play={play} executing={model.executingPlay} />;
});
