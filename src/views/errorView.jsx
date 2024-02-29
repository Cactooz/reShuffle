import { useNavigate } from 'react-router-dom';

import '../style/error.scss';

export default function errorView() {
	const navigate = useNavigate();
	return (
		<main className='error'>
			<img src='images/reShuffle-full-white.svg' />
			<h1>Error 404</h1>
			<h2>The page you were looking for could not be found :(</h2>
			<button
				onClick={() => {
					navigate('/', { replace: true });
				}}
			>
				Go to home
			</button>
		</main>
	);
}
