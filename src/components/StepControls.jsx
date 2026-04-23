// StepControls.jsx
// Prev / Play / Next buttons + speed slider + progress bar

export default function StepControls({ engine }) {
  const { isPlaying, togglePlay, prev, next, reset, isFirst, isLast, speed, setSpeed, progress } = engine

  const speedLabel = speed >= 800 ? 'Slow' : speed >= 400 ? 'Medium' : 'Fast'

  return (
    <div className="controls-panel">
      {/* Progress bar */}
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="controls-row">
        {/* Playback buttons */}
        <div className="btn-group">
          <button className="ctrl-btn" onClick={reset} title="Restart">
            ↺
          </button>
          <button className="ctrl-btn" onClick={prev} disabled={isFirst} title="Previous step">
            ‹‹
          </button>
          <button className="ctrl-btn play-btn" onClick={togglePlay} title={isPlaying ? 'Pause' : 'Play'}>
            {isPlaying ? '⏸' : '▶'}
          </button>
          <button className="ctrl-btn" onClick={next} disabled={isLast} title="Next step">
            ››
          </button>
        </div>

        {/* Speed control */}
        <div className="speed-control">
          <span className="speed-label">Speed: {speedLabel}</span>
          <input
            type="range"
            className="speed-slider"
            min={100}
            max={1000}
            step={100}
            // Invert: high slider = fast = low ms delay
            value={1100 - speed}
            onChange={e => setSpeed(1100 - Number(e.target.value))}
          />
        </div>
      </div>
    </div>
  )
}
