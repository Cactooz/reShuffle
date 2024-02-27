import { observer } from 'mobx-react-lite';

import PlaylistView from '../views/playlistsView';
import Loading from '../components/Loading';

import { playPlaylist } from '../fetch';

export default observer(function playlistPresenter({ model }) {
	function play(playlist, total) {
		model.setExecutingPlay(true);
		playPlaylist(playlist, total, model);
	}

	if (model.loggedIn && !model.playlistsLoaded) model.setPlaylists();

	if (!model.loggedIn) return <Loading text='Logging in...' />;
	if (!model.playlistsLoaded) return <Loading text='Loading playlists...' />;

	return <PlaylistView playlists={model.playlists} play={play} executing={model.executingPlay} />;
});
