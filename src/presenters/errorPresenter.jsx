import { useEffect } from 'react';

import ErrorView from '../views/errorView';

export default function errorPresenter() {
	useEffect(() => {
		const metaRobots = document.createElement('meta');
		metaRobots.name = 'robots';
		metaRobots.content = 'noindex';
		document.head.appendChild(metaRobots);
		document.title = 'Error 404';

		return () => {
			metaRobots.remove();
			document.title = 'reShuffle';
		};
	}, []);

	return <ErrorView />;
}
