/* ===== English GameBox · art helpers: line icons, monster avatars (img/m), mascots, medals. No emoji. ===== */
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
    drop:    '<path d="M12 3c3 4.6 6.5 8 6.5 11.5a6.5 6.5 0 0 1-13 0C5.5 11 9 7.6 12 3z"/><path d="M9 15.5a3 3 0 0 0 3 3"/>',
    snow:    '<path d="M12 2.5v19M3.8 7.3l16.4 9.4M3.8 16.7l16.4-9.4"/><path d="M9.6 4.2 12 6.6l2.4-2.4M9.6 19.8 12 17.4l2.4 2.4"/>',
    shuffle: '<path d="M3 7h3.5c4.5 0 6.5 10 11 10H21M3 17h3.5c1.8 0 3-1.6 4.1-3.6M13.4 9.6C14.6 8 16 7 17.5 7H21"/><path d="M18 4l3 3-3 3M18 14l3 3-3 3"/>',
    magnet:  '<path d="M5 3.5h4v8a3 3 0 0 0 6 0v-8h4v8a7 7 0 0 1-14 0z"/><path d="M5 7.5h4M15 7.5h4"/>',
    shield:  '<path d="M12 3l7.5 2.8v5.7c0 4.6-3.2 8-7.5 9.5-4.3-1.5-7.5-4.9-7.5-9.5V5.8z"/><path d="M8.8 12.2l2.2 2.2 4.3-4.6"/>',
    spark:   '<path d="M12 2.5v4M12 17.5v4M2.5 12h4M17.5 12h4M5.3 5.3l2.8 2.8M15.9 15.9l2.8 2.8M5.3 18.7l2.8-2.8M15.9 8.1l2.8-2.8"/>'
  };
  const icon = (name, cls = "") =>
    `<svg class="gi ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[name] || ""}</svg>`;

  /* ---------- brand mark: a game controller ---------- */
  const gamepad = (cls = "") =>
    `<svg class="${cls}" viewBox="0 0 48 48" aria-hidden="true"><path d="M14 15h20c6 0 10 5 10 12v3c0 4-3 6-6 6-2 0-3.4-1-4.6-2.6L31 30H17l-2.4 3.4C13.4 35 12 36 10 36c-3 0-6-2-6-6v-3c0-7 4-12 10-12z" fill="#1a0b5e"/><path d="M14 21v8M10 25h8" stroke="#fff" stroke-width="3" stroke-linecap="round"/><circle cx="32" cy="22.5" r="2.4" fill="#ef4560"/><circle cx="36.5" cy="27" r="2.4" fill="#2d8cf0"/><circle cx="27.5" cy="27" r="2.4" fill="#2e9d48"/></svg>`;

  /* ---------- character avatars: 64 hand-drawn monsters (img/m/a0–a63.webp, thumbnails in img/m/s) ---------- */
  const N = 64;
  const AVATARS = Array.from({ length: N }, (_, i) => "a" + i);
  const idx = id => {
    const m = /^a(\d+)$/.exec(String(id || ""));
    if (m && +m[1] < N) return +m[1];
    let h = 0; for (const c of String(id || "x")) h = (h * 31 + c.codePointAt(0)) >>> 0;
    return h % N;
  };
  const INK = "#1d1d1f";
  const img = (src, cls = "") => `<img class="${cls}" src="img/${src}.webp" alt="" draggable="false">`;
  // small = 96px thumbnail (phone picker, tiny chips); default = 256px
  const avatar = (id, cls = "", small = false) => img((small ? "m/s/a" : "m/a") + idx(id), "avsvg " + cls);
  const mascot = (team, cls = "") => img(team === "blue" ? "team-blue" : "team-red", "mascot " + cls);
  // warm the cache so avatars appear instantly on slow 4G
  function preload(list){ for (const s of list){ const i = new Image(); i.src = "img/" + s + ".webp"; } }

  /* ---------- medals, badges, ball ---------- */
  const MEDAL = [["#ffd43b","#e67700"],["#e9ecef","#868e96"],["#ffb380","#c2410c"]];
  function medal(i){
    if (i > 2) return `<svg class="medal" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#e9ecef"/><text x="12" y="16" text-anchor="middle" font-size="11" font-weight="900" fill="#495057" font-family="Nunito,sans-serif">${i + 1}</text></svg>`;
    const [a, b] = MEDAL[i];
    return `<svg class="medal" viewBox="0 0 24 24"><path d="M7 1.5 10 9M17 1.5 14 9" stroke="#5c7cfa" stroke-width="3" stroke-linecap="round"/><circle cx="12" cy="14.5" r="8" fill="${a}" stroke="${b}" stroke-width="2"/><text x="12" y="18.3" text-anchor="middle" font-size="10" font-weight="900" fill="${b}" font-family="Nunito,sans-serif">${i + 1}</text></svg>`;
  }
  const three = () => `<svg class="medal" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#ff9f1c" stroke="#c26f00" stroke-width="2"/><text x="12" y="16.5" text-anchor="middle" font-size="12" font-weight="900" fill="#fff" font-family="Nunito,sans-serif">3</text></svg>`;
  const ball = (cls = "") => img("ball", "ballimg " + cls);

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

  return { icon, gamepad, avatar, AVATARS, mascot, img, preload, medal, three, ball, crowd };
})();

/* fill any <i data-i="name"> / <span data-art="gamepad"> placeholders in the page */
ART.hydrate = (root = document) => {
  root.querySelectorAll("[data-i]").forEach(el => { if (!el.dataset.done){ el.insertAdjacentHTML("afterbegin", ART.icon(el.dataset.i)); el.dataset.done = 1; } });
  const art = a => a === "gamepad" ? ART.gamepad() : a === "ball" ? ART.ball() : a === "logo" ? ART.avatar("a5", "logo")
    : a === "red" || a === "blue" ? ART.mascot(a) : a === "trophy" ? ART.img("trophy", "trophy") : /^a\d+$/.test(a) ? ART.avatar(a) : "";
  root.querySelectorAll("[data-art]").forEach(el => { if (!el.dataset.done){ el.insertAdjacentHTML("afterbegin", art(el.dataset.art)); el.dataset.done = 1; } });
};
if (document.readyState !== "loading") ART.hydrate(); else document.addEventListener("DOMContentLoaded", () => ART.hydrate());
