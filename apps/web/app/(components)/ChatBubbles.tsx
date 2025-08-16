"use client";
import { ChatMessage, detectLanguage, isRTL } from '@repo/shared';
import clsx from 'clsx';

export function ChatBubbles({ items }: { items: ChatMessage[] }) {
	return (
		<div className="chat" role="log" aria-live="polite" aria-relevant="additions">
			{items.map(m => {
				const lang = m.language ?? detectLanguage(m.content);
				const dir = isRTL(lang) ? 'rtl' : 'ltr';
				return (
					<div key={m.id} dir={dir} className={clsx('bubble', m.role === 'assistant' ? 'assistant' : 'user')} aria-label={`${m.role} message`}>{m.content}</div>
				);
			})}
		</div>
	);
}