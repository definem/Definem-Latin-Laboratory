import { Check, X, Clock3 } from "lucide-react";
import { formatTime } from "../utils/quiz";
import BoneDiagram, { anchorOf } from "../components/BoneDiagram";

export default function Quiz({ questions, index, selected, onAnswer, onNext, seconds }) {
  const q = questions[index];
  if (!q) return null;
  const progress = ((index + (selected ? 1 : 0)) / questions.length) * 100;
  const isImage = q.kind === "image";
  const right = selected === q.answer;
  const anchor = isImage ? anchorOf(q) : null;
  const latinOptions = q.kind === "image" || q.kind === "uz-lat";

  return (
    <main className={`quiz-shell ${isImage ? "wide" : ""}`}>
      <div className="quiz-top">
        <span>Savol {index + 1} / {questions.length}</span>
        <span className="timer"><Clock3 size={16}/>{formatTime(seconds)}</span>
      </div>
      <div className="progress-track"><div style={{width:`${progress}%`}}/></div>

      <section className={`quiz-card ${isImage ? "image-q" : ""}`}>
        {isImage && (
          <div className="quiz-figure">
            <BoneDiagram
              id={q.diagram}
              highlight={q.parts}
              markers={anchor ? [{ id: q.id, x: anchor[0], y: anchor[1], label: "?", active: true, ring: true }] : []}
              caption={false}
            />
          </div>
        )}

        <div className="quiz-body">
          <div className="quiz-cat">{q.category}</div>
          {isImage
            ? <h2 className="quiz-ask">{q.ask}</h2>
            : <>
                <h2 className={`quiz-word ${q.kind === "uz-lat" ? "uz" : ""}`}>{q.prompt}</h2>
                <p className="muted">{q.ask}</p>
              </>}

          <div className="answers">
            {q.options.map((option, i) => {
              let state = "";
              if (selected) {
                if (option === q.answer) state = "correct";
                else if (option === selected) state = "wrong";
              }
              return (
                <button key={option} disabled={!!selected} className={`answer ${state} ${latinOptions ? "latin-opt" : ""}`} onClick={() => onAnswer(option)}>
                  <span className="answer-letter">{String.fromCharCode(65+i)}</span>
                  <span>{option}</span>
                  {state === "correct" && <Check size={19}/>}
                  {state === "wrong" && <X size={19}/>}
                </button>
              );
            })}
          </div>

          {selected && (
            <div className={`feedback ${right ? "good" : "bad"}`}>
              <b>{right ? "To‘g‘ri!" : "Noto‘g‘ri."}</b>
              {q.lesson
                ? <span> <i>{q.latin}</i> — {q.uzbek}</span>
                : !right && <span> To‘g‘ri javob: <strong>{q.answer}</strong></span>}
            </div>
          )}

          {selected && <button className="primary-btn full" onClick={onNext} autoFocus>{index === questions.length - 1 ? "Natijani ko‘rish" : "Keyingi savol"}</button>}
        </div>
      </section>
    </main>
  );
}
