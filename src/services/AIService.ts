import { streamText } from 'ai';
import { openrouter } from '../lib/ai';

export default {
  async generateRecipe(prompt: string) {
    const result = streamText({
      // model: openrouter('dots-studio/dots-3-note-preview:free'),
      model: openrouter('nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free'),
      // model: openrouter('cohere/north-mini-code:free'),
      prompt,
    });

    return result.textStream;
  },
};
