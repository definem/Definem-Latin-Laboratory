import { diagrams } from "../data/diagrams";

export const anchorOf = (term) => diagrams[term.diagram]?.anchors[term.anchor] ?? null;

/**
 * id        — diagram kaliti
 * highlight — yoritiladigan qism kalitlari
 * markers   — [{ x, y, label, active, id }]
 * onPick    — qismga bosilganda (partKey) chaqiriladi
 */
export default function BoneDiagram({ id, highlight = [], markers = [], onPick, onMarker, caption = true, className = "" }) {
  const d = diagrams[id];
  if (!d) return null;
  const hl = new Set(highlight);
  const pick = (e) => {
    if (!onPick) return;
    const g = e.target.closest("[data-part]");
    if (g) onPick(g.dataset.part);
  };
  return (
    <figure className={`bone-diagram ${onPick ? "pickable" : ""} ${hl.size ? "has-hl" : ""} ${className}`}>
      <svg viewBox={d.viewBox} role="img" aria-label={d.title} onClick={pick}>
        <d.Render hl={hl} />
        {markers.map((m) => (
          <g
            key={m.id ?? m.label}
            className={`marker ${m.active ? "active" : ""}`}
            transform={`translate(${m.x} ${m.y}) scale(${d.ms ?? 1})`}
            onClick={onMarker ? (e) => { e.stopPropagation(); onMarker(m.id); } : undefined}
          >
            {m.active && <circle className="pulse" r="15" />}
            {m.ring
              ? <circle className="ring" r="15" />
              : <><circle r={m.active ? 13 : 10.5} /><text dy="0.35em">{m.label}</text></>}
          </g>
        ))}
      </svg>
      {caption && <figcaption>{d.title}</figcaption>}
    </figure>
  );
}
