// ArrayVisualizer.jsx
// Renders the array as vertical bars.
// Bar color changes based on its current state in the algorithm:
//   - Default  → dim blue/grey
//   - Comparing → cyan (being examined)
//   - Swapped   → orange (just moved)
//   - Sorted    → green (finalized, won't move again)

export default function ArrayVisualizer({ step, maxValue }) {
  if (!step) return null

  const { array, comparing, swapped, sorted } = step

  const getBarState = (index) => {
    if (sorted[index]) return 'sorted'
    if (swapped.includes(index)) return 'swapped'
    if (comparing.includes(index)) return 'comparing'
    if (step.pivot === index) return 'pivot'
    return 'default'
  }

  // Bar height as % of container — min 8% so tiny values are still visible
  const getHeight = (value) => {
    const pct = (value / maxValue) * 100
    return Math.max(pct, 8)
  }

  return (
    <div className="array-visualizer">
      {array.map((value, index) => {
        const state = getBarState(index)
        return (
          <div key={index} className="bar-wrapper">
            <div
              className={`bar bar-${state}`}
              style={{ height: `${getHeight(value)}%` }}
            >
              {/* Show value inside bar if tall enough, else above */}
              <span className="bar-value">{value}</span>
            </div>
            <span className="bar-index">{index}</span>
          </div>
        )
      })}
    </div>
  )
}
