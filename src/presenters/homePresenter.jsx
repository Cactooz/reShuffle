import { observer } from 'mobx-react-lite';

import HomeView from '../views/homeView';

export default observer(function homePresenter({ model }) {
	function logout() {
		model.logout();
	}

	return <HomeView loggedIn={model.loggedIn} logout={logout} />;
});
