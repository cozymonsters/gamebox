/* ===== English GameBox · shared helpers (load after the Firebase SDK) ===== */
"use strict";
const GB = (() => {
  // Web config from Firebase console → Project settings → Your apps. apiKey/authDomain/appId are public identifiers (not passwords); teacher sign-in needs them.
  const FB = {
    projectId: "fun-english-abd9b",
    databaseURL: "https://fun-english-abd9b-default-rtdb.asia-southeast1.firebasedatabase.app",
    apiKey: "AIzaSyAkZ-EZhDKTq1KCaQTkPmyjXDYRWuCLXj4",
    authDomain: "fun-english-abd9b.firebaseapp.com",
    appId: "1:553629068314:web:563cbaf1731d484093f5a3"
  };
  firebase.initializeApp(Object.fromEntries(Object.entries(FB).filter(([k,v])=>v)));
  const db = firebase.database();
  let serverOffset = 0;
  db.ref(".info/serverTimeOffset").on("value", s => { serverOffset = s.val() || 0; });
  const now = () => Date.now() + serverOffset;

  const $ = id => document.getElementById(id);
  const show = (el, on = true) => el && el.classList.toggle("hidden", !on);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
  const store = { get(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } }, set(k,v){ try{ localStorage.setItem(k,v); }catch(e){} } };
  const rand = n => Math.floor(Math.random()*n);
  const pick = a => a[rand(a.length)];
  const shuffle = a => { for (let i=a.length-1;i>0;i--){ const j=rand(i+1); [a[i],a[j]]=[a[j],a[i]]; } return a; };
  const fmt = ms => { const s=Math.ceil(Math.max(0,ms)/1000); return Math.floor(s/60)+":"+String(s%60).padStart(2,"0"); };
  const params = new URLSearchParams(location.search);
  const baseUrl = location.origin + location.pathname;
  const dirUrl = baseUrl.replace(/[^\/]*$/, "");

  const AVATARS = ART.AVATARS;

  // Question sets live in each teacher's My Sets (kits.html, Firebase). There are no built-in banks on the site any more.
  // window.GB_QUIZ is only set by local test fixtures (fixtures/banks.js).
  const SETS = {};
  if (window.GB_QUIZ) for (const k in window.GB_QUIZ) SETS[k]=window.GB_QUIZ[k];
  const setSize = k => SETS[k].quiz ? SETS[k].quiz.length : parseWords(SETS[k].words).length;
  function parseWords(text){
    const out=[]; const seenEn=new Set(), seenZh=new Set();
    for (let line of String(text||"").split(/\r?\n/)){
      line=line.trim(); if(!line) continue;
      let en, zh;
      let m = line.match(/^(.+?)\s*[\t,，=:：]\s*(.+)$/);
      if (m && /[A-Za-z]/.test(m[1]) && !/[A-Za-z]/.test(m[2].replace(/[；;（）()]/g,""))) { en=m[1]; zh=m[2]; }
      else {                                                    // "warm up 暖身", "T-shirt T恤", "apple蘋果"
        m = line.match(/^([A-Za-z][A-Za-z\s'’.\-\/]*?)\s+(\S*[^\x00-\x7F].*)$/) || line.match(/^([A-Za-z][A-Za-z\s'’.\-\/]*?)\s*([^\x00-\x7F].*)$/);
        if(m){ en=m[1]; zh=m[2]; }
      }
      if(!en||!zh) continue;
      en=en.trim().replace(/\s+/g," "); zh=zh.trim().replace(/^[\-–—:：,，\s]+/,"");
      if(!en||!zh) continue;
      const k=en.toLowerCase(); if(seenEn.has(k)||seenZh.has(zh)) continue;
      seenEn.add(k); seenZh.add(zh); out.push([en,zh]);
    }
    return out;
  }

  /* ---- sound ---- */
  let actx=null;
  function beep(freq=660,dur=.12,type="sine",vol=.2,when=0,slide=0){
    try{
      actx = actx || new (window.AudioContext||window.webkitAudioContext)();
      const t=actx.currentTime+when, o=actx.createOscillator(), g=actx.createGain();
      o.type=type; o.frequency.setValueAtTime(freq,t); if(slide) o.frequency.exponentialRampToValueAtTime(slide,t+dur);
      g.gain.setValueAtTime(vol,t); g.gain.exponentialRampToValueAtTime(.001,t+dur);
      o.connect(g).connect(actx.destination); o.start(t); o.stop(t+dur+.02);
    }catch(e){}
  }
  const unlockAudio = () => document.addEventListener("click",()=>{ try{ actx=actx||new (window.AudioContext||window.webkitAudioContext)(); actx.resume(); }catch(e){} },{once:true});
  const fanfare = (delay=0) => { [523,659,784,1047].forEach((f,i)=>beep(f,.3,"triangle",.25,delay+i*.14)); beep(1047,.8,"triangle",.25,delay+.6); beep(1319,.8,"triangle",.18,delay+.6); };
  const buzzer = () => { beep(180,.9,"sawtooth",.18); beep(186,.9,"square",.1); };
  // pronunciation: recorded Microsoft Ava Neural voice (audio/<slug>.mp3) for the built-in word lists; the browser voice for anything else
  const VOICED = new Set("answer athlete attack bag break captain catch champion classmate classroom coach court defense desk early eraser exam fan forget foul friend goal grade gym happy history holiday homework hungry injury jump kick late league library listen lose lunch match math medal muscle nervous notebook opponent player practice proud question race read record referee remember ruler schedule science score speak spectator speed sprint stadium stamina strength stretch subject substitute sweat swim teacher team teammate teamwork throw tie tired tournament train trophy uniform victory warm-up weekend whistle win write".split(" "));   // regenerate with gen_audio.py when word lists change
  const voiceSlug = t => String(t).toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
  // one shared <audio> element: once it has played inside a tap, phones (iOS too) let it play again later without a tap
  let voiceAudio = null, voiceDone = null;
  const voiceEl = () => voiceAudio || (voiceAudio = new Audio());
  const voice = { blocked:false, primed:false };   // true when the browser refused to play before the first tap
  // both return a promise that settles when the word has been said (or after 3 s, whichever comes first)
  function browserVoice(text){
    return new Promise(res=>{
      try{ speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(text); u.lang="en-US"; u.rate=.85; u.onend=()=>res(); u.onerror=e=>{ if (e && e.error==="not-allowed") voice.blocked=true; res(); }; speechSynthesis.speak(u); }catch(e){ res(); }
      setTimeout(res, 3000);
    });
  }
  function speak(text){
    const k=voiceSlug(text);
    if (voiceDone) { voiceDone(); voiceDone=null; }
    if (VOICED.has(k)){
      try{
        const a=voiceEl(); a.pause(); a.muted=false; a.src=dirUrl+"audio/"+k+".mp3";
        return new Promise(res=>{
          voiceDone=res; a.onended=()=>res(); setTimeout(res, 3000);
          const p=a.play();
          if (p && p.then) p.then(()=>{ voice.blocked=false; }, err=>{ if (err && err.name==="NotAllowedError") { voice.blocked=true; res(); } else browserVoice(text).then(res); });
        });
      }catch(e){}
    }
    return browserVoice(text);
  }
  // call inside a tap: unlocks the shared audio element and the browser voice for later automatic playback
  function primeVoice(){
    if (voice.primed) return; voice.primed=true;
    try{ const a=voiceEl(); if (a.paused){ a.muted=true; if (!a.src) a.src=dirUrl+"audio/win.mp3"; const p=a.play(); if (p && p.then) p.then(()=>{ if (a.muted){ a.pause(); a.muted=false; } },()=>{ a.muted=false; }); } }catch(e){}
    try{ const u=new SpeechSynthesisUtterance(" "); u.volume=0; speechSynthesis.speak(u); }catch(e){}
  }

  function confetti(canvas){
    const ctx=canvas.getContext("2d"); const W=canvas.width=canvas.offsetWidth, H=canvas.height=canvas.offsetHeight;
    const cols=["#e0533d","#3a78c9","#f2c14e","#5fae7b","#9b8fd6","#e98bb0","#5bbcbc","#e2683a"];
    const ps=Array.from({length:180},()=>({x:Math.random()*W,y:-20-Math.random()*H*.6,vx:(Math.random()-.5)*4,vy:2+Math.random()*4,r:Math.random()*6.28,vr:(Math.random()-.5)*.3,w:8+Math.random()*8,h:6+Math.random()*6,c:pick(cols)}));
    const t0=performance.now();
    (function f(t){ ctx.clearRect(0,0,W,H);
      for(const p of ps){ p.x+=p.vx; p.y+=p.vy; p.vy+=.04; p.r+=p.vr; ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.r); ctx.fillStyle=p.c; ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h); ctx.restore(); }
      if(t-t0<5000) requestAnimationFrame(f); else ctx.clearRect(0,0,W,H);
    })(t0);
  }

  /* ---- teacher accounts & kits (question banks saved in Firebase) ----
     kits/{id}              { owner, name, type:"words"|"quiz", items, count, updated }  readable by anyone who has the id (students practise / play it)
     users/{uid}/kits/{id}  { name, type, count, updated }                                the teacher's own list (only they can read it)
     users/{uid}/starter    true once the built-in banks have been copied into the account
     Only teachers sign in (Google). Students never need an account. */
  const AUTH_SRC = "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js";
  const account = {
    ready: !!(FB.apiKey && FB.authDomain),   // false until the web config is filled in above
    user: null, loaded: false, _subs: [], _p: null,
    load(){                                   // the auth SDK is loaded only when needed (phones never load it)
      if (!account.ready) { account.loaded=true; return Promise.resolve(null); }
      if (account._p) return account._p;
      account._p = new Promise(res=>{
        const go=()=>{ try{ firebase.auth().onAuthStateChanged(u=>{ account.user=u||null; account.loaded=true; res(account.user); for (const f of account._subs) f(account.user); }); }catch(e){ account.loaded=true; res(null); } };
        if (firebase.auth) return go();
        const sc=document.createElement("script"); sc.src=AUTH_SRC; sc.onload=go; sc.onerror=()=>{ account.loaded=true; res(null); }; document.head.appendChild(sc);
      });
      return account._p;
    },
    onChange(f){ account._subs.push(f); if (account.loaded) f(account.user); else account.load().then(()=>{ if (!account.ready) f(null); }); },
    async signIn(){
      await account.load(); const p=new firebase.auth.GoogleAuthProvider(); p.setCustomParameters({ prompt:"select_account" });
      try{ return await firebase.auth().signInWithPopup(p); }
      catch(e){ if (e && /popup-blocked|operation-not-supported/.test(e.code||"")) return firebase.auth().signInWithRedirect(p); throw e; }
    },
    signOut(){ return firebase.auth().signOut(); }
  };
  const arr = x => Array.isArray(x) ? x : Object.keys(x||{}).sort((a,b)=>a-b).map(k=>x[k]);   // Firebase may hand arrays back as objects
  const txt = (x, n) => String(x==null?"":x).replace(/\s+/g," ").trim().slice(0, n);
  function cleanItems(type, items){
    items = arr(items);
    if (type==="quiz") return items.map(it=>{
      const o=arr(it.o).map(x=>txt(x,160)).filter(Boolean).slice(0,4), q={ q:txt(it.q,400), o, a:Math.max(0,Math.min(o.length-1, +it.a||0)) };
      if (txt(it.s,400)) q.s=txt(it.s,400); if (txt(it.w,300)) q.w=txt(it.w,300); return q;
    }).filter(q=>q.q && q.o.length>=2);
    return items.map(p=>{ p=arr(p); return [txt(p[0],60), txt(p[1],60)]; }).filter(p=>p[0] && p[1]);
  }
  // Right after sign-in the database may not have the new login yet, so a first read/write can be refused: try again a few times.
  async function authed(fn){
    for (let i=0;;i++){
      try{ return await fn(); }
      catch(e){ if (i>=4 || !/permission/i.test((e&&(e.code||e.message))||"")) throw e; await new Promise(r=>setTimeout(r,400*(i+1))); }
    }
  }
  const kits = {
    MAX: 300,
    async list(){
      const u=account.user; if (!u) return [];
      const v=(await authed(()=>db.ref("users/"+u.uid+"/kits").get())).val()||{};
      return Object.entries(v).map(([id,k])=>Object.assign({id},k)).sort((a,b)=>(b.updated||0)-(a.updated||0));
    },
    async get(id){
      if (!/^[-\w]{6,40}$/.test(String(id||""))) return null;
      const v=(await db.ref("kits/"+id).get()).val(); if (!v) return null;
      return { id, owner:v.owner, name:v.name||"Untitled set", type:v.type==="quiz"?"quiz":"words", items:cleanItems(v.type, v.items), updated:v.updated };
    },
    async save(kit){
      const u=account.user; if (!u) throw new Error("Please sign in again.");
      const type=kit.type==="quiz"?"quiz":"words", items=cleanItems(type, kit.items).slice(0,kits.MAX), name=txt(kit.name,60)||"Untitled set";
      const id=kit.id || db.ref("kits").push().key, T=firebase.database.ServerValue.TIMESTAMP;
      await authed(()=>db.ref().update({ ["kits/"+id]:{ owner:u.uid, name, type, items, count:items.length, updated:T },
                                         ["users/"+u.uid+"/kits/"+id]:{ name, type, count:items.length, updated:T } }));
      return id;
    },
    async remove(id){ const u=account.user; await authed(()=>db.ref().update({ ["kits/"+id]:null, ["users/"+u.uid+"/kits/"+id]:null })); },
    async duplicate(id){ const k=await kits.get(id); return kits.save({ name:(k.name+" (copy)").slice(0,60), type:k.type, items:k.items }); },
    // first sign-in: copy the built-in banks into the account (saved last-to-first so the list shows them in the usual order)
    async starter(){
      const u=account.user; if (!u) return 0;
      const ref=db.ref("users/"+u.uid+"/starter"); if ((await authed(()=>ref.get())).val()) return 0;
      const keys=Object.keys(SETS).reverse();
      for (const k of keys){ const S=SETS[k]; await kits.save({ name:S.name, type:S.quiz?"quiz":"words", items:S.quiz?S.quiz:parseWords(S.words) }); await new Promise(r=>setTimeout(r,30)); }
      await ref.set(true); return keys.length;
    }
  };

  /* ---- host helpers ---- */
  const host = {
    netStatus(el){ db.ref(".info/connected").on("value",s=>{ const on=!!s.val(); el.textContent=on?"Online":"Reconnecting…"; el.classList.toggle("off",!on); }); },

    // reuse ?host=CODE if it belongs to this game, else make a new room
    async openRoom(game, existing){
      let code = String(existing||"").replace(/\D/g,"");
      if (code.length===4){
        const m=(await db.ref("rooms/"+code+"/meta").get()).val();
        if (!m || (m.game||"tug")!==game) code="";
      } else code="";
      if (!code){
        for (let i=0;i<25 && !code;i++){
          const c=String(1000+rand(9000));
          const m=(await db.ref("rooms/"+c+"/meta").get()).val();
          if (!m || (Date.now()-(m.created||0)) > 6*3600e3){
            await db.ref("rooms/"+c).set({ meta:{ game, state:"lobby", round:0, created:firebase.database.ServerValue.TIMESTAMP } });
            code=c;
          }
        }
      }
      history.replaceState(null,"",baseUrl+"?host="+code);
      host.code=code;
      return code;
    },

    drawQR(url, el){
      const s=document.createElement("script");
      s.src="https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.js";
      s.onload=()=>{ const q=qrcode(0,"M"); q.addData(url); q.make(); el.innerHTML=q.createImgTag(8,0); };
      s.onerror=()=>{ el.innerHTML='<div style="color:#333;padding:14px;line-height:1.3;font-weight:700">QR code<br>failed to load</div>'; };
      document.head.appendChild(s);
    },

    // settings: <select id=sSet>, plus any selects listed in ids (remembered per teacher)
    // Question Set: the signed-in teacher's sets from My Sets (kits.html). Internally a set is still called a "kit".
    myKits: null, kitCache: {}, extraKit: null,
    initSettings(ids){
      const sel=$("sSet"), want=(params.get("kit")||"").trim();   // ?kit=<id> comes from "Play Live" on the My Sets page
      const opt=(parent,v,t)=>{ const o=document.createElement("option"); o.value=v; o.textContent=t; parent.appendChild(o); return o; };
      const label=k=>k.name+" ("+k.count+(k.type==="quiz"?" questions)":" words)");
      const fill=()=>{
        sel.innerHTML="";
        if (host.extraKit && !(host.myKits||[]).some(k=>k.id===host.extraKit.id)){ const g=document.createElement("optgroup"); g.label="Shared set"; sel.appendChild(g); opt(g,"kit:"+host.extraKit.id,label(host.extraKit)); }
        if (host.myKits){
          const g=document.createElement("optgroup"); g.label="My Sets"; sel.appendChild(g);
          for (const k of host.myKits) opt(g,"kit:"+k.id,label(k));
        } else for (const k in SETS) opt(sel,k,SETS[k].name+" ("+setSize(k)+(SETS[k].quiz?" questions)":" words)"));
        if (!sel.options.length){ const o=opt(sel,"", !account.loaded ? "Loading your sets…" : !account.user ? "Sign in to My Sets to choose a set" : host.kitsErr ? "Couldn't load your sets. Reload the page." : "No sets yet. Make one in My Sets."); o.disabled=true; }
        const saved=store.get("tug.set"); if (saved && [...sel.options].some(o=>o.value===saved)) sel.value=saved;
        if (!sel.value && sel.options.length) sel.selectedIndex=0;
      };
      const kitInfo=v=>{ const id=String(v||"").slice(4); return (host.myKits||[]).find(k=>k.id===id) || (host.extraKit&&host.extraKit.id===id?host.extraKit:null); };
      const isQuiz=v=> v.startsWith("kit:") ? !!(kitInfo(v)&&kitInfo(v).type==="quiz") : !!(SETS[v]&&SETS[v].quiz);
      const modeLock=()=>{ const m=$("sMode"); if(!m) return; const quiz=isQuiz(sel.value); m.disabled=quiz; const row=m.closest(".setrow"); if(row) row.style.opacity=quiz?.45:""; };
      const prefetch=()=>{ const v=sel.value; if (!v.startsWith("kit:")) return; const id=v.slice(4); if (!host.kitCache[id]) kits.get(id).then(k=>{ if(k) host.kitCache[id]=k; }).catch(()=>{}); };
      // "Edit" opens the chosen set in My Sets (or the list when nothing is chosen)
      const editLink=()=>{ const a=$("kitsLink"); if (a) a.href = dirUrl+"kits.html"+(sel.value.startsWith("kit:") && kitInfo(sel.value) && (host.myKits||[]).some(k=>k.id===sel.value.slice(4)) ? "#edit="+sel.value.slice(4) : ""); };
      const refresh=()=>{ fill(); modeLock(); prefetch(); editLink(); };
      refresh();
      sel.onchange=()=>{ store.set("tug.set",sel.value); modeLock(); prefetch(); editLink(); };
      // signed-in teachers see their own kits
      account.onChange(async u=>{
        host.kitsErr=false;
        try{ host.myKits = u ? await kits.list() : null; }catch(e){ host.myKits = u ? [] : null; host.kitsErr=!!u; }
        if (want && !host.extraKit){ const k=await kits.get(want).catch(()=>null); if (k){ host.kitCache[k.id]=k; host.extraKit={ id:k.id, name:k.name, type:k.type, count:k.items.length }; store.set("tug.set","kit:"+k.id); } }
        refresh();
      });
      // "Edit" link next to the menu: sets are made and edited in My Sets (kits.html)
      if (!$("kitsLink")){
        const a=document.createElement("a"); a.className="btn-soft"; a.id="kitsLink"; a.href=dirUrl+"kits.html"; a.innerHTML=ART.icon("pencil")+" Edit"; a.title="Make and edit sets in My Sets";
        sel.insertAdjacentElement("afterend", a); editLink();
      }
      // practice: a QR code students scan to practise (4-choice quiz, cards.html) the selected list on their phones before the game
      if (!$("cardsBtn")){
        const b=document.createElement("button"); b.className="btn-soft"; b.id="cardsBtn"; b.innerHTML=ART.icon("qr")+" Practice";
        $("kitsLink").insertAdjacentElement("afterend", b);
        const m=document.createElement("div"); m.className="modal hidden"; m.id="cardsModal";
        m.innerHTML=`<div class="mcard cardsm"><div class="mh">${ART.icon("qr")} Practice before the game</div><div class="mb">
          <div class="cq"><div class="qrbox" id="cardsQR"></div><div class="ctext"><b id="cardsName"></b><span id="cardsCount"></span>
          <p>Scan to practise on your phone. Missed questions come back until you get them right.</p></div></div>
          <div class="row"><button class="go" id="cardsDone">Done</button></div></div></div>`;
        document.body.appendChild(m);
        m.onclick=e=>{ if(e.target===m) show(m,false); };
        $("cardsDone").onclick=()=>show(m,false);
        b.onclick=async()=>{
          const k=sel.value, kit=k.startsWith("kit:"), list=host.words(), quiz=isQuiz(k);
          if (!k){ $("cardsName").textContent="No question set yet"; $("cardsCount").textContent="Sign in to My Sets and choose a set first."; $("cardsQR").innerHTML=""; show(m); return; }
          $("cardsName").textContent = kit ? (kitInfo(k)||{}).name||"Set" : (SETS[k]||{}).name||"";
          $("cardsCount").textContent = (kit && kitInfo(k) ? kitInfo(k).count : list.length)+(quiz?" questions":" words");
          $("cardsQR").innerHTML='<div class="qrwait">Loading…</div>'; show(m);
          const url = kit ? dirUrl+"cards.html?k="+k.slice(4) : dirUrl+"cards.html?set="+k;
          host.drawQR(url, $("cardsQR"));
        };
      }
      for (const id of ids){ const el=$(id); const v=store.get("tug."+id); if(v && [...el.options].some(o=>o.value===v)) el.value=v; el.onchange=()=>store.set("tug."+id,el.value); }
    },
    words(){
      const k=$("sSet").value;
      if (k.startsWith("kit:")){ const c=host.kitCache[k.slice(4)]; return c ? c.items : []; }
      return SETS[k] ? (SETS[k].quiz ? SETS[k].quiz : parseWords(SETS[k].words)) : [];
    },
    // the selected bank's questions, waiting for a kit to finish loading if needed
    async wordsReady(){
      const k=$("sSet").value;
      if (k.startsWith("kit:") && !host.kitCache[k.slice(4)]){ const c=await kits.get(k.slice(4)).catch(()=>null); if (c) host.kitCache[c.id]=c; }
      return host.words();
    },

    teams(players){
      const r=[], b=[];
      for (const id in players){ const p={id,...players[id]}; if(!p.name) continue; (p.team==="blue"?b:r).push(p); }
      const byJoin=(x,y)=>(x.joined||0)-(y.joined||0);
      r.sort(byJoin); b.sort(byJoin); return {r,b};
    },

    // lobby team columns: #rNames #bNames #rN #bN, chips with switch/remove
    renderLobby(players, ref){
      const {r,b}=host.teams(players);
      const chips = list => list.length ? list.map(p=>`<span class="pchip${p.online===false?" off":""}"><span class="av">${ART.avatar(p.av,"",true)}</span>${esc(p.name)}<button data-sw="${p.id}" title="Switch team">${ART.icon("swap")}</button><button data-x="${p.id}" title="Remove">${ART.icon("x")}</button></span>`).join("")
        : `<div class="waiting">Waiting for players…<br><span class="dots"><i></i><i></i><i></i></span></div>`;
      $("rNames").innerHTML=chips(r); $("bNames").innerHTML=chips(b);
      $("rN").textContent=r.length; $("bN").textContent=b.length;
      for (const el of document.querySelectorAll("[data-sw]")) el.onclick=()=>{ const p=players[el.dataset.sw]; if(p) ref.child("players/"+el.dataset.sw+"/team").set(p.team==="blue"?"red":"blue"); };
      for (const el of document.querySelectorAll("[data-x]")) el.onclick=()=>{ ref.child("players/"+el.dataset.x).remove(); };
      return {r,b};
    }
  };

  /* ---- player join helper ----
     opts: { game, ref, code, extra:{...fields reset on join}, onEnter() } */
  const join = {
    async checkGame(game, code){
      try{
        const m=(await db.ref("rooms/"+code+"/meta").get()).val();
        if (m && (m.game||"tug")!==game){ location.replace(dirUrl+(m.game||"tug")+".html?r="+code); return false; }
        return { exists: !!m };
      }catch(e){ return { exists: true }; }
    },
    setup(P, opts){
      document.documentElement.classList.add("phone");      // phone pages: cream all the way down (Safari tints its toolbar with the page background)
      P.pid = store.get("tug.pid") || ("p"+Date.now().toString(36)+rand(1e6).toString(36));
      store.set("tug.pid",P.pid);
      P.name = store.get("tug.name")||"";
      P.av = store.get("tug.av"); if (!AVATARS.includes(P.av)) P.av = pick(AVATARS);
      $("pCodeLbl").textContent=opts.code;
      if (!$("pName").value) $("pName").value=P.name; P.showAv();
      // monsters are dealt at random (no picking): keep this phone's last monster unless someone in the room already has it
      const deal=used=>{
        if (!AVATARS.includes(P.av) || used.has(P.av)){ const free=AVATARS.filter(a=>!used.has(a)); P.av=pick(free.length?free:AVATARS); }
        store.set("tug.av",P.av); P.showAv();
      };
      deal(new Set());
      opts.ref.child("players").get().then(s=>{ const all=s.val()||{}; deal(new Set(Object.keys(all).filter(id=>id!==P.pid && all[id] && all[id].av).map(id=>all[id].av))); }).catch(()=>{});
      const check=()=>{ $("pGo").disabled=!($("pName").value.trim() && P.team); };
      const pickTeam=t=>{ P.team=t; document.querySelectorAll(".tbtn").forEach(b=>b.classList.toggle("sel",b.dataset.team===t)); check(); };
      document.querySelectorAll(".tbtn").forEach(b=>b.onclick=()=>pickTeam(b.dataset.team));
      const lastTeam=store.get("tug.team"); if (lastTeam) pickTeam(lastTeam);
      $("pName").oninput=check; check();
      opts.ref.child("players/"+P.pid).get().then(s=>{ const v=s.val(); if (v && v.name){ P.name=v.name; P.team=v.team; if(v.av) P.av=v.av; opts.onEnter(); } }).catch(()=>{});
      $("pGo").onclick=async()=>{
        const name=$("pName").value.trim().slice(0,8);
        if(!name||!P.team) return;
        $("pGo").disabled=true; $("pErr").textContent="";
        try{
          const s=await opts.ref.child("meta/state").get();
          if(!s.exists()){ $("pErr").textContent="Room not found. Check the code on the big screen."; $("pGo").disabled=false; return; }
          P.name=name; store.set("tug.name",name); store.set("tug.team",P.team);
          await opts.ref.child("players/"+P.pid).update(Object.assign({name, team:P.team, av:P.av, online:true, joined:firebase.database.ServerValue.TIMESTAMP}, opts.extra||{}));
          opts.onEnter();
        }catch(e){ $("pErr").textContent="No connection. Check your internet and try again."; $("pGo").disabled=false; }
      };
      document.addEventListener("visibilitychange",()=>{ if(document.visibilityState==="visible" && P.joined) opts.ref.child("players/"+P.pid+"/online").set(true); });
    },
    presence(P, ref){
      const me=ref.child("players/"+P.pid);
      me.child("online").onDisconnect().set(false); me.child("online").set(true);
      if (!P._connHooked){ P._connHooked=true;
        db.ref(".info/connected").on("value",s=>{ if(s.val() && P.joined){ const m2=ref.child("players/"+P.pid); m2.child("online").onDisconnect().set(false); m2.child("online").set(true);} });
      }
      return me;
    },
    kicked(P, ref, me, v){
      P.joined=false; me.off(); ref.child("meta").off();
      me.child("online").onDisconnect().cancel(); if (v) me.remove();
      clearInterval(P.timerInt);
      for (const id of ["pWait","pPlay","pEnd","pCount"]) show($(id),false);
      show($("pJoin"),true);
      $("pErr").textContent="The teacher removed you. You can join again."; $("pGo").disabled=false;
    }
  };

  // tiny shared question maker: returns {en,zh,dir,answer,opts[]}
  function makeQuestion(W, mode, recent){
    let i, guard=0;
    do { i=rand(W.length); } while (recent.includes(i) && guard++<50);
    recent.push(i); if (recent.length>Math.min(Array.isArray(W[0])?8:Math.floor(W.length*.6),W.length-1)) recent.shift();   // quiz banks: don't repeat a question too soon
    if (!Array.isArray(W[i])){                                   // multiple-choice item {q,s,o,a,w}
      const it=W[i]; return { quiz:true, text:it.q, sub:it.s||"", why:it.w||"", choices:it.o, answer:it.a, opts:shuffle(it.o.map((_,k)=>k)) };
    }
    const dir = mode==="mix" ? (Math.random()<.5?"en2zh":"zh2en") : mode;
    const pool=shuffle(W.map((_,k)=>k).filter(k=>k!==i)).slice(0,3);
    return { en:W[i][0], zh:W[i][1], dir, answer:i, opts:shuffle([i,...pool]) };
  }

  // shared by every game: draw the next question on the phone (Player needs meta, recent, q, answer())
  function renderQuestion(P){
    const W=P.meta.words||[]; if(W.length<4) return;
    const q=makeQuestion(W, P.meta.mode||"mix", P.recent);
    P.q=q;
    const card=$("pQ").parentNode, old=card.querySelector(".why, .qsub"); if (old) old.remove();
    card.querySelectorAll(".why, .qsub").forEach(e=>e.remove());
    $("pQ").classList.toggle("long", !!q.quiz); $("pOpts").classList.toggle("long", !!q.quiz); card.classList.toggle("quiz", !!q.quiz); document.body.classList.toggle("quizq", !!q.quiz);
    if (q.quiz){
      $("pAsk").textContent = "Choose the best answer";
      $("pQ").textContent = q.text; $("pQ").classList.remove("zh");
      if (q.sub){ const d=document.createElement("div"); d.className="qsub"+(/[\u4e00-\u9fff]/.test(q.sub.replace(/^原文[^：:]*[：:]/,""))?"":" en"); d.textContent=q.sub; card.appendChild(d); }
      show($("pSay"), false);
      $("pOpts").innerHTML = q.opts.map(k=>`<button class="opt" data-k="${k}">${esc(q.choices[k])}</button>`).join("");
    } else {
      const isEn = q.dir==="en2zh";
      $("pAsk").textContent = isEn ? "What does it mean?" : "Which English word?";
      $("pQ").textContent = isEn ? q.en : q.zh;
      $("pQ").classList.toggle("zh",!isEn);
      show($("pSay"), isEn);
      $("pOpts").innerHTML = q.opts.map(k=>`<button class="opt" data-k="${k}">${esc(isEn?W[k][1]:W[k][0])}</button>`).join("");
    }
    for (const b of $("pOpts").children) b.onclick=()=>P.answer(+b.dataset.k,b);
  }
  // after a wrong answer: show why (quiz items) and keep it on screen long enough to read
  function showWhy(q){
    if (!q || !q.quiz || !q.why) return;
    const card=$("pQ").parentNode; card.querySelectorAll(".why").forEach(e=>e.remove());
    const d=document.createElement("div"); d.className="why"; d.textContent=q.why; card.appendChild(d);
  }
  const wrongMs = q => q && q.quiz ? 3200 : 1400;

  return { db, now, $, show, esc, store, rand, pick, shuffle, fmt, params, baseUrl, dirUrl, AVATARS, SETS, parseWords, account, kits,
           beep, unlockAudio, fanfare, buzzer, speak, voice, primeVoice, confetti, host, join, makeQuestion, renderQuestion, showWhy, wrongMs };
})();
