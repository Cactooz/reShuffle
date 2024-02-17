import ShufflePresenter from './shufflePresenter';
import CurrentTrackPresenter from './currentTrackPresenter';
import PlaybackPresenter from './playbackPresenter';

import Spotify from '../../assets/images/spotify-logo-green.svg';

import { useEffect } from 'react';

export default function controlsPresenter(props) {
	useEffect(() => {
		if (props.model.loggedIn) {
			var spotifyPlayerScript = document.createElement('script');
			spotifyPlayerScript.src = 'https://sdk.scdn.co/spotify-player.js';
			document.head.appendChild(spotifyPlayerScript);
		}
	}, [props.model.loggedIn]);

	return (
		<section>
			<ShufflePresenter {...props} />
			<CurrentTrackPresenter {...props} />
			<PlaybackPresenter {...props} />
			<a href='https://spotify.com/' target='_blank'>
				MADE USING <img src={Spotify} alt='Green Spotify logo' />
			</a>
		</section>
	);
}
