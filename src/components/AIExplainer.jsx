// AIExplainer.jsx — uses Groq API (free forever, works in India)
// Get free key at: console.groq.com → API Keys

import { useState } from 'react'

export default function AIExplainer({ step, algoName }) {
  const [text,    setText]    = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const handleExplain = async () => {
    if (!step) return
    setLoading(true)
    setError('')
    setText('')

    const apiKey = import.meta.env.VITE_GROQ_API_KEY

    if (!apiKey) {
      setError('Add VITE_GROQ_API_KEY to your .env — free key at console.groq.com')
      setLoading(false)
      return
    }

    const prompt = `Algorithm: ${algoName}
What just happened: ${step.explanation}
${step.detail ? `Detail: ${step.detail}` : ''}

Explain in 2-3 simple sentences why this step is necessary and what it's working toward. Talk like you're explaining to a CS student, not a child. Be concise.`

    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          max_tokens: 150,
          temperature: 0.7,
          messages: [{ role: 'user', content: prompt }],
        }),
      })

      const data = await res.json()

      if (data.error) {
        setError(`Groq error: ${data.error.message}`)
        return
      }

      const result = data.choices?.[0]?.message?.content
      if (result) {
        setText(result.trim())
      } else {
        setError('Empty response. Try again.')
      }
    } catch (e) {
      setError('Network error — check your connection.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="ai-explainer">
      <div className="ai-header">
        <span className="ai-label">AI EXPLAINER</span>
        <button
          className="btn-explain"
          onClick={handleExplain}
          disabled={loading || !step}
        >
          {loading ? '...' : '⚡ Why this step?'}
        </button>
      </div>

      <div className="ai-output">
        {loading && <div className="ai-loading">Thinking<span className="blink">▋</span></div>}
        {error   && <div className="ai-error">{error}</div>}
        {!loading && !error && text && <div className="ai-text">{text}</div>}
        {!loading && !error && !text && (
          <div className="ai-placeholder">
            Click "Why this step?" to get an AI explanation of the current operation.
          </div>
        )}
      </div>
    </div>
  )
}
