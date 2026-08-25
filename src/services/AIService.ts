import { streamText } from 'ai';
import { openrouter } from '../lib/ai';

export default {
  async generateRecipe(prompt: string) {
    const result = streamText({
      model: openrouter('dots-studio/dots-3-note-preview:free'),
      prompt,
    });

    return result.textStream;
  },
};
