import Track from '../components/Track';

import '../style/queue.scss';

export default function queueView(props) {
	return (
		<section className='queue'>
			<h3>Now playing</h3>
			<section className='track'>
				<Track song={props.queue?.shift()} />
			</section>
			<h3>Coming next</h3>
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
