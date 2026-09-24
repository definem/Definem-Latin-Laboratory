// Sxematik suyak rasmlari. Har bir qism <P k="kalit"> ichida — shu kalit orqali
// lug'atdagi termin rasmda belgilanadi (rangga bo'yaladi va marker qo'yiladi).

const cx = (...a) => a.filter(Boolean).join(" ");

// Part: k — bitta kalit yoki kalitlar massivi. hl — yoritiladigan kalitlar Set'i.
function P({ k, hl, c = "bone", children }) {
  const keys = Array.isArray(k) ? k : [k];
  const on = keys.some((x) => hl.has(x));
  return <g className={cx("part", c, on && "hl")} data-part={keys[0]}>{children}</g>;
}

// Uzun suyakcha (kaft, falanga) — asos, tana, boshcha bilan
function rodPath(L, w) {
  return `M0 ${-w * .55} Q${L * .12} ${-w * .3} ${L * .3} ${-w * .28} L${L * .75} ${-w * .28} Q${L * .9} ${-w * .3} ${L} ${-w * .48} A${w * .48} ${w * .48} 0 0 1 ${L} ${w * .48} Q${L * .9} ${w * .3} ${L * .75} ${w * .28} L${L * .3} ${w * .28} Q${L * .12} ${w * .3} 0 ${w * .55} Q${-w * .22} 0 0 ${-w * .55}Z`;
}
function Rod({ x1, y1, x2, y2, w }) {
  const L = Math.hypot(x2 - x1, y2 - y1);
  const a = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
  return <path d={rodPath(L, w)} transform={`translate(${x1} ${y1}) rotate(${a})`} />;
}
// Nurda davom etuvchi falangalar
function chain(x1, y1, x2, y2, lens, gap = 5) {
  const L = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / L, uy = (y2 - y1) / L;
  let x = x2 + ux * gap, y = y2 + uy * gap;
  return lens.map((l) => {
    const seg = { x1: x, y1: y, x2: x + ux * l, y2: y + uy * l };
    x = seg.x2 + ux * gap; y = seg.y2 + uy * gap;
    return seg;
  });
}

/* ---------------- 1. Umurtqa (ko'krak umurtqasi, yuqoridan) ---------------- */
const mirror = (d) => d.replace(/(-?\d+\.?\d*) (-?\d+\.?\d*)/g, (_, x, y) => `${400 - x} ${y}`);
const vTrans = "M160 172 L156 204 L92 238 Q66 242 66 224 Q68 210 84 204 Z";
const vPed = "M150 126 L178 134 L176 180 L150 178 Z";
const vLam = "M150 178 L176 180 Q182 220 200 232 L200 258 Q160 248 146 206 Z";

const vertebra = {
  title: "Ko‘krak umurtqasi (yuqoridan ko‘rinishi)",
  viewBox: "0 0 400 330",
  anchors: {
    corpus: [200, 86], foramen: [200, 194], pediculus: [163, 155], lamina: [166, 222],
    arcus: [236, 226], spinosus: [200, 284], transversus: [318, 222], artsup: [240, 186],
    fovea_tp: [78, 222],
  },
  Render: ({ hl }) => (
    <>
      <P k={["transversus"]} hl={hl}><path d={vTrans} /><path d={mirror(vTrans)} /></P>
      <P k="fovea_tp" hl={hl} c="bone facet"><ellipse cx="80" cy="222" rx="11" ry="8" /><ellipse cx="320" cy="222" rx="11" ry="8" /></P>
      <P k="spinosus" hl={hl}><path d="M186 236 L214 236 L208 302 Q200 316 192 302 Z" /></P>
      <P k={["pediculus", "arcus"]} hl={hl}><path d={vPed} /><path d={mirror(vPed)} /></P>
      <P k={["lamina", "arcus"]} hl={hl}><path d={vLam} /><path d={mirror(vLam)} /></P>
      <P k="artsup" hl={hl}><ellipse cx="162" cy="184" rx="15" ry="10" /><ellipse cx="238" cy="184" rx="15" ry="10" /></P>
      <P k="corpus" hl={hl}><ellipse cx="200" cy="90" rx="74" ry="50" /></P>
      <P k="foramen" hl={hl} c="hole"><path d="M200 144 Q246 146 244 188 Q240 222 200 232 Q160 222 156 188 Q154 146 200 144 Z" /></P>
    </>
  ),
};

