// claudeAPI.js
// Calls Claude Haiku (fastest + cheapest model) to explain the current step
// in plain English. Called only when user clicks "Explain This Step".

export async function explainStep(algoName, step) {
  const apiKey = import.meta.env.VITE_CLAUDE_API_KEY

  if (!apiKey || apiKey === 'your_api_key_here') {
    return '⚠️ Add your Claude API key to .env file (VITE_CLAUDE_API_KEY) to enable AI explanations.'
  }

  const prompt = `You are explaining a DSA algorithm step to a CS student who is learning.

Algorithm: ${algoName}
Current array: [${step.array.join(', ')}]
What just happened: ${step.explanation}
More detail: ${step.detail}

In exactly 2-3 sentences, explain:
1. WHY this step is necessary
2. What it's working toward

Be direct, use simple language. No fluff. Talk like a smart friend, not a textbook.`

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',  // Haiku: fast + cheap, perfect for this
      max_tokens: 150,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!response.ok) {
    const err = await response.json()
    throw new Error(err.error?.message || 'API call failed')
  }

  const data = await response.json()
  return data.content[0].text
}
