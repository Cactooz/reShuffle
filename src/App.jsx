import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { getToken } from './login';
import HomePresenter from './presenters/homePresenter';
import PlaylistPresenter from './presenters/playlistPresenter';
import ControlsPresenter from './presenters/controlsPresenter';
import QueuePresenter from './presenters/queuePresenter';

export default observer(function App(props) {
	const router = createBrowserRouter([
		{
			path: '/',
			element: <HomePresenter {...props} />,
		},
		{
			path: '/player',
			element: (
				<main className='player'>
					<PlaylistPresenter {...props} />
					<ControlsPresenter {...props} />
					<QueuePresenter {...props} />
				</main>
			),
		},
	]);

	getToken(props.model);

	return <RouterProvider router={router} />;
});
