import { ArrowLeft, RotateCcw } from "lucide-react";

export default function Mistakes({ mistakes, onBack, onPractice }) {
  return (
    <main className="content-page">
      <button className="back-link" onClick={onBack}><ArrowLeft size={17}/> Ortga</button>
      <div className="page-heading">
        <div><div className="section-kicker">REVIEW</div><h2>Xatolaringiz</h2><p className="muted">Mana shu terminlar yana bir marta qaytarilishi kerak.</p></div>
        {mistakes.length > 0 && <button className="primary-btn" onClick={onPractice}><RotateCcw size={18}/> Qayta ishlash</button>}
      </div>
      {mistakes.length === 0 ? <div className="empty">Hozircha xato yo‘q. Shubhali darajada yaxshi.😎</div> :
      <div className="mistake-list">
        {mistakes.map((m,i) => <article key={`${m.id}-${i}`}><div><span className="latin-small">{m.latin}</span><b>{m.uzbek ?? m.correct}</b></div><div className="wrong-answer">Javobingiz: {m.selected}</div></article>)}
      </div>}
    </main>
  )
}
