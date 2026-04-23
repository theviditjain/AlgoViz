// InputPanel.jsx
// Lets user type their own array or generate a random one.

import { useState } from 'react'

export default function InputPanel({ currentArray, onArrayChange }) {
  const [inputValue, setInputValue] = useState(currentArray.join(', '))
  const [error, setError] = useState('')

  const handleApply = () => {
    // Parse comma-separated numbers
    const parts = inputValue.split(',').map(s => s.trim())
    const nums = parts.map(Number)

    if (nums.some(isNaN)) {
      setError('Enter numbers only, separated by commas')
      return
    }
    if (nums.length < 2 || nums.length > 12) {
      setError('Enter between 2 and 12 numbers')
      return
    }

    setError('')
    onArrayChange(nums)
  }

  const handleRandom = () => {
    const size = Math.floor(Math.random() * 5) + 5   // 5 to 9 elements
    const arr = Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10)
    setInputValue(arr.join(', '))
    setError('')
    onArrayChange(arr)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleApply()
  }

  return (
    <div className="input-panel">
      <span className="selector-label">ARRAY INPUT</span>
      <div className="input-row">
        <input
          className="array-input"
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. 64, 34, 25, 12, 22"
          spellCheck={false}
        />
        <button className="btn-apply" onClick={handleApply}>Apply</button>
        <button className="btn-random" onClick={handleRandom}>Random</button>
      </div>
      {error && <span className="input-error">{error}</span>}
    </div>
  )
}
