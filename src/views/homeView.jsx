import { useNavigate } from 'react-router-dom';

import { authRedirect } from '../login';
import LogoutButton from '../components/LogouotButton';

export default function homeView(props) {
	const navigate = useNavigate();

	return (
		<section>
			<h1>reShuffle</h1>
			<h2>Redefine Your Music Experience</h2>

			{props.loggedIn ? (
				<>
					<button
						onClick={() => {
							navigate('/player');
						}}
					>
						Go to the player
					</button>
					<LogoutButton logout={props.logout} />
				</>
			) : (
				<button onClick={authRedirect}>Continue using Spotify</button>
			)}
		</section>
	);
}
