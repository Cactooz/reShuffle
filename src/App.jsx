import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import PlayerView from './views/playerView';
import HomeView from './views/homeView';

export default function App() {
	const router = createBrowserRouter([
		{
			path: '/',
			element: <HomeView />,
		},
		{
			path: '/player',
			element: <PlayerView />,
		},
	]);

	return <RouterProvider router={router} />;
}
