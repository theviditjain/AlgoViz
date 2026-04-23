// AlgoSelector.jsx
// Renders the algorithm picker tabs at the top

export default function AlgoSelector({ algos, selected, onSelect }) {
  return (
    <div className="algo-selector">
      <span className="selector-label">ALGORITHM</span>
      <div className="algo-tabs">
        {Object.entries(algos).map(([key, algo]) => (
          <button
            key={key}
            className={`algo-tab ${selected === key ? 'active' : ''}`}
            onClick={() => onSelect(key)}
          >
            {algo.name}
          </button>
        ))}
      </div>
    </div>
  )
}
