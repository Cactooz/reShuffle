import Play from '../../assets/icons/play.svg';
import Pause from '../../assets/icons/pause.svg';
import Forward from '../../assets/icons/forward.svg';
import Backward from '../../assets/icons/backward.svg';

export default function playbackView(props) {
	return (
		<section className='play-controls'>
			<button onClick={props.playPrevious} title='Play Previous Song'>
				<img src={Backward} height='40px' />
			</button>
			<button onClick={props.playPause} title={props.isPlaying ? 'Pause the Music' : 'Play Music'}>
				<img src={props.isPlaying ? Pause : Play} height='40px' />
			</button>
			<button onClick={props.playNext} title='Play Next Song'>
				<img src={Forward} height='40px' />
			</button>
		</section>
	);
}
