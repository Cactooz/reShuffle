import { observer } from 'mobx-react-lite';

import PlayerView from '../views/playerView';
import PlaybackView from '../views/playbackView';

import { playPlaylist, playPause, playNext, playPrevious } from '../fetch';
import { useEffect, useState } from 'react';

export default observer(function playerPresenter(props) {
	let playbackFetch = undefined;
	const [playbackListener, setPlaybackListener] = useState(false);

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
		playbackFetch = setTimeout(getPlayback, 1000);
	}

	useEffect(() => {
		if (props.model.loggedIn && props.model.playerLoaded && !playbackListener) {
			getPlayback();

			props.model.player.addListener('player_state_changed', (playback) => {
				if (playback === null || playback?.playback_id === '') {
					if (playbackFetch === undefined) getPlayback();
				} else {
					clearTimeout(playbackFetch);
					playbackFetch = undefined;

					const {
						context,
						duration,
						position,
						paused,
						playback_id,
						track_window: { current_track: track },
					} = playback;

					const item = {
						artists: track.artists,
						duration,
						name: track.name,
						playlist: context.uri,
						url: `https://open.spotify.com/track/${track.id}`,
						image: track.album.images[1]?.url,
					};

					props.model.setPlayback(item, position, paused);
					props.model.setDevice(
						playback_id,
						import.meta.env.VITE_PLAYER_NAME,
						localStorage.getItem('volume'),
					);
				}
			});
			setPlaybackListener(true);
		}
	}, [props.model.loggedIn, props.model.playerLoaded]);

	if (props.model.loggedIn && !props.model.playlistsLoaded) props.model.setPlaylists();

	if (!props.model.loggedIn) return <p>Logging in...</p>;
	if (!props.model.playlistsLoaded) return <p>Loading playlists...</p>;
	if (!props.model.playing) return <p>Waiting for playback...</p>;

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