/* ---------------- 2. Umurtqa pog'onasi (yon tomondan) ---------------- */
const colVerts = (() => {
  const out = [];
  const regions = [
    { key: "cervicales", n: 7, h: 15, w: 32, gap: 5 },
    { key: "thoracicae", n: 12, h: 18, w: 40, gap: 5 },
    { key: "lumbales", n: 5, h: 25, w: 54, gap: 6 },
  ];
  let y = 28;
  // x siljishi: bo'yin va belda oldinga (chapga), ko'krakda orqaga (o'ngga)
  const off = (yy) => {
    if (yy < 150) return -16 * Math.sin((Math.PI * (yy - 20)) / 130);
    if (yy < 440) return 20 * Math.sin((Math.PI * (yy - 150)) / 290);
    return -18 * Math.sin((Math.PI * (yy - 440)) / 170);
  };
  regions.forEach((r) => {
    for (let i = 0; i < r.n; i++) {
      const cy = y + r.h / 2;
      out.push({ ...r, i, cy, x: 120 + off(cy), y });
      y += r.h + r.gap;
    }
  });
  return { list: out, end: y, off };
})();

const columna = {
  title: "Umurtqa pog‘onasi (yon tomondan, old tomoni chapda)",
  viewBox: "30 10 210 745", ms: 1.7,
  anchors: (() => {
    const V = colVerts.list, e = colVerts.end, at = (i, dx = 0, dy = 0) => [V[i].x + dx, V[i].cy + dy];
    return {
      atlas: at(0, -34), axis: at(1, -36, 4), cervicales: at(4), prominens: at(6, 44, 6),
      thoracicae: at(12), lumbales: at(21), discus: [V[15].x - V[15].w / 2 - 14, V[15].y + V[15].h + 2],
      sacrum: [140, e + 46], coccygis: [182, e + 130], columna: [220, 420], lordosis: [50, 90], kyphosis: [222, 300],
    };
  })(),
  Render: ({ hl }) => {
    const { list, end } = colVerts;
    return (
      <>
        {list.map((v, j) => {
          const next = list[j + 1];
          const keys = [v.key, "columna"];
          if (v.key === "cervicales" && v.i === 0) keys.push("atlas");
          if (v.key === "cervicales" && v.i === 1) keys.push("axis");
          if (v.key === "cervicales" && v.i === 6) keys.push("prominens");
          const spineLen = v.key === "cervicales" ? (v.i === 6 ? 34 : 18) : v.key === "thoracicae" ? 30 : 26;
          return (
            <g key={j}>
              <P k={keys} hl={hl}>
                <rect x={v.x - v.w / 2} y={v.y} width={v.w} height={v.h} rx="4" />
                <path d={`M${v.x + v.w / 2 - 2} ${v.y + 3} L${v.x + v.w / 2 + spineLen} ${v.y + v.h * .8 + 4} L${v.x + v.w / 2 + spineLen - 3} ${v.y + v.h + 3} L${v.x + v.w / 2 - 2} ${v.y + v.h - 2} Z`} />
              </P>
              {next && <P k="discus" hl={hl} c="cart"><rect x={v.x - v.w / 2 + 3} y={v.y + v.h + .5} width={v.w - 6} height={next.y - v.y - v.h - 1} rx="2" /></P>}
            </g>
          );
        })}
        <P k={["sacrum", "columna"]} hl={hl}>
          <path d={`M${128 - 30} ${end + 2} L${128 + 34} ${end + 2} Q${176} ${end + 60} ${170} ${end + 110} Q${150} ${end + 118} ${142} ${end + 104} Q${112} ${end + 60} ${98} ${end + 2} Z`} />
        </P>
        <P k={["coccygis", "columna"]} hl={hl}>
          <path d={`M146 ${end + 112} L168 ${end + 114} Q176 ${end + 132} 164 ${end + 142} Q152 ${end + 136} 146 ${end + 112} Z`} />
        </P>
        <P k="lordosis" hl={hl} c="edge"><path d="M62 30 Q86 90 62 150" /><path d="M72 440 Q102 530 72 600" /></P>
        <P k="kyphosis" hl={hl} c="edge"><path d="M200 160 Q226 300 200 440" /></P>
      </>
    );
  },
};

