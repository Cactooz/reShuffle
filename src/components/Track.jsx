import '../style/track.scss';
import reShuffle from '/images/reShuffle-icon.svg';

export default function track({ song }) {
	return (
		<>
			{song ? (
				<a href={song.url} target='_blank'>
					<img src={song.image} />
					<div>
						<p>{song.name}</p>
						<p>{song.artists?.map((artist) => artist.name).join(', ')}</p>
					</div>
				</a>
			) : (
				<div className='not-playing'>
					<img src={reShuffle} />
					<p>No song playing</p>
				</div>
			)}
		</>
	);
}
