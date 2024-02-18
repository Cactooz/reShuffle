import { observer } from 'mobx-react-lite';

import ShuffleView from '../views/shuffleView';

export default observer(function shufflePresenter({ model }) {
	function setShuffle(id) {
		model.setShuffle(id);
	}

	const shuffleButtons = [
		{ class: 'first' },
		{ class: 'second' },
		{ class: 'third' },
		{ class: 'fourth' },
		{ class: 'fifth' },
	];

	return <ShuffleView array={shuffleButtons} setShuffle={setShuffle} shuffle={model.shuffle} />;
});
