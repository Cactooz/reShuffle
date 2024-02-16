import { observer } from 'mobx-react-lite';

import ShuffleView from '../views/shuffleView';
import { useEffect, useState } from 'react';

export default observer(function shufflePresenter({ model }) {
	const [shuffleButtons, setShuffleButtons] = useState([]);

	function setShuffle(id) {
		model.setShuffle(id);
	}

	useEffect(() => {
		const shuffledArray = [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }].sort(
			() => Math.random() - 0.5,
		);
		setShuffleButtons(shuffledArray);
	}, []);

	return <ShuffleView array={shuffleButtons} setShuffle={setShuffle} shuffle={model.shuffle} />;
});
