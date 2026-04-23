// CodePanel.jsx
// Shows the pseudocode for the current algorithm.
// The active line (currently executing) glows cyan.
// Line numbers shown on the left, like a real IDE.

import { useEffect, useRef } from 'react'
import { ALGO_CODE, getCodeLine } from '../utils/algorithmCode'

export default function CodePanel({ algoKey, step }) {
  const lines      = ALGO_CODE[algoKey] || []
  const activeLine = getCodeLine(algoKey, step)
  const activeRef  = useRef(null)

  // Auto-scroll to keep the active line visible
  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  }, [activeLine])

  return (
    <div className="code-panel">
      <div className="panel-label" style={{ marginBottom: '10px' }}>
        CODE  <span style={{ color: 'var(--cyan)', fontSize: '10px' }}>Java pseudocode</span>
      </div>

      <div className="code-scroll">
        {lines.map((line, i) => {
          const isActive  = i === activeLine
          const indent    = line.match(/^(\s*)/)[1].length  // preserve indentation

          return (
            <div
              key={i}
              ref={isActive ? activeRef : null}
              className={`code-line ${isActive ? 'code-line-active' : ''}`}
            >
              {/* Line number */}
              <span className="code-linenum">{i + 1}</span>

              {/* Code text — preserve leading spaces */}
              <span className="code-text" style={{ paddingLeft: `${indent * 6}px` }}>
                {line.trimStart()}
              </span>

              {/* Active indicator arrow */}
              {isActive && <span className="code-arrow">◀</span>}
            </div>
          )
        })}
      </div>

      {/* Active line description */}
      <div className="code-hint">
        {activeLine >= 0 && lines[activeLine]
          ? <><span style={{ color: 'var(--cyan)' }}>Line {activeLine + 1}:</span> {lines[activeLine].trim()}</>
          : 'Step through the algorithm to see active lines'
        }
      </div>
    </div>
  )
}
