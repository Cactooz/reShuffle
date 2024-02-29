import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';

import PlaybackView from '../views/playbackView';

import { playPause, playNext, playPrevious, playPlaylist } from '../fetch';

export default observer(function playbackPresenter({ model }) {
	useEffect(() => {
		navigator.mediaSession.setActionHandler('previoustrack', () => setPrevious());
		navigator.mediaSession.setActionHandler('nexttrack', () => setNext());
	}, []);

	async function setPlayPause() {
		model.setExecutingPlayPause(true);
		model.setIsPlaying(await playPause(model));
		setTimeout(() => {
			model.setExecutingPlayPause(false);
		}, 500);
	}

	function setNext() {
		model.setExecutingNext(true);
		if (model.currentQueueTrack !== model.queue.length - 1) playNext(model);
		else playPlaylist(model.currentPlaylistId, model.queue.length, model);
		setTimeout(() => {
			model.setExecutingNext(false);
		}, 500);
	}

	async function setPrevious() {
		model.setExecutingPrevious(true);
		playPrevious(model);
		setTimeout(() => {
			model.setExecutingPrevious(false);
		}, 500);
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
