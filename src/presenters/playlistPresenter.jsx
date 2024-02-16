import { observer } from 'mobx-react-lite';

import PlaylistView from '../views/playlistsView';

import { playPlaylist } from '../fetch';

export default observer(function playlistPresenter({ model }) {
	function play(playlist, total) {
		playPlaylist(playlist, total).then(model.getPlayback());
	}

	if (model.loggedIn && !model.playlistsLoaded) model.setPlaylists();

	if (!model.loggedIn) return <p>Logging in...</p>;
	if (!model.playlistsLoaded) return <p>Loading playlists...</p>;

	return <PlaylistView loading={model.loading} playlists={model.playlists} play={play} />;
});
