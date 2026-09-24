import { Search } from "lucide-react";
import { useMemo, useState } from "react";

export default function Vocabulary({ words, categories }) {
  const [query,setQuery] = useState("");
  const [cat,setCat] = useState("Barchasi");
  const filtered = useMemo(() => words.filter(w =>
    (cat === "Barchasi" || w.category === cat) &&
    (`${w.latin} ${w.uzbek}`.toLowerCase().includes(query.toLowerCase()))
  ), [query,cat,words]);

  return (
    <main className="content-page">
      <div className="page-heading"><div><div className="section-kicker">VOCABULARY</div><h2>Lotincha lug‘at</h2><p className="muted">{filtered.length} ta termin topildi.</p></div></div>
      <div className="toolbar">
        <label className="search-box"><Search size={18}/><input placeholder="Lotincha yoki o‘zbekcha qidirish..." value={query} onChange={e=>setQuery(e.target.value)}/></label>
        <select className="filter-select" value={cat} onChange={e=>setCat(e.target.value)}>{categories.map(c=><option key={c}>{c}</option>)}</select>
      </div>
      <div className="word-grid">
        {filtered.map(w => <article className="word-card" key={w.id}><div className="word-card-top"><span>{w.category}</span><span>{w.difficulty}</span></div><h3>{w.latin}</h3><p>{w.uzbek}</p></article>)}
      </div>
    </main>
  )
}
