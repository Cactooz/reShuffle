import { observer } from 'mobx-react-lite';

import ShuffleView from '../views/shuffleView';

export default observer(function shufflePresenter({ model }) {
	function setShuffle(id) {
		model.setShuffle(id);
	}

	return <ShuffleView setShuffle={setShuffle} shuffle={model.shuffle} />;
});
