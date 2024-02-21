import { observer } from 'mobx-react-lite';

import PlaybackView from '../views/playbackView';

import { playPause, playNext, playPrevious } from '../fetch';

export default observer(function playbackPresenter({ model }) {
	async function setPlayPause() {
		model.setIsPlaying(await playPause());
	}

	function setNext() {
		model.incrementCurrentQueueTrack();
		playNext();
	}

	async function setPrevious() {
		model.decrementCurrentQueueTrack();
		playPrevious();
	}

	return (
		<PlaybackView
			playing={model.playing}
			isPlaying={model.isPlaying}
			playPrevious={setPrevious}
			playPause={setPlayPause}
			playNext={setNext}
		/>
	);
});
