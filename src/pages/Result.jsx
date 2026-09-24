import { RotateCcw, Home, AlertCircle, Trophy } from "lucide-react";
import { formatTime } from "../utils/quiz";

export default function Result({ result, onAgain, onHome, onReview }) {
  const pct = Math.round(result.score / result.total * 100);
  return (
    <main className="narrow">
      <section className="panel result-panel">
        <div className="result-icon"><Trophy size={28}/></div>
        <div className="section-kicker">TEST COMPLETE</div>
        <h2>{result.name ? `${result.name}, natijang` : "Natijang"}</h2>
        <div className="score-ring" style={{"--score": `${pct * 3.6}deg`}}>
          <div><strong>{pct}%</strong><span>{result.score}/{result.total}</span></div>
        </div>
        <div className="result-stats">
          <div><b>{result.score}</b><span>To‘g‘ri</span></div>
          <div><b>{result.total-result.score}</b><span>Noto‘g‘ri</span></div>
          <div><b>{formatTime(result.seconds)}</b><span>Vaqt</span></div>
        </div>
        <div className="result-actions">
          {result.mistakes.length > 0 && <button className="secondary-btn full" onClick={onReview}><AlertCircle size={18}/> Xatolarni ko‘rish</button>}
          <button className="primary-btn full" onClick={onAgain}><RotateCcw size={18}/> Yana test</button>
          <button className="ghost-btn full" onClick={onHome}><Home size={18}/> Bosh sahifa</button>
        </div>
      </section>
    </main>
  );
}
