import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';

import PlaybackView from '../views/playbackView';

import { playNext, playPause, playPlaylist, playPrevious } from '../fetch';

export default observer(function playbackPresenter({ model }) {
	useEffect(() => {
		navigator.mediaSession.setActionHandler('previoustrack', () => setPrevious());
		navigator.mediaSession.setActionHandler('nexttrack', () => setNext());
	}, []);

	async function setPlayPause() {
		model.setExecutingPlayPause(true);
		if (model.local) model.player.togglePlay().then();
		else playPause(model).then();
		setTimeout(() => model.setExecutingPlayPause(false), 500);
	}

	function setNext() {
		model.setExecutingNext(true);
		if (model.local) model.player.nextTrack().then();
		else playNext(model).then();
		setTimeout(() => model.setExecutingNext(false), 500);
	}

	async function setPrevious() {
		model.setExecutingPrevious(true);
		if (model.local) {
			model.player.previousTrack().then(() => {
				model.decrementCurrentQueueTrack();
			});
		} else {
			playPrevious(model).then(() => {
				model.decrementCurrentQueueTrack();
			});
		}
		setTimeout(() => model.setExecutingPrevious(false), 500);
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
