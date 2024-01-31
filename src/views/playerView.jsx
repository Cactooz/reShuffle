import LogoutButton from '../components/LogouotButton';
import ListScroller from '../components/ListScroller';

export default function playerView(props) {
	return (
		<>
			<ListScroller title='Long playlists' data={props.playlists[0]} play={props.play} />
			<ListScroller title='Short playlists' data={props.playlists[1]} play={props.play} />
			<LogoutButton logout={props.logout} />
		</>
	);
}
