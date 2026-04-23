// BinarySearchVisualizer.jsx
// Completely different from ArrayVisualizer.
// Shows the array as flat blocks (not height-based bars) with
// LOW / MID / HIGH pointer labels and eliminated regions greyed out.

export default function BinarySearchVisualizer({ step }) {
  if (!step) return null

  const { array, low, high, mid, found, eliminated, target } = step
  const eliminatedSet = new Set(eliminated)

  const getBlockState = (index) => {
    if (found === index)              return 'found'
    if (found === -2)                 return 'notfound'   // all eliminated, not found
    if (eliminatedSet.has(index))     return 'eliminated'
    if (index === mid && mid !== -1)  return 'mid'
    if (index === low || index === high) return 'boundary'
    return 'active'
  }

  const getPointers = (index) => {
    const pts = []
    if (index === low  && low <= high)  pts.push('L')
    if (index === mid  && mid !== -1)   pts.push('M')
    if (index === high && low <= high)  pts.push('H')
    return pts
  }

  return (
    <div className="bs-visualizer">
      {/* Target display */}
      <div className="bs-target">
        <span className="bs-target-label">TARGET</span>
        <span className="bs-target-value">{target}</span>
      </div>

      {/* Array blocks */}
      <div className="bs-blocks">
        {array.map((value, index) => {
          const state   = getBlockState(index)
          const ptrs    = getPointers(index)

          return (
            <div key={index} className="bs-block-col">
              {/* Pointer labels above block */}
              <div className="bs-pointers">
                {ptrs.map(p => (
                  <span key={p} className={`bs-ptr bs-ptr-${p}`}>{p}</span>
                ))}
              </div>

              {/* The block itself */}
              <div className={`bs-block bs-block-${state}`}>
                <span className="bs-block-value">{value}</span>
              </div>

              {/* Index below */}
              <span className="bs-index">{index}</span>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="legend" style={{ marginTop: '12px' }}>
        <span className="legend-item" style={{ color: '#00d4ff' }}>● Mid</span>
        <span className="legend-item" style={{ color: '#a78bfa' }}>● Boundary</span>
        <span className="legend-item" style={{ color: '#00ff88' }}>● Found</span>
        <span className="legend-item" style={{ color: '#3a3a5a' }}>● Eliminated</span>
      </div>
    </div>
  )
}
