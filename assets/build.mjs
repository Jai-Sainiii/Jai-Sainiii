// Builds every SVG used in README.md, once per theme, into assets/dark and assets/light.
// Edit CONFIG below, then run:  node assets/build.mjs
//
// All motion is CSS inside the SVG (GitHub shows SVGs through <img>, so no scripts and no web fonts).
// Every animation has a sensible resting state and stops under prefers-reduced-motion.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = dirname(fileURLToPath(import.meta.url));

const CONFIG = {
  name: "Jai Saini",
  role: "Full-stack web developer",
  status: "Available for freelance and collabs",
  typed: [
    "building deploy-ready websites",
    "learning Next.js and TypeScript",
    "shipping with React, Node and MongoDB",
  ],
  // Each line is a list of parts; a part wrapped in an array is drawn in the accent colour.
  about: [["Full-stack developer building fully"], ["functional, ", ["deploy-ready"], " websites."]],
  pipeline: ["commit", "build", "deploy", "live"],
  learning: ["Next.js", "TypeScript"],
  openTo: ["Freelance projects", "Collaborations", "Wild ideas"],
  flow: [
    ["React", "client"],
    ["Node + Express", "server"],
    ["MongoDB", "database"],
  ],
  // [name, dot colour]. null = use the theme's text colour (brands that are black or white).
  stack: [
    ["Languages", [["JavaScript", "#f1e05a"], ["TypeScript", "#3178c6"], ["Python", "#3572a5"], ["Java", "#b07219"], ["C", "#6e7681"], ["C++", "#f34b7d"]]],
    ["Frontend", [["HTML", "#e34c26"], ["CSS", "#663399"], ["React", "#58c4dc"], ["Next.js", null], ["Tailwind CSS", "#38bdf8"], ["Bootstrap", "#7952b3"], ["Vite", "#646cff"], ["React Router", "#f44250"]]],
    ["Backend", [["Node.js", "#5fa04e"], ["Express", null], ["MongoDB", "#47a248"], ["Firebase", "#ffa000"], ["JWT", "#d63aff"]]],
    ["Tools", [["Git", "#f05032"], ["GitHub", null], ["Vercel", null], ["Netlify", "#00c7b7"], ["Postman", "#ff6c37"], ["npm", "#cb3837"], ["Nodemon", "#76d04b"], ["Canva", "#00c4cc"]]],
  ],
  headings: { stack: "Stack", activity: "Activity", contributions: "Contributions" },
  cta: "Got an idea? Let's build it.",
  ctaLabel: "Get in touch",
  email: "jaisaini4a@gmail.com",
  links: [
    ["contact", "Get in touch", "primary", "right"],
    ["linkedin", "LinkedIn", "secondary", "out"],
    ["repos", "Repositories", "secondary", "out"],
  ],
};

// GitHub Primer neutrals so the cards sit natively on github.com, plus a green-to-teal accent pair.
const THEMES = {
  dark: {
    surface: "#0d1117",
    deep: "#010409",
    raised: "#151b23",
    border: "#30363d",
    fg: "#f0f6fc",
    muted: "#9198a1",
    dim: "#656c76",
    accent: "#3fb950",
    accent2: "#2dd4bf",
    button: "#238636",
    onButton: "#ffffff",
    glow: 0.26,
    // isometric bars: crest colour runs crestA to crestB across the field; faces are mixed toward `shade`
    crestA: "#56d364",
    crestB: "#2dd4bf",
    shade: "#010409",
    faces: [0.58, 0.64, 0.8], // top (resting), left, right
  },
  light: {
    surface: "#f6f8fa",
    deep: "#ffffff",
    raised: "#ffffff",
    border: "#d1d9e0",
    fg: "#1f2328",
    muted: "#59636e",
    dim: "#818b98",
    accent: "#1a7f37",
    accent2: "#0e7c86",
    button: "#1f883d",
    onButton: "#ffffff",
    glow: 0.16,
    crestA: "#2da44e",
    crestB: "#1b9aaa",
    shade: "#ffffff",
    faces: [0.62, 0.3, 0.08],
  },
};

// GitHub's own font stacks.
const SANS = "-apple-system,BlinkMacSystemFont,'Segoe UI','Noto Sans',Helvetica,Arial,sans-serif";
const MONO = "ui-monospace,SFMono-Regular,'SF Mono',Menlo,Consolas,'Liberation Mono',monospace";

const W = 880; // matches the README column, so 1 unit is about 1px on desktop
const R = 14; // card radius. Pills, chips and buttons are fully rounded.
const EASE = "cubic-bezier(.16,1,.3,1)";

const BASE_CSS = `.s{font-family:${SANS}}.m{font-family:${MONO}}.fb{transform-box:fill-box}`;
const REDUCED = `@media (prefers-reduced-motion:reduce){*{animation:none!important}.bm{display:none}}`;

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const len = (s) => [...s].length;
const n = (v) => +v.toFixed(2);
const pct = (v) => n(v) + "%";

const svg = (w, h, title, inner) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(title)}"><title>${esc(title)}</title>${inner}</svg>\n`;

