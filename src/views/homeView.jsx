import { useNavigate } from 'react-router-dom';

import { authRedirect } from '../login';
import LogoutButton from '../components/LogouotButton';

import '../style/home.scss';

export default function homeView(props) {
	const navigate = useNavigate();

	return (
		<main className='home'>
			<section className='hero'>
				<div>
					<h1>reShuffle</h1>
					<h2>Redefine Your Music Experience</h2>
					<hr />
				</div>
				<div>
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
				</div>
			</section>
			<div className='diagonal'></div>
			<section className='about'>
				<div>
					<h2>About</h2>
					<p>
						reShuffle is a project dedicated to refining music shuffle algorithms to enhance the
						user experience.
					</p>
				</div>
				<div>
					<h2>How it works</h2>
					<p>
						Upon connecting to your Spotify account, you'll gain access to your personal Spotify
						playlists.
					</p>
					<p>
						From there, you can play them and select from a choice of five distinct shuffle
						algorithms.
					</p>
					<p>Use Spotify Connect to transfer the playback and controls to another device.</p>
				</div>
			</section>
			<section className='algorithms'>
				<div>
					<h2>Five Shuffle Algorithms</h2>
					<p>Discover the perfect shuffle algorithm for your playlists, whether long or short.</p>
					<p>Experiment with different options to find your best fit.</p>
				</div>
			</section>
			<section className='privacy'>
				<h2>Privacy Policy</h2>
				<p>
					The data obtained from your Spotify profile remains exclusively on your device and is
					never stored on any external server.
				</p>
				<p>When you log out, all your Spotify data is removed from the device.</p>
				<p>
					All the code used for this application is open source and can be found on{' '}
					<a href='https://github.com/Cactooz/reShuffle'>Github</a>, ensuring the transparency for
					all users.
				</p>
			</section>
			<footer>
				<p>© reShuffe 2024</p>
				<p>
					Spotify trademark and service by <a href='https://www.spotify.com/'>Spotify AB</a>.
				</p>
			</footer>
		</main>
	);
}
