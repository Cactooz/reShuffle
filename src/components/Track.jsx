export default function track({ playing }) {
	if (!playing) return;

	return (
		<section>
			<a href={playing.url} target='_blank'>
				<img src={playing.image} />
				<p>{playing.name}</p>
				<p>{playing.artists.map((artist) => artist.name).join(', ')}</p>
			</a>
		</section>
	);
}
