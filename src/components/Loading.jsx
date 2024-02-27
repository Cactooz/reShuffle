import '../style/loading.scss';

export default function Loading(props) {
	return (
		<div className='loading'>
			<div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</div>
			<h1>{props.text}</h1>
		</div>
	);
}
