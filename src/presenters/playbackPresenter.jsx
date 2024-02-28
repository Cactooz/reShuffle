import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';

import PlaybackView from '../views/playbackView';

import { playPlaylist } from '../fetch';

export default observer(function playbackPresenter({ model }) {
	async function setPlayPause() {
		model.setExecutingPlayPause(true);
		model.player.togglePlay().then(() => {
			setTimeout(() => model.setExecutingPlayPause(false), 500);
		});
	}

	useEffect(() => {
		navigator.mediaSession.setActionHandler('previoustrack', () => setPrevious());
		navigator.mediaSession.setActionHandler('nexttrack', () => setNext());
	}, []);

	function setNext() {
		model.setExecutingNext(true);
		if (model.currentQueueTrack !== model.queue.length - 1)
			model.player.nextTrack().then(() => {
				setTimeout(() => model.setExecutingNext(false), 500);
			});
		else playPlaylist(model.currentPlaylistId, model.queue.length, model);
	}

	async function setPrevious() {
		model.setExecutingPrevious(true);
		if (model.currentQueueTrack !== 0) {
			model.player.previousTrack().then(() => {
				model.decrementCurrentQueueTrack();
				setTimeout(() => model.setExecutingPrevious(false), 500);
			});
		}
	}

	return (
		<PlaybackView
			loggedIn={model.loggedIn}
			playing={model.playing}
			isPlaying={model.isPlaying}
			playPrevious={setPrevious}
			playPause={setPlayPause}
			playNext={setNext}
			executingNext={model.executingNext}
			executingPrevious={model.executingPrevious}
			executingPlayPause={model.executingPlayPause}
			firstSong={model.currentQueueTrack === 0}
		/>
	);
});
