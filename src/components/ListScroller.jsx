import Spotify from '../../assets/images/spotify-icon-green.svg';
import ReShuffle from '../../assets/images/reShuffle.svg';

import '../style/listScroller.scss';

export default function ListScroller(props) {
	return (
		<section>
			<h1>{props.title}</h1>
			<ul className='list-scroller'>
				{props.data.map((item) => {
					return (
						<li key={item.id}>
							<img src={item.image} height='200px' />
							<h2 title={item.name}>{item.name}</h2>
							<div className='playlist-buttons'>
								<a href={item.url} target='_blank' title={`Open ${item.name} on Spotify`}>
									<img src={Spotify} alt='Green Spotify logo' />
								</a>
								<button
									onClick={() => {
										props.play(item.uri, item.tracks.total);
									}}
									title={`Play ${item.name}`}
									disabled={props.executing}
								>
									<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'>
										<path d='M0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM188.3 147.1c-7.6 4.2-12.3 12.3-12.3 20.9V344c0 8.7 4.7 16.7 12.3 20.9s16.8 4.1 24.3-.5l144-88c7.1-4.4 11.5-12.1 11.5-20.5s-4.4-16.1-11.5-20.5l-144-88c-7.4-4.5-16.7-4.7-24.3-.5z' />
									</svg>
								</button>
							</div>
						</li>
					);
				})}
				{props.addMore && (
					<li className='add-more'>
						<img src={ReShuffle} alt='reShuffle Blue logo' />
						<p>Create or Save Playlists on Spotify to find them here!</p>
					</li>
				)}
			</ul>
		</section>
	);
}