/* ---------------- 3. Qovurg'a ---------------- */
const Strk = ({ d, w }) => (<><path className="o" d={d} strokeWidth={w + 3} /><path className="i" d={d} strokeWidth={w} /></>);
const ribCorpus = "M100 74 C150 52 180 50 200 58 C300 98 360 170 340 240";
const costa = {
  title: "Qovurg‘a (orqa-yuqori tomondan)",
  viewBox: "0 0 420 300",
  anchors: {
    caput: [48, 94], collum: [82, 82], tuberculum: [108, 60], angulus: [166, 56], corpus: [300, 118],
    sulcus: [314, 196], cartilago: [372, 280], os_costale: [250, 86],
  },
  Render: ({ hl }) => (
    <>
      <P k={["corpus", "os_costale"]} hl={hl} c="stroke"><Strk d={ribCorpus} w={22} /></P>
      <P k={["angulus", "os_costale"]} hl={hl} c="stroke"><Strk d="M148 57 C162 52 180 51 196 56" w={22} /></P>
      <P k={["collum", "os_costale"]} hl={hl} c="stroke"><Strk d="M60 88 L106 72" w={13} /></P>
      <P k={["caput", "os_costale"]} hl={hl}><ellipse cx="48" cy="94" rx="16" ry="14" /><path className="guide" d="M40 84 L56 104" /></P>
      <P k={["tuberculum", "os_costale"]} hl={hl}><circle cx="108" cy="64" r="10" /></P>
      <P k="sulcus" hl={hl} c="groove"><path d="M206 70 C296 108 352 174 332 236" /></P>
      <P k="cartilago" hl={hl} c="stroke cartS"><Strk d="M338 250 C336 270 352 280 388 282" w={18} /></P>
    </>
  ),
};

