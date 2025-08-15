### /api/market

POST a JSON body:

```
{
  "keywords": ["Notion template", "printable planner"],
  "geo": "US"
}
```

Response contains computed categories, price ranges, opportunity score, and AI recommendations.

Environment variables to enrich and enable AI:
- `OPENAI_API_KEY` or `ANTHROPIC_API_KEY` or `GOOGLE_API_KEY`
- `ETSY_API_KEY`
- `GUMROAD_ACCESS_TOKEN`, `GUMROAD_SELLER_ID`