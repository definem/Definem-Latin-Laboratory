# DefLab

Medical Latin vocabulary quiz built with React + Vite.

## Run
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```

- Umumiy lug‘at: `src/data/words.js`
- Anatomiya darslari lug‘ati: `src/data/anatomy.js` (har bir dars — terminlar ro‘yxati)
- Suyak rasmlari (SVG): `src/data/diagrams.jsx`

Yangi termin qo‘shish: `anatomy.js` dagi kerakli darsga `["lotincha", "o‘zbekcha"]` qatori qo‘shiladi.
Rasmda ko‘rsatish uchun uchinchi va to‘rtinchi element sifatida rasm kalitini va qism kalitini yozing,
masalan `["caput costae", "qovurg‘a boshchasi", "costa", "caput"]`.

Progress, xatolar va reyting brauzerning localStorage xotirasida saqlanadi.