/* ---------------- 4. Ko'krak qafasi (old tomondan) ---------------- */
const ribData = (() => {
  const W = [58, 84, 104, 116, 124, 130, 132, 132, 128, 120, 104, 86];
  const A = [[46, 70], [60, 100], [70, 124], [76, 148], [80, 170], [84, 192], [88, 212], [98, 230], [106, 246], [112, 260], [116, 286], [98, 300]];
  const S = [[26, 60], [20, 90], [19, 112], [19, 134], [19, 156], [19, 178], [18, 206]];
  return W.map((w, i) => {
    const pY = 44 + i * 20;
    const [ax, ay] = A[i];
    return { i, w, pY, ax, ay, s: S[i] };
  });
})();
const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
// qovurg'aning orqa (xira) va old qismlari
const ribD = (r, sgn, t = .42) => {
  const p0 = [200 + sgn * 20, r.pY], p1 = [200 + sgn * r.w, r.pY - 14], p2 = [200 + sgn * (r.w + 6), r.ay + 6], p3 = [200 + sgn * r.ax, r.ay];
  const a = lerp(p0, p1, t), b = lerp(p1, p2, t), c = lerp(p2, p3, t), d = lerp(a, b, t), e = lerp(b, c, t), m = lerp(d, e, t);
  const f = (p) => p.map((v) => v.toFixed(1)).join(" ");
  return [`M${f(p0)} C${f(a)} ${f(d)} ${f(m)}`, `M${f(m)} C${f(e)} ${f(c)} ${f(p3)}`];
};
const cartD = (r, sgn) => {
  if (r.i < 7) {
    const [sx, sy] = r.s;
    return `M${200 + sgn * r.ax} ${r.ay} Q${200 + sgn * (sx + (r.ax - sx) * .45)} ${sy + (r.ay - sy) * .2 + 6} ${200 + sgn * sx} ${sy}`;
  }
  if (r.i < 10) {
    const p = ribData[r.i - 1];
    const tx = p.i < 7 ? (p.ax + p.s[0]) / 2 : p.ax - 6, ty = p.i < 7 ? (p.ay + p.s[1]) / 2 + 6 : p.ay + 4;
    return `M${200 + sgn * r.ax} ${r.ay} Q${200 + sgn * (tx + 10)} ${r.ay} ${200 + sgn * tx} ${ty}`;
  }
  return null;
};
const thorax = {
  title: "Ko‘krak qafasi (old tomondan)",
  viewBox: "0 0 400 340",
  anchors: {
    manubrium: [200, 70], corpus_sterni: [200, 150], xiphoid: [200, 228], inc_jug: [200, 42],
    inc_clav: [230, 50], ang_sterni: [182, 88], verae: [308, 150], spuriae: [312, 238],
    fluctuantes: [318, 290], cart: [258, 186], arcus: [148, 250], ang_infra: [200, 258],
    ap_sup: [150, 40], ap_inf: [200, 318], intercost: [98, 160],
  },
  Render: ({ hl }) => (
    <>
      <g className="ghost">{Array.from({ length: 13 }, (_, i) => <rect key={i} x="190" y={30 + i * 21} width="20" height="16" rx="3" />)}</g>
      {ribData.map((r) => {
        const k = r.i < 7 ? "verae" : r.i < 10 ? "spuriae" : "fluctuantes";
        return [-1, 1].map((sgn) => (
          <g key={`${r.i}${sgn}`}>
            <P k={[k, "costae"]} hl={hl} c="stroke back"><Strk d={ribD(r, sgn)[0]} w={r.i === 0 ? 8 : 7} /></P>
            <P k={[k, "costae"]} hl={hl} c="stroke"><Strk d={ribD(r, sgn)[1]} w={r.i === 0 ? 8 : 7} /></P>
            {cartD(r, sgn) && <P k="cart" hl={hl} c="stroke cartS"><Strk d={cartD(r, sgn)} w={6} /></P>}
          </g>
        ));
      })}
      <P k="arcus" hl={hl} c="edge">
        {[-1, 1].map((s) => <path key={s} d={`M${200 + s * 112} 264 Q${200 + s * 100} 250 ${200 + s * 92} 238 Q${200 + s * 60} 228 ${200 + s * 20} 212`} />)}
      </P>
      <P k={["manubrium", "sternum"]} hl={hl}><path d="M176 42 L190 40 Q200 50 210 40 L224 42 L228 58 L220 86 L180 86 L172 58 Z" /></P>
      <P k={["corpus_sterni", "sternum"]} hl={hl}><path d="M181 90 L219 90 L222 150 L218 208 L182 208 L178 150 Z" /></P>
      <P k={["xiphoid", "sternum"]} hl={hl}><path d="M190 211 L210 211 L206 236 L200 246 L194 236 Z" /></P>
      <P k="inc_jug" hl={hl} c="edge"><path d="M190 40 Q200 50 210 40" /></P>
      <P k="inc_clav" hl={hl} c="edge"><path d="M176 42 L172 56" /><path d="M224 42 L228 56" /></P>
      <P k="ang_sterni" hl={hl} c="edge"><path d="M178 88 L222 88" /></P>
    </>
  ),
};

/* ---------------- 5. To'sh suyagi ---------------- */
const notchYs = [72, 120, 162, 202, 242, 280, 312];
const sternum = {
  title: "To‘sh suyagi (old tomondan)",
  viewBox: "20 20 200 370",
  anchors: {
    manubrium: [120, 84], corpus_sterni: [120, 220], xiphoid: [120, 352], inc_jug: [120, 44],
    inc_clav: [162, 42], inc_cost: [180, 202], ang_sterni: [60, 120], sternum: [52, 240],
  },
  Render: ({ hl }) => (
    <>
      <P k={["manubrium", "sternum"]} hl={hl}><path d="M72 52 L96 40 Q120 62 144 40 L168 52 L176 70 L162 110 L150 118 L90 118 L78 110 L64 70 Z" /></P>
      <P k={["corpus_sterni", "sternum"]} hl={hl}><path d="M90 122 L150 122 L156 160 L160 210 L158 262 L150 298 L134 318 L106 318 L90 298 L82 262 L80 210 L84 160 Z" /></P>
      <P k={["xiphoid", "sternum"]} hl={hl}><path d="M108 322 L132 322 L128 356 L120 378 L112 356 Z" /></P>
      <P k="inc_jug" hl={hl} c="edge"><path d="M96 40 Q120 62 144 40" /></P>
      <P k="inc_clav" hl={hl} c="edge"><path d="M72 52 L96 40" /><path d="M144 40 L168 52" /></P>
      <P k="ang_sterni" hl={hl} c="edge"><path d="M86 120 L154 120" /></P>
      <P k="inc_cost" hl={hl} c="notch">
        {notchYs.map((y, i) => {
          const xr = i === 0 ? 172 : i === 1 ? 153 : i === 6 ? 142 : 158 - (i > 4 ? 4 : 0);
          return [<path key={`l${i}`} d={`M${240 - xr} ${y - 6} Q${240 - xr + 7} ${y} ${240 - xr} ${y + 6}`} />, <path key={`r${i}`} d={`M${xr} ${y - 6} Q${xr - 7} ${y} ${xr} ${y + 6}`} />];
        })}
      </P>
    </>
  ),
};

