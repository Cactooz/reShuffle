export default function shuffleView(props) {
	return (
		<section>
			{props.array.map((item) => {
				return (
					<button
						disabled={props.shuffle === item.id}
						key={item.id}
						onClick={() => props.setShuffle(item.id)}
					>
						{item.id}
					</button>
				);
			})}
		</section>
	);
}
