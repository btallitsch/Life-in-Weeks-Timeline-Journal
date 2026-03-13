import './GridLegend.css';

export default function GridLegend() {
  const items = [
    { color: 'var(--bg-2)', border: '1px solid var(--border)', label: 'Future' },
    { color: 'var(--week-past)', label: 'Past' },
    { color: 'var(--week-journaled)', label: 'Journaled' },
    { color: 'var(--week-milestone)', label: 'Milestone' },
    { color: 'var(--week-planned)', label: 'Planned' },
    { color: 'var(--gold)', label: 'Current', glow: true },
  ];

  return (
    <div className="grid-legend">
      {items.map(item => (
        <div key={item.label} className="grid-legend__item">
          <div
            className={`grid-legend__swatch ${item.glow ? 'grid-legend__swatch--glow' : ''}`}
            style={{ background: item.color, border: item.border }}
          />
          <span className="grid-legend__label">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
