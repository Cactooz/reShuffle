import { useNavigate } from 'react-router-dom';

export default function LogoutButton(props) {
	const navigate = useNavigate();
	return (
		<button
			onClick={() => {
				props.logout();
				navigate('/', { replace: true });
			}}
		>
			Logout
		</button>
	);
}