const card = (t, x, y, w, h, fill = t.surface, stroke = t.border) =>
  `<rect x="${x + 0.5}" y="${y + 0.5}" width="${w - 1}" height="${h - 1}" rx="${R}" fill="${fill}" stroke="${stroke}"/>`;

// Monospace text pinned to an exact width, so layout does not depend on which mono font the viewer has.
const mono = (x, y, str, size, attrs = "") =>
  `<text class="m" x="${n(x)}" y="${n(y)}" font-size="${size}" textLength="${n(len(str) * size * 0.6)}" lengthAdjust="spacing" ${attrs}>${esc(str)}</text>`;
const monoW = (str, size) => len(str) * size * 0.6;

function mix(a, b, k) {
  const p = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
  const [x, y] = [p(a), p(b)];
  return "#" + x.map((v, i) => Math.round(v + (y[i] - v) * k).toString(16).padStart(2, "0")).join("");
}

function cubicLength([x0, y0, x1, y1, x2, y2, x3, y3]) {
  let L = 0;
  let px = x0;
  let py = y0;
  for (let i = 1; i <= 200; i++) {
    const u = i / 200;
    const v = 1 - u;
    const x = v ** 3 * x0 + 3 * v * v * u * x1 + 3 * v * u * u * x2 + u ** 3 * x3;
    const y = v ** 3 * y0 + 3 * v * v * u * y1 + 3 * v * u * u * y2 + u ** 3 * y3;
    L += Math.hypot(x - px, y - py);
    px = x;
    py = y;
  }
  return L;
}

const arrow = (x, y, kind, color, sw = 1.8) =>
  kind === "out"
    ? `<path d="M${x},${y + 4.5} L${x + 9},${y - 4.5} M${x + 2},${y - 4.5} H${x + 9} V${y + 2.5}" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>`
    : `<path d="M${x},${y} H${x + 11} M${x + 6.5},${y - 4.5} L${x + 11},${y} L${x + 6.5},${y + 4.5}" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>`;

// A light that runs around a card's border, with a fading tail.
function beam(t, w, h, { id = "bm", dur = 9, color = t.accent2 } = {}) {
  const P = 2 * (w - 1 + h - 1 - 4 * R) + 2 * Math.PI * R;
  const layers = [
    [190, 0.16, 2.5],
    [110, 0.4, 2],
    [44, 1, 1.5],
  ];
  let css = "";
  let body = "";
  layers.forEach(([L, o, sw], i) => {
    css += `.${id}${i}{stroke-dasharray:${L} ${n(P - L)};stroke-dashoffset:${L};animation:${id}${i} ${dur}s linear infinite}@keyframes ${id}${i}{to{stroke-dashoffset:${n(L - P)}}}`;
    body += `<rect class="bm ${id}${i}" x=".5" y=".5" width="${w - 1}" height="${h - 1}" rx="${R}" fill="none" stroke="${color}" stroke-opacity="${o}" stroke-width="${sw}" stroke-linecap="round"/>`;
  });
  return { css, body };
}

// Two soft colour clouds drifting behind the content.
function aurora(t, id, blobs) {
  let defs = "";
  let body = "";
  let css = "";
  blobs.forEach(([cx, cy, r, color, dx, dy, dur], i) => {
    defs += `<radialGradient id="${id}${i}"><stop offset="0" stop-color="${color}" stop-opacity="${t.glow}"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient>`;
    css += `.${id}${i}{animation:${id}${i} ${dur}s ease-in-out infinite alternate}@keyframes ${id}${i}{to{transform:translate(${dx}px,${dy}px) scale(1.18)}}`;
    body += `<circle class="fb ${id}${i}" cx="${cx}" cy="${cy}" r="${r}" fill="url(#${id}${i})" style="transform-origin:center"/>`;
  });
  return { defs, css, body };
}

