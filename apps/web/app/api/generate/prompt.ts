export type Mode = 'product_description'|'social_instagram'|'social_tiktok'|'social_twitter'|'ad_facebook'|'ad_google'|'email_template';

export function buildPrompt(mode: Mode, input: string, audience: string, trends: string) {
	const trendLine = trends ? `Incorporate these trend keywords when natural: ${trends}.` : '';
	const audienceLine = audience ? `Target audience: ${audience}.` : '';
	switch (mode) {
		case 'product_description':
			return `Create a compelling product description for: ${input}. ${trendLine} ${audienceLine} Include bullet points and a short headline.`;
		case 'social_instagram':
			return `Write an Instagram caption for: ${input}. ${trendLine} ${audienceLine} Include 8-12 relevant hashtags and a call-to-action.`;
		case 'social_tiktok':
			return `Write a short TikTok script and caption for: ${input}. ${trendLine} ${audienceLine} Keep it fun, high-energy, and add 6-10 hashtags.`;
		case 'social_twitter':
			return `Write 1-2 concise tweets about: ${input}. ${trendLine} ${audienceLine} Optimize for engagement, use hooks, and emojis sparingly.`;
		case 'ad_facebook':
			return `Write 2 variations of Facebook ad copy for: ${input}. ${trendLine} ${audienceLine} Provide primary text, headline, and description.`;
		case 'ad_google':
			return `Write Google Ads copy for: ${input}. ${trendLine} ${audienceLine} Provide multiple headlines (30 chars) and descriptions (90 chars).`;
		case 'email_template':
			return `Write an email marketing template for: ${input}. ${trendLine} ${audienceLine} Include subject line options, preview text, and body with sections.`;
		default:
			return input;
	}
}
export default buildPrompt;