import Play from '../../assets/icons/play.svg';
import Spotify from '../../assets/images/spotify-icon-green.svg';

export default function ListScroller(props) {
	return (
		<section>
			<h1>{props.title}</h1>
			<ul>
				{props.data.map((item) => {
					return (
						<li key={item.id}>
							<img src={item.image} height='200px' />
							<h2 title={item.name}>{item.name}</h2>
							<button
								onClick={() => {
									props.play(item.uri, item.tracks.total);
								}}
								title={`Play ${item.name}`}
							>
								<img src={Play} height='30px' />
							</button>
							<a href={item.url} target='_blank' title='Open Spotify'>
								<img src={Spotify} height='30px' />
							</a>
						</li>
					);
				})}
			</ul>
		</section>
	);
}