// An isometric field of bars rippling outward from the centre, like the 3D contribution graph coming alive.
// Side faces are rectangles inside a skewed group, so scaling them keeps the isometric angle;
// the top face translates by the same amount on the same clock.
function terrain(t, { cx, y0, size = 8, a = 22, H = 62 }) {
  const DUR = 4.2;
  const MIN = 0.14;
  const s = a - 1.2; // footprint half-width, leaving a thin seam between bars
  const tan = Math.tan(Math.PI / 6);
  const b = a * tan;
  const sb = s * tan;
  const c = (size - 1) / 2;
  const top = `M0,${n(-sb)} L${n(s)},0 L0,${n(sb)} L${n(-s)},0Z`;
  const bars = [];
  for (let i = 0; i < size; i++) for (let j = 0; j < size; j++) bars.push([i, j]);
  bars.sort((p, q) => p[0] + p[1] - (q[0] + q[1]));

  let body = "";
  for (const [i, j] of bars) {
    const gx = n(cx + (i - j) * a);
    const gy = n(y0 + (i + j) * b);
    const dist = Math.hypot(i - c, j - c);
    const crest = mix(t.crestA, t.crestB, i / (size - 1));
    const [kt, kl, kr] = t.faces;
    // resting height: where this bar sits in the ripple at t=0 (used when motion is off)
    const rest = MIN + (1 - MIN) * (0.5 - 0.5 * Math.cos((dist * 0.34 * 2 * Math.PI) / DUR));
    body += `<g style="--d:${n(dist * 0.34 - DUR * 3)}s;--s:${n(rest)};--y:${n(-rest * H)}px;--g:${n((rest - MIN) / (1 - MIN))}">
      <g transform="translate(${n(gx - s)} ${gy}) skewY(30)"><rect class="tf" y="${-H}" width="${n(s)}" height="${H}" fill="${mix(crest, t.shade, kl)}"/></g>
      <g transform="translate(${gx} ${n(gy + sb)}) skewY(-30)"><rect class="tf" y="${-H}" width="${n(s)}" height="${H}" fill="${mix(crest, t.shade, kr)}"/></g>
      <g transform="translate(${gx} ${gy})"><g class="tt"><path d="${top}" fill="${mix(crest, t.shade, kt)}"/><path class="tg" d="${top}" fill="${crest}"/></g></g>
    </g>`;
  }
  const curve = `${DUR}s cubic-bezier(.45,0,.55,1) var(--d) infinite`;
  return {
    css: `.tf{transform:scaleY(var(--s));animation:tf ${curve}}
      .tt{transform:translateY(var(--y));animation:tt ${curve}}
      .tg{opacity:var(--g);animation:tg ${curve}}
      @keyframes tf{0%,100%{transform:scaleY(${MIN})}50%{transform:scaleY(1)}}
      @keyframes tt{0%,100%{transform:translateY(${n(-MIN * H)}px)}50%{transform:translateY(${-H}px)}}
      @keyframes tg{0%,100%{opacity:0}50%{opacity:1}}`,
    body,
    centerY: y0 + (size - 1) * b,
  };
}

// Typewriter cycling through phrases, CSS only. Every glyph is its own <text> on a fixed
// grid, so it stays aligned whichever monospace font the viewer has.
function typer(t, { phrases, x, y, size }) {
  const cw = size * 0.6;
  const SLOT = 4.8;
  const T = SLOT * phrases.length;
  const START = 0.25;
  const STEP = 0.045;
  const at = (s) => ((s / T) * 100).toFixed(3) + "%";
  let css = `
    .ph{opacity:0;animation:ph ${T}s linear infinite}
    @keyframes ph{0%,${at(SLOT - 0.65)}{opacity:1}${at(SLOT - 0.35)},100%{opacity:0}}
    .ch{font-size:${size}px;fill:${t.fg};opacity:0;animation:ch ${T}s step-end infinite}
    @keyframes ch{0%{opacity:1}${at(SLOT - 0.3)},100%{opacity:0}}
    .cr{animation-duration:${T}s;animation-iteration-count:infinite}
    .bl{fill:${t.accent};animation:bl 1.1s step-end infinite}
    @keyframes bl{50%{opacity:0}}
    @media (prefers-reduced-motion:reduce){.ph0,.ph0 .ch{opacity:1}.cr{opacity:0}}`;
  let body = "";
  phrases.forEach((p, i) => {
    const chars = [...p];
    const begin = i * SLOT;
    css += `@keyframes cr${i}{0%{transform:translateX(0)}${at(START - STEP)}{transform:translateX(0);animation-timing-function:steps(${chars.length},end)}${at(START - STEP + chars.length * STEP)},100%{transform:translateX(${n(chars.length * cw)}px)}}`;
    body += `<g class="ph ph${i}" style="animation-delay:${n(begin)}s">`;
    chars.forEach((ch, k) => {
      if (ch === " ") return;
      body += `<text class="m ch" x="${n(x + k * cw)}" y="${y}" style="animation-delay:${n(begin + START + k * STEP)}s">${esc(ch)}</text>`;
    });
    body += `<g class="cr" style="animation-name:cr${i};animation-delay:${n(begin)}s"><rect class="bl" x="${x + 1}" y="${n(y - size * 0.82)}" width="${n(cw * 0.85)}" height="${n(size * 1.08)}" rx="1.5"/></g></g>`;
  });
  return { css, body };
}

