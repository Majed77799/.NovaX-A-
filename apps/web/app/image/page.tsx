'use client'
import { useState } from 'react'
import { AIClient } from '@novax/ai'

export default function ImagePage() {
	const [prompt, setPrompt] = useState('A futuristic city')
	const [url, setUrl] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)
	return (
		<main style={{ padding: 24 }}>
			<h2>Image Generation</h2>
			<form
				onSubmit={async (e) => {
					e.preventDefault()
					setLoading(true)
					const client = new AIClient({})
					const u = await client.generateImage(prompt)
					setUrl(u)
					setLoading(false)
				}}
			>
				<input value={prompt} onChange={(e) => setPrompt(e.target.value)} />
				<button disabled={loading}>Generate</button>
			</form>
			{url && (
				<div style={{ marginTop: 12 }}>
					<img src={url} alt={prompt} width={256} height={256} />
				</div>
			)}
		</main>
	)
}