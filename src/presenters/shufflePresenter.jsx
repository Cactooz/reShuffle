import { observer } from 'mobx-react-lite';

import ShuffleView from '../views/shuffleView';
import { useEffect, useState } from 'react';

export default observer(function shufflePresenter({ model }) {
	const [shuffleButtons, setShuffleButtons] = useState([]);

	function setShuffle(id) {
		model.setShuffle(id);
	}

	useEffect(() => {
		const shuffledArray = [
			{ id: 0, color: '#ee2222' },
			{ id: 1, color: '#eeee22' },
			{ id: 2, color: '#22ee22' },
			{ id: 3, color: '#2222ee' },
			{ id: 4, color: '#ee22ee' },
		].sort(() => Math.random() - 0.5);
		setShuffleButtons(shuffledArray);
	}, []);

	return <ShuffleView array={shuffleButtons} setShuffle={setShuffle} shuffle={model.shuffle} />;
});
