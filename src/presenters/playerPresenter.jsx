import { observer } from 'mobx-react-lite';

import PlayerView from '../views/playerView';

export default observer(function playerPresenter(props) {
	function logout() {
		props.model.logout();
	}

	function play(playlist) {
		console.log(playlist);
	}

	if (props.model.loggedIn && !props.model.playlistsLoaded) props.model.setPlaylists();

	if (!props.model.loggedIn) return <p>Logging in...</p>;
	if (!props.model.playlistsLoaded) return <p>Loading playlists...</p>;

	return (
		<PlayerView
			logout={logout}
			loading={props.model.loading}
			playlists={props.model.playlists}
			play={play}
		/>
	);
});