// Builds every animated SVG used in README.md.
// Edit CONFIG below, then run:  node assets/build.mjs

import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = dirname(fileURLToPath(import.meta.url));

const CONFIG = {
  name: "Jai Saini",
  greeting: "KHAMMA GHANI  ✦  I'M",
  roles: [
    "Full Stack Web Developer",
    "Building deploy-ready websites",
    "Learning Next.js + TypeScript",
    "Open to collabs & freelance",
  ],
  location: "SIKAR · RAJASTHAN · INDIA",
  status: "OPEN TO COLLABORATE",
  email: "jaisaini4a@gmail.com",
};

// Thar-desert dusk palette
const C = {
  ink: "#110c24",
  panel: "#17112f",
  well: "#0d091d",
  line: "#2c2350",
  saffron: "#ff9f1c",
  gold: "#ffd27a",
  rose: "#ff5e7e",
  pink: "#f15bb5",
  teal: "#2ee6c5",
  lilac: "#c9b6ff",
  text: "#f4ecff",
  muted: "#8b80b0",
  dim: "#4d4472",
  shadow: "#1a0a26",
};

const SANS = "'Segoe UI', 'Helvetica Neue', Helvetica, Arial, sans-serif";
const MONO = "'JetBrains Mono', 'Cascadia Code', 'Fira Code', Consolas, Menlo, 'DejaVu Sans Mono', monospace";

const BASE_CSS = `
  .sans{font-family:${SANS}}
  .mono{font-family:${MONO}}
  .tw{fill:#fff;animation:tw 4s ease-in-out infinite}
  @keyframes tw{0%,100%{opacity:.15}50%{opacity:1}}
  .blink{fill:${C.saffron};animation:blink 1s steps(1) infinite}
  @keyframes blink{50%{opacity:0}}
  .sp{fill:${C.gold};transform-box:fill-box;transform-origin:center;animation:sp 3.6s ease-in-out infinite}
  @keyframes sp{0%,100%{transform:scale(.35) rotate(0);opacity:.3}50%{transform:scale(1) rotate(45deg);opacity:1}}
  .shoot{opacity:0;animation:shoot 9s linear infinite}
  @keyframes shoot{0%{transform:translate(0,0);opacity:0}1%{opacity:1}9%{transform:translate(460px,160px);opacity:0}100%{transform:translate(460px,160px);opacity:0}}
  .ping{transform-box:fill-box;transform-origin:center;animation:ping 2s ease-out infinite}
  @keyframes ping{0%{transform:scale(1);opacity:.9}100%{transform:scale(3);opacity:0}}
`;

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const len = (s) => [...s].length;
const svg = (w, h, title, inner) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(title)}"><title>${esc(title)}</title>${inner}</svg>\n`;

