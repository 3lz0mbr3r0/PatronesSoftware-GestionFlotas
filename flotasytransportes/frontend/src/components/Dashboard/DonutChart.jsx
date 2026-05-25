import { useState, useEffect } from 'react'

const RADIUS = 38
const C = 2 * Math.PI * RADIUS
const SIZE = 120

export default function DonutChart({ data, total, title, colors }) {
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 200)
    return () => clearTimeout(t)
  }, [])

  const sorted = [...data].sort((a, b) => b.value - a.value)

  if (total === 0) {
    return (
      <div className="donut-card">
        <div className="donut-chart">
          <svg viewBox={`0 0 ${SIZE} ${SIZE}`}>
            <circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} fill="none"
              stroke="var(--border-subtle)" strokeWidth="8" />
            <text x={SIZE / 2} y={SIZE / 2 - 4} textAnchor="middle"
              className="donut-total">0</text>
            <text x={SIZE / 2} y={SIZE / 2 + 12} textAnchor="middle"
              className="donut-sub">Sin datos</text>
          </svg>
        </div>
        <span className="donut-title">{title}</span>
      </div>
    )
  }

  let cum = 0
  const segments = sorted.map((item, i) => {
    const pct = item.value / total
    const arr = animated ? pct * C : 0
    const off = -cum * C
    cum += pct
    return { ...item, pct, arr, off, color: colors[i % colors.length], i }
  })

  return (
    <div className="donut-card">
      <div className="donut-chart">
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`}>
          <circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} fill="none"
            stroke="var(--border-subtle)" strokeWidth="8" opacity="0.5" />
          {segments.map(s => (
            <circle key={s.i} cx={SIZE / 2} cy={SIZE / 2} r={RADIUS}
              fill="none" stroke={s.color} strokeWidth="8"
              strokeDasharray={`${s.arr} ${C - s.arr}`}
              strokeDashoffset={s.off}
              transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
              style={{ transition: 'stroke-dasharray 0.8s ease' }}
              strokeLinecap="round" />
          ))}
          <text x={SIZE / 2} y={SIZE / 2 - 4} textAnchor="middle"
            className="donut-total">{total}</text>
          <text x={SIZE / 2} y={SIZE / 2 + 12} textAnchor="middle"
            className="donut-sub">{total === 1 ? 'Vehículo' : 'Vehículos'}</text>
        </svg>
      </div>
      <span className="donut-title">{title}</span>
      <div className="donut-legend">
        {segments.map(s => (
          <div key={s.i} className="donut-legend-item">
            <span className="donut-dot" style={{ background: s.color }} />
            <span className="donut-legend-label">{s.label}</span>
            <span className="donut-legend-value">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
