import { BookOpen, Moon, Sun, Trophy, ChartNoAxesColumnIncreasing, Bone } from "lucide-react";

const links = [
  ["home", "Bosh sahifa"],
  ["anatomy", "Anatomiya darslari", Bone],
  ["vocabulary", "Lug‘at"],
  ["progress", "Progress", ChartNoAxesColumnIncreasing],
  ["leaderboard", "Reyting", Trophy],
];

export default function Header({ page, setPage, dark, setDark }) {
  const nav = (cls) => (
    <nav className={cls}>
      {links.map(([id, label, Icon]) => (
        <button key={id} className={page === id ? "active" : ""} onClick={() => setPage(id)}>
          {Icon && <Icon size={16}/>} {label}
        </button>
      ))}
    </nav>
  );
  return (
    <>
      <header className="topbar">
        <button className="brand" onClick={() => setPage("home")}>
          <span className="brand-mark"><BookOpen size={20} /></span>
          <span>DEFINEM_<span>LAB</span></span>
        </button>
        {nav("desktop-nav")}
        <button className="icon-btn" aria-label="Mavzuni almashtirish" onClick={() => setDark(!dark)}>
          {dark ? <Sun size={18}/> : <Moon size={18}/>}
        </button>
      </header>
      {nav("mobile-nav")}
    </>
  );
}
