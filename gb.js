/* ===== English GameBox · shared helpers (load after the Firebase SDK) ===== */
"use strict";
const GB = (() => {
  firebase.initializeApp({
    projectId: "fun-english-abd9b",
    databaseURL: "https://fun-english-abd9b-default-rtdb.asia-southeast1.firebasedatabase.app"
  });
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

  const SETS = {
    sports: { name: "Sports", words: `coach 教練
referee 裁判
athlete 運動員
team 隊伍
player 選手
captain 隊長
teammate 隊友
opponent 對手
fan 球迷
champion 冠軍
medal 獎牌
trophy 獎盃
score 得分
win 贏
lose 輸
match 比賽
race 賽跑
tournament 錦標賽
practice 練習
train 訓練
warm up 暖身
stretch 伸展
sprint 衝刺
jump 跳
throw 丟；投擲
catch 接住
kick 踢
swim 游泳
injury 受傷
muscle 肌肉
sweat 汗水
stamina 耐力
strength 力量
speed 速度
whistle 哨子
goal 球門；目標
foul 犯規
defense 防守
gym 體育館
stadium 體育場
record 紀錄
tie 平手` },
    school: { name: "School Life", words: `teacher 老師
classmate 同學
classroom 教室
homework 回家作業
exam 考試
grade 成績
notebook 筆記本
eraser 橡皮擦
ruler 尺
desk 書桌
library 圖書館
lunch 午餐
break 下課休息
uniform 制服
bag 書包
question 問題
answer 答案
listen 聽
speak 說
read 閱讀
write 寫
remember 記得
forget 忘記
late 遲到的
early 早的
tired 累的
hungry 餓的
happy 開心的
nervous 緊張的
proud 驕傲的
friend 朋友
weekend 週末
holiday 假日
schedule 時間表
subject 科目
history 歷史
science 科學
math 數學` }
  };
  function parseWords(text){
    const out=[]; const seenEn=new Set(), seenZh=new Set();
    for (let line of String(text||"").split(/\r?\n/)){
      line=line.trim(); if(!line) continue;
      let en, zh;
      let m = line.match(/^(.+?)\s*[\t,，=:：]\s*(.+)$/);
      if (m && /[A-Za-z]/.test(m[1]) && !/[A-Za-z]/.test(m[2].replace(/[；;（）()]/g,""))) { en=m[1]; zh=m[2]; }
      else { m = line.match(/^([A-Za-z][A-Za-z\s'’.\-\/]*?)\s*([^A-Za-z].*)$/); if(m){ en=m[1]; zh=m[2]; } }
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
  function speak(text){ try{ speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(text); u.lang="en-US"; u.rate=.85; speechSynthesis.speak(u);}catch(e){} }

  function confetti(canvas){
    const ctx=canvas.getContext("2d"); const W=canvas.width=canvas.offsetWidth, H=canvas.height=canvas.offsetHeight;
    const cols=["#ef4560","#2d8cf0","#ffc83d","#2e9d48","#8e44ad","#e84393","#ff9f1c"];
    const ps=Array.from({length:180},()=>({x:Math.random()*W,y:-20-Math.random()*H*.6,vx:(Math.random()-.5)*4,vy:2+Math.random()*4,r:Math.random()*6.28,vr:(Math.random()-.5)*.3,w:8+Math.random()*8,h:6+Math.random()*6,c:pick(cols)}));
    const t0=performance.now();
    (function f(t){ ctx.clearRect(0,0,W,H);
      for(const p of ps){ p.x+=p.vx; p.y+=p.vy; p.vy+=.04; p.r+=p.vr; ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.r); ctx.fillStyle=p.c; ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h); ctx.restore(); }
      if(t-t0<5000) requestAnimationFrame(f); else ctx.clearRect(0,0,W,H);
    })(t0);
  }

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
    initSettings(ids){
      const sel=$("sSet");
      const fill=()=>{
        sel.innerHTML="";
        for (const k in SETS){ const o=document.createElement("option"); o.value=k; o.textContent=SETS[k].name+" ("+parseWords(SETS[k].words).length+" words)"; sel.appendChild(o); }
        const custom=parseWords(store.get("tug.custom")||"");
        if (custom.length>=4){ const o=document.createElement("option"); o.value="custom"; o.textContent="My Words ("+custom.length+" words)"; sel.appendChild(o); }
        const saved=store.get("tug.set"); if (saved && [...sel.options].some(o=>o.value===saved)) sel.value=saved;
      };
      fill();
      sel.onchange=()=>store.set("tug.set",sel.value);
      for (const id of ids){ const el=$(id); const v=store.get("tug."+id); if(v && [...el.options].some(o=>o.value===v)) el.value=v; el.onchange=()=>store.set("tug."+id,el.value); }
      // word editor modal
      $("editWords").onclick=()=>{ $("wordText").value=store.get("tug.custom")||""; $("wordErr").textContent=""; show($("wordModal")); $("wordText").focus(); };
      $("wordCancel").onclick=()=>show($("wordModal"),false);
      $("wordSave").onclick=()=>{
        const list=parseWords($("wordText").value);
        if (list.length<4){ $("wordErr").textContent="Found "+list.length+" words. Need at least 4 (format: English 中文)."; return; }
        store.set("tug.custom",$("wordText").value); store.set("tug.set","custom");
        fill(); sel.value="custom"; show($("wordModal"),false);
      };
    },
    words(){
      const k=$("sSet").value;
      return k==="custom" ? parseWords(store.get("tug.custom")||"") : parseWords(SETS[k].words);
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
      const chips = list => list.length ? list.map(p=>`<span class="pchip${p.online===false?" off":""}"><span class="av">${ART.avatar(p.av)}</span>${esc(p.name)}<button data-sw="${p.id}" title="Switch team">${ART.icon("swap")}</button><button data-x="${p.id}" title="Remove">${ART.icon("x")}</button></span>`).join("")
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
      P.pid = store.get("tug.pid") || ("p"+Date.now().toString(36)+rand(1e6).toString(36));
      store.set("tug.pid",P.pid);
      P.name = store.get("tug.name")||"";
      P.av = store.get("tug.av"); if (!AVATARS.includes(P.av)) P.av = pick(AVATARS);
      $("pCodeLbl").textContent=opts.code;
      if (!$("pName").value) $("pName").value=P.name; P.showAv();
      $("pAvBtn").onclick=()=>{ let a; do{ a=pick(AVATARS); }while(a===P.av); P.av=a; store.set("tug.av",a); P.showAv(); beep(700,.06,"triangle",.12); };
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
    recent.push(i); if (recent.length>Math.min(8,W.length-1)) recent.shift();
    const dir = mode==="mix" ? (Math.random()<.5?"en2zh":"zh2en") : mode;
    const pool=shuffle(W.map((_,k)=>k).filter(k=>k!==i)).slice(0,3);
    return { en:W[i][0], zh:W[i][1], dir, answer:i, opts:shuffle([i,...pool]) };
  }

  return { db, now, $, show, esc, store, rand, pick, shuffle, fmt, params, baseUrl, dirUrl, AVATARS, SETS, parseWords,
           beep, unlockAudio, fanfare, buzzer, speak, confetti, host, join, makeQuestion };
})();
