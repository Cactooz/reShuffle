import { observer } from 'mobx-react-lite';

import PlaybackView from '../views/playbackView';

import { playPause, playNext, playPrevious, playPlaylist } from '../fetch';

export default observer(function playbackPresenter({ model }) {
	async function setPlayPause() {
		model.setExecutingPlayPause(true);
		model.setIsPlaying(await playPause(model));
	}

	function setNext() {
		model.setExecutingNext(true);
		if (model.currentQueueTrack !== model.queue.length - 1) playNext(model);
		else playPlaylist(model.currentPlaylistId, model.queue.length, model);
	}

	async function setPrevious() {
		model.setExecutingPrevious(true);
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
