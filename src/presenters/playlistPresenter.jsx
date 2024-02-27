import { observer } from 'mobx-react-lite';

import PlaylistView from '../views/playlistsView';
import Loading from '../components/Loading';
import Warning from '../components/Warning';

import { playPlaylist } from '../fetch';

export default observer(function playlistPresenter({ model }) {
	function play(playlist, total) {
		model.setExecutingPlay(true);
		playPlaylist(playlist, total, model);
	}

	function logout() {
		model.logout();
	}

	if (model.loggedIn && !model.playlistsLoaded) model.setPlaylists();

	if (model.loginState === 'free') return <Warning text='Continue using a Premium account' />;
	if (model.loginState === 'timeout') return <Warning text='Login to continue' />;
	if (!model.loggedIn) return <Loading text='Logging in...' />;
	if (!model.playlistsLoaded) return <Loading text='Loading playlists...' />;

	return (
		<PlaylistView
			logout={logout}
			playlists={model.playlists}
			play={play}
			executing={model.executingPlay}
		/>
	);
});
