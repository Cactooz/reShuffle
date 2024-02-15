import Spotify from '../../assets/images/spotify-logo-green.svg';

export default function playbackView(props) {
	return (
		<>
			<section>
				{[{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }].map((item) => {
					return (
						<button
							disabled={props.shuffle === item.id}
							key={item.id}
							onClick={() => props.setShuffle(item.id)}
						>
							{item.id}
						</button>
					);
				})}
			</section>
			<section>
				<section>
					<a href={props.playing.url} target='_blank'>
						<img src={props.playing.image} />
						<p>{props.playing.name}</p>
						<p>{props.playing.artists.map((artist) => artist.name).join(', ')}</p>
					</a>
				</section>
				<section>
					<button onClick={props.playPrevious}>Previous</button>
					<button onClick={props.playPause}>{props.isPlaying ? 'Pause' : 'Play'}</button>
					<button onClick={props.playNext}>Next</button>
				</section>
				<a href='https://spotify.com/' target='_blank'>
					MADE USING <img src={Spotify} alt='Green Spotify logo' />
				</a>
			</section>
		</>
	);
}
