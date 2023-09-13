import { config } from 'dotenv';
config();
import weaviate, { ApiKey } from 'weaviate-ts-client';

const client = weaviate.client({
  scheme: 'https',
  host: process.env.WEAVIATE_URL,
  apiKey: new ApiKey(process.env.WEAVIATE_API_KEY),
  headers: { 'X-OpenAI-Api-Key': process.env.OPENAI_API_KEY },
});

export { client };