/* ---------------- 6. O'mrov suyagi ---------------- */
const clavicula = {
  title: "O‘mrov suyagi (yuqoridan, o‘ng)",
  viewBox: "0 0 420 150", ms: .8,
  anchors: { ext_st: [40, 88], corpus_clav: [200, 52], ext_acr: [372, 72], tub_con: [318, 104], clavicula: [190, 112] },
  Render: ({ hl }) => (
    <>
      <P k={["corpus_clav", "clavicula"]} hl={hl} c="stroke"><Strk d="M60 86 C120 70 150 44 220 58 C290 74 320 92 352 80" w={20} /></P>
      <P k={["ext_st", "clavicula"]} hl={hl}><ellipse cx="42" cy="90" rx="22" ry="24" /></P>
      <P k={["ext_acr", "clavicula"]} hl={hl}><ellipse cx="370" cy="74" rx="30" ry="15" transform="rotate(-18 370 74)" /></P>
      <P k="tub_con" hl={hl} c="bone facet"><ellipse cx="318" cy="92" rx="9" ry="6" /></P>
    </>
  ),
};

/* ---------------- 7. Kurak suyagi (orqadan) ---------------- */
const scapula = {
  title: "Kurak suyagi (orqa tomondan, o‘ng)",
  viewBox: "0 0 400 370",
  anchors: {
    supra: [170, 86], infra: [190, 210], spina: [196, 108], acromion: [330, 52], coracoid: [292, 30],
    glenoid: [312, 118], collum_sc: [274, 128], m_sup: [176, 50], m_med: [98, 220], m_lat: [238, 250],
    a_sup: [112, 44], a_inf: [150, 344], a_lat: [300, 92], inc_sc: [240, 88], scapula: [222, 300],
  },
  Render: ({ hl }) => (
    <>
      <P k={["coracoid", "scapula"]} hl={hl}><path d="M256 72 Q258 42 288 36 Q308 36 306 48 Q286 50 274 76 Z" /></P>
      <P k={["supra", "scapula"]} hl={hl}><path d="M120 50 L228 68 Q240 84 252 70 L272 74 L278 64 L104 126 Q104 88 120 50 Z" /></P>
      <P k={["infra", "scapula"]} hl={hl}><path d="M108 150 L286 82 L292 104 L286 132 Q256 222 168 340 Q150 348 142 332 Q112 232 108 150 Z" /></P>
      <P k={["collum_sc", "scapula"]} hl={hl}><path d="M272 88 L292 104 L286 132 L268 142 Q262 112 272 88 Z" /></P>
      <P k={["glenoid", "a_lat", "scapula"]} hl={hl} c="bone facet"><ellipse cx="296" cy="116" rx="11" ry="26" /></P>
      <P k={["spina", "scapula"]} hl={hl}><path d="M100 128 L278 62 L292 78 L108 152 Z" /></P>
      <P k={["acromion", "scapula"]} hl={hl}><path d="M274 58 Q298 30 340 36 Q360 46 348 66 Q318 82 290 80 Z" /></P>
      <P k="m_sup" hl={hl} c="edge"><path d="M120 50 L228 68" /></P>
      <P k="m_med" hl={hl} c="edge"><path d="M120 50 Q104 88 104 128 Q112 232 142 332" /></P>
      <P k="m_lat" hl={hl} c="edge"><path d="M286 132 Q256 222 168 340" /></P>
      <P k="inc_sc" hl={hl} c="edge"><path d="M228 68 Q240 84 252 70" /></P>
    </>
  ),
};

