// GraphVisualizer.jsx
// Interactive SVG graph — user can:
//   • Click empty space   → add a node
//   • Click node          → select it (first click)
//   • Click another node  → add edge between them (second click)
//   • Right-click node    → delete node + its edges
//   • Drag nodes          → reposition them
//   • Click "Set Start"   → mark a node as BFS/DFS/Dijkstra start

import { useState, useRef, useCallback } from 'react'

const NODE_RADIUS = 22

export default function GraphVisualizer({
  graphState,        // { nodes, edges }
  onGraphChange,     // callback when user edits graph
  algoStep,          // current algorithm step snapshot
  startNode,
  onStartNodeChange,
  isWeighted,        // true for Dijkstra's
}) {
  const { nodes, edges } = graphState
  const svgRef    = useRef(null)
  const [selected, setSelected]   = useState(null)   // node id selected for edge creation
  const [dragging, setDragging]   = useState(null)   // { id, offsetX, offsetY }

  // ── Derived state from algo step ──────────────────────────────
  const visited     = algoStep?.visited    || []
  const current     = algoStep?.current    ?? -1
  const discovering = algoStep?.discovering ?? -1
  const backtracking = algoStep?.backtracking ?? false
  const relaxing    = algoStep?.relaxing   || null
  const distances   = algoStep?.distances  || {}

  // ── Node color based on algo state ────────────────────────────
  const getNodeColor = (id) => {
    if (id === current && backtracking) return '#f59e0b'   // amber = backtracking
    if (id === current)                 return '#00d4ff'   // cyan = being processed
    if (id === discovering)             return '#a78bfa'   // purple = just discovered
    if (visited.includes(id))           return '#00ff88'   // green = visited
    if (id === startNode)               return '#ff6b35'   // orange = start
    return '#1e1e35'                                       // default dark
  }

  const getNodeBorder = (id) => {
    if (id === selected) return '#ffffff'
    if (id === startNode) return '#ff6b35'
    if (id === current)   return '#00d4ff'
    return '#2a2a5a'
  }

  // ── Edge color based on algo state ────────────────────────────
  const getEdgeColor = (edge) => {
    if (relaxing && ((relaxing.from === edge.from && relaxing.to === edge.to) ||
                     (relaxing.from === edge.to   && relaxing.to === edge.from))) {
      return relaxing.improved ? '#00ff88' : '#ff6b35'
    }
    const bothVisited = visited.includes(edge.from) && visited.includes(edge.to)
    if (bothVisited) return '#2a5a3a'
    return '#2a2a4a'
  }

  // ── SVG coordinate helper ──────────────────────────────────────
  const getSVGCoords = (e) => {
    const svg  = svgRef.current
    const rect = svg.getBoundingClientRect()
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
  }

  // ── Click on SVG background → add node ────────────────────────
  const handleSVGClick = (e) => {
    if (e.target !== svgRef.current) return   // only bare SVG, not nodes/edges
    const { x, y } = getSVGCoords(e)
    const newId = nodes.length > 0 ? Math.max(...nodes.map(n => n.id)) + 1 : 0
    onGraphChange({
      nodes: [...nodes, { id: newId, x, y }],
      edges,
    })
    setSelected(null)
  }

  // ── Click on node ──────────────────────────────────────────────
  const handleNodeClick = (e, id) => {
    e.stopPropagation()

    if (selected === null) {
      setSelected(id)   // first click: select
    } else if (selected === id) {
      setSelected(null)  // click same: deselect
    } else {
      // Second click on different node → add edge
      const exists = edges.some(
        edge => (edge.from === selected && edge.to === id) ||
                (edge.from === id && edge.to === selected)
      )
      if (!exists) {
        let weight = 1
if (isWeighted) {
  const input = window.prompt('Enter edge weight:', '1')
  weight = input ? Math.max(1, parseInt(input) || 1) : 1
}
        onGraphChange({
          nodes,
          edges: [...edges, { from: selected, to: id, weight }],
        })
      }
      setSelected(null)
    }
  }

  // ── Right-click node → delete ──────────────────────────────────
  const handleNodeRightClick = (e, id) => {
    e.preventDefault()
    e.stopPropagation()
    onGraphChange({
      nodes: nodes.filter(n => n.id !== id),
      edges: edges.filter(edge => edge.from !== id && edge.to !== id),
    })
    if (selected === id) setSelected(null)
    if (startNode === id) onStartNodeChange(nodes.find(n => n.id !== id)?.id ?? -1)
  }

  // ── Drag nodes ─────────────────────────────────────────────────
  const handleMouseDown = (e, id) => {
    if (e.button !== 0) return
    e.stopPropagation()
    const { x, y } = getSVGCoords(e)
    const node = nodes.find(n => n.id === id)
    setDragging({ id, offsetX: x - node.x, offsetY: y - node.y })
  }

  const handleMouseMove = useCallback((e) => {
    if (!dragging) return
    const { x, y } = getSVGCoords(e)
    onGraphChange({
      nodes: nodes.map(n =>
        n.id === dragging.id
          ? { ...n, x: x - dragging.offsetX, y: y - dragging.offsetY }
          : n
      ),
      edges,
    })
  }, [dragging, nodes, edges])

  const handleMouseUp = () => setDragging(null)

  // ── Edge midpoint for weight label ─────────────────────────────
  const edgeMid = (edge) => {
    const from = nodes.find(n => n.id === edge.from)
    const to   = nodes.find(n => n.id === edge.to)
    if (!from || !to) return { x: 0, y: 0 }
    return { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 }
  }

  return (
    <div className="graph-container">
      {/* Instructions */}
      <div className="graph-instructions">
        <span>Click canvas → add node</span>
        <span>Click node → select</span>
        <span>Click 2nd node → add edge</span>
        <span>Right-click node → delete</span>
        <span>Drag → move node</span>
      </div>

      <svg
        ref={svgRef}
        className="graph-svg"
        onClick={handleSVGClick}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* ── Edges ── */}
        {edges.map((edge, i) => {
          const from = nodes.find(n => n.id === edge.from)
          const to   = nodes.find(n => n.id === edge.to)
          if (!from || !to) return null
          const mid  = edgeMid(edge)
          const col  = getEdgeColor(edge)

          return (
            <g key={i}>
              <line
                x1={from.x} y1={from.y}
                x2={to.x}   y2={to.y}
                stroke={col}
                strokeWidth={2}
              />
              {/* Weight label for Dijkstra's */}
              {isWeighted && (
                <g
  style={{ cursor: 'pointer' }}
  onClick={(e) => {
    e.stopPropagation()
    const input = window.prompt('Edit edge weight:', edge.weight)
    if (input) {
      const newWeight = Math.max(1, parseInt(input) || 1)
      onGraphChange({
        nodes,
        edges: edges.map((ed, idx) =>
          idx === i ? { ...ed, weight: newWeight } : ed
        ),
      })
    }
  }}
>
  <circle cx={mid.x} cy={mid.y} r={10} fill="#0f0f1a" stroke={col} strokeWidth={1} />
  <text x={mid.x} y={mid.y} textAnchor="middle" dominantBaseline="central"
    fontSize="10" fill={col} fontFamily="JetBrains Mono, monospace">
    {edge.weight}
  </text>
</g>
              )}
            </g>
          )
        })}

        {/* ── Nodes ── */}
        {nodes.map(node => {
          const fill   = getNodeColor(node.id)
          const stroke = getNodeBorder(node.id)
          const dist   = distances[node.id]
          const isSelected = selected === node.id

          return (
            <g
              key={node.id}
              transform={`translate(${node.x}, ${node.y})`}
              onClick={(e) => handleNodeClick(e, node.id)}
              onContextMenu={(e) => handleNodeRightClick(e, node.id)}
              onMouseDown={(e) => handleMouseDown(e, node.id)}
              style={{ cursor: dragging?.id === node.id ? 'grabbing' : 'grab' }}
            >
              {/* Selection ring */}
              {isSelected && (
                <circle r={NODE_RADIUS + 6} fill="none" stroke="#ffffff" strokeWidth={1.5}
                  strokeDasharray="4 3" opacity={0.6} />
              )}

              {/* Main circle */}
              <circle
                r={NODE_RADIUS}
                fill={fill}
                stroke={stroke}
                strokeWidth={2}
                style={{ transition: 'fill 0.2s ease, stroke 0.2s ease' }}
              />

              {/* Node ID */}
              <text textAnchor="middle" dominantBaseline="central"
                fontSize="13" fontWeight="700" fill="#fff"
                fontFamily="JetBrains Mono, monospace">
                {node.id}
              </text>

              {/* Distance label above node (Dijkstra's only) */}
              {dist !== undefined && (
                <text y={-NODE_RADIUS - 8} textAnchor="middle"
                  fontSize="11" fill="#00d4ff"
                  fontFamily="JetBrains Mono, monospace">
                  {dist}
                </text>
              )}

              {/* Start node marker */}
              {node.id === startNode && (
                <text y={NODE_RADIUS + 14} textAnchor="middle"
                  fontSize="9" fill="#ff6b35" letterSpacing="1"
                  fontFamily="JetBrains Mono, monospace">
                  START
                </text>
              )}
            </g>
          )
        })}
      </svg>

      {/* Start node selector */}
      <div className="graph-start-row">
        <span className="selector-label">START NODE</span>
        <div className="start-node-btns">
          {nodes.map(n => (
            <button
              key={n.id}
              className={`start-node-btn ${startNode === n.id ? 'active' : ''}`}
              onClick={() => onStartNodeChange(n.id)}
            >
              {n.id}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
