export default function ListScroller(props) {
	return (
		<section>
			<h1>{props.title}</h1>
			<ul>
				{props.data.map((item) => {
					return (
						<li key={item.id}>
							<img src={item.image} height='200px' />
							<h2>{item.name}</h2>
							<button
								onClick={() => {
									props.play(item.id);
								}}
							>
								PLAY
							</button>
							<a href={item.url}>PLAY ON SPOTIFY</a>
						</li>
					);
				})}
			</ul>
		</section>
	);
}