/* ---------------- 8. Qo'l panjasi (orqa tomondan, o'ng) ---------------- */
const handRays = [
  { f: "pollex", b: [112, 318], h: [74, 252], w: 20, ph: [46, 34] },
  { f: "index", b: [140, 314], h: [128, 198], w: 17, ph: [58, 36, 26] },
  { f: "medius", b: [168, 312], h: [170, 192], w: 17, ph: [64, 40, 27] },
  { f: "anularis", b: [196, 314], h: [208, 204], w: 16, ph: [60, 38, 26] },
  { f: "minimus", b: [222, 318], h: [246, 226], w: 15, ph: [48, 30, 23] },
];
const rowKeys = (n, j) => (n === 2 ? ["ph_prox", "ph_dist"][j] : ["ph_prox", "ph_med", "ph_dist"][j]);
const manus = {
  title: "Qo‘l panjasi suyaklari (orqa tomondan, o‘ng)",
  viewBox: "50 20 270 455", ms: 1.15,
  anchors: {
    scaph: [116, 384], lunat: [152, 380], triq: [190, 372], pisi: [216, 360], trapezium: [106, 346],
    trapezoid: [134, 340], capit: [166, 344], hamat: [200, 338], carpi: [166, 362], metacarpi: [170, 256], manus: [292, 300], digiti: [300, 140],
    ph_prox: [214, 170], ph_med: [172, 108], ph_dist: [174, 62], pollex: [58, 214], index: [118, 132],
    medius: [172, 140], anularis: [224, 150], minimus: [262, 176], radius: [134, 440], ulna: [214, 440],
    sty_rad: [96, 408], sty_uln: [236, 402],
  },
  Render: ({ hl }) => (
    <>
      <P k="radius" hl={hl}><path d="M104 470 L104 424 Q104 402 140 398 L172 400 L172 470 Z" /></P>
      <P k="sty_rad" hl={hl}><path d="M104 424 L94 408 Q98 398 112 400 Z" /></P>
      <P k="ulna" hl={hl}><path d="M190 470 L190 414 Q198 402 224 404 L230 470 Z" /></P>
      <P k="sty_uln" hl={hl}><path d="M222 404 L236 392 Q242 400 230 412 Z" /></P>
      <g>
        <P k={["scaph", "carpi", "manus"]} hl={hl}><path d="M100 380 Q98 364 116 362 L136 366 Q140 386 128 394 Q106 396 100 380 Z" /></P>
        <P k={["lunat", "carpi", "manus"]} hl={hl}><path d="M140 366 L170 364 Q176 380 166 394 L136 392 Q144 382 140 366 Z" /></P>
        <P k={["triq", "carpi", "manus"]} hl={hl}><path d="M174 362 L206 356 Q214 374 200 386 L170 390 Q180 378 174 362 Z" /></P>
        <P k={["pisi", "carpi", "manus"]} hl={hl}><circle cx="214" cy="366" r="9" /></P>
        <P k={["trapezium", "carpi", "manus"]} hl={hl}><path d="M92 340 Q96 324 116 326 L122 346 Q120 360 104 360 Q92 356 92 340 Z" /></P>
        <P k={["trapezoid", "carpi", "manus"]} hl={hl}><path d="M124 326 L146 324 L148 346 L140 360 L124 358 Z" /></P>
        <P k={["capit", "carpi", "manus"]} hl={hl}><path d="M150 322 L184 322 L184 346 Q178 362 162 362 Q148 358 150 344 Z" /></P>
        <P k={["hamat", "carpi", "manus"]} hl={hl}><path d="M188 322 L222 324 Q230 342 214 354 L190 358 Z" /></P>
      </g>
      {handRays.map((r) => (
        <g key={r.f}>
          <P k={["metacarpi", "manus"]} hl={hl}><Rod x1={r.b[0]} y1={r.b[1]} x2={r.h[0]} y2={r.h[1]} w={r.w} /></P>
          {chain(r.b[0], r.b[1], r.h[0], r.h[1], r.ph).map((s, j) => (
            <P key={j} k={[rowKeys(r.ph.length, j), r.f, "digiti", "manus"]} hl={hl}><Rod {...s} w={r.w - 2 - j * 1.5} /></P>
          ))}
        </g>
      ))}
    </>
  ),
};

