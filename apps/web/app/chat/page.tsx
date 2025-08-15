"use client"
import { useState, useMemo } from 'react'
import { useChat } from '@novax/ai/react'
import { TEMPLATES, fillTemplate } from '@novax/ai/templates'

function useVoiceInput() {
	const [listening, setListening] = useState(false)
	const [result, setResult] = useState('')
	const recognition = useMemo(() => {
		if (typeof window === 'undefined') return null as any
		const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
		if (!SpeechRecognition) return null
		const r = new SpeechRecognition()
		r.continuous = false
		r.interimResults = false
		r.lang = 'en-US'
		return r
	}, [])
	const start = () => {
		if (!recognition) return
		setListening(true)
		recognition.onresult = (e: any) => {
			const text = e.results[0][0].transcript
			setResult(text)
			setListening(false)
		}
		recognition.onerror = () => setListening(false)
		recognition.onend = () => setListening(false)
		recognition.start()
	}
	return { listening, result, start, setResult }
}

export default function ChatPage() {
	const [input, setInput] = useState('')
	const { messages, isLoading, sendMessage } = useChat()
	const { listening, result, start, setResult } = useVoiceInput()
	return (
		<main style={{ padding: 24 }}>
			<h2>Chat</h2>
			<div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
				<select onChange={(e) => setInput(e.target.value)} defaultValue="">
					<option value="" disabled>
						Templates
					</option>
					{TEMPLATES.map((t) => (
						<option key={t.id} value={fillTemplate(t.template, { topic: 'NovaX', text: '...' })}>
							{t.title}
						</option>
					))}
				</select>
				<button onClick={start} disabled={listening}>
					{listening ? 'Listening…' : 'Speak'}
				</button>
			</div>
			{result && (
				<div style={{ marginBottom: 8 }}>
					<small>Voice: {result}</small>
					<button onClick={() => setInput(result)}>Use</button>
				</div>
			)}
			<div style={{ display: 'grid', gap: 8 }}>
				{messages.map((m, i) => (
					<div key={i}>
						<strong>{m.role}:</strong> {m.content}
					</div>
				))}
			</div>
			<form
				onSubmit={(e) => {
					e.preventDefault()
					sendMessage(input)
					setInput('')
				}}
				style={{ marginTop: 12 }}
			>
				<input value={input} onChange={(e) => setInput(e.target.value)} />
				<button disabled={isLoading}>Send</button>
			</form>
		</main>
	)
}