// Deterministic randomness so rebuilds don't reshuffle the sky.
function rng(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function stars(seed, count, w, yMax) {
  const r = rng(seed);
  let out = "";
  for (let i = 0; i < count; i++) {
    const x = (r() * w).toFixed(1);
    const y = (6 + r() * yMax).toFixed(1);
    const size = (0.5 + r() * 1.3).toFixed(2);
    const dur = (2 + r() * 4).toFixed(2);
    const delay = (-r() * 6).toFixed(2);
    out += `<circle class="tw" cx="${x}" cy="${y}" r="${size}" style="animation-duration:${dur}s;animation-delay:${delay}s"/>`;
  }
  return out;
}

const SPARK = "M0,-7 L1.6,-1.6 L7,0 L1.6,1.6 L0,7 L-1.6,1.6 L-7,0 L-1.6,-1.6Z";
const sparkle = (x, y, s, delay) =>
  `<g transform="translate(${x} ${y}) scale(${s})"><path class="sp" d="${SPARK}" style="animation-delay:${delay}s"/></g>`;

function shootingStar(x, y, dur, delay) {
  return `<g transform="translate(${x} ${y})"><g class="shoot" style="animation-duration:${dur}s;animation-delay:${delay}s">
    <line x1="0" y1="0" x2="-120" y2="-42" stroke="url(#tail)" stroke-width="2" stroke-linecap="round"/>
    <circle r="2" fill="#fff"/></g></g>`;
}

// A little camel, feet at the origin, facing right. Legs swing while it walks.
function camel() {
  const leg = (x, flip) => {
    const a = flip ? [14, -14, 14] : [-14, 14, -14];
    return `<line x1="${x}" y1="-19" x2="${x}" y2="0"><animateTransform attributeName="transform" type="rotate" values="${a.map((d) => `${d} ${x} -19`).join(";")}" dur="0.9s" repeatCount="indefinite"/></line>`;
  };
  return `<g fill="${C.shadow}" stroke="${C.shadow}">
    <g stroke-width="3.2" stroke-linecap="round">${leg(-13, 0)}${leg(-8, 1)}${leg(10, 1)}${leg(15, 0)}</g>
    <path stroke="none" d="M-19,-24 C-17,-34 -8,-42 -1,-40 C6,-38 10,-30 15,-28 C20,-28 22,-36 25,-42 L31,-44 C35,-44 36,-41 33,-39 L28,-38 C26,-32 24,-24 18,-20 C10,-16 -12,-16 -18,-20 C-20,-21 -20,-23 -19,-24Z"/>
    <path stroke="none" d="M28,-43 L28.5,-47.5 L31,-44Z"/>
    <line x1="-19" y1="-24" x2="-23" y2="-14" stroke-width="1.6" stroke-linecap="round"/>
    <path stroke="none" fill="${C.pink}" d="M-10,-35 C-6,-41.5 2,-41.5 5,-36 L3.5,-29.5 L-8,-29.5Z"/>
    <path fill="none" stroke="${C.saffron}" stroke-width="1.3" stroke-linecap="round" d="M-7,-29.5 V-26 M-2.2,-29.5 V-25.5 M2.6,-29.5 V-26"/>
  </g>`;
}

function caravan(ridge, dur, offsets, scale = 1) {
  return offsets
    .map(
      (o) =>
        `<g><animateMotion dur="${dur}s" begin="-${o}s" repeatCount="indefinite" rotate="auto" path="${ridge}"/><g transform="scale(${scale})">${camel()}</g></g>`,
    )
    .join("");
}

// Typewriter that cycles through phrases. Each phrase is centered, typed, held, then erased.
// textLength pins every glyph to a fixed grid so the clip steps land exactly between characters.
function typer({ phrases, cx, y, cw, fs, slot, id, cls }) {
  const T = slot * phrases.length;
  let defs = "";
  let body = "";
  phrases.forEach((p, i) => {
    const n = len(p);
    const x0 = +(cx - (n * cw) / 2).toFixed(1);
    const typeStart = 0.2;
    const typeStep = 0.055;
    const eraseStep = 0.022;
    const frames = [[0, 0]];
    for (let k = 1; k <= n; k++) frames.push([typeStart + k * typeStep, k]);
    const eraseStart = slot - 0.25 - n * eraseStep;
    for (let k = n - 1; k >= 0; k--) frames.push([eraseStart + (n - k) * eraseStep, k]);
    const keyTimes = frames.map(([t]) => (t / T).toFixed(5)).join(";");
    const widths = frames.map(([, k]) => (k * cw).toFixed(1)).join(";");
    const xs = frames.map(([, k]) => (x0 + k * cw + 2).toFixed(1)).join(";");
    const timing = `dur="${T}s" begin="${i * slot}s" repeatCount="indefinite" calcMode="discrete"`;
    defs += `<clipPath id="${id}${i}"><rect x="${x0}" y="${y - fs}" height="${fs * 1.5}" width="0"><animate attributeName="width" values="${widths}" keyTimes="${keyTimes}" ${timing}/></rect></clipPath>`;
    body += `<text class="${cls}" x="${x0}" y="${y}" textLength="${(n * cw).toFixed(1)}" lengthAdjust="spacing" clip-path="url(#${id}${i})">${esc(p)}</text>`;
    body += `<g opacity="0"><animate attributeName="opacity" values="1;0" keyTimes="0;${(slot / T).toFixed(5)}" ${timing}/>`;
    body += `<rect class="blink" x="${x0 + 2}" y="${y - fs * 0.8}" width="${(cw * 0.55).toFixed(1)}" height="${fs}"><animate attributeName="x" values="${xs}" keyTimes="${keyTimes}" ${timing}/></rect></g>`;
  });
  return { defs, body };
}

function shimmerGradient(id) {
  return `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1600" y2="0" spreadMethod="repeat">
    <stop offset="0" stop-color="#fff6ea"/><stop offset=".38" stop-color="#fff6ea"/>
    <stop offset=".46" stop-color="${C.gold}"/><stop offset=".5" stop-color="${C.saffron}"/><stop offset=".54" stop-color="${C.pink}"/>
    <stop offset=".62" stop-color="#fff6ea"/><stop offset="1" stop-color="#fff6ea"/>
    <animateTransform attributeName="gradientTransform" type="translate" from="-1600 0" to="0 0" dur="6s" repeatCount="indefinite"/>
  </linearGradient>`;
}

const PIN = "M0,-14 C-5.5,-14 -9,-10 -9,-5.5 C-9,1 0,9 0,9 C0,9 9,1 9,-5.5 C9,-10 5.5,-14 0,-14Z M0,-9 A3.4,3.4 0 1 0 0.01,-9Z";

function header() {
  const W = 1200;
  const H = 420;
  const ridge =
    "M-150,322 C0,300 150,288 300,300 C420,310 520,318 600,312 C700,304 780,294 900,302 C1020,310 1100,320 1200,304 C1260,296 1310,300 1350,306";
  const roles = typer({
    phrases: CONFIG.roles,
    cx: 600,
    y: 222,
    cw: 15,
    fs: 25,
    slot: 4.5,
    id: "role",
    cls: "mono role",
  });
  const locW = len(CONFIG.location) * 10.5;
  const statW = len(CONFIG.status) * 10.5;
  const statX = W - 40 - statW;

  return svg(
    W,
    H,
    `${CONFIG.name} — ${CONFIG.roles[0]} from Sikar, Rajasthan`,
    `<style>${BASE_CSS}
      .role{font-size:25px;fill:${C.gold}}
      .glow{animation:glow 6s ease-in-out infinite}
      @keyframes glow{0%,100%{opacity:.7}50%{opacity:1}}
      .caps{font-size:14px;font-weight:600}
    </style>
    <defs>
      <clipPath id="frame"><rect width="${W}" height="${H}" rx="22"/></clipPath>
      <linearGradient id="sky" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="330">
        <stop offset="0" stop-color="#07051a"/><stop offset=".35" stop-color="#1a0f3d"/><stop offset=".62" stop-color="#4a1a5c"/>
        <stop offset=".82" stop-color="#a8346b"/><stop offset=".95" stop-color="#f0625a"/><stop offset="1" stop-color="#ff9a4a"/>
      </linearGradient>
      <radialGradient id="halo"><stop offset="0" stop-color="${C.saffron}" stop-opacity=".55"/><stop offset=".5" stop-color="${C.rose}" stop-opacity=".16"/><stop offset="1" stop-color="${C.rose}" stop-opacity="0"/></radialGradient>
      <linearGradient id="sun" gradientUnits="userSpaceOnUse" x1="0" y1="245" x2="0" y2="318">
        <stop offset="0" stop-color="#ffeaa8"/><stop offset=".55" stop-color="${C.saffron}"/><stop offset="1" stop-color="${C.rose}"/>
      </linearGradient>
      <mask id="sunCut"><rect width="${W}" height="${H}" fill="#fff"/>
        <rect y="274" width="${W}" height="2.5"/><rect y="285" width="${W}" height="3.5"/><rect y="297" width="${W}" height="4.5"/><rect y="310" width="${W}" height="6"/>
      </mask>
      <linearGradient id="far" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6b2a6e"/><stop offset="1" stop-color="#2a1040"/></linearGradient>
      <linearGradient id="mid" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#34134a"/><stop offset="1" stop-color="#1a0a2a"/></linearGradient>
      <linearGradient id="tail" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="-120" y2="-42"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
      ${shimmerGradient("nameFill")}
      <filter id="blur" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="12"/></filter>
      ${roles.defs}
    </defs>
    <g clip-path="url(#frame)">
      <rect width="${W}" height="${H}" fill="url(#sky)"/>
      ${stars(7, 70, W, 230)}
      ${sparkle(140, 70, 1, 0)}${sparkle(1060, 54, 0.8, -1.4)}${sparkle(980, 170, 0.6, -2.3)}${sparkle(230, 190, 0.7, -0.8)}
      ${shootingStar(150, 30, 9, 1.5)}${shootingStar(760, 20, 13, 6)}
      <circle class="glow" cx="600" cy="320" r="270" fill="url(#halo)"/>
      <circle cx="600" cy="355" r="110" fill="url(#sun)" mask="url(#sunCut)"/>
      <path d="${ridge} L1350,${H} L-150,${H}Z" fill="url(#far)"/>
      <path d="${ridge}" fill="none" stroke="${C.saffron}" stroke-opacity=".55" stroke-width="1.5"/>
      ${caravan(ridge, 80, [0, 2.8, 5.6])}
      <path d="M-10,352 C150,330 300,338 450,352 C600,366 760,334 900,340 C1040,346 1120,362 1210,350 L1210,${H} L-10,${H}Z" fill="url(#mid)"/>
      <path d="M-10,352 C150,330 300,338 450,352 C600,366 760,334 900,340 C1040,346 1120,362 1210,350" fill="none" stroke="${C.pink}" stroke-opacity=".28" stroke-width="1.2"/>
      <path d="M-10,392 C180,372 380,384 560,396 C760,408 920,378 1210,386 L1210,${H} L-10,${H}Z" fill="#120720"/>

      <text class="sans caps" x="600" y="82" text-anchor="middle" letter-spacing="7" fill="${C.saffron}">${esc(CONFIG.greeting)}</text>
      <text class="sans" x="600" y="170" text-anchor="middle" font-size="100" font-weight="800" fill="${C.saffron}" opacity=".45" filter="url(#blur)">${esc(CONFIG.name)}</text>
      <text class="sans" x="600" y="170" text-anchor="middle" font-size="100" font-weight="800" letter-spacing="2" fill="url(#nameFill)">${esc(CONFIG.name)}</text>
      ${roles.body}

      <g transform="translate(46 404)"><path d="${PIN}" fill="${C.pink}" fill-rule="evenodd" transform="scale(.9)"/></g>
      <text class="sans caps" x="64" y="409" fill="${C.lilac}" textLength="${locW}" lengthAdjust="spacing">${esc(CONFIG.location)}</text>
      <circle cx="${statX - 16}" cy="404" r="5" fill="${C.teal}"/>
      <circle class="ping" cx="${statX - 16}" cy="404" r="5" fill="none" stroke="${C.teal}" stroke-width="1.5"/>
      <text class="sans caps" x="${statX}" y="409" fill="${C.text}" textLength="${statW}" lengthAdjust="spacing">${esc(CONFIG.status)}</text>
    </g>`,
  );
}

function about() {
  const W = 1200;
  const H = 800;
  const X = 104;
  const Y0 = 112;
  const LH = 34;
  const CW = 12.6; // monospace advance at 21px

  const S = (t) => ["s", `"${t}"`];
  const P = (t) => ["p", t];
  const arr = (...xs) => [P("["), ...xs.flatMap((x, i) => (i ? [P(", "), S(x)] : [S(x)])), P("]")];
  const prop = (key, ...val) => [["key", "  " + key], P(":" + " ".repeat(9 - key.length)), ...val, P(",")];

  const code = [
    [["c", `// about-me.ts — Khamma Ghani! (that's "hello" in Rajasthani)`]],
    [],
    [["k", "const "], ["v", "jai"], P(": "), ["t", "Developer"], P(" = {")],
    prop("role", S("Full Stack Web Developer")),
    prop("basedIn", S("Sikar, Rajasthan, India")),
    prop("shipping", S("Fully functional, deploy-ready websites")),
    prop("learning", ...arr("Next.js", "TypeScript")),
    prop("stack", ...arr("React", "Node.js", "Express", "MongoDB", "Tailwind")),
    prop("openTo", ...arr("collabs", "freelance", "wild ideas")),
    prop("pingMe", S(CONFIG.email)),
    [P("};")],
    [],
    [["k", "export default "], ["v", "jai"], P(";"), ["c", "  // ship it"]],
  ];
  const HOT = 6; // "learning" line gets the active-line highlight

  let lines = "";
  let mini = "";
  code.forEach((tokens, i) => {
    const y = Y0 + i * LH;
    const d = (0.3 + i * 0.14).toFixed(2);
    lines += `<text class="mono num ln" x="72" y="${y}" text-anchor="end" style="animation-delay:${d}s"${i === HOT ? ` fill="${C.text}"` : ""}>${i + 1}</text>`;
    if (!tokens.length) return;
    lines += `<text class="mono code ln" x="${X}" y="${y}" xml:space="preserve" style="animation-delay:${d}s">${tokens
      .map(([cls, t]) => `<tspan class="${cls}">${esc(t)}</tspan>`)
      .join("")}</text>`;
    let col = 0;
    for (const [cls, t] of tokens) {
      const lead = t.length - t.trimStart().length;
      const body = t.trim().length;
      if (body) mini += `<rect class="${cls}" x="${(1104 + (col + lead) * 1.1).toFixed(1)}" y="${80 + i * 7}" width="${(body * 1.1).toFixed(1)}" height="3" rx="1"/>`;
      col += t.length;
    }
  });

  const hotY = Y0 + HOT * LH;
  const cmd = "npm run deploy";
  const cmdX = X + 8 * CW;
  const typeAt = 2.7;
  const step = 0.07;
  const kt = [0];
  const widths = [0];
  const cxs = [cmdX + 2];
  for (let k = 1; k <= cmd.length; k++) {
    kt.push(k / cmd.length);
    widths.push(+(k * CW).toFixed(1));
    cxs.push(+(cmdX + k * CW + 2).toFixed(1));
  }
  const typeDur = (cmd.length * step).toFixed(2);
  const ty = [636, 670, 704, 738];
  const prompt = (y, cls, delay) =>
    `<text class="mono code ${cls}" x="${X}" y="${y}" xml:space="preserve" textLength="${7 * CW}" lengthAdjust="spacing" style="animation-delay:${delay}s"><tspan class="t">~/jai</tspan> <tspan class="k">❯</tspan></text>`;

  return svg(
    W,
    H,
    `about-me.ts: ${CONFIG.roles[0]} based in Sikar, Rajasthan. Shipping fully functional, deploy-ready websites; learning Next.js and TypeScript; open to collaborations. Email ${CONFIG.email}`,
    `<style>${BASE_CSS}
      .code{font-size:21px}
      .num{font-size:17px;fill:${C.dim}}
      .ln{opacity:0;animation:in .55s ease-out forwards}
      @keyframes in{from{opacity:0;transform:translateX(-14px)}to{opacity:1;transform:none}}
      .pop{opacity:0;animation:pop .35s ease-out forwards}
      @keyframes pop{to{opacity:1}}
      .c{fill:#6b5f8f;font-style:italic}.k{fill:${C.pink}}.v{fill:${C.saffron}}.t{fill:${C.teal}}
      .p{fill:${C.muted}}.key{fill:${C.lilac}}.s{fill:${C.gold}}.o{fill:${C.text}}.m{fill:${C.muted}}
      rect.c,rect.k,rect.v,rect.t,rect.p,rect.key,rect.s{opacity:.55}
      .tab{font-size:15px}.ui{font-size:12px;font-weight:600;letter-spacing:1.5px}
      .bar{font-size:13px;font-weight:600;fill:${C.shadow}}
    </style>
    <defs>
      <clipPath id="win"><rect width="${W}" height="${H}" rx="18"/></clipPath>
      <clipPath id="cmd"><rect x="${cmdX}" y="${ty[0] - 21}" height="32" width="0">
        <animate attributeName="width" values="${widths.join(";")}" keyTimes="${kt.map((k) => k.toFixed(4)).join(";")}" calcMode="discrete" begin="${typeAt}s" dur="${typeDur}s" fill="freeze"/></rect></clipPath>
    </defs>
    <g clip-path="url(#win)">
      <rect width="${W}" height="${H}" fill="${C.ink}"/>
      <rect width="${W}" height="52" fill="${C.panel}"/>
      <circle cx="32" cy="26" r="7" fill="#ff5f57"/><circle cx="56" cy="26" r="7" fill="#febc2e"/><circle cx="80" cy="26" r="7" fill="#28c840"/>
      <rect x="112" y="0" width="196" height="52" fill="${C.ink}"/><rect x="112" y="0" width="196" height="2.5" fill="${C.saffron}"/>
      <rect x="128" y="18" width="24" height="17" rx="3" fill="#3178c6"/>
      <text class="sans" x="140" y="31" text-anchor="middle" font-size="10.5" font-weight="700" fill="#fff">TS</text>
      <text class="sans tab" x="162" y="32" fill="${C.text}">about-me.ts</text>
      <text class="sans" x="288" y="32" font-size="15" fill="${C.muted}">×</text>
      <text class="mono" x="330" y="32" font-size="14" fill="${C.teal}">$</text>
      <text class="sans tab" x="346" y="32" fill="${C.muted}">deploy.sh</text>
      <text class="sans" x="1176" y="32" text-anchor="end" font-size="13" fill="${C.dim}">jai-sainii  ›  portfolio  ›  src</text>

      <rect x="0" y="${hotY - 24}" width="1090" height="${LH}" fill="#fff" fill-opacity=".035"/>
      <rect x="84" y="${hotY - 22}" width="3" height="${LH - 4}" rx="1.5" fill="${C.teal}"/>
      ${lines}
      <rect x="1096" y="72" width="96" height="${code.length * 7 + 14}" rx="3" fill="#fff" fill-opacity=".03"/>
      ${mini}

      <rect y="560" width="${W}" height="204" fill="${C.well}"/>
      <line x1="0" x2="${W}" y1="560.5" y2="560.5" stroke="${C.line}"/>
      <text class="sans ui" x="${X}" y="592" fill="${C.dim}">PROBLEMS</text>
      <text class="sans ui" x="${X + 112}" y="592" fill="${C.dim}">OUTPUT</text>
      <text class="sans ui" x="${X + 206}" y="592" fill="${C.text}">TERMINAL</text>
      <rect x="${X + 206}" y="602" width="78" height="2" fill="${C.saffron}"/>

      ${prompt(ty[0], "pop", 2.3)}
      <text class="mono code o" x="${cmdX}" y="${ty[0]}" textLength="${(cmd.length * CW).toFixed(1)}" lengthAdjust="spacing" clip-path="url(#cmd)">${cmd}</text>
      <rect class="blink" x="${cmdX + 2}" y="${ty[0] - 17}" width="7" height="21" opacity="0">
        <set attributeName="opacity" to="1" begin="2.3s" dur="${(typeAt - 2.3 + +typeDur + 0.5).toFixed(2)}s"/>
        <animate attributeName="x" values="${cxs.join(";")}" keyTimes="${kt.map((k) => k.toFixed(4)).join(";")}" calcMode="discrete" begin="${typeAt}s" dur="${typeDur}s" fill="freeze"/>
      </rect>
      <text class="mono code pop" x="${X}" y="${ty[1]}" xml:space="preserve" style="animation-delay:4.1s"><tspan class="v">  ▲</tspan><tspan class="m"> Compiled successfully in 1.4s</tspan></text>
      <text class="mono code pop" x="${X}" y="${ty[2]}" xml:space="preserve" style="animation-delay:4.7s"><tspan class="t">  ✓</tspan><tspan class="o"> Deployed to production </tspan><tspan class="k">→</tspan><tspan class="o"> let's build something together</tspan></text>
      ${prompt(ty[3], "pop", 5.3)}
      <g class="pop" style="animation-delay:5.3s"><rect class="blink" x="${cmdX + 2}" y="${ty[3] - 17}" width="11" height="21"/></g>

      <rect y="764" width="${W}" height="36" fill="${C.saffron}"/>
      <text class="sans bar" x="22" y="787" xml:space="preserve">✓ main     0 problems     ● open to work</text>
      <text class="sans bar" x="1178" y="787" text-anchor="end" xml:space="preserve">TypeScript     UTF-8     Ln 13, Col 29     Sikar, IN</text>
    </g>
    <rect x=".75" y=".75" width="${W - 1.5}" height="${H - 1.5}" rx="18" fill="none" stroke="${C.line}" stroke-width="1.5"/>`,
  );
}

function footer() {
  const W = 1200;
  const H = 300;
  const ridge =
    "M-150,252 C0,234 200,226 360,238 C500,248 620,254 760,242 C900,230 1050,226 1200,240 C1260,246 1310,248 1350,246";
  const mail = `→ ${CONFIG.email}`;
  const mailW = len(mail) * 13.2;
  return svg(
    W,
    H,
    `Got an idea? Let's build it. ${CONFIG.email}`,
    `<style>${BASE_CSS}
      .draw{stroke-dasharray:${mailW};stroke-dashoffset:${mailW};animation:draw 1.6s .6s ease-out forwards}
      @keyframes draw{to{stroke-dashoffset:0}}
    </style>
    <defs>
      <clipPath id="frame"><rect width="${W}" height="${H}" rx="22"/></clipPath>
      <linearGradient id="sky" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="250">
        <stop offset="0" stop-color="#05041a"/><stop offset=".6" stop-color="#160c35"/><stop offset=".86" stop-color="#3d1650"/><stop offset="1" stop-color="#7a2560"/>
      </linearGradient>
      <radialGradient id="moonGlow"><stop offset="0" stop-color="#fff1d6" stop-opacity=".35"/><stop offset="1" stop-color="#fff1d6" stop-opacity="0"/></radialGradient>
      <mask id="crescent"><rect width="${W}" height="${H}" fill="#fff"/><circle cx="1058" cy="62" r="25"/></mask>
      <linearGradient id="tail" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="-120" y2="-42"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
      ${shimmerGradient("ctaFill")}
    </defs>
    <g clip-path="url(#frame)">
      <rect width="${W}" height="${H}" fill="url(#sky)"/>
      ${stars(42, 80, W, 200)}
      ${sparkle(180, 120, 0.8, -0.5)}${sparkle(880, 200, 0.6, -2)}
      ${shootingStar(260, 24, 11, 3)}
      <circle cx="1042" cy="72" r="80" fill="url(#moonGlow)"/>
      <circle cx="1042" cy="72" r="28" fill="#fff1d6" mask="url(#crescent)"/>
      <path d="${ridge} L1350,${H} L-150,${H}Z" fill="#1d0b30"/>
      <path d="${ridge}" fill="none" stroke="${C.pink}" stroke-opacity=".35" stroke-width="1.3"/>
      ${caravan(ridge, 95, [0, 2.9])}
      <path d="M-10,282 C200,262 420,276 600,284 C800,292 980,268 1210,276 L1210,${H} L-10,${H}Z" fill="#0e0619"/>

      <text class="sans" x="600" y="64" text-anchor="middle" font-size="14" font-weight="600" letter-spacing="6" fill="${C.saffron}">PADHARO MHARE DES  ✦  THANKS FOR STOPPING BY</text>
      <text class="sans" x="600" y="128" text-anchor="middle" font-size="50" font-weight="800" fill="url(#ctaFill)">Got an idea? Let's build it.</text>
      <text class="mono" x="600" y="180" text-anchor="middle" font-size="22" fill="${C.gold}" textLength="${mailW}" lengthAdjust="spacing">${esc(mail)}</text>
      <line class="draw" x1="${600 - mailW / 2}" x2="${600 + mailW / 2}" y1="192" y2="192" stroke="${C.pink}" stroke-width="2" stroke-linecap="round"/>
    </g>`,
  );
}

function sectionTitle(text, sub) {
  const W = 1200;
  const n = len(text);
  const tw = n * 30;
  const half = tw / 2;
  const gap = 34;
  const lineW = 250;
  return svg(
    W,
    110,
    text,
    `<style>${BASE_CSS}
      .grow{transform-box:fill-box;animation:grow 1.2s ease-out both}
      .gl{transform-origin:right}.gr{transform-origin:left}
      @keyframes grow{from{transform:scaleX(0)}to{transform:scaleX(1)}}
    </style>
    <defs>
      <linearGradient id="g" gradientUnits="userSpaceOnUse" x1="${600 - half}" y1="0" x2="${600 + half}" y2="0">
        <stop offset="0" stop-color="${C.saffron}"/><stop offset=".5" stop-color="${C.rose}"/><stop offset="1" stop-color="${C.pink}"/>
      </linearGradient>
      <linearGradient id="l" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${C.saffron}" stop-opacity="0"/><stop offset="1" stop-color="${C.saffron}"/></linearGradient>
      <linearGradient id="r" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${C.pink}"/><stop offset="1" stop-color="${C.pink}" stop-opacity="0"/></linearGradient>
    </defs>
    <text class="mono" x="600" y="30" text-anchor="middle" font-size="16" fill="${C.muted}">${esc(sub)}</text>
    <text class="sans" x="600" y="82" text-anchor="middle" font-size="34" font-weight="800" fill="url(#g)" textLength="${tw}" lengthAdjust="spacing">${esc(text)}</text>
    <rect class="grow gl" x="${600 - half - gap - lineW}" y="69" width="${lineW}" height="2" fill="url(#l)"/>
    <rect class="grow gr" x="${600 + half + gap}" y="69" width="${lineW}" height="2" fill="url(#r)"/>
    ${sparkle(600 - half - gap + 12, 70, 0.9, 0)}${sparkle(600 + half + gap - 12, 70, 0.9, -1.8)}`,
  );
}

const files = {
  "header.svg": header(),
  "about.svg": about(),
  "footer.svg": footer(),
  "title-stack.svg": sectionTitle("TECH STACK", "// tools i build with"),
  "title-stats.svg": sectionTitle("GITHUB STATS", "// commits, streaks & languages"),
  "title-snake.svg": sectionTitle("CONTRIBUTIONS", "// a snake that eats my commits"),
};

for (const [name, content] of Object.entries(files)) {
  writeFileSync(join(OUT, name), content);
  console.log(`wrote assets/${name} (${(content.length / 1024).toFixed(1)} KB)`);
}
