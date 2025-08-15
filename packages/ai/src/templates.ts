export type PromptTemplate = {
	id: string
	title: string
	description?: string
	template: string
}

export const TEMPLATES: PromptTemplate[] = [
	{
		id: 'brainstorm',
		title: 'Brainstorm Ideas',
		description: 'Generate 10 creative ideas about a topic',
		template: 'Brainstorm 10 creative ideas about: {{topic}}',
	},
	{
		id: 'summarize',
		title: 'Summarize Text',
		description: 'Summarize the following text in 3 bullet points',
		template: 'Summarize in 3 concise bullet points: {{text}}',
	},
	{
		id: 'translate',
		title: 'Translate',
		description: 'Translate to Spanish',
		template: 'Translate to Spanish: {{text}}',
	},
]

export function fillTemplate(template: string, variables: Record<string, string>) {
	return template.replace(/\{\{(.*?)\}\}/g, (_, key) => variables[key.trim()] ?? '')
}