export default function playbackView(props) {
	return (
		<section className='play-controls'>
			<button onClick={props.playPrevious}>Previous</button>
			<button onClick={props.playPause}>{props.isPlaying ? 'Pause' : 'Play'}</button>
			<button onClick={props.playNext}>Next</button>
		</section>
	);
}
