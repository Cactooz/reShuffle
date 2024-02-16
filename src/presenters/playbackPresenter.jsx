import { observer } from 'mobx-react-lite';

import PlaybackView from '../views/playbackView';

import { playPause, playNext, playPrevious } from '../fetch';

export default observer(function playbackPresenter({ model }) {
	async function setPlayPause() {
		model.setIsPlaying(await playPause());
	}

	function setNext() {
		playNext();
	}

	async function setPrevious() {
		playPrevious();
	}

	if (!model.loggedIn) return <p>Logging in...</p>;
	if (!model.playing) return <p>Waiting for playback...</p>;

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
