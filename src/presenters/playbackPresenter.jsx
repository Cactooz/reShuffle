import { observer } from 'mobx-react-lite';

import PlaybackView from '../views/playbackView';

import { playPause, playNext, playPrevious } from '../fetch';

export default observer(function playbackPresenter({ model }) {
	async function setPlayPause() {
		model.setExecutingPlayPause(true);
		model.setIsPlaying(await playPause(model));
	}

	function setNext() {
		model.setExecutingNext(true);
		if (model.currentQueueTrack !== model.queue.length - 1) playNext(model);
		model.incrementCurrentQueueTrack();
	}

	async function setPrevious() {
		model.setExecutingPrevious(true);
		model.decrementCurrentQueueTrack();
		playPrevious(model);
	}

	return (
		<PlaybackView
			playing={model.playing}
			isPlaying={model.isPlaying}
			playPrevious={setPrevious}
			playPause={setPlayPause}
			playNext={setNext}
			executingNext={model.executingNext}
			executingPrevious={model.executingPrevious}
			executingPlayPause={model.executingPlayPause}
		/>
	);
});
