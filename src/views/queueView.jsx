import Track from '../components/Track';

import '../style/queue.scss';

export default function queueView(props) {
	return (
		<section className='queue'>
			<h1>Music Queue</h1>
			<h2>Now playing</h2>
			<section className='track'>
				<Track song={props.queue?.shift()} />
			</section>
			<h2>Coming next</h2>
			<ol>
				{props.queue?.map((song, i) => {
					return (
						<li key={i} className='track'>
							<Track song={song} />
						</li>
					);
				})}
			</ol>
		</section>
	);
}
