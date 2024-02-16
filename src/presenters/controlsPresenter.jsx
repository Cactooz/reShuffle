import ShufflePresenter from './shufflePresenter';
import CurrentTrackPresenter from './currentTrackPresenter';
import PlaybackPresenter from './playbackPresenter';

import Spotify from '../../assets/images/spotify-logo-green.svg';

export default function controlsPresenter(props) {
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
