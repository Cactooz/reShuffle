import { observer } from 'mobx-react-lite';

import PlayerView from '../views/playerView';
import PlaybackView from '../views/playbackView';

import { playPlaylist, playPause, playNext, playPrevious } from '../fetch';

export default observer(function playerPresenter(props) {
	function logout() {
		props.model.logout();
	}

	function play(playlist, total) {
		playPlaylist(playlist, total).then(props.model.getPlayback());
	}

	async function setPlayPause() {
		props.model.setIsPlaying(await playPause());
	}

	function setNext() {
		playNext();
	}

	async function setPrevious() {
		playPrevious();
	}

	function getPlayback() {
		props.model.getPlayback();

		setTimeout(getPlayback, 1000);
	}

	if (props.model.loggedIn && !props.model.playlistsLoaded) {
		props.model.setPlaylists();
		getPlayback();
	}

	if (!props.model.loggedIn) return <p>Logging in...</p>;
	if (!props.model.playlistsLoaded) return <p>Loading playlists...</p>;

	return (
		<>
			<PlayerView
				logout={logout}
				loading={props.model.loading}
				playlists={props.model.playlists}
				play={play}
			/>
			<PlaybackView
				playing={props.model.playing}
				isPlaying={props.model.isPlaying}
				playPrevious={setPrevious}
				playPause={setPlayPause}
				playNext={setNext}
			/>
		</>
	);
});
