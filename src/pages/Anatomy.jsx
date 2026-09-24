import { useMemo, useState } from "react";
import { ArrowLeft, Play, Search } from "lucide-react";
import { lessons, lessonById } from "../data/anatomy";
import { diagrams } from "../data/diagrams";
import { MODES } from "../utils/quiz";
import BoneDiagram, { anchorOf } from "../components/BoneDiagram";

export default function Anatomy({ onStart }) {
  const [open, setOpen] = useState(null); // { id, term }
  const go = (o) => { setOpen(o); window.scrollTo({ top: 0 }); };
  if (open && lessonById[open.id]) {
    return <Lesson key={open.id} lesson={lessonById[open.id]} initialTerm={open.term} onBack={() => go(null)} onStart={onStart} />;
  }
  return <LessonList onOpen={(id, term) => go({ id, term })} onStart={onStart} />;
}

/* ---------------- Darslar ro'yxati + test sozlash ---------------- */
function LessonList({ onOpen, onStart }) {
  const [picked, setPicked] = useState(() => new Set(lessons.map((l) => l.id)));
  const [mode, setMode] = useState("mixed");
  const [count, setCount] = useState(20);
  const [query, setQuery] = useState("");

  const pool = lessons.filter((l) => picked.has(l.id)).flatMap((l) => l.terms);
  const amounts = [10, 20, 30].filter((n) => n < pool.length);
  const toggle = (id) => setPicked((s) => {
    const n = new Set(s);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });

  const found = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return lessons.flatMap((l) => l.terms).filter((t) => `${t.latin} ${t.uzbek}`.toLowerCase().includes(q)).slice(0, 12);
  }, [query]);

  return (
    <main className="content-page">
      <div className="page-heading">
        <div>
          <div className="section-kicker">ANATOMIYA DARSLARI</div>
          <h2>Suyaklar va ularning qismlari</h2>
          <p className="muted">Darsni oching: rasmda qism ustiga bosing, nomi lug‘atda yonib ko'rinadi. Keyin shu mavzular bo‘yicha test ishlang.</p>
        </div>
      </div>

      <div className="lesson-grid">
        {lessons.map((l, i) => (
          <button key={l.id} className="lesson-card" onClick={() => onOpen(l.id)}>
            <div className="lesson-thumb"><BoneDiagram id={l.diagrams[0]} caption={false} /></div>
            <div className="lesson-card-body">
              <span className="lesson-num">{i + 1}-dars</span>
              <h3>{l.title}</h3>
              <i className="lesson-latin">{l.latin}</i>
              <span className="lesson-count">{l.terms.length} ta termin</span>
            </div>
          </button>
        ))}
      </div>

      <div className="anatomy-lower">
        <section className="panel test-builder">
          <h3>Anatomiyadan test</h3>
          <label className="field-label">Mavzular</label>
          <div className="chip-row">
            {lessons.map((l) => (
              <button key={l.id} className={`chip ${picked.has(l.id) ? "on" : ""}`} aria-pressed={picked.has(l.id)} onClick={() => toggle(l.id)}>{l.title}</button>
            ))}
          </div>
          <label className="field-label">Savol turi</label>
          <div className="choice-row mode-row">
            {MODES.map((m) => <button key={m.id} className={mode === m.id ? "choice active" : "choice"} onClick={() => setMode(m.id)}>{m.label}</button>)}
          </div>
          <label className="field-label">Savollar soni</label>
          <div className="choice-row">
            {amounts.map((n) => <button key={n} className={count === n ? "choice active" : "choice"} onClick={() => setCount(n)}>{n}</button>)}
            <button className={count >= pool.length || !amounts.includes(count) ? "choice active" : "choice"} onClick={() => setCount(pool.length)}>Hammasi ({pool.length})</button>
          </div>
          <button className="primary-btn full" disabled={pool.length < 4} onClick={() => onStart([...picked], mode, count)}>
            <Play size={18} /> Testni boshlash
          </button>
          {pool.length < 4 && <p className="muted small">Kamida bitta mavzuni tanla.</p>}
        </section>

        <section className="term-search">
          <h3>Terminni topish</h3>
          <label className="search-box"><Search size={18} /><input placeholder="Masalan: caput yoki boshcha" value={query} onChange={(e) => setQuery(e.target.value)} /></label>
          {query && (
            <div className="search-results">
              {found.length === 0 && <div className="empty">“{query}” bo‘yicha termin yo‘q. Boshqacha yozib ko‘r.</div>}
              {found.map((t) => (
                <button key={t.id} className="term-row" onClick={() => onOpen(t.lesson, t.id)}>
                  <span className="term-latin">{t.latin}</span>
                  <span className="term-uz">{t.uzbek}</span>
                  <span className="term-tag">{t.category}</span>
                </button>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

/* ---------------- Bitta dars: rasm + lug'at ---------------- */
function Lesson({ lesson, initialTerm, onBack, onStart }) {
  const first = lesson.terms.find((t) => t.id === initialTerm);
  const [diagram, setDiagram] = useState(first?.diagram || lesson.diagrams[0]);
  const [active, setActive] = useState(first?.id ?? null);

  const onThis = lesson.terms.filter((t) => t.diagram === diagram);
  const number = new Map(onThis.map((t, i) => [t.id, i + 1]));
  const activeTerm = lesson.terms.find((t) => t.id === active);

  const markers = onThis.map((t) => {
    const a = anchorOf(t);
    return a && { id: t.id, x: a[0], y: a[1], label: number.get(t.id), active: t.id === active };
  }).filter(Boolean);

  const select = (t) => {
    if (t.diagram && t.diagram !== diagram) setDiagram(t.diagram);
    setActive(t.id === active ? null : t.id);
  };
  const pickPart = (key) => {
    const t = onThis.find((x) => x.anchor === key) || onThis.find((x) => x.parts.includes(key));
    if (t) {
      setActive(t.id);
      document.getElementById(t.id)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  };

  const withImg = lesson.terms.filter((t) => t.diagram);
  const noImg = lesson.terms.filter((t) => !t.diagram);

  return (
    <main className="content-page">
      <button className="back-link" onClick={onBack}><ArrowLeft size={17} /> Barcha darslar</button>
      <div className="page-heading">
        <div>
          <h2>{lesson.title}</h2>
          <p className="muted"><i>{lesson.latin}</i>. {lesson.note}. {lesson.terms.length} ta termin.</p>
        </div>
        <button className="primary-btn" onClick={() => onStart([lesson.id], "mixed", lesson.terms.length)}><Play size={18} /> Shu dars bo‘yicha test</button>
      </div>

      <div className="lesson-layout">
        <div className="lesson-figure">
          {lesson.diagrams.length > 1 && (
            <div className="tabs" role="tablist">
              {lesson.diagrams.map((d) => (
                <button key={d} role="tab" aria-selected={d === diagram} className={d === diagram ? "on" : ""} onClick={() => { setDiagram(d); setActive(null); }}>
                  {diagrams[d].title.split(" (")[0]}
                </button>
              ))}
            </div>
          )}
          <BoneDiagram
            id={diagram}
            highlight={activeTerm?.diagram === diagram ? activeTerm.parts : []}
            markers={markers}
            onPick={pickPart}
            onMarker={(id) => setActive(id)}
          />
          <div className="active-term" aria-live="polite">
            {activeTerm
              ? <><span className="term-latin">{activeTerm.latin}</span><span className="term-uz">{activeTerm.uzbek}</span></>
              : <span className="muted">Rasmdagi qismga yoki ro‘yxatdagi terminga bosing.</span>}
          </div>
        </div>

        <div className="term-list">
          <h3>Dars lug‘ati</h3>
          {withImg.map((t) => (
            <button id={t.id} key={t.id} className={`term-row ${t.id === active ? "on" : ""}`} onClick={() => select(t)}>
              <span className={`term-num ${t.diagram === diagram ? "" : "off"}`}>{t.diagram === diagram ? number.get(t.id) : "↗"}</span>
              <span className="term-latin">{t.latin}</span>
              <span className="term-uz">{t.uzbek}</span>
            </button>
          ))}
          {noImg.length > 0 && <>
            <h4>Rasmsiz terminlar</h4>
            {noImg.map((t) => (
              <div key={t.id} className="term-row static">
                <span className="term-num off">·</span>
                <span className="term-latin">{t.latin}</span>
                <span className="term-uz">{t.uzbek}</span>
              </div>
            ))}
          </>}
        </div>
      </div>
    </main>
  );
}
