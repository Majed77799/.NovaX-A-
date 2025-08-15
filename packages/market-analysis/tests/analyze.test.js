import { describe, it, expect } from 'vitest';
import { analyzeCore, inferCategoriesFromTrends } from '../src/analyze';
describe('market-analysis', () => {
    const trends = {
        keywords: ['template', 'printable'],
        series: {
            template: [
                { date: '2024-08-01T00:00:00.000Z', interest: 50 },
                { date: '2024-08-02T00:00:00.000Z', interest: 60 },
                { date: '2024-08-03T00:00:00.000Z', interest: 70 }
            ],
            printable: [
                { date: '2024-08-01T00:00:00.000Z', interest: 30 },
                { date: '2024-08-02T00:00:00.000Z', interest: 40 },
                { date: '2024-08-03T00:00:00.000Z', interest: 50 }
            ]
        },
        relatedTopics: [
            { title: 'Canva template', type: 'Topic', value: 90 },
            { title: 'Notion template', type: 'Topic', value: 80 },
            { title: 'Etsy printable', type: 'Topic', value: 75 }
        ]
    };
    it('infers categories', () => {
        const cats = inferCategoriesFromTrends(trends);
        expect(cats.length).toBeGreaterThan(0);
        expect(cats[0].demandScore).toBeLessThanOrEqual(100);
        expect(cats[0].demandScore).toBeGreaterThanOrEqual(0);
    });
    it('analyzes core metrics', () => {
        const result = analyzeCore(trends, []);
        expect(result.topCategories.length).toBeGreaterThan(0);
        expect(result.marketOpportunityScore).toBeGreaterThanOrEqual(0);
        expect(result.marketOpportunityScore).toBeLessThanOrEqual(100);
        expect(result.suggestedPriceRanges).toBeTruthy();
    });
    it('opportunity score increases with higher demand', () => {
        const high = analyzeCore({ ...trends, series: { template: trends.series.template.map(p => ({ ...p, interest: p.interest + 30 })), printable: trends.series.printable } }, []);
        const low = analyzeCore({ ...trends, series: { template: trends.series.template.map(p => ({ ...p, interest: Math.max(0, p.interest - 30) })), printable: trends.series.printable } }, []);
        expect(high.marketOpportunityScore).toBeGreaterThanOrEqual(low.marketOpportunityScore);
    });
});
//# sourceMappingURL=analyze.test.js.map