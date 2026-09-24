import { words } from "../data/words";
import { anatomyTerms } from "../data/anatomy";

export const shuffle = (array) => {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// Anatomiya testlari uchun savol turlari
export const MODES = [
  { id: "mixed", label: "Aralash" },
  { id: "image", label: "Rasm bo‘yicha" },
  { id: "lat-uz", label: "Lotincha → o‘zbekcha" },
  { id: "uz-lat", label: "O‘zbekcha → lotincha" },
];

// Butun suyak yoki katta guruhni bildiruvchi qism kalitlari.
// Rasmli savolda ular chalg'ituvchi variant bo'lmaydi: aks holda
// "caput femoris" yoritilganda "femur" varianti ham qisman to'g'ri bo'lib qolardi.
const UMBRELLA = new Set([
  "columna", "arcus", "sternum", "clavicula", "scapula", "manus", "carpi", "metacarpi",
  "digiti", "femur", "tibia", "fibula", "tarsi", "os_costale", "costae",
]);

export const isAnatomy = (item) => typeof item.id === "string" && item.id.startsWith("an-");

function pickOptions(answer, candidates, field) {
  const seen = new Set([answer]);
  const out = [];
  for (const c of shuffle(candidates)) {
    const v = c[field];
    if (!v || seen.has(v)) continue;
    seen.add(v);
    out.push(v);
    if (out.length === 3) break;
  }
  return shuffle([answer, ...out]);
}

function makeQuestion(item, kind) {
  const anatomy = isAnatomy(item);
  const base = anatomy ? anatomyTerms : words;
  const others = base.filter((t) => t.id !== item.id);
  // Chalg'ituvchi variantlar avval shu darsdan olinadi
  const sameLesson = anatomy ? others.filter((t) => t.lesson === item.lesson) : [];

  if (kind === "image") {
    const clashes = (t) =>
      t.parts.some((p) => item.parts.includes(p)) ||
      t.parts.some((p) => UMBRELLA.has(p) && t.diagram === item.diagram);
    const sameDiagram = sameLesson.filter((t) => t.diagram === item.diagram && !clashes(t));
    const pool = sameDiagram.length >= 3
      ? sameDiagram
      : [...sameDiagram, ...sameLesson.filter((t) => t.diagram !== item.diagram && !clashes(t))];
    return {
      ...item, kind, answer: item.latin, prompt: null,
      ask: "Rasmda belgilangan qism lotincha qanday ataladi?",
      options: pickOptions(item.latin, pool, "latin"),
    };
  }

  const pool = sameLesson.length >= 3 ? sameLesson : others;
  if (kind === "uz-lat") {
    return {
      ...item, kind, answer: item.latin, prompt: item.uzbek,
      ask: "Lotincha nomi qaysi?",
      options: pickOptions(item.latin, pool, "latin"),
    };
  }
  return {
    ...item, kind: "lat-uz", answer: item.uzbek, prompt: item.latin,
    ask: anatomy ? "O‘zbekcha nomi qaysi?" : "Bu so‘zning o‘zbekcha ma’nosi qaysi?",
    options: pickOptions(item.uzbek, pool, "uzbek"),
  };
}

/**
 * items — lug'at so'zlari yoki anatomiya terminlari (aralash ham bo'lishi mumkin)
 * mode  — "lat-uz" (odatiy), "uz-lat", "image", "mixed"
 */
export function buildQuestions(items, count, mode = "lat-uz") {
  const source = mode === "image" ? items.filter((t) => t.diagram) : items;
  const selected = shuffle(source).slice(0, Math.min(count, source.length));
  // aralash rejimda: taxminan yarmi rasm bilan, qolgani ikki yo'nalishda
  const cycle = shuffle(["image", "image", "lat-uz", "uz-lat"]);

  return selected.map((item, i) => {
    if (!isAnatomy(item)) return makeQuestion(item, "lat-uz");
    let kind = mode;
    if (mode === "mixed") {
      kind = cycle[i % cycle.length];
      if (kind === "image" && !item.diagram) kind = i % 2 ? "uz-lat" : "lat-uz";
    }
    return makeQuestion(item, kind);
  });
}

export function formatTime(totalSeconds) {
  const min = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const sec = (totalSeconds % 60).toString().padStart(2, "0");
  return `${min}:${sec}`;
}
