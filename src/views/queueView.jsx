import Track from '../components/Track';

export default function queueView(props) {
	return (
		<section>
			<h3>Now playing</h3>
			<Track song={props.queue?.shift()} />
			<h3>Coming next</h3>
			{props.queue?.map((song, i) => {
				return <Track key={i} song={song} />;
			})}
		</section>
	);
}
