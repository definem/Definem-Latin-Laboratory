import { Trophy } from "lucide-react";

export default function Leaderboard({ history }) {
  const bestByName = {};
  history.forEach(r => {
    const name = (r.name || "Student").trim() || "Student";
    const pct = Math.round(r.score/r.total*100);
    if (!bestByName[name] || pct > bestByName[name].pct) bestByName[name] = {name,pct,score:r.score,total:r.total};
  });
  const board = Object.values(bestByName).sort((a,b)=>b.pct-a.pct);
  return (
    <main className="content-page">
      <div className="page-heading"><div><div className="section-kicker">LOCAL LEADERBOARD</div><h2>Reyting</h2><p className="muted">Hozircha shu qurilmada ishlangan natijalar. Supabase ulanganda guruh bo‘yicha umumiy bo‘ladi.</p></div></div>
      <div className="leaderboard">
        {board.length === 0 ? <div className="empty">Reyting uchun avval biror test ishlash kerak. Fizika qonunlari shunaqa.</div> :
        board.map((r,i)=><article key={r.name} className={i<3 ? "podium" : ""}><span className="rank">{i===0?<Trophy size={20}/>:i+1}</span><div><b>{r.name}</b><small>best score</small></div><strong>{r.pct}%</strong></article>)}
      </div>
    </main>
  )
}
