import { useNavigate } from 'react-router-dom';

import LoginButton from './LoginButton';

import '../style/warning.scss';

export default function Warning(props) {
	const navigate = useNavigate();

	return (
		<div className='warning'>
			<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 512'>
				<path d='M64 64c0-17.7-14.3-32-32-32S0 46.3 0 64V320c0 17.7 14.3 32 32 32s32-14.3 32-32V64zM32 480a40 40 0 1 0 0-80 40 40 0 1 0 0 80z' />
			</svg>
			<h1>{props.text}</h1>
			<div>
				<button
					onClick={() => {
						navigate('/', { replace: true });
					}}
				>
					Go to home
				</button>
				<LoginButton />
			</div>
		</div>
	);
}
