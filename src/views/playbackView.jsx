import '../style/playback.scss';

export default function playbackView(props) {
	return (
		<section className='playback'>
			<button
				onClick={props.playPrevious}
				title='Play Previous Song'
				disabled={!props.loggedIn || props.executingPrevious || props.firstSong}
			>
				<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 512'>
					<path d='M267.5 440.6c9.5 7.9 22.8 9.7 34.1 4.4s18.4-16.6 18.4-29V96c0-12.4-7.2-23.7-18.4-29s-24.5-3.6-34.1 4.4l-192 160L64 241V96c0-17.7-14.3-32-32-32S0 78.3 0 96V416c0 17.7 14.3 32 32 32s32-14.3 32-32V271l11.5 9.6 192 160z' />
				</svg>
			</button>
			<button
				onClick={props.playPause}
				title={props.isPlaying ? 'Pause the Music' : 'Play Music'}
				disabled={!props.loggedIn || props.executingPlayPause}
			>
				{props.isPlaying ? (
					<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'>
						<path d='M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM224 192V320c0 17.7-14.3 32-32 32s-32-14.3-32-32V192c0-17.7 14.3-32 32-32s32 14.3 32 32zm128 0V320c0 17.7-14.3 32-32 32s-32-14.3-32-32V192c0-17.7 14.3-32 32-32s32 14.3 32 32z' />
					</svg>
				) : (
					<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'>
						<path d='M0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM188.3 147.1c-7.6 4.2-12.3 12.3-12.3 20.9V344c0 8.7 4.7 16.7 12.3 20.9s16.8 4.1 24.3-.5l144-88c7.1-4.4 11.5-12.1 11.5-20.5s-4.4-16.1-11.5-20.5l-144-88c-7.4-4.5-16.7-4.7-24.3-.5z' />
					</svg>
				)}
			</button>
			<button
				onClick={props.playNext}
				title='Play Next Song'
				disabled={!props.loggedIn || props.executingNext}
			>
				<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 512'>
					<path d='M52.5 440.6c-9.5 7.9-22.8 9.7-34.1 4.4S0 428.4 0 416V96C0 83.6 7.2 72.3 18.4 67s24.5-3.6 34.1 4.4l192 160L256 241V96c0-17.7 14.3-32 32-32s32 14.3 32 32V416c0 17.7-14.3 32-32 32s-32-14.3-32-32V271l-11.5 9.6-192 160z' />
				</svg>
			</button>
		</section>
	);
}
