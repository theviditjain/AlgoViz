// RaceMode.jsx
// Runs TWO algorithms simultaneously on the SAME array.
// Both have independent step engines but share one Play button.
// Winner (finishes first) gets a crown + glow effect.
// Shows a live step counter comparison — visually proves complexity differences.

import { useState, useMemo, useEffect, useRef } from 'react'
import { bubbleSortSteps }    from '../algorithms/sorting/bubbleSort'
import { selectionSortSteps } from '../algorithms/sorting/selectionSort'
import { mergeSortSteps }     from '../algorithms/sorting/mergeSort'
import { quickSortSteps }     from '../algorithms/sorting/quickSort'

// Only sorting algos make sense to race (same input/output type)
const RACE_ALGOS = {
  bubble:    { name: 'Bubble Sort',    fn: bubbleSortSteps,    complexity: 'O(n²)' },
  selection: { name: 'Selection Sort', fn: selectionSortSteps, complexity: 'O(n²)' },
  merge:     { name: 'Merge Sort',     fn: mergeSortSteps,     complexity: 'O(n log n)' },
  quick:     { name: 'Quick Sort',     fn: quickSortSteps,     complexity: 'O(n log n)' },
}

// Mini array visualizer just for race mode (compact, no labels)
function RaceBar({ step, maxValue, algoName, complexity, stepNum, totalSteps, isWinner, isLoser }) {
  if (!step) return null
  const { array, comparing, swapped, sorted } = step

  const getBarState = (i) => {
    if (sorted?.[i])          return 'sorted'
    if (swapped?.includes(i)) return 'swapped'
    if (comparing?.includes(i)) return 'comparing'
    return 'default'
  }

  const pct = totalSteps > 1 ? Math.round((stepNum / (totalSteps - 1)) * 100) : 100

  return (
    <div className={`race-lane ${isWinner ? 'race-winner' : ''} ${isLoser ? 'race-loser' : ''}`}>
      {/* Lane header */}
      <div className="race-lane-header">
        <div className="race-lane-title">
          {isWinner && <span className="race-crown">👑</span>}
          <span className="race-algo-name">{algoName}</span>
          <span className="race-complexity">{complexity}</span>
        </div>
        <div className="race-step-count">
          {stepNum} / {totalSteps} steps
        </div>
      </div>

      {/* Progress bar */}
      <div className="race-progress-track">
        <div
          className={`race-progress-fill ${isWinner ? 'winner-fill' : ''}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Bars */}
      <div className="race-bars">
        {array.map((value, i) => {
          const state = getBarState(i)
          const height = Math.max((value / maxValue) * 100, 6)
          return (
            <div key={i} className="race-bar-wrap">
              <div className={`race-bar race-bar-${state}`} style={{ height: `${height}%` }} />
            </div>
          )
        })}
      </div>

      {/* Current step explanation */}
      <div className="race-explanation">
        {step.explanation}
      </div>
    </div>
  )
}

export default function RaceMode({ initialArray }) {
  const [array,  setArray]  = useState(initialArray || [64, 34, 25, 12, 22, 11, 90, 45, 80, 15])
  const [algoA,  setAlgoA]  = useState('bubble')
  const [algoB,  setAlgoB]  = useState('merge')
  const [stepA,  setStepA]  = useState(0)
  const [stepB,  setStepB]  = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speed,  setSpeed]  = useState(300)
  const [finished, setFinished] = useState(false)
  const intervalRef = useRef(null)

  // Compute steps for both algos
  const stepsA = useMemo(() => RACE_ALGOS[algoA].fn([...array]), [algoA, array])
  const stepsB = useMemo(() => RACE_ALGOS[algoB].fn([...array]), [algoB, array])

  const maxValue = Math.max(...array)
  const doneA = stepA >= stepsA.length - 1
  const doneB = stepB >= stepsB.length - 1
  const bothDone = doneA && doneB

  // Winner logic
  const winnerA = doneA && !doneB
  const winnerB = doneB && !doneA

  // Reset when algo or array changes
  useEffect(() => {
    setStepA(0); setStepB(0); setPlaying(false); setFinished(false)
  }, [algoA, algoB, array])

  // Auto-play engine — advances both independently
  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        let stillGoing = false

        setStepA(prev => {
          if (prev < stepsA.length - 1) { stillGoing = true; return prev + 1 }
          return prev
        })
        setStepB(prev => {
          if (prev < stepsB.length - 1) { stillGoing = true; return prev + 1 }
          return prev
        })

        // Stop when both are done
        setStepA(a => {
          setStepB(b => {
            if (a >= stepsA.length - 1 && b >= stepsB.length - 1) {
              setPlaying(false)
              setFinished(true)
            }
            return b
          })
          return a
        })
      }, speed)
    }
    return () => clearInterval(intervalRef.current)
  }, [playing, speed, stepsA.length, stepsB.length])

  const handleReset = () => {
    setStepA(0); setStepB(0); setPlaying(false); setFinished(false)
  }

  const handleTogglePlay = () => {
    if (bothDone) { handleReset(); return }
    setPlaying(p => !p)
  }

  const handleRandomArray = () => {
    const size = Math.floor(Math.random() * 6) + 7   // 7-12 elements
    const arr  = Array.from({ length: size }, () => Math.floor(Math.random() * 85) + 10)
    setArray(arr)
  }

  const speedLabel = speed >= 500 ? 'Slow' : speed >= 250 ? 'Medium' : 'Fast'

  return (
    <div className="race-mode">

      {/* ── RACE HEADER ── */}
      <div className="race-header">
        <div>
          <div className="race-title">⚡ RACE MODE</div>
          <div className="race-subtitle">Same array. Two algorithms. Watch complexity in action.</div>
        </div>
        <button className="btn-random" onClick={handleRandomArray}>New Array</button>
      </div>

      {/* ── ALGO PICKERS ── */}
      <div className="race-pickers">
        <div className="race-picker">
          <span className="selector-label">ALGORITHM A</span>
          <div className="algo-tabs">
            {Object.entries(RACE_ALGOS).map(([key, a]) => (
              <button
                key={key}
                className={`algo-tab ${algoA === key ? 'active' : ''} ${key === algoB ? 'disabled-tab' : ''}`}
                onClick={() => key !== algoB && setAlgoA(key)}
              >
                {a.name}
              </button>
            ))}
          </div>
        </div>

        <div className="race-vs">VS</div>

        <div className="race-picker">
          <span className="selector-label">ALGORITHM B</span>
          <div className="algo-tabs">
            {Object.entries(RACE_ALGOS).map(([key, a]) => (
              <button
                key={key}
                className={`algo-tab ${algoB === key ? 'active' : ''} ${key === algoA ? 'disabled-tab' : ''}`}
                onClick={() => key !== algoA && setAlgoB(key)}
              >
                {a.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── RACE LANES ── */}
      <div className="race-lanes">
        <RaceBar
          step={stepsA[stepA]}
          maxValue={maxValue}
          algoName={RACE_ALGOS[algoA].name}
          complexity={RACE_ALGOS[algoA].complexity}
          stepNum={stepA}
          totalSteps={stepsA.length}
          isWinner={finished && stepsA.length <= stepsB.length}
          isLoser={finished && stepsA.length > stepsB.length}
        />
        <RaceBar
          step={stepsB[stepB]}
          maxValue={maxValue}
          algoName={RACE_ALGOS[algoB].name}
          complexity={RACE_ALGOS[algoB].complexity}
          stepNum={stepB}
          totalSteps={stepsB.length}
          isWinner={finished && stepsB.length <= stepsA.length}
          isLoser={finished && stepsB.length > stepsA.length}
        />
      </div>

      {/* ── FINISH BANNER ── */}
      {finished && (
        <div className="race-finish-banner">
          {stepsA.length === stepsB.length ? (
            <span>🤝 Tie! Both took {stepsA.length} steps on this array.</span>
          ) : stepsA.length < stepsB.length ? (
            <span>
              👑 <strong>{RACE_ALGOS[algoA].name}</strong> won! &nbsp;
              {stepsA.length} steps vs {stepsB.length} steps &nbsp;
              <span style={{ color: 'var(--green)' }}>({Math.round((1 - stepsA.length / stepsB.length) * 100)}% fewer steps)</span>
            </span>
          ) : (
            <span>
              👑 <strong>{RACE_ALGOS[algoB].name}</strong> won! &nbsp;
              {stepsB.length} steps vs {stepsA.length} steps &nbsp;
              <span style={{ color: 'var(--green)' }}>({Math.round((1 - stepsB.length / stepsA.length) * 100)}% fewer steps)</span>
            </span>
          )}
        </div>
      )}

      {/* ── CONTROLS ── */}
      <div className="controls-panel">
        <div className="progress-track">
          <div className="progress-fill" style={{
            width: `${Math.max(
              stepsA.length > 1 ? (stepA / (stepsA.length - 1)) * 100 : 100,
              stepsB.length > 1 ? (stepB / (stepsB.length - 1)) * 100 : 100
            )}%`
          }} />
        </div>
        <div className="controls-row">
          <div className="btn-group">
            <button className="ctrl-btn" onClick={handleReset}>↺</button>
            <button className="ctrl-btn play-btn" onClick={handleTogglePlay}>
              {bothDone ? '↺' : playing ? '⏸' : '▶'}
            </button>
          </div>
          <div className="speed-control">
            <span className="speed-label">Speed: {speedLabel}</span>
            <input type="range" className="speed-slider"
              min={50} max={800} step={50}
              value={850 - speed}
              onChange={e => setSpeed(850 - Number(e.target.value))}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
