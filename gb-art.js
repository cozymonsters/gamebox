/* ===== English GameBox · hand-drawn SVG art (icons, avatars, medals). No emoji. ===== */
"use strict";
const ART = (() => {
  /* ---------- line icons (24x24, stroke = currentColor) ---------- */
  const P = {
    clock:   '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
    timer:   '<circle cx="12" cy="13.5" r="7.5"/><path d="M12 10v3.5l2.2 1.6M10 2.5h4M12 2.5v3.5M18.5 6l1.5-1.5"/>',
    users:   '<circle cx="9" cy="8" r="3.4"/><path d="M2.8 20c0-3.6 2.8-6.2 6.2-6.2s6.2 2.6 6.2 6.2"/><circle cx="17.3" cy="9" r="2.6"/><path d="M16.4 14.2c2.9.1 4.9 2.3 4.9 5.6"/>',
    book:    '<path d="M5 4.5h11a3 3 0 0 1 3 3V20H8a3 3 0 0 1-3-3z"/><path d="M5 17a3 3 0 0 1 3-3h11"/>',
    help:    '<circle cx="12" cy="12" r="9"/><path d="M9.4 9.3a2.7 2.7 0 1 1 3.9 2.4c-.8.4-1.3 1-1.3 1.9v.6"/><circle cx="12" cy="17.2" r=".9" fill="currentColor" stroke="none"/>',
    rope:    '<path d="M2 12c2.2-3 4.4 3 6.6 0s4.4 3 6.6 0 4.4 3 6.8 0"/><circle cx="12" cy="12" r="2.2" fill="currentColor" stroke="none"/>',
    ball:    '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3v18M5.6 5.6c3.2 3.4 3.2 9.4 0 12.8M18.4 5.6c-3.2 3.4-3.2 9.4 0 12.8"/>',
    trophy:  '<path d="M8 4h8v5.5a4 4 0 0 1-8 0z"/><path d="M8 6H5.2a2.8 2.8 0 0 0 3 4M16 6h2.8a2.8 2.8 0 0 1-3 4M12 13.5V17M8.5 20.5h7M10 17h4v3.5h-4z"/>',
    sliders: '<path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1"/><circle cx="15" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="17" cy="18" r="2"/>',
    swap:    '<path d="M7 4 4 7l3 3M4 7h12M17 20l3-3-3-3M20 17H8"/>',
    x:       '<path d="M6 6l12 12M18 6 6 18"/>',
    check:   '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    play:    '<path d="M8 5.2v13.6a.8.8 0 0 0 1.2.7l10.6-6.8a.8.8 0 0 0 0-1.4L9.2 4.5A.8.8 0 0 0 8 5.2z" fill="currentColor" stroke="none"/>',
    stop:    '<rect x="6" y="6" width="12" height="12" rx="2.5" fill="currentColor" stroke="none"/>',
    refresh: '<path d="M20 11.5A8 8 0 1 0 17.7 17M20 4.5v7h-7"/>',
    volume:  '<path d="M4 9.5h3.5L13 5v14l-5.5-4.5H4z" fill="currentColor"/><path d="M16.5 9a4.2 4.2 0 0 1 0 6M19 6.5a7.8 7.8 0 0 1 0 11"/>',
    flame:   '<path d="M12.3 2.5c.6 3.6 5.2 5.6 5.2 10.6a5.5 5.5 0 0 1-11 0c0-2.4 1.1-4 2.4-5 .1 1.8.9 3 2.1 3.3-.9-3.4.1-6.6 1.3-8.9z" fill="currentColor" stroke="none"/>',
    bolt:    '<path d="M13.5 2 4.5 13.6h6.6L10 22l9.5-12.2h-6.7z" fill="currentColor" stroke="none"/>',
    target:  '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/>',
    star:    '<path d="M12 3.2l2.6 5.5 6 .8-4.4 4.1 1.1 6-5.3-2.9-5.3 2.9 1.1-6-4.4-4.1 6-.8z" fill="currentColor" stroke="none"/>',
    pencil:  '<path d="M4 20l4.2-1 11-11a2.1 2.1 0 0 0-3-3l-11 11z"/><path d="M14.5 6.5l3 3"/>',
    phone:   '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18h2"/>',
    flag:    '<path d="M5.5 21V4"/><path d="M5.5 4.5h11l-2.2 4 2.2 4h-11z" fill="currentColor"/>',
    home:    '<path d="M3.5 11 12 4l8.5 7"/><path d="M6 9.5V20h12V9.5"/>',
    qr:      '<rect x="3.5" y="3.5" width="6.5" height="6.5" rx="1"/><rect x="14" y="3.5" width="6.5" height="6.5" rx="1"/><rect x="3.5" y="14" width="6.5" height="6.5" rx="1"/><path d="M14 14h2.5v2.5H14zM18 18h2.5v2.5H18zM18 14h2.5M14 18v2.5"/>',
    teacher: '<rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M8 20h8M12 16v4"/>',
    wifi:    '<path d="M2.5 9a14 14 0 0 1 19 0M5.5 12.3a9.5 9.5 0 0 1 13 0M8.6 15.6a5 5 0 0 1 6.8 0"/><circle cx="12" cy="19" r="1.2" fill="currentColor" stroke="none"/>',
    scale:   '<path d="M12 3v18M7 21h10M5 7h14M5 7l-2.5 6a2.6 2.6 0 0 0 5 0zM19 7l-2.5 6a2.6 2.6 0 0 0 5 0z"/>',
    spark:   '<path d="M12 2.5v4M12 17.5v4M2.5 12h4M17.5 12h4M5.3 5.3l2.8 2.8M15.9 15.9l2.8 2.8M5.3 18.7l2.8-2.8M15.9 8.1l2.8-2.8"/>'
  };
  const icon = (name, cls = "") =>
    `<svg class="gi ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[name] || ""}</svg>`;

  /* ---------- brand mark: a game controller ---------- */
  const gamepad = (cls = "") =>
    `<svg class="${cls}" viewBox="0 0 48 48" aria-hidden="true"><path d="M14 15h20c6 0 10 5 10 12v3c0 4-3 6-6 6-2 0-3.4-1-4.6-2.6L31 30H17l-2.4 3.4C13.4 35 12 36 10 36c-3 0-6-2-6-6v-3c0-7 4-12 10-12z" fill="#1a0b5e"/><path d="M14 21v8M10 25h8" stroke="#fff" stroke-width="3" stroke-linecap="round"/><circle cx="32" cy="22.5" r="2.4" fill="#ef4560"/><circle cx="36.5" cy="27" r="2.4" fill="#2d8cf0"/><circle cx="27.5" cy="27" r="2.4" fill="#2e9d48"/></svg>`;

  /* ---------- character avatars (original "buddies") ---------- */
  const COLORS = ["#ff6b6b","#ffa94d","#fcc419","#51cf66","#20c997","#339af0","#5c7cfa","#9775fa","#f06595","#ff922b","#22b8cf","#94d82d"];
  const N = 24;
  const AVATARS = Array.from({ length: N }, (_, i) => "a" + i);
  const shade = (hex, f) => {
    const n = parseInt(hex.slice(1), 16);
    const ch = s => Math.max(0, Math.min(255, Math.round(((n >> s) & 255) * (1 + f))));
    return "#" + [16, 8, 0].map(s => ch(s).toString(16).padStart(2, "0")).join("");
  };
  const idx = id => {
    const m = /^a(\d+)$/.exec(String(id || ""));
    if (m && +m[1] < N) return +m[1];
    let h = 0; for (const c of String(id || "x")) h = (h * 31 + c.codePointAt(0)) >>> 0;
    return h % N;
  };
  const INK = "#1d1b3a";
  function avatar(id, cls = ""){
    const i = idx(id);
    const c = COLORS[(i * 5) % 12], d = shade(c, -0.28), l = shade(c, 0.35);
    const shape = ["round","square","egg","pear"][(i + Math.floor(i / 12)) % 4];
    const ears  = ["cat","bear","bunny","antenna","horns","sprout","none"][(i * 3 + 1) % 7];
    const eyes  = ["big","dot","happy","wink"][(i * 7 + Math.floor(i / 4)) % 4];
    const mouth = ["smile","open","cat","teeth"][(i * 5 + 2) % 4];
    let s = "";
    // ears / top things (behind the body)
    if (ears === "cat")   s += `<path d="M20 44 26 9 47 28z M80 44 74 9 53 28z" fill="${c}" stroke="${d}" stroke-width="3" stroke-linejoin="round"/><path d="M27 34 29 18 39 28z M73 34 71 18 61 28z" fill="#ffc9d6"/>`;
    if (ears === "bear")  s += `<circle cx="25" cy="27" r="12" fill="${c}" stroke="${d}" stroke-width="3"/><circle cx="75" cy="27" r="12" fill="${c}" stroke="${d}" stroke-width="3"/><circle cx="25" cy="27" r="5.5" fill="${l}"/><circle cx="75" cy="27" r="5.5" fill="${l}"/>`;
    if (ears === "bunny") s += `<ellipse cx="36" cy="18" rx="8.5" ry="19" fill="${c}" stroke="${d}" stroke-width="3"/><ellipse cx="64" cy="18" rx="8.5" ry="19" fill="${c}" stroke="${d}" stroke-width="3"/><ellipse cx="36" cy="19" rx="3.8" ry="12" fill="#ffc9d6"/><ellipse cx="64" cy="19" rx="3.8" ry="12" fill="#ffc9d6"/>`;
    if (ears === "antenna") s += `<path d="M39 24 31 7M61 24 69 7" stroke="${INK}" stroke-width="3" stroke-linecap="round"/><circle cx="31" cy="7" r="5.5" fill="#ffd43b" stroke="${INK}" stroke-width="2"/><circle cx="69" cy="7" r="5.5" fill="#ffd43b" stroke="${INK}" stroke-width="2"/>`;
    if (ears === "horns") s += `<path d="M29 30 23 7 41 23z M71 30 77 7 59 23z" fill="#fff3bf" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`;
    if (ears === "sprout") s += `<path d="M50 22V10" stroke="#2b8a3e" stroke-width="3.5" stroke-linecap="round"/><path d="M50 13C41 2 30 7 33 14c5 4 11 3 17-1z" fill="#51cf66" stroke="#2b8a3e" stroke-width="2"/><path d="M50 11c8-10 20-6 17 1-5 4-11 3-17-1z" fill="#69db7c" stroke="#2b8a3e" stroke-width="2"/>`;
    // body
    const body = {
      round:  `<circle cx="50" cy="57" r="37"/>`,
      square: `<rect x="14" y="20" width="72" height="72" rx="26"/>`,
      egg:    `<ellipse cx="50" cy="58" rx="34" ry="37"/>`,
      pear:   `<path d="M50 20c14 0 22 9 24 21 9 6 13 15 13 25 0 16-16 26-37 26S13 82 13 66c0-10 4-19 13-25 2-12 10-21 24-21z"/>`
    }[shape];
    s += `<g fill="${c}" stroke="${d}" stroke-width="3">${body}</g>`;
    s += `<ellipse cx="50" cy="79" rx="21" ry="10" fill="#fff" opacity=".3"/>`;
    s += `<circle cx="27" cy="65" r="6" fill="#ff8fab" opacity=".55"/><circle cx="73" cy="65" r="6" fill="#ff8fab" opacity=".55"/>`;
    // eyes
    const bigEye = (x) => `<circle cx="${x}" cy="50" r="10" fill="#fff" stroke="${d}" stroke-width="2"/><circle cx="${x + 2}" cy="52" r="5.5" fill="${INK}"/><circle cx="${x + 3.8}" cy="50" r="2" fill="#fff"/>`;
    const dotEye = (x) => `<circle cx="${x}" cy="52" r="5" fill="${INK}"/><circle cx="${x + 1.6}" cy="50.4" r="1.7" fill="#fff"/>`;
    const arcEye = (x) => `<path d="M${x - 6} 54q6-8 12 0" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>`;
    if (eyes === "big")   s += bigEye(37) + bigEye(63);
    if (eyes === "dot")   s += dotEye(38) + dotEye(62);
    if (eyes === "happy") s += arcEye(37) + arcEye(63);
    if (eyes === "wink")  s += bigEye(37) + arcEye(63);
    // mouth
    if (mouth === "smile") s += `<path d="M42 67q8 8 16 0" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>`;
    if (mouth === "open")  s += `<path d="M41 65q9 14 18 0z" fill="${INK}"/><path d="M45.5 71q4.5 5 9 0-4.5-3-9 0z" fill="#ff6b81"/>`;
    if (mouth === "cat")   s += `<path d="M42 66q4 5 8 0 4 5 8 0" fill="none" stroke="${INK}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>`;
    if (mouth === "teeth") s += `<path d="M40 65q10 11 20 0z" fill="${INK}"/><rect x="46" y="65" width="8" height="4.5" rx="1" fill="#fff"/>`;
    return `<svg class="avsvg ${cls}" viewBox="0 0 100 100" aria-hidden="true">${s}</svg>`;
  }

  /* ---------- medals, badges, ball ---------- */
  const MEDAL = [["#ffd43b","#e67700"],["#e9ecef","#868e96"],["#ffb380","#c2410c"]];
  function medal(i){
    if (i > 2) return `<svg class="medal" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#e9ecef"/><text x="12" y="16" text-anchor="middle" font-size="11" font-weight="900" fill="#495057" font-family="Nunito,sans-serif">${i + 1}</text></svg>`;
    const [a, b] = MEDAL[i];
    return `<svg class="medal" viewBox="0 0 24 24"><path d="M7 1.5 10 9M17 1.5 14 9" stroke="#5c7cfa" stroke-width="3" stroke-linecap="round"/><circle cx="12" cy="14.5" r="8" fill="${a}" stroke="${b}" stroke-width="2"/><text x="12" y="18.3" text-anchor="middle" font-size="10" font-weight="900" fill="${b}" font-family="Nunito,sans-serif">${i + 1}</text></svg>`;
  }
  const three = () => `<svg class="medal" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#ff9f1c" stroke="#c26f00" stroke-width="2"/><text x="12" y="16.5" text-anchor="middle" font-size="12" font-weight="900" fill="#fff" font-family="Nunito,sans-serif">3</text></svg>`;
  const ball = (cls = "") => `<svg class="${cls}" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="44" fill="#f26b1d" stroke="${INK}" stroke-width="5"/><path d="M6 50h88M50 6v88M20 18c14 16 14 48 0 64M80 18c-14 16-14 48 0 64" fill="none" stroke="${INK}" stroke-width="4.5"/><ellipse cx="34" cy="30" rx="10" ry="6" fill="#fff" opacity=".25" transform="rotate(-30 34 30)"/></svg>`;

  /* ---------- crowd of fans ---------- */
  function crowd(n){
    const cols = ["#ff6b6b","#ffa94d","#fcc419","#51cf66","#339af0","#9775fa","#f06595","#22b8cf"];
    let out = "";
    for (let k = 0; k < n; k++){
      const c = cols[(k * 3) % cols.length], skin = ["#ffd8b8","#f1c27d","#e0ac69","#c68642"][k % 4];
      const arms = k % 3 === 0 ? `<path d="M6 30 1 16M30 30l5-14" stroke="${c}" stroke-width="5" stroke-linecap="round"/>` : "";
      out += `<span class="fan" style="animation-delay:${(k % 5) * .17}s"><svg viewBox="0 0 36 46">${arms}<circle cx="18" cy="13" r="9" fill="${skin}"/><path d="M4 46c0-12 6-18 14-18s14 6 14 18z" fill="${c}"/></svg></span>`;
    }
    return out;
  }

  return { icon, gamepad, avatar, AVATARS, medal, three, ball, crowd };
})();

/* fill any <i data-i="name"> / <span data-art="gamepad"> placeholders in the page */
ART.hydrate = (root = document) => {
  root.querySelectorAll("[data-i]").forEach(el => { if (!el.dataset.done){ el.insertAdjacentHTML("afterbegin", ART.icon(el.dataset.i)); el.dataset.done = 1; } });
  root.querySelectorAll("[data-art]").forEach(el => { if (!el.dataset.done){ const a = el.dataset.art; el.insertAdjacentHTML("afterbegin", a === "gamepad" ? ART.gamepad() : a === "ball" ? ART.ball() : ""); el.dataset.done = 1; } });
};
if (document.readyState !== "loading") ART.hydrate(); else document.addEventListener("DOMContentLoaded", () => ART.hydrate());
