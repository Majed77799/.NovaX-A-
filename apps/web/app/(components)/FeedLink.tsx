import Link from 'next/link';

export default function FeedLink() {
	return (
		<div style={{ position: 'fixed', right: 12, bottom: 12 }}>
			<Link href="/feed" className="btn">Open Feed</Link>
		</div>
	);
}