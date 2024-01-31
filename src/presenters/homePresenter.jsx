import { observer } from 'mobx-react-lite';

import HomeView from '../views/homeView';

export default observer(function homePresenter(props) {
	function logout() {
		props.model.logout();
	}

	return <HomeView loggedIn={props.model.loggedIn} logout={logout} />;
});
