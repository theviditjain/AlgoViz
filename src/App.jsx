// App.jsx — Quiz Mode update
// QuizPanel appears in the right sidebar, unlocks when algo is complete

import { useState, useMemo } from 'react'
import { bubbleSortSteps }    from './algorithms/sorting/bubbleSort'
import { selectionSortSteps } from './algorithms/sorting/selectionSort'
import { mergeSortSteps }     from './algorithms/sorting/mergeSort'
import { quickSortSteps }     from './algorithms/sorting/quickSort'
import { binarySearchSteps }  from './algorithms/searching/binarySearch'
import { bfsSteps }           from './algorithms/graphs/bfs'
import { dfsSteps }           from './algorithms/graphs/dfs'
import { dijkstraSteps }      from './algorithms/graphs/dijkstra'
import { useStepEngine }      from './hooks/useStepEngine'
import AlgoSelector           from './components/AlgoSelector'
import ArrayVisualizer        from './components/ArrayVisualizer'
import BinarySearchVisualizer from './components/BinarySearchVisualizer'
import GraphVisualizer        from './components/GraphVisualizer'
import StepControls           from './components/StepControls'
import InputPanel             from './components/InputPanel'
import AIExplainer            from './components/AIExplainer'
import CodePanel              from './components/CodePanel'
import RaceMode               from './components/RaceMode'
import QuizPanel              from './components/QuizPanel'

const DEFAULT_ARRAY = [64, 34, 25, 12, 22, 11, 90]

const DEFAULT_GRAPH = {
  nodes: [
    { id: 0, x: 200, y: 80  }, { id: 1, x: 100, y: 200 },
    { id: 2, x: 300, y: 200 }, { id: 3, x: 80,  y: 320 },
    { id: 4, x: 200, y: 320 }, { id: 5, x: 350, y: 320 },
  ],
  edges: [
    { from: 0, to: 1, weight: 4 }, { from: 0, to: 2, weight: 2 },
    { from: 1, to: 3, weight: 5 }, { from: 1, to: 4, weight: 1 },
    { from: 2, to: 4, weight: 3 }, { from: 2, to: 5, weight: 6 },
    { from: 4, to: 5, weight: 2 },
  ],
}

const ALGOS = {
  bubble:    { name: 'Bubble Sort',    type: 'sort',   fn: (arr) => bubbleSortSteps(arr),          complexity: 'O(n²) time  ·  O(1) space',       description: 'Compares adjacent elements and swaps if out of order. Largest "bubbles up" each pass.' },
  selection: { name: 'Selection Sort', type: 'sort',   fn: (arr) => selectionSortSteps(arr),       complexity: 'O(n²) time  ·  O(1) space',       description: 'Finds minimum in unsorted portion and places it at the correct position each pass.' },
  merge:     { name: 'Merge Sort',     type: 'sort',   fn: (arr) => mergeSortSteps(arr),           complexity: 'O(n log n) time  ·  O(n) space',  description: 'Divide & conquer: splits in half recursively, then merges sorted halves together.' },
  quick:     { name: 'Quick Sort',     type: 'sort',   fn: (arr) => quickSortSteps(arr),           complexity: 'O(n log n) avg  ·  O(1) space',   description: 'Picks a pivot, partitions so smaller elements go left, larger right, then recurses.' },
  binary:    { name: 'Binary Search',  type: 'search', fn: (arr, t) => binarySearchSteps(arr, t), complexity: 'O(log n) time  ·  O(1) space',    description: 'On sorted array: check middle, eliminate half the search space each step.' },
  bfs:       { name: 'BFS',            type: 'graph',  fn: (n,e,s) => bfsSteps(n,e,s),            complexity: 'O(V + E) time  ·  O(V) space',    description: 'Breadth-First: explores level by level using a queue. Shortest path in unweighted graphs.', weighted: false },
  dfs:       { name: 'DFS',            type: 'graph',  fn: (n,e,s) => dfsSteps(n,e,s),            complexity: 'O(V + E) time  ·  O(V) space',    description: 'Depth-First: goes as deep as possible before backtracking. Uses recursion stack.',         weighted: false },
  dijkstra:  { name: "Dijkstra's",     type: 'graph',  fn: (n,e,s) => dijkstraSteps(n,e,s),       complexity: 'O((V+E) log V)  ·  O(V) space',   description: "Shortest path in weighted graphs. Always picks unvisited node with smallest distance.",     weighted: true  },
}