/* ---------------- 9. Falanga (yaqindan) ---------------- */
const phalanx = {
  title: "Barmoq falangalari (yon tomondan)",
  viewBox: "0 0 420 130", ms: .75,
  anchors: { basis: [42, 64], corpus_ph: [110, 64], caput_ph: [180, 64], ph_prox: [110, 100], ph_med: [262, 98], ph_dist: [352, 96], tub_dist: [398, 64] },
  Render: ({ hl }) => (
    <>
      <P k={["ph_prox", "corpus_ph"]} hl={hl}><path d="M66 50 L160 52 L160 76 L66 78 Z" /></P>
      <P k={["ph_prox", "basis"]} hl={hl}><path d="M30 40 Q44 34 70 46 L70 82 Q44 94 30 88 Q24 64 30 40 Z" /></P>
      <P k={["ph_prox", "caput_ph"]} hl={hl}><path d="M156 48 Q186 40 196 64 Q186 88 156 80 Z" /></P>
      <P k="ph_med" hl={hl}><Rod x1={206} y1={64} x2={312} y2={64} w={34} /></P>
      <P k="ph_dist" hl={hl}><path d="M322 46 Q334 44 344 52 L378 56 L378 72 L344 76 Q334 84 322 82 Q316 64 322 46 Z" /></P>
      <P k={["ph_dist", "tub_dist"]} hl={hl}><path d="M376 52 Q404 46 406 64 Q404 82 376 76 Z" /></P>
    </>
  ),
};

/* ---------------- 10. Oyoq suyaklari (old tomondan, o'ng) ---------------- */
const crus = {
  title: "Son va boldir suyaklari (old tomondan, o‘ng)",
  viewBox: "50 20 210 670", ms: 1.6,
  anchors: {
    caput_fem: [108, 50], collum_fem: [140, 98], troch_maj: [190, 96], troch_min: [132, 152],
    corpus_fem: [162, 250], cond_med_f: [120, 400], cond_lat_f: [194, 400], patella: [156, 380],
    fovea_cap: [80, 80], cond_med_t: [124, 440], cond_lat_t: [186, 440], tub_tib: [158, 476],
    corpus_tib: [150, 560], mall_med: [138, 662], caput_fib: [220, 462], corpus_fib: [214, 560],
    mall_lat: [214, 672], femur: [200, 250], tibia: [110, 560], fibula: [236, 600],
  },
  Render: ({ hl }) => (
    <>
      <P k={["corpus_fib", "fibula"]} hl={hl}><path d="M199 470 L209 470 L207 642 L197 642 Z" /></P>
      <P k={["caput_fib", "fibula"]} hl={hl}><ellipse cx="206" cy="464" rx="12" ry="13" /></P>
      <P k={["mall_lat", "fibula"]} hl={hl}><path d="M195 636 L211 636 Q216 668 205 680 Q192 674 192 652 Z" /></P>
      <P k={["corpus_tib", "tibia"]} hl={hl}><path d="M128 456 L190 456 Q172 482 168 520 L162 642 L136 642 L140 520 Q138 482 128 456 Z" /></P>
      <P k={["mall_med", "tibia"]} hl={hl}><path d="M136 640 L162 640 Q164 662 150 670 Q128 678 124 656 Z" /></P>
      <P k={["cond_med_t", "tibia"]} hl={hl}><path d="M108 428 Q104 450 128 458 L156 460 L156 428 Z" /></P>
      <P k={["cond_lat_t", "tibia"]} hl={hl}><path d="M156 428 L200 428 Q208 448 188 458 L156 460 Z" /></P>
      <P k={["tub_tib", "tibia"]} hl={hl}><ellipse cx="158" cy="476" rx="11" ry="9" /></P>
      <P k={["corpus_fem", "femur"]} hl={hl}><path d="M150 108 L180 112 L174 372 L138 372 Z" /></P>
      <P k={["cond_med_f", "femur"]} hl={hl}><ellipse cx="132" cy="398" rx="27" ry="24" /></P>
      <P k={["cond_lat_f", "femur"]} hl={hl}><ellipse cx="182" cy="396" rx="27" ry="24" /></P>
      <P k={["troch_min", "femur"]} hl={hl}><ellipse cx="146" cy="152" rx="10" ry="13" /></P>
      <P k={["collum_fem", "femur"]} hl={hl}><path d="M110 58 L164 92 L172 128 L148 128 L100 86 Z" /></P>
      <P k={["troch_maj", "femur"]} hl={hl}><path d="M160 78 Q192 66 204 96 Q200 126 176 130 L162 110 Z" /></P>
      <P k={["caput_fem", "femur"]} hl={hl}><circle cx="100" cy="66" r="28" /></P>
      <P k="fovea_cap" hl={hl} c="hole"><ellipse cx="88" cy="72" rx="5" ry="4" /></P>
      <P k="patella" hl={hl}><path d="M136 364 Q156 350 176 364 Q180 390 158 412 Q134 392 136 364 Z" /></P>
    </>
  ),
};

