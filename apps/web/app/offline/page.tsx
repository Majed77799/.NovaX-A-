export default function Offline() {
	return (
		<div className="container" style={{ paddingTop: 24 }}>
			<h2>Offline</h2>
			<p>The app is offline. Cached messages, templates, and settings are available.</p>
			<p><a href="/" aria-label="Retry loading">Retry</a></p>
		</div>
	);
}