import { z } from 'zod';

export const ResearchInputSchema = z.object({ topic: z.string().min(2), audience: z.string().min(2) });
export type ResearchInput = z.infer<typeof ResearchInputSchema>;

export const researchProductIdeas = async (input: ResearchInput) => {
  const validated = ResearchInputSchema.parse(input);
  // Placeholder: call your AI backend
  return [
    { title: `${validated.topic} Toolkit`, demandScore: 82, competition: 'medium' },
    { title: `${validated.topic} Course`, demandScore: 76, competition: 'low' },
  ];
};

export const generateProduct = async (brief: { title: string; format: 'ebook' | 'course' | 'template' }) => {
  // Placeholder for one-click generator
  return {
    id: Date.now().toString(),
    title: brief.title,
    format: brief.format,
    files: [{ name: `${brief.title}.pdf`, url: 'https://example.com/file.pdf' }],
  };
};

export const marketingCopilot = async (context: { productTitle: string; tone?: string }) => {
  return {
    adCopy: `Launch ${context.productTitle} today. Start winning with NovaX.`,
    email: `Subject: ${context.productTitle} — your unfair advantage`,
    tweets: [
      `Building ${context.productTitle} with NovaX`,
      `Ship faster with ${context.productTitle}`,
    ],
  };
};