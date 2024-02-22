import { observer } from 'mobx-react-lite';

import QueueView from '../views/queueView';

export default observer(function QueuePresenter({ model }) {
	const queue = [...model.queue];
	queue?.splice(0, model.currentQueueTrack);

	return <QueueView queue={queue} song={model.playing} />;
});
