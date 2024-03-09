import '../style/skipButton.scss';

export default function SkipButton({ to, text }) {
	return <a href={`#${to}`} className='skip-button'>{`Skip to ${text}`}</a>;
}
