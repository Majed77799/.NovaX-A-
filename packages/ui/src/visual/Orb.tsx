import clsx from 'clsx';

export type OrbState = 'idle'|'pulse'|'active';

export function Orb({ state = 'idle', size = 96, className }: { state?: OrbState; size?: number; className?: string }) {
	return (
		<div
			className={clsx('rounded-full', className, state === 'idle' ? 'animate-[orbPulse_3s_ease-in-out_infinite]' : state === 'pulse' ? 'animate-[orbSpeaking_1.2s_ease-in-out_infinite]' : 'animate-[orbThinking_1.4s_ease-in-out_infinite]')}
			style={{ width: size, height: size, boxShadow: '0 0 32px rgba(120, 65, 255, 0.35), inset 0 0 40px rgba(124, 193, 255, 0.35)', willChange: 'transform, box-shadow', filter: 'saturate(110%)' }}
			aria-label={`orb ${state}`}
		/>
	);
}