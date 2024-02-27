import { authRedirect } from '../login';

export default function LoginButton() {
	return <button onClick={authRedirect}>Continue using Spotify</button>;
}
