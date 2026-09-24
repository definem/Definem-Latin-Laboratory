import { ArrowLeft, Play } from "lucide-react";

export default function Setup({ settings, setSettings, categories, maxQuestions, onBegin, onBack, mistakeCount, onMistakes }) {
  const amounts = [10, 20, 30, 50].filter(n => n <= maxQuestions);
  if (!amounts.includes(Math.min(10, maxQuestions)) && maxQuestions > 0) amounts.unshift(maxQuestions);

  return (
    <main className="narrow">
      <button className="back-link" onClick={onBack}><ArrowLeft size={17}/> Ortga</button>
      <div className="panel setup-panel">
        <div className="section-kicker">QUIZ SETUP</div>
        <h2>Testni sozlang</h2>
        <p className="muted">Bir necha tanlov, keyin miyaga kichkina lotincha hujum😁.</p>

        <label className="field-label">Ismingiz</label>
        <input className="text-input" value={settings.name} onChange={e => setSettings({...settings, name:e.target.value})} placeholder="Masalan: Gulchapchap"/>

        <label className="field-label">Kategoriya</label>
        <select className="text-input" value={settings.category} onChange={e => setSettings({...settings, category:e.target.value})}>
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>

        <label className="field-label">Savollar soni</label>
        <div className="choice-row">
          {amounts.map(n => <button key={n} className={settings.count === n ? "choice active" : "choice"} onClick={() => setSettings({...settings,count:n})}>{n}</button>)}
        </div>

        <button className="primary-btn full" onClick={onBegin} disabled={maxQuestions < 4}><Play size={18}/> Boshlash</button>
        {mistakeCount > 0 && <button className="secondary-btn full" onClick={onMistakes}>Faqat xatolarimni ishlash ({mistakeCount})</button>}
      </div>
    </main>
  );
}
