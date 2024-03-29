import ShufflePresenter from './shufflePresenter';
import CurrentTrackPresenter from './currentTrackPresenter';
import PlaybackPresenter from './playbackPresenter';

import Spotify from '../../assets/spotify/spotify-logo-green.svg';
import '../style/controls.scss';

import { useEffect } from 'react';

export default function controlsPresenter(props) {
	useEffect(() => {
		const spotifyPlayerScript = document.createElement('script');
		if (props.model.loggedIn) {
			spotifyPlayerScript.src = 'https://sdk.scdn.co/spotify-player.js';
			document.head.appendChild(spotifyPlayerScript);

			if (navigator.mediaSession.metadata === null)
				navigator.mediaSession.metadata = new MediaMetadata({
					title: 'reShuffle',
					artist: 'reShuffle.one',
				});
		}
		return () => {
			props.model.removePlayer();
			spotifyPlayerScript.remove();
		};
	}, [props.model.loggedIn]);

	return (
		<section className='controls' id='controls'>
			<ShufflePresenter {...props} />
			<div>
				<CurrentTrackPresenter {...props} />
				<PlaybackPresenter {...props} />
				<div className='spotify'>
					<a href='https://spotify.com/' target='_blank'>
						MADE USING <img src={Spotify} alt='Green Spotify logo' />
					</a>
				</div>
			</div>
		</section>
	);
}
