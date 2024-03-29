import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';

import Track from '../components/Track';

export default observer(function currentTrackPresenter({ model }) {
	let playbackFetch = undefined;
	const [playbackListener, setPlaybackListener] = useState(false);

	function getPlayback() {
		model.getPlayback();
		playbackFetch = setTimeout(getPlayback, 1000);
	}

	useEffect(() => {
		if (model.loggedIn && model.playerLoaded && !playbackListener) {
			getPlayback();

			model.player.addListener('player_state_changed', (playback) => {
				if (playback === null || playback?.playback_id === '') {
					if (playbackFetch === undefined) getPlayback();
					model.local = false;
				} else {
					clearTimeout(playbackFetch);
					playbackFetch = undefined;

					model.local = true;

					const {
						duration,
						position,
						paused,
						playback_id,
						track_window: { current_track: track },
					} = playback;

					const item = {
						id: track.id,
						artists: track.artists,
						duration,
						name: track.name,
						url: `https://open.spotify.com/track/${track.id}`,
						album: {
							images: track.album.images,
							name: track.album.name,
						},
					};

					model.setPlayback(item, position, paused);
					model.setDevice(
						playback_id,
						import.meta.env.VITE_PLAYER_NAME,
						localStorage.getItem('volume'),
					);
				}
			});
			setPlaybackListener(true);
		}

		return () => {
			clearTimeout(playbackFetch);
		};
	}, [model.loggedIn, model.playerLoaded]);

	return (
		<section className='track'>
			<Track song={model.playing} />
		</section>
	);
});
