interface Props {
  total: number
  done: number
}

const RADIUS = 68
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export default function ProgressRing({ total, done }: Props) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100)
  const offset = CIRCUMFERENCE * (1 - pct / 100)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
      <div className="ring-container">
        <svg className="ring-svg" viewBox="0 0 160 160">
          <circle className="ring-track" cx="80" cy="80" r={RADIUS} />
          <circle
            className="ring-progress"
            cx="80"
            cy="80"
            r={RADIUS}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="ring-inner">
          <span className="ring-pct">{pct}<span style={{ fontSize: '16px', opacity: 0.5 }}>%</span></span>
          <span className="ring-label">completado</span>
        </div>
      </div>
      <span className="ring-counts">
        {done.toString().padStart(2, '0')} / {total.toString().padStart(2, '0')}
      </span>
    </div>
  )
}