function hero(t) {
  const H = 356;
  const X = 48;
  const land = terrain(t, { cx: 664, y0: 118 });
  const sky = aurora(t, "au", [
    [700, 60, 300, t.accent2, -50, 30, 15],
    [520, 380, 280, t.accent, 60, -40, 19],
  ]);
  const edge = beam(t, W, H);
  const type = typer(t, { phrases: CONFIG.typed, x: X + 22, y: 290, size: 17 });
  const pillW = 30 + monoW(CONFIG.status, 12.5) + 16;
  const name = `<text class="s" x="${X - 3}" y="184" font-size="88" font-weight="800" letter-spacing="-2.6">${esc(CONFIG.name)}</text>`;

  return svg(
    W,
    H,
    `${CONFIG.name}, ${CONFIG.role}. ${CONFIG.status}.`,
    `<style>${BASE_CSS}${land.css}${sky.css}${edge.css}${type.css}
      .in{animation:in .9s ${EASE} both}
      @keyframes in{from{opacity:0;transform:translateY(12px)}}
      .rise{animation:rise 1.1s ${EASE} both}
      @keyframes rise{from{transform:translateY(96px)}}
      .land{animation:land 1.4s ${EASE} both}
      @keyframes land{from{opacity:0;transform:translateY(34px)}}
      .sheen{animation:sheen 6.5s ease-in-out 1.6s infinite}
      @keyframes sheen{0%{transform:translateX(0)}55%,100%{transform:translateX(900px)}}
      .ping{transform-origin:center;animation:ping 2.4s ease-out infinite}
      @keyframes ping{0%{transform:scale(1);opacity:.8}70%,100%{transform:scale(3);opacity:0}}
      ${REDUCED}
    </style>
    <defs>
      <clipPath id="frame"><rect width="${W}" height="${H}" rx="${R}"/></clipPath>
      <clipPath id="nc"><rect x="0" y="96" width="560" height="112"/></clipPath>
      <mask id="nm" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><g fill="#fff">${name}</g></mask>
      <linearGradient id="band" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${t.accent}" stop-opacity="0"/><stop offset=".4" stop-color="${t.accent}"/><stop offset=".6" stop-color="${t.accent2}"/><stop offset="1" stop-color="${t.accent2}" stop-opacity="0"/></linearGradient>
      <pattern id="dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="1" fill="${t.muted}" fill-opacity=".4"/></pattern>
      <radialGradient id="dg" gradientUnits="userSpaceOnUse" cx="664" cy="200" r="380"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#000"/></radialGradient>
      <mask id="dm" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="url(#dg)"/></mask>
      <radialGradient id="floor"><stop offset="0" stop-color="${t.accent}" stop-opacity="${t.glow + 0.1}"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0"/></radialGradient>
      ${sky.defs}
    </defs>
    ${card(t, 0, 0, W, H, t.deep)}
    <g clip-path="url(#frame)">
      ${sky.body}
      <rect width="${W}" height="${H}" fill="url(#dots)" mask="url(#dm)"/>
      <g class="land">
        <ellipse cx="664" cy="${n(land.centerY + 20)}" rx="250" ry="120" fill="url(#floor)"/>
        ${land.body}
      </g>
    </g>
    ${edge.body}

    <g class="in">
      <rect x="${X + 0.5}" y="44.5" width="${n(pillW)}" height="30" rx="15" fill="${t.raised}" stroke="${t.border}"/>
      <circle class="fb ping" cx="${X + 17}" cy="59.5" r="4" fill="none" stroke="${t.accent}" stroke-width="1.5"/>
      <circle cx="${X + 17}" cy="59.5" r="4" fill="${t.accent}"/>
      ${mono(X + 30, 64, CONFIG.status, 12.5, `fill="${t.fg}"`)}
    </g>

    <g clip-path="url(#nc)"><g class="rise"><g mask="url(#nm)">
      <rect width="${W}" height="${H}" fill="${t.fg}"/>
      <g transform="skewX(-18)"><rect class="sheen" x="-200" y="80" width="230" height="140" fill="url(#band)"/></g>
    </g></g></g>

    <text class="s in" x="${X}" y="232" font-size="25" font-weight="500" fill="${t.muted}" style="animation-delay:.25s">${esc(CONFIG.role)}</text>

    <g class="in" style="animation-delay:.45s">
      <path d="M${X + 1},278.5 l6,5.5 l-6,5.5" fill="none" stroke="${t.accent}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
      ${type.body}
    </g>`,
  );
}

