import { useNavigate } from 'react-router-dom';

import LogoutButton from '../components/LogoutButton';
import LoginButton from '../components/LoginButton';

import '../style/home.scss';

export default function homeView(props) {
	const navigate = useNavigate();

	return (
		<main className='home'>
			<section className='hero'>
				<div>
					<h1>reShuffle</h1>
					<h2>Redefine Your Music Experience</h2>
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
						<LoginButton />
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
			<section className='faq'>
				<h2>FAQ</h2>
				<details>
					<summary>Can I queue tracks?</summary>
					<p>
						Yes. You can queue tracks in the normal Spotify client and they will play as normal.
						However, they do not show up in the reShuffle queue.
					</p>
				</details>
				<details>
					<summary>Can I play shuffle music on other devices?</summary>
					<p>
						Yes! reShuffle works with Spotify connect so you can continue on all your other
						connected devices.
					</p>
				</details>
				<details>
					<summary>Can I play my local tracks?</summary>
					<p>
						Sadly no. You can not play local tracks through reShuffle and nor will they not be added
						to the playback queue.
					</p>
				</details>
				<details>
					<summary>Do I need Spotify Premium?</summary>
					<p>Yes. You need to have an active Spotify Premium account in order to use reShuffle.</p>
				</details>
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
					<a href='https://github.com/Cactooz/reShuffle' target='_blank'>
						Github
					</a>
					, ensuring the transparency for all users.
				</p>
			</section>
			<footer>
				<p>© reShuffe 2024</p>
				<p>
					Spotify trademark and service by{' '}
					<a href='https://www.spotify.com/' target='_blank'>
						Spotify AB
					</a>
					.
				</p>
			</footer>
		</main>
	);
}
