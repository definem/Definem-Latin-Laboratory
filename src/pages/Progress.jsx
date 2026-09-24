import { Award, Target, CheckCircle2, History } from "lucide-react";

export default function Progress({ history }) {
  const tests = history.length;
  const avg = tests ? Math.round(history.reduce((s,r)=>s+(r.score/r.total*100),0)/tests) : 0;
  const best = tests ? Math.max(...history.map(r=>Math.round(r.score/r.total*100))) : 0;
  const answered = history.reduce((s,r)=>s+r.total,0);
  return (
    <main className="content-page">
      <div className="page-heading"><div><div className="section-kicker">PROGRESS</div><h2>Statistikangiz</h2><p className="muted">Local qurilmada saqlangan test natijalari.</p></div></div>
      <div className="stat-grid">
        <article><History/><b>{tests}</b><span>Testlar</span></article>
        <article><Target/><b>{avg}%</b><span>O‘rtacha</span></article>
        <article><Award/><b>{best}%</b><span>Eng yaxshi</span></article>
        <article><CheckCircle2/><b>{answered}</b><span>Javoblar</span></article>
      </div>
      <h3 className="subheading">Oxirgi natijalar</h3>
      <div className="history-list">
        {history.length === 0 ? <div className="empty">Hali test ishlanmagan.</div> :
          history.slice().reverse().slice(0,10).map((r,i)=><article key={i}><div><b>{r.name || "Student"}</b><span>{r.category}</span></div><strong>{r.score}/{r.total} · {Math.round(r.score/r.total*100)}%</strong></article>)
        }
      </div>
    </main>
  )
}