function about(t) {
  const GAP = 12;
  const WIDE = 556;
  const NARROW = W - WIDE - GAP;
  const H1 = 204;
  const H2 = 190;
  const Y2 = H1 + GAP;
  const H = Y2 + H2;
  const XB = WIDE + GAP;
  const XD = NARROW + GAP;
  const tint = mix(t.surface, t.accent, 0.09);
  const tintLine = mix(t.border, t.accent, 0.4);
  const label = (x, y, s) => `<text class="s" x="${x}" y="${y}" font-size="13" font-weight="500" fill="${t.muted}">${esc(s)}</text>`;
  let css = "";

  // Tile A: statement + a delivery pipeline that fills from commit to live.
  const statement = CONFIG.about
    .map(
      (parts, i) =>
        `<text class="s" x="32" y="${62 + i * 34}" font-size="25" font-weight="600" letter-spacing="-.2" fill="${t.fg}" xml:space="preserve">${parts
          .map((p) => (Array.isArray(p) ? `<tspan fill="${t.accent}">${esc(p[0])}</tspan>` : esc(p)))
          .join("")}</text>`,
    )
    .join("");
  const PX0 = 50;
  const PX1 = 506;
  const PY = 150;
  const steps = CONFIG.pipeline;
  const FILL = 52; // percent of the loop spent filling the line
  css += `.pl{transform-origin:0 50%;animation:pl 6.5s linear infinite}
    @keyframes pl{0%{transform:scaleX(0);opacity:1}${FILL}%,88%{transform:scaleX(1);opacity:1}97%,100%{transform:scaleX(1);opacity:0}}
    .ph{animation:phd 6.5s linear infinite}
    @keyframes phd{0%{transform:translateX(0);opacity:1}${FILL}%{transform:translateX(${PX1 - PX0}px);opacity:1}${FILL + 3}%,100%{transform:translateX(${PX1 - PX0}px);opacity:0}}
    .pn{transform-origin:center}
    .pr{transform-origin:center;opacity:0;animation:pr 6.5s ease-out infinite}
    @keyframes pr{0%,${FILL}%{transform:scale(1);opacity:0}${FILL + 1}%{transform:scale(1);opacity:.7}${FILL + 16}%,100%{transform:scale(2.8);opacity:0}}`;
  let pipe = `<rect x="${PX0}" y="${PY - 1}" width="${PX1 - PX0}" height="2" rx="1" fill="${t.border}"/>
    <rect class="fb pl" x="${PX0}" y="${PY - 1}" width="${PX1 - PX0}" height="2" rx="1" fill="url(#pg)"/>`;
  steps.forEach((s, k) => {
    const x = PX0 + ((PX1 - PX0) * k) / (steps.length - 1);
    const p = (FILL * k) / (steps.length - 1);
    const last = k === steps.length - 1;
    const color = mix(t.accent, t.accent2, k / (steps.length - 1));
    css += `.pn${k}{animation:pn${k} 6.5s linear infinite}@keyframes pn${k}{0%${p > 0 ? `,${pct(p)}` : ""}{opacity:0;transform:scale(.3)}${pct(p + 3)},88%{opacity:1;transform:scale(1)}97%,100%{opacity:0;transform:scale(1)}}`;
    pipe += `<circle cx="${n(x)}" cy="${PY}" r="6" fill="${t.surface}" stroke="${t.border}" stroke-width="1.5"/>
      ${last ? `<circle class="fb pr" cx="${n(x)}" cy="${PY}" r="10" fill="none" stroke="${color}" stroke-width="1.5"/>` : ""}
      <g class="fb pn pn${k}"><circle cx="${n(x)}" cy="${PY}" r="${last ? 10 : 6.5}" fill="${color}"/>${last ? `<path d="M${n(x - 4.5)},${PY + 0.5} l3,3 l6,-6.5" fill="none" stroke="${t.deep}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>` : ""}</g>
      <text class="m" x="${n(x)}" y="${PY + 30}" text-anchor="middle" font-size="12" fill="${t.muted}">${esc(s)}</text>`;
  });
  pipe += `<circle class="ph" cx="${PX0}" cy="${PY}" r="3.5" fill="${t.fg}"/>`;

  // Tile B: a learning curve that draws itself.
  const curve = [XB + 28, 176, XB + 130, 176, XB + 210, 164, XB + NARROW - 30, 70];
  const cLen = n(cubicLength(curve));
  const cPath = `M${curve[0]},${curve[1]} C${curve.slice(2).join(",")}`;
  const [ex, ey] = curve.slice(6);
  css += `.lc{stroke-dasharray:${cLen};animation:lc 7s ease-in-out infinite}
    @keyframes lc{0%{stroke-dashoffset:${cLen};opacity:1}42%,88%{stroke-dashoffset:0;opacity:1}97%,100%{stroke-dashoffset:0;opacity:0}}
    .la{animation:la 7s ease-in-out infinite}
    @keyframes la{0%,22%{opacity:0}46%,88%{opacity:1}97%,100%{opacity:0}}
    .ld{transform-origin:center;animation:ld 7s ease-in-out infinite}
    @keyframes ld{0%,40%{opacity:0;transform:scale(.2)}46%,88%{opacity:1;transform:scale(1)}97%,100%{opacity:0;transform:scale(1)}}
    .lr{transform-origin:center;opacity:0;animation:lr 7s ease-out infinite}
    @keyframes lr{0%,44%{transform:scale(1);opacity:0}46%{transform:scale(1);opacity:.7}64%,100%{transform:scale(3.2);opacity:0}}`;
  const learn = `<g clip-path="url(#cb)">
      <path class="la" d="${cPath} L${ex},${H1} L${curve[0]},${H1}Z" fill="url(#lg)"/>
      <path class="lc" d="${cPath}" fill="none" stroke="url(#ls)" stroke-width="2.5" stroke-linecap="round"/>
      <circle class="fb lr" cx="${ex}" cy="${ey}" r="5" fill="none" stroke="${t.accent2}" stroke-width="1.5"/>
      <circle class="fb ld" cx="${ex}" cy="${ey}" r="5" fill="${t.accent2}" stroke="${tint}" stroke-width="2"/>
    </g>`;

  // Tile C: switches flipping on one by one.
  const TX = NARROW - 28 - 40;
  let toggles = "";
  CONFIG.openTo.forEach((s, k) => {
    const y = Y2 + 82 + k * 36;
    const on = 8 + k * 9;
    css += `.tk${k}{animation:tk${k} 7.5s ${EASE} infinite}@keyframes tk${k}{0%,${on}%{transform:translateX(-18px)}${on + 6}%,92%{transform:translateX(0)}98%,100%{transform:translateX(-18px)}}
      .to${k}{animation:to${k} 7.5s ease infinite}@keyframes to${k}{0%,${on}%{opacity:0}${on + 6}%,92%{opacity:1}98%,100%{opacity:0}}`;
    toggles += `<text class="s" x="28" y="${y}" font-size="19" font-weight="600" fill="${t.fg}">${esc(s)}</text>
      <rect x="${TX}" y="${y - 17}" width="40" height="22" rx="11" fill="${t.border}"/>
      <rect class="to${k}" x="${TX}" y="${y - 17}" width="40" height="22" rx="11" fill="${mix(t.accent, t.accent2, k / 2)}"/>
      <circle class="tk${k}" cx="${TX + 29}" cy="${y - 6}" r="8" fill="#ffffff"/>`;
  });

  // Tile D: a request travelling client, server, database and back.
  const BW = 124;
  const BH = 78;
  const BG = (WIDE - 64 - 3 * BW) / 2;
  const BY = Y2 + 68;
  const mid = BY + BH / 2;
  const bx = (i) => XD + 32 + i * (BW + BG);
  const T = 5;
  // [gap index, start %, end %, direction]
  const hops = [
    [0, 2, 20, 1],
    [1, 26, 44, 1],
    [1, 56, 74, -1],
    [0, 80, 98, -1],
  ];
  let flow = "";
  for (let g = 0; g < 2; g++) {
    const x0 = bx(g) + BW;
    flow += `<path d="M${x0 + 6},${mid - 7} H${x0 + BG - 6} M${x0 + 6},${mid + 7} H${x0 + BG - 6}" stroke="${t.border}" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="1 6"/>`;
  }
  hops.forEach(([g, a, z, dir], k) => {
    const x0 = bx(g) + BW + 8;
    const x1 = bx(g) + BW + BG - 8;
    const from = dir > 0 ? x0 : x1;
    const dist = (x1 - x0) * dir;
    css += `.hp${k}{opacity:0;animation:hp${k} ${T}s linear infinite}@keyframes hp${k}{0%,${a}%{opacity:0;transform:translateX(0)}${a + 1}%{opacity:1;transform:translateX(0)}${z - 1}%{opacity:1;transform:translateX(${n(dist)}px)}${z}%,100%{opacity:0;transform:translateX(${n(dist)}px)}}`;
    flow += `<rect class="hp${k}" x="${n(from - 7)}" y="${mid + (dir > 0 ? -7 : 7) - 2.5}" width="14" height="5" rx="2.5" fill="${dir > 0 ? t.accent : t.accent2}"/>`;
  });
  // each box lights up while it is handling the request
  const lit = [
    "0%,3%{opacity:1}9%,93%{opacity:0}98%,100%{opacity:1}",
    "0%,17%{opacity:0}21%,27%{opacity:1}33%,70%{opacity:0}74%,81%{opacity:1}87%,100%{opacity:0}",
    "0%,41%{opacity:0}45%,57%{opacity:1}63%,100%{opacity:0}",
  ];
  CONFIG.flow.forEach(([name, role], i) => {
    const x = bx(i);
    css += `.bx${i}{opacity:0;animation:bx${i} ${T}s ease infinite}@keyframes bx${i}{${lit[i]}}`;
    flow += `<rect x="${x + 0.5}" y="${BY + 0.5}" width="${BW - 1}" height="${BH - 1}" rx="10" fill="${t.raised}" stroke="${t.border}"/>
      <rect class="bx${i}" x="${x + 0.5}" y="${BY + 0.5}" width="${BW - 1}" height="${BH - 1}" rx="10" fill="${mix(t.raised, t.accent, 0.12)}" stroke="${mix(t.accent, t.accent2, i / 2)}" stroke-width="1.5"/>
      <text class="m" x="${x + BW / 2}" y="${BY + 36}" text-anchor="middle" font-size="14.5" font-weight="700" fill="${t.fg}">${esc(name)}</text>
      <text class="s" x="${x + BW / 2}" y="${BY + 56}" text-anchor="middle" font-size="12.5" fill="${t.muted}">${esc(role)}</text>`;
  });

  return svg(
    W,
    H,
    `About: full-stack developer building fully functional, deploy-ready websites, from commit to live. Currently learning ${CONFIG.learning.join(" and ")}. Open to ${CONFIG.openTo.join(", ").toLowerCase()}. Core stack: ${CONFIG.flow.map((f) => f[0]).join(", ")}.`,
    `<style>${BASE_CSS}${css}${REDUCED}</style>
    <defs>
      <linearGradient id="pg" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="${t.accent}"/><stop offset="1" stop-color="${t.accent2}"/></linearGradient>
      <linearGradient id="ls" gradientUnits="userSpaceOnUse" x1="${curve[0]}" y1="0" x2="${ex}" y2="0"><stop offset="0" stop-color="${t.accent}"/><stop offset="1" stop-color="${t.accent2}"/></linearGradient>
      <linearGradient id="lg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${t.accent2}" stop-opacity=".3"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0"/></linearGradient>
      <clipPath id="cb"><rect x="${XB + 1}" y="1" width="${NARROW - 2}" height="${H1 - 2}" rx="${R - 1}"/></clipPath>
    </defs>
    ${card(t, 0, 0, WIDE, H1)}
    ${statement}
    ${pipe}

    ${card(t, XB, 0, NARROW, H1, tint, tintLine)}
    ${learn}
    ${label(XB + 28, 44, "Currently learning")}
    ${CONFIG.learning.map((s, i) => `<text class="s" x="${XB + 28}" y="${88 + i * 36}" font-size="27" font-weight="700" letter-spacing="-.5" fill="${t.fg}">${esc(s)}</text>`).join("")}

    ${card(t, 0, Y2, NARROW, H2)}
    ${label(28, Y2 + 42, "Open to")}
    ${toggles}

    ${card(t, XD, Y2, WIDE, H2)}
    ${label(XD + 32, Y2 + 42, "Core stack")}
    ${flow}`,
  );
}

// Four rows of chips drifting in alternating directions under faded edges.
function stack(t) {
  const PAD = 28;
  const CH = 32;
  const GAP = 14;
  const X0 = 150;
  const FS = 13;
  const SPEED = 22; // px per second
  const H = PAD * 2 + CONFIG.stack.length * CH + (CONFIG.stack.length - 1) * GAP;
  let defs = "";
  let css = "";
  let rows = "";
  let labels = "";
  CONFIG.stack.forEach(([group, items], r) => {
    const y = PAD + r * (CH + GAP);
    let x = 0;
    let set = "";
    for (const [name, color] of items) {
      const w = 14 + 9 + 8 + monoW(name, FS) + 15;
      set += `<rect x="${n(x + 0.5)}" y=".5" width="${n(w - 1)}" height="${CH - 1}" rx="${CH / 2}" fill="${t.raised}" stroke="${t.border}"/>
        <circle cx="${n(x + 18.5)}" cy="${CH / 2}" r="4.5" fill="${color ?? t.fg}"/>
        ${mono(x + 31, CH / 2 + 4.5, name, FS, `fill="${t.fg}"`)}`;
      x += w + 10;
    }
    const loop = n(x);
    const copies = Math.ceil((W - X0) / loop) + 1;
    defs += `<g id="r${r}">${set}</g>`;
    css += `.mq${r}{animation:mq${r} ${n(loop / SPEED)}s linear infinite${r % 2 ? " reverse" : ""}}@keyframes mq${r}{to{transform:translateX(${-loop}px)}}`;
    rows += `<g transform="translate(${X0} ${y})"><g class="mq${r}">${Array.from({ length: copies }, (_, k) => `<use href="#r${r}" x="${n(k * loop)}"/>`).join("")}</g></g>`;
    labels += `<text class="s" x="32" y="${y + CH / 2 + 4.5}" font-size="13.5" font-weight="600" fill="${t.muted}">${esc(group)}</text>`;
  });
  return svg(
    W,
    H,
    "Stack. " + CONFIG.stack.map(([g, items]) => `${g}: ${items.map((i) => i[0]).join(", ")}`).join(". ") + ".",
    `<style>${BASE_CSS}${css}${REDUCED}</style>
    <defs>
      ${defs}
      <clipPath id="frame"><rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="${R - 1}"/></clipPath>
      <linearGradient id="fl" gradientUnits="userSpaceOnUse" x1="${X0 - 14}" y1="0" x2="${X0 + 44}" y2="0"><stop offset="0" stop-color="${t.surface}"/><stop offset="1" stop-color="${t.surface}" stop-opacity="0"/></linearGradient>
      <linearGradient id="fr" gradientUnits="userSpaceOnUse" x1="${W - 70}" y1="0" x2="${W - 8}" y2="0"><stop offset="0" stop-color="${t.surface}" stop-opacity="0"/><stop offset="1" stop-color="${t.surface}"/></linearGradient>
    </defs>
    ${card(t, 0, 0, W, H)}
    <g clip-path="url(#frame)">
      ${rows}
      <rect width="${X0 + 44}" height="${H}" fill="url(#fl)"/>
      <rect x="${W - 70}" width="70" height="${H}" fill="url(#fr)"/>
    </g>
    ${labels}`,
  );
}

// Section heading written like raw markdown, with a light running along its rule.
function heading(t, label) {
  const H = 40;
  const FS = 20;
  const x1 = 36 + monoW(label, FS) + 20;
  const L = W - x1;
  return svg(
    W,
    H,
    label,
    `<style>${BASE_CSS}
      .cm{stroke-dasharray:70 ${L + 70};stroke-dashoffset:70;animation:cm 5s ${EASE} infinite}
      @keyframes cm{70%,100%{stroke-dashoffset:${-L - 70}}}
      ${REDUCED}
      @media (prefers-reduced-motion:reduce){.cm{display:none}}
    </style>
    <defs>
      <linearGradient id="hl" gradientUnits="userSpaceOnUse" x1="${n(x1)}" y1="0" x2="${W}" y2="0"><stop offset="0" stop-color="${t.border}"/><stop offset="1" stop-color="${t.border}" stop-opacity="0"/></linearGradient>
      <linearGradient id="hc" gradientUnits="userSpaceOnUse" x1="${n(x1)}" y1="0" x2="${W}" y2="0"><stop offset="0" stop-color="${t.accent}"/><stop offset=".7" stop-color="${t.accent2}"/><stop offset="1" stop-color="${t.accent2}" stop-opacity="0"/></linearGradient>
    </defs>
    ${mono(0, 27, "##", FS, `font-weight="700" fill="${t.accent}"`)}
    ${mono(36, 27, label, FS, `font-weight="700" fill="${t.fg}"`)}
    <path d="M${n(x1)},20.5 H${W}" stroke="url(#hl)" stroke-width="1"/>
    <path class="cm" d="M${n(x1)},20.5 H${W}" stroke="url(#hc)" stroke-width="2" stroke-linecap="round"/>`,
  );
}

function footer(t) {
  const H = 188;
  const BW = 44 + monoW(CONFIG.ctaLabel, 14) + 12 + 11;
  const BX = W - 44 - BW;
  const BY = H / 2 - 23;
  const sky = aurora(t, "au", [
    [760, 30, 260, t.accent2, -70, 40, 13],
    [180, 220, 240, t.accent, 80, -30, 17],
  ]);
  const edge = beam(t, W, H, { dur: 7 });
  return svg(
    W,
    H,
    `${CONFIG.cta} ${CONFIG.ctaLabel}: ${CONFIG.email}`,
    `<style>${BASE_CSS}${sky.css}${edge.css}
      .nudge{animation:nudge 2.4s ease-in-out infinite}
      @keyframes nudge{0%,55%,100%{transform:translateX(0)}78%{transform:translateX(5px)}}
      .halo{transform-origin:center;animation:halo 2.4s ease-out infinite}
      @keyframes halo{0%{transform:scale(1);opacity:.55}80%,100%{transform:scale(1.16,1.55);opacity:0}}
      ${REDUCED}
    </style>
    <defs><clipPath id="frame"><rect width="${W}" height="${H}" rx="${R}"/></clipPath>${sky.defs}</defs>
    ${card(t, 0, 0, W, H, t.deep)}
    <g clip-path="url(#frame)">${sky.body}</g>
    ${edge.body}
    <text class="s" x="44" y="92" font-size="36" font-weight="800" letter-spacing="-.9" fill="${t.fg}">${esc(CONFIG.cta)}</text>
    ${mono(45, 128, CONFIG.email, 15, `fill="${t.muted}"`)}
    <rect class="fb halo" x="${n(BX)}" y="${BY}" width="${n(BW)}" height="46" rx="23" fill="none" stroke="${t.accent}" stroke-width="1.5"/>
    <rect x="${n(BX)}" y="${BY}" width="${n(BW)}" height="46" rx="23" fill="${t.button}"/>
    ${mono(BX + 22, BY + 28, CONFIG.ctaLabel, 14, `font-weight="700" fill="${t.onButton}"`)}
    <g class="nudge">${arrow(n(BX + BW - 33), BY + 23, "right", t.onButton, 2)}</g>`,
  );
}

function button(t, label, kind, arrowKind) {
  const H = 44;
  const FS = 14;
  const w = Math.ceil(22 + monoW(label, FS) + 12 + 11 + 20);
  const primary = kind === "primary";
  const ink = primary ? t.onButton : t.fg;
  return svg(
    w,
    H,
    label,
    `<style>${BASE_CSS}</style>
    <rect x=".5" y=".5" width="${w - 1}" height="${H - 1}" rx="${(H - 1) / 2}" fill="${primary ? t.button : t.raised}" stroke="${primary ? t.button : t.border}"/>
    ${mono(22, 27, label, FS, `font-weight="700" fill="${ink}"`)}
    ${arrow(n(22 + monoW(label, FS) + 12), 22, arrowKind, primary ? ink : t.muted)}`,
  );
}

for (const [name, t] of Object.entries(THEMES)) {
  const dir = join(OUT, name);
  mkdirSync(dir, { recursive: true });
  const files = {
    "hero.svg": hero(t),
    "about.svg": about(t),
    "stack.svg": stack(t),
    "footer.svg": footer(t),
    ...Object.fromEntries(Object.entries(CONFIG.headings).map(([id, label]) => [`head-${id}.svg`, heading(t, label)])),
    ...Object.fromEntries(CONFIG.links.map(([id, label, kind, arrowKind]) => [`btn-${id}.svg`, button(t, label, kind, arrowKind)])),
  };
  for (const [file, content] of Object.entries(files)) {
    writeFileSync(join(dir, file), content);
    console.log(`wrote assets/${name}/${file} (${(content.length / 1024).toFixed(1)} KB)`);
  }
}
