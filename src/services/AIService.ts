export default {
  async generateRecipe(prompt: string) {
    const res = await fetch('/api/recipe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    if (!res.body) throw new Error('No se recibió stream');

    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    return (async function* () {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        yield decoder.decode(value, { stream: true });
      }
    })();
  },
};