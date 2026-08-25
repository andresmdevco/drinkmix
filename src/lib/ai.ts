import { createOpenRouter } from '@openrouter/ai-sdk-provider';

export const openroute = createOpenRouter({
  apiKey: import.meta.env.VITE_OPENROUTER_KEY,
});
