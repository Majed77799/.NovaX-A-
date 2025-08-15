import { useCallback, useMemo, useState } from 'react'
import { AIClient, ChatMessage } from './index'

export function useChat() {
	const client = useMemo(() => new AIClient({}), [])
	const [messages, setMessages] = useState<ChatMessage[]>([])
	const [isLoading, setIsLoading] = useState(false)

	const sendMessage = useCallback(async (content: string) => {
		const nextMessages = [...messages, { role: 'user', content }]
		setMessages(nextMessages)
		setIsLoading(true)
		try {
			const reply = await client.send(nextMessages)
			setMessages((prev) => [...prev, reply])
		} finally {
			setIsLoading(false)
		}
	}, [client, messages])

	return { messages, isLoading, sendMessage }
}