export default function track({ song }) {
	if (!song) return <p>No song playing</p>;

	return (
		<section>
			<a href={song.url} target='_blank'>
				<img src={song.image} />
				<p>{song.name}</p>
				<p>{song.artists.map((artist) => artist.name).join(', ')}</p>
			</a>
		</section>
	);
}