export default function App() {
  const [mode,         setMode]         = useState('visualize')
  const [selectedAlgo, setSelectedAlgo] = useState('bubble')
  const [array,        setArray]        = useState(DEFAULT_ARRAY)
  const [target,       setTarget]       = useState(25)
  const [graph,        setGraph]        = useState(DEFAULT_GRAPH)
  const [startNode,    setStartNode]    = useState(0)
  const [showCode,     setShowCode]     = useState(true)
  const [showQuiz,     setShowQuiz]     = useState(false)

  const algo       = ALGOS[selectedAlgo]
  const isSearch   = algo.type === 'search'
  const isGraph    = algo.type === 'graph'
  const isWeighted = algo.weighted ?? false

  const steps = useMemo(() => {
    if (isGraph)  return algo.fn(graph.nodes, graph.edges, startNode)
    if (isSearch) return algo.fn(array, target)
    return algo.fn(array)
  }, [selectedAlgo, array, target, graph, startNode])

  const engine = useStepEngine(steps)
  const isComplete = engine.isLast   // algo completed = unlock quiz

  const handleResetGraph = () => { setGraph(DEFAULT_GRAPH); setStartNode(0) }

  return (
    <div className="app">

      {/* ── HEADER ── */}
      <header className="header">
        <div className="header-brand">
          <span className="brand-bracket">[</span>
          <span className="brand-name">AlgoViz</span>
          <span className="brand-bracket">]</span>
          <span className="brand-tag">8 algorithms · interactive · AI-powered</span>
        </div>
        <div className="header-meta" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div className="mode-switcher">
            <button className={`mode-btn ${mode === 'visualize' ? 'active' : ''}`} onClick={() => setMode('visualize')}>
              Visualize
            </button>
            <button className={`mode-btn race-mode-btn ${mode === 'race' ? 'active' : ''}`} onClick={() => setMode('race')}>
              ⚡ Race
            </button>
          </div>
          {mode === 'visualize' && (
            <>
              <button className={`code-toggle-btn ${showCode ? 'active' : ''}`} onClick={() => setShowCode(c => !c)}>
                {'</>'} {showCode ? 'Hide Code' : 'Show Code'}
              </button>
              <button className={`quiz-toggle-btn ${showQuiz ? 'active' : ''}`} onClick={() => setShowQuiz(q => !q)}>
                🎯 {showQuiz ? 'Hide Quiz' : 'Show Quiz'}
              </button>
              <span className="complexity-badge">{algo.complexity}</span>
            </>
          )}
        </div>
      </header>

      {mode === 'race' && <RaceMode initialArray={array} />}

      {mode === 'visualize' && (
        <>
          <AlgoSelector algos={ALGOS} selected={selectedAlgo} onSelect={setSelectedAlgo} />

          {!isGraph && (
            <div className="top-row">
              <InputPanel currentArray={array} onArrayChange={setArray} />
              {isSearch && (
                <div className="target-panel">
                  <span className="selector-label">SEARCH TARGET</span>
                  <div className="input-row">
                    <input className="array-input" type="number" value={target}
                      onChange={e => setTarget(Number(e.target.value))} style={{ maxWidth: '100px' }} />
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>(auto-sorted)</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {isGraph && (
            <div className="top-row" style={{ alignItems: 'center' }}>
              <div className="algo-description" style={{ margin: 0, flex: 1 }}>
                <span className="desc-icon">▸</span>{algo.description}
              </div>
              <button className="btn-random" onClick={handleResetGraph}>Reset Graph</button>
            </div>
          )}

          {!isGraph && (
            <div className="algo-description">
              <span className="desc-icon">▸</span>{algo.description}
            </div>
          )}

          <div className={`viz-row ${isGraph ? 'viz-row-graph' : ''}`}>
            <div className="viz-panel">
              <div className="panel-label">VISUALIZATION</div>
              {isGraph ? (
                <GraphVisualizer graphState={graph} onGraphChange={setGraph}
                  algoStep={engine.step} startNode={startNode}
                  onStartNodeChange={setStartNode} isWeighted={isWeighted} />
              ) : isSearch ? (
                <BinarySearchVisualizer step={engine.step} />
              ) : (
                <>
                  <ArrayVisualizer step={engine.step} maxValue={Math.max(...array)} />
                  <div className="legend">
                    <span className="legend-item comparing">● Comparing</span>
                    <span className="legend-item swapped">● Swapping</span>
                    {selectedAlgo === 'quick' && <span className="legend-item" style={{ color: '#f59e0b' }}>● Pivot</span>}
                    <span className="legend-item sorted">● Sorted</span>
                  </div>
                </>
              )}
            </div>

            <div className="info-panel">
              {isGraph && engine.step && (
                <div className="step-log">
                  <div className="panel-label">
                    {selectedAlgo === 'bfs' ? 'QUEUE STATE' : selectedAlgo === 'dfs' ? 'STACK STATE' : 'DISTANCES'}
                  </div>
                  {selectedAlgo === 'bfs' && (
                    <div className="ds-display">
                      <span className="ds-label">Queue (FIFO):</span>
                      <div className="ds-items">
                        {engine.step.queue?.length > 0
                          ? engine.step.queue.map((id, i) => <span key={i} className="ds-item">{id}</span>)
                          : <span className="ds-empty">empty</span>}
                      </div>
                    </div>
                  )}
                  {selectedAlgo === 'dfs' && (
                    <div className="ds-display">
                      <span className="ds-label">Call Stack:</span>
                      <div className="ds-items">
                        {engine.step.stack?.length > 0
                          ? engine.step.stack.map((id, i) => <span key={i} className="ds-item">{id}</span>)
                          : <span className="ds-empty">empty</span>}
                      </div>
                    </div>
                  )}
                  {selectedAlgo === 'dijkstra' && engine.step.distances && (
                    <div className="ds-display">
                      <span className="ds-label">Distance Table:</span>
                      <div className="dist-table">
                        {Object.entries(engine.step.distances).map(([id, d]) => (
                          <div key={id} className="dist-row">
                            <span className="dist-node">Node {id}</span>
                            <span className="dist-val">{d}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="step-log">
                <div className="panel-label">
                  STEP LOG <span className="step-counter">{engine.currentStep + 1} / {engine.totalSteps}</span>
                </div>
                <div className="step-explanation">{engine.step?.explanation}</div>
                <div className="step-detail">{engine.step?.detail}</div>
              </div>

              {showCode && <CodePanel algoKey={selectedAlgo} step={engine.step} />}
              
              {showQuiz ? (
                <QuizPanel algoName={algo.name} isComplete={isComplete} />
              ) : (
                <AIExplainer step={engine.step} algoName={algo.name} />
              )}
            </div>
          </div>

          <StepControls engine={engine} />

          {isGraph && (
            <div className="graph-legend">
              <span className="legend-item" style={{ color: '#ff6b35' }}>● Start</span>
              <span className="legend-item" style={{ color: '#00d4ff' }}>● Processing</span>
              <span className="legend-item" style={{ color: '#a78bfa' }}>● Discovered</span>
              <span className="legend-item" style={{ color: '#00ff88' }}>● Visited</span>
              {selectedAlgo === 'dfs' && <span className="legend-item" style={{ color: '#f59e0b' }}>● Backtracking</span>}
            </div>
          )}
        </>
      )}
    </div>
  )
}