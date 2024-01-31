import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { getToken } from './login';
import HomePresenter from './presenters/homePresenter';
import PlayerPresenter from './presenters/playerPresenter';

export default observer(function App(props) {
	const router = createBrowserRouter([
		{
			path: '/',
			element: <HomePresenter {...props} />,
		},
		{
			path: '/player',
			element: <PlayerPresenter {...props} />,
		},
	]);

	getToken(props.model);

	return <RouterProvider router={router} />;
});
