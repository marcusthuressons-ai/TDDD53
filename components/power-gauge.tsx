const zones = ['#e87979', '#edcb72', '#83cba5', '#edcb72', '#e87979'];

function point(angle: number, radius: number) {
  const radians = angle * Math.PI / 180;
  return { x: 160 + Math.cos(radians) * radius, y: 150 - Math.sin(radians) * radius };
}

export function PowerGauge({ value }: { value: number }) {
  return <section className="power-gauge" aria-label="Effektmätare">
    <h2>Effekt</h2>
    <svg viewBox="0 0 320 170" aria-hidden="true">
      <path className="power-gauge-face" d="M 12 150 A 148 148 0 0 1 308 150 Z" />
      {zones.map((color, index) => {
        const start = point(180 - index * 36, 126);
        const end = point(180 - (index + 1) * 36, 126);
        return <path key={index} d={`M ${start.x} ${start.y} A 126 126 0 0 1 ${end.x} ${end.y}`} fill="none" stroke={color} strokeWidth="18" />;
      })}
      {Array.from({ length: 21 }, (_, index) => {
        const outer = point(180 - index * 9, 110);
        const inner = point(180 - index * 9, index % 4 === 0 ? 96 : 103);
        return <line key={index} x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y} className="power-gauge-tick" />;
      })}
      <path className="power-gauge-needle" d="M 155 150 L 160 55 L 165 150 Z" transform={`rotate(${value * 1.8 - 90} 160 150)`} />
      <circle cx="160" cy="150" r="9" className="power-gauge-hub" />
    </svg>
    <div className="power-gauge-labels"><span>För låg</span><span>För hög</span></div>
  </section>;
}


