import { useNavigate } from 'react-router-dom';

import ListScroller from '../components/ListScroller';
import SkipButton from '../components/SkipButton';

import '../style/playlist.scss';

import Logo from '/images/reShuffle-icon.svg';

export default function playerView(props) {
	const navigate = useNavigate();

	return (
		<section className='playlists'>
			<header>
				<button
					onClick={() => {
						navigate('/', { replace: true });
					}}
					title='Go to home'
				>
					<img src={Logo} alt='Blue reShuffle logo' />
				</button>
				<button
					onClick={() => {
						props.logout();
						navigate('/', { replace: true });
					}}
					title='Logout'
				>
					<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'>
						<path d='M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z' />
					</svg>
				</button>
			</header>
			<SkipButton to='short' text='Short Playlists' />
			<SkipButton to='controls' text='Controls' />
			<ListScroller
				title='Long playlists'
				data={props.playlists[0]}
				play={props.play}
				executing={props.executing}
				addMore={true}
				playlistButtonsDisabled={props.playlistButtonsDisabled}
				id='long'
			/>
			<SkipButton to='controls' text='Controls' />
			<ListScroller
				title='Short playlists'
				data={props.playlists[1]}
				play={props.play}
				executing={props.executing}
				addMore={true}
				playlistButtonsDisabled={props.playlistButtonsDisabled}
				id='short'
			/>
		</section>
	);
}
