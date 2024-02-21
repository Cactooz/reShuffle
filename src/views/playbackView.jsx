export default function playbackView(props) {
	return (
		<section className='play-controls'>
			<button onClick={props.playPrevious} disabled={props.executingPrevious}>
				Previous
			</button>
			<button onClick={props.playPause} disabled={props.executingPlayPause}>
				{props.isPlaying ? 'Pause' : 'Play'}
			</button>
			<button onClick={props.playNext} disabled={props.executingNext}>
				Next
			</button>
		</section>
	);
}
