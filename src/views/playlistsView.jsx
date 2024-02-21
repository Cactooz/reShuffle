import ListScroller from '../components/ListScroller';
import '../style/playlist.scss';

export default function playerView(props) {
	return (
		<section className='playlists'>
			<ListScroller
				title='Long playlists'
				data={props.playlists[0]}
				play={props.play}
				executing={props.executing}
				addMore={true}
			/>
			<ListScroller
				title='Short playlists'
				data={props.playlists[1]}
				play={props.play}
				executing={props.executing}
				addMore={true}
			/>
		</section>
	);
}
