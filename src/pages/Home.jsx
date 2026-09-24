import { ArrowRight, BookOpenCheck, Brain, RotateCcw, Sparkles, Trophy } from "lucide-react";
import BoneDiagram from "../components/BoneDiagram";

export default function Home({ onStart, setPage, stats, wordCount, lessons = [] }) {
  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><Sparkles size={15}/> Qaytaring va yod oling</div>
          <h1>Lotin tilini <em>test bilan</em> yodlang.</h1>
          <p>So‘zlarni ko‘rib, javobni tanlab, xatolaringizni qayta ishlang. Tibbiy lotin lug‘atini qisqa testlar bilan mustahkamlash uchun tayyorlangan.</p>
          <div className="hero-actions">
            <button className="primary-btn" onClick={onStart}>Testni boshlash <ArrowRight size={18}/></button>
            <button className="secondary-btn" onClick={() => setPage("anatomy")}>Anatomiya darslari</button>
            <button className="ghost-btn" onClick={() => setPage("vocabulary")}>Lug‘atni ko‘rish</button>
          </div>
          <div className="mini-stats">
            <span><b>{wordCount}</b> so‘z</span>
            <span><b>{stats.tests}</b> test</span>
            <span><b>{stats.average}%</b> o‘rtacha</span>
          </div>
        </div>

        <div className="hero-card">
          <div className="floating-tag">TODAY'S WORD</div>
          <div className="latin-word">COR</div>
          <div className="divider"/>
          <div className="meaning">yurak</div>
          <div className="word-meta"><span>noun</span><span>•</span><span>anatomy</span></div>
          <div className="card-quote">Tomchi tomchi yig'ilib daryo bo'lur.</div>
        </div>
      </section>

      <section className="home-anatomy">
        <div className="home-anatomy-text">
          <h2>Anatomiya darslari</h2>
          <p className="muted">Darsda o‘tilgan suyaklar va ularning qismlari lotincha nomlari bilan, rasmda ko‘rsatilgan. Har bir dars bo‘yicha alohida test.</p>
          <button className="primary-btn" onClick={() => setPage("anatomy")}>Darslarni ochish <ArrowRight size={18}/></button>
        </div>
        <div className="home-anatomy-list">
          {lessons.map((l) => (
            <button key={l.id} onClick={() => setPage("anatomy")}>
              <span className="mini-thumb"><BoneDiagram id={l.diagrams[0]} caption={false} /></span>
              <span><b>{l.title}</b><i>{l.latin}</i></span>
              <small>{l.terms.length}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="feature-grid">
        <article><span className="feature-icon"><Brain/></span><h3>Random testlar</h3><p>Har safar savollar va variantlar o'rni o'zgaradi. Variant joyini yodlab qutulib bo‘lmaydi😉.</p></article>
        <article><span className="feature-icon"><RotateCcw/></span><h3>Xatolarni qaytarish</h3><p>Noto‘g‘ri javoblaringiz saqlanadi va ularni alohida mashq qila olasiz.</p></article>
        <article><span className="feature-icon"><BookOpenCheck/></span><h3>Smart lug‘at</h3><p>Qidiruv, kategoriya va qiyinlik bo‘yicha, kerakli terminni tez topish uchun mo'ljallandi. (shuni qiguncha sochimga oq tushdi)</p></article>
        <article><span className="feature-icon"><Trophy/></span><h3>Progress</h3><p>Testlar soni, o‘rtacha natija va eng yaxshi natija bir joyda.</p></article>
      </section>
    </main>
  );
}
