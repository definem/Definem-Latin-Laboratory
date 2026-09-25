import { useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import Home from "./pages/Home";
import Setup from "./pages/Setup";
import Quiz from "./pages/Quiz";
import Result from "./pages/Result";
import Mistakes from "./pages/Mistakes";
import Vocabulary from "./pages/Vocabulary";
import Progress from "./pages/Progress";
import Leaderboard from "./pages/Leaderboard";
import Anatomy from "./pages/Anatomy";
import { words, categories, inCategory } from "./data/words";
import { lessons, anatomyTerms, lessonById } from "./data/anatomy";
import { buildQuestions } from "./utils/quiz";

const read = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
};
const allItems = new Map([...words, ...anatomyTerms].map((w) => [w.id, w]));

export default function App() {
  const [page,setPage] = useState("home");
  const [dark,setDark] = useState(() => read("latin-theme", true));
  const [history,setHistory] = useState(() => read("latin-history", []));
  const [savedMistakes,setSavedMistakes] = useState(() => read("latin-mistakes", []));
  const [settings,setSettings] = useState({name: read("latin-name",""), category:"Barchasi", count:10});
  const [questions,setQuestions] = useState([]);
  const [quizLabel,setQuizLabel] = useState("");
  const [returnTo,setReturnTo] = useState("setup");
  const [index,setIndex] = useState(0);
  const [selected,setSelected] = useState(null);
  const [answers,setAnswers] = useState([]);
  const [seconds,setSeconds] = useState(0);
  const [result,setResult] = useState(null);

  useEffect(()=>{ localStorage.setItem("latin-theme",JSON.stringify(dark)); document.documentElement.dataset.theme=dark?"dark":"light"; },[dark]);
  useEffect(()=>localStorage.setItem("latin-history",JSON.stringify(history)),[history]);
  useEffect(()=>localStorage.setItem("latin-mistakes",JSON.stringify(savedMistakes)),[savedMistakes]);
  useEffect(()=>localStorage.setItem("latin-name",JSON.stringify(settings.name)),[settings.name]);
  useEffect(()=>{ window.scrollTo({ top: 0 }); },[page]);

  useEffect(()=>{
    if(page!=="quiz") return;
    const timer=setInterval(()=>setSeconds(s=>s+1),1000);
    return ()=>clearInterval(timer);
  },[page]);

  const availableWords = useMemo(() => words.filter(w=>inCategory(w,settings.category)),[settings.category]);

  useEffect(()=>{
    if(settings.count > availableWords.length) setSettings(s=>({...s,count:Math.min(10,availableWords.length)}));
  },[availableWords.length]);

  const stats = useMemo(()=>{
    const tests=history.length;
    const average=tests?Math.round(history.reduce((s,r)=>s+(r.score/r.total*100),0)/tests):0;
    return {tests,average};
  },[history]);

  function start(list, label, back) {
    if(list.length<1) return;
    setQuestions(list); setQuizLabel(label); setReturnTo(back);
    setIndex(0); setSelected(null); setAnswers([]); setSeconds(0); setResult(null); setPage("quiz");
  }

  // Oddiy lug'at testi
  function begin(source=availableWords) {
    start(buildQuestions(source, Math.min(settings.count,source.length), "lat-uz"), settings.category, "setup");
  }

  // Anatomiya darslari bo'yicha test
  function beginAnatomy(lessonIds, mode, count) {
    const pool = lessons.filter(l=>lessonIds.includes(l.id)).flatMap(l=>l.terms);
    const names = lessonIds.map(id=>lessonById[id]?.title).filter(Boolean);
    const label = `Anatomiya: ${names.length===lessons.length ? "barcha darslar" : names.join(", ")}`;
    start(buildQuestions(pool, count, mode), label, "anatomy");
  }

  function practiceMistakes() {
    const list = savedMistakes.map(m=>allItems.get(m.id)).filter(Boolean);
    start(buildQuestions(list, list.length, "mixed"), "Xatolar ustida ishlash", "home");
  }

  function answer(option) {
    if(selected) return;
    setSelected(option);
    const q=questions[index];
    setAnswers(a=>[...a,{id:q.id, latin:q.latin, uzbek:q.uzbek, correct:q.answer, selected:option, isCorrect:option===q.answer}]);
  }

  function next() {
    if(index < questions.length-1) { setIndex(i=>i+1); setSelected(null); return; }
    const mistakes = answers.filter(a=>!a.isCorrect);
    const score = answers.filter(a=>a.isCorrect).length;
    const r={name:settings.name.trim(), category:quizLabel, score,total:questions.length,seconds,mistakes,date:new Date().toISOString()};
    setResult(r);
    setHistory(h=>[...h,r].slice(-100));
    setSavedMistakes(prev=>{
      const map=new Map(prev.map(m=>[m.id,m]));
      mistakes.forEach(m=>map.set(m.id,m));
      answers.filter(a=>a.isCorrect).forEach(a=>map.delete(a.id));
      return [...map.values()];
    });
    setPage("result");
  }

  const mistakeCount = savedMistakes.filter(m=>allItems.has(m.id)).length;

  return (
    <div className="app">
      <Header page={page} setPage={setPage} dark={dark} setDark={setDark}/>
      {page==="home" && <Home onStart={()=>setPage("setup")} setPage={setPage} stats={stats} wordCount={words.length} lessons={lessons}/>}
      {page==="setup" && <Setup settings={settings} setSettings={setSettings} categories={categories} maxQuestions={availableWords.length} onBegin={()=>begin()} onBack={()=>setPage("home")} mistakeCount={mistakeCount} onMistakes={practiceMistakes}/>}
      {page==="anatomy" && <Anatomy onStart={beginAnatomy}/>}
      {page==="quiz" && <Quiz questions={questions} index={index} selected={selected} onAnswer={answer} onNext={next} seconds={seconds}/>}
      {page==="result" && result && <Result result={result} onAgain={()=>setPage(returnTo)} onHome={()=>setPage("home")} onReview={()=>setPage("mistakes")}/>}
      {page==="mistakes" && <Mistakes mistakes={result?.mistakes ?? savedMistakes} onBack={()=>setPage(result?"result":"home")} onPractice={practiceMistakes}/>}
      {page==="vocabulary" && <Vocabulary words={words} categories={categories}/>}
      {page==="progress" && <Progress history={history}/>}
      {page==="leaderboard" && <Leaderboard history={history}/>}
      <footer><span>By definem | DNT - 923</span><span>Duo qilib qo'ying, shuncha mehnat ketdi 😅</span></footer>
    </div>
  );
}