/* ---------------- 11. Oyoq panjasi (yuqoridan, o'ng) ---------------- */
const footRays = [
  { f: "hallux", b: [124, 290], h: [112, 176], w: 24, ph: [36, 28] },
  { f: "d2", b: [150, 290], h: [148, 160], w: 15, ph: [28, 16, 14] },
  { f: "d3", b: [174, 292], h: [178, 168], w: 14, ph: [26, 15, 13] },
  { f: "d4", b: [198, 300], h: [206, 180], w: 13, ph: [24, 14, 12] },
  { f: "d5", b: [224, 318], h: [236, 196], w: 13, ph: [22, 12, 11] },
];
const pes = {
  title: "Oyoq panjasi suyaklari (yuqoridan, o‘ng)",
  viewBox: "60 80 220 440", ms: 1.25,
  anchors: {
    calcaneus: [212, 470], tuber_calc: [160, 510], talus: [152, 400], naviculare: [150, 334], cuboideum: [220, 336],
    cuneiformia: [150, 304], metatarsi: [178, 236], ph_pedis: [206, 140], hallux: [96, 142], tarsi: [230, 400],
  },
  Render: ({ hl }) => (
    <>
      <P k={["calcaneus", "tarsi"]} hl={hl}><path d="M118 450 Q112 494 150 508 Q200 514 214 490 L228 420 Q232 380 214 366 L196 372 L196 440 Q160 452 118 450 Z" /></P>
      <P k="tuber_calc" hl={hl} c="edge"><path d="M126 488 Q150 512 196 504" /></P>
      <P k={["talus", "tarsi"]} hl={hl}><path d="M116 448 Q104 410 118 380 Q124 356 150 350 L180 352 Q196 362 196 380 L196 440 Q160 452 116 448 Z" /></P>
      <P k={["naviculare", "tarsi"]} hl={hl}><path d="M112 344 Q120 322 150 318 Q184 320 190 342 Q170 352 150 350 Q126 352 112 344 Z" /></P>
      <P k={["cuboideum", "tarsi"]} hl={hl}><path d="M194 346 L200 318 L240 322 L238 364 L214 366 L196 372 Z" /></P>
      <P k={["cuneiformia", "tarsi"]} hl={hl}>
        <path d="M110 300 L138 298 L140 318 Q122 322 110 334 Z" />
        <path d="M142 298 L160 298 L162 318 L142 318 Z" />
        <path d="M164 298 L194 300 L196 316 L188 322 L164 318 Z" />
      </P>
      {footRays.map((r) => (
        <g key={r.f}>
          <P k="metatarsi" hl={hl}><Rod x1={r.b[0]} y1={r.b[1]} x2={r.h[0]} y2={r.h[1]} w={r.w} /></P>
          {chain(r.b[0], r.b[1], r.h[0], r.h[1], r.ph, 4).map((s, j) => (
            <P key={j} k={["ph_pedis", r.f]} hl={hl}><Rod {...s} w={r.w - 2 - j * 1.5} /></P>
          ))}
        </g>
      ))}
    </>
  ),
};

export const diagrams = { vertebra, columna, costa, thorax, sternum, clavicula, scapula, manus, phalanx, crus, pes };
