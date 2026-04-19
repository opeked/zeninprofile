/* ═══════════════════════════════════════════════
   THRAGG EMPIRE — SHARED DATA ENGINE
   Captura de IP corrigida e otimizada
═══════════════════════════════════════════════ */

const DB = {
  get(key){ 
    try{ return JSON.parse(localStorage.getItem(key)) } catch{ return null } 
  },
  set(key, val){ 
    try{ localStorage.setItem(key, JSON.stringify(val)) } catch{} 
  },

  getVisits(){ 
    return this.get('tg_visits') || { total:0, today:0, todayKey:'', days:{}, log:[] } 
  },

  bumpVisit(page){
    const v = this.getVisits();
    const dk = new Date().toISOString().slice(0,10);

    v.total = (v.total||0) + 1;
    v.days = v.days || {};
    v.days[dk] = (v.days[dk]||0) + 1;
    if(v.todayKey !== dk){ v.today = 0; v.todayKey = dk; }
    v.today = (v.today||0) + 1;

    const ua = navigator.userAgent;
    let browser = 'Desconhecido';
    if(/Edg/.test(ua)) browser = 'Edge';
    else if(/OPR|Opera/.test(ua)) browser = 'Opera';
    else if(/Chrome/.test(ua)) browser = 'Chrome';
    else if(/Firefox/.test(ua)) browser = 'Firefox';
    else if(/Safari/.test(ua)) browser = 'Safari';

    let os = 'Desconhecido';
    if(/Windows/.test(ua)) os = 'Windows';
    else if(/Android/.test(ua)) os = 'Android';
    else if(/iPhone|iPad/.test(ua)) os = 'iOS';
    else if(/Mac/.test(ua)) os = 'macOS';
    else if(/Linux/.test(ua)) os = 'Linux';

    const now = new Date();

    const entry = {
      time: now.toLocaleString('pt-BR'),
      page: page || 'Início',
      browser,
      os,
      lang: navigator.language || '—',
      screen: window.screen.width + '×' + window.screen.height,
      ip: 'Carregando...',
      location: '—'
    };

    // Adiciona imediatamente
    v.log = v.log || [];
    v.log.unshift(entry);
    if(v.log.length > 200) v.log = v.log.slice(0,200);
    this.set('tg_visits', v);

    if (typeof renderDB === 'function') renderDB();

    // Busca o IP real
    fetch('https://api.ipify.org?format=json')
      .then(r => r.json())
      .then(data => {
        entry.ip = data.ip || '—';
        return fetch(`https://ipapi.co/${entry.ip}/json/`);
      })
      .then(r => r.json())
      .then(loc => {
        entry.location = `${loc.city || ''}, ${loc.country_name || ''}`.trim() || 'Desconhecido';
        this.set('tg_visits', v);
        if (typeof renderDB === 'function') renderDB();
      })
      .catch(() => {
        entry.ip = '—';
        entry.location = '—';
        this.set('tg_visits', v);
        if (typeof renderDB === 'function') renderDB();
      });
  },

  resetVisits(){
    this.set('tg_visits', { total:0, today:0, todayKey:'', days:{}, log:[] });
  },

  getPlays(){ return this.get('tg_plays') || { audio:0, video:0 } },
  bumpPlay(type){ 
    const p = this.getPlays(); 
    p[type] = (p[type]||0) + 1; 
    this.set('tg_plays', p); 
  },
  resetPlays(){ this.set('tg_plays',{audio:0,video:0}); },

  getLog(){ return this.get('tg_log') || [] },
  log(msg, type='info'){
    const l = this.getLog();
    l.unshift({ time: new Date().toLocaleString('pt-BR'), msg, type });
    if(l.length > 300) l.pop();
    this.set('tg_log', l);
  },
  clearLog(){ this.set('tg_log', []); },

  MASTER: { user:'Zenin', pass:'supremoregente@2026', role:'Grão-Regente', master:true },

  getCreds(){ return this.get('tg_creds') || [] },

  addCred(user, pass, label){
    const list = this.getCreds();
    list.push({ 
      user: user.trim(), 
      pass: pass.trim(), 
      label: label || 'Sem apelido', 
      role:'Convidado', 
      created: new Date().toLocaleString('pt-BR'), 
      active:true 
    });
    this.set('tg_creds', list);
  },

  revokeCred(user){
    const list = this.getCreds().map(c => c.user===user ? {...c, active:false} : c);
    this.set('tg_creds', list);
  },

  deleteCred(user){
    const list = this.getCreds().filter(c => c.user !== user);
    this.set('tg_creds', list);
  },

  checkLogin(user, pass){
    if(!user || !pass) return { ok:false };
    const u = user.trim();
    const p = pass.trim();

    if(u === this.MASTER.user && p === this.MASTER.pass) {
      return { ok:true, ...this.MASTER };
    }

    const found = this.getCreds().find(c => c.user===u && c.pass===p && c.active);
    if(found) return { ok:true, ...found };

    return { ok:false };
  }
};

/* ── Funções auxiliares ── */
function generateCredential(label){
  const adj = ['Ferro','Aço','Sangue','Chama','Sombra','Viltrum','Eterno','Supremo','Cinza','Imperial'];
  const noun = ['Guerreiro','Soldado','Regente','Lâmina','Escudo','Punho','Império','Estrela','Corvo','Lobo'];
  const user = adj[Math.floor(Math.random()*adj.length)] + noun[Math.floor(Math.random()*noun.length)] + Math.floor(10 + Math.random()*89);
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#$!';
  let pass = '';
  for(let i=0;i<14;i++) pass += chars[Math.floor(Math.random()*chars.length)];
  return { user, pass };
}

function renderNav(activePage){
  const pages = [
    { id:'hino', label:'Hino', href:'thragg_hino.html' },
    { id:'arquivo', label:'Arquivo', href:'thragg_arquivo.html' },
    { id:'legado', label:'Legado', href:'thragg_legado.html' },
    { id:'admin', label:'Admin', href:'thragg_admin.html', special:true },
  ];
  const v = DB.getVisits();
  return `
  <nav class="site-nav">
    <a class="nav-logo" href="thragg_hino.html">THRAGG</a>
    <div class="nav-links">
      ${pages.map(p => `
        <a class="nav-link${p.id===activePage?' active':''}${p.special?' nav-admin':''}" href="${p.href}">${p.label}</a>
      `).join('')}
    </div>
    <div class="nav-visits">Visitas <span class="nav-visits-num">${(v.total||0).toLocaleString('pt-BR')}</span></div>
  </nav>`;
}

const SHARED_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Cinzel+Decorative:wght@700;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Orbitron:wght@400;600;900&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --void:#020008;--abyss:#06000E;--deep:#0C0118;--deep2:#130222;--mid:#1A0530;
  --blood:#7A0000;--blood2:#AA0010;--crimson:#CC1020;--fire:#E83020;--ember:#FF5030;
  --gold:#A87808;--gold2:#C89A18;--gold3:#E8B830;--pale:#FFF0C0;
  --text:#EAD8C0;--muted:#907868;--dim:#504040;
}
html{scroll-behavior:smooth}
body{background:var(--void);color:var(--text);font-family:'Cormorant Garamond',serif;overflow-x:hidden;min-height:100vh}
#bg-canvas{position:fixed;inset:0;pointer-events:none;z-index:0}
body::before{content:'';position:fixed;inset:0;background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.05) 2px,rgba(0,0,0,.05) 4px);pointer-events:none;z-index:9999}
 
/* NAV */
.site-nav{position:fixed;top:0;left:0;right:0;z-index:8000;display:flex;align-items:center;justify-content:space-between;padding:.85rem 2.5rem;background:linear-gradient(180deg,rgba(2,0,8,.97),rgba(2,0,8,.75));border-bottom:1px solid rgba(170,0,16,.35);backdrop-filter:blur(10px)}
.nav-logo{font-family:'Cinzel Decorative',serif;font-size:1rem;font-weight:900;letter-spacing:.2em;color:transparent;background:linear-gradient(90deg,var(--gold2),var(--gold3),var(--gold2));-webkit-background-clip:text;background-clip:text;text-decoration:none}
.nav-links{display:flex;align-items:center;gap:0}
.nav-link{font-family:'Orbitron',sans-serif;font-size:.42rem;letter-spacing:.5em;color:var(--muted);text-transform:uppercase;text-decoration:none;padding:.5rem 1.1rem;border-right:1px solid rgba(120,0,0,.2);transition:color .2s,background .2s}
.nav-link:first-child{border-left:1px solid rgba(120,0,0,.2)}
.nav-link:hover{color:var(--gold3);background:rgba(120,0,0,.08)}
.nav-link.active{color:var(--pale);background:rgba(120,0,0,.15)}
.nav-admin{color:rgba(200,16,32,.6)!important}
.nav-admin:hover,.nav-admin.active{color:var(--crimson)!important;background:rgba(200,16,32,.1)!important}
.nav-visits{font-family:'Orbitron',sans-serif;font-size:.38rem;letter-spacing:.4em;color:var(--dim);text-transform:uppercase;display:flex;align-items:center;gap:.5rem}
.nav-visits-num{color:var(--crimson);font-size:.55rem;font-weight:600}
 
/* PAGE WRAPPER */
.page-wrap{padding-top:60px;min-height:100vh;position:relative;z-index:1}
 
/* SECTION COMMONS */
.s-tag{font-family:'Orbitron',sans-serif;font-size:.46rem;letter-spacing:.75em;color:var(--blood2);text-transform:uppercase;text-align:center;margin-bottom:.9rem;display:flex;align-items:center;justify-content:center;gap:1.2rem}
.s-tag::before,.s-tag::after{content:'';display:block;width:30px;height:1px;background:linear-gradient(90deg,transparent,var(--blood2))}
.s-tag::after{transform:scaleX(-1)}
.s-title{font-family:'Cinzel',serif;font-size:clamp(1.4rem,3.5vw,2.4rem);font-weight:700;color:var(--pale);text-align:center;letter-spacing:.12em;margin-bottom:3rem;text-shadow:0 0 40px rgba(200,154,24,.2)}
 
/* FOOTER */
.site-footer{position:relative;padding:3rem 2rem;text-align:center;background:var(--void);border-top:1px solid rgba(120,0,0,.3);overflow:hidden}
.site-footer::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--crimson),var(--gold2),var(--crimson),transparent)}
.ft-logo{font-family:'Cinzel Decorative',serif;font-size:1.2rem;font-weight:900;letter-spacing:.15em;color:transparent;background:linear-gradient(135deg,var(--gold) 30%,var(--gold3) 60%,var(--gold) 90%);-webkit-background-clip:text;background-clip:text;display:block;margin-bottom:.5rem}
.ft-sub{font-family:'Orbitron',sans-serif;font-size:.38rem;letter-spacing:.55em;color:var(--dim);text-transform:uppercase;line-height:2}
 
/* ANIMATIONS */
@keyframes spin-cw{to{transform:rotate(360deg)}}
@keyframes spin-ccw{to{transform:rotate(-360deg)}}
@keyframes border-flow{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
@keyframes sweep{from{background-position:-200%}to{background-position:200%}}
@keyframes rise{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
@keyframes name-in{0%{opacity:0;letter-spacing:.5em;filter:blur(28px)}100%{opacity:1;letter-spacing:.06em;filter:drop-shadow(0 0 50px rgba(200,154,24,.4))}}
@keyframes gold-flow{0%{background-position:200% center}100%{background-position:-200% center}}
@keyframes float-q{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
@keyframes drip{0%{height:0;opacity:1}75%{opacity:1}100%{height:60px;opacity:0}}
@keyframes pip-pulse{0%,100%{box-shadow:0 0 12px var(--fire),0 0 30px rgba(232,48,32,.3)}50%{box-shadow:0 0 25px var(--ember),0 0 60px rgba(232,48,32,.6)}}
`;
 
/* ── PARTICLE BACKGROUND (shared init) ── */
function initBgCanvas(){
  const cv=document.getElementById('bg-canvas');if(!cv)return;
  const cx=cv.getContext('2d');let W,H;
  function resize(){W=cv.width=window.innerWidth;H=cv.height=window.innerHeight}
  resize();window.addEventListener('resize',resize);
  const C=['rgba(200,16,32,','rgba(184,100,8,','rgba(232,184,48,','rgba(120,0,120,','rgba(80,0,140,'];
  const pts=Array.from({length:130},()=>({x:Math.random()*9999,y:Math.random()*9999,r:Math.random()*1.3+.2,vx:(Math.random()-.5)*.1,vy:(Math.random()-.5)*.1,c:C[Math.floor(Math.random()*C.length)],a:Math.random()*.4+.08}));
  function tick(){
    cx.clearRect(0,0,W,H);
    [{x:.3,y:.4,r:.4,col:'rgba(80,0,100,.04)'},{x:.75,y:.6,r:.35,col:'rgba(100,0,20,.05)'}].forEach(g=>{
      const gr=cx.createRadialGradient(W*g.x,H*g.y,0,W*g.x,H*g.y,W*g.r);gr.addColorStop(0,g.col);gr.addColorStop(1,'transparent');cx.fillStyle=gr;cx.fillRect(0,0,W,H);
    });
    pts.forEach(p=>{p.x+=p.vx;p.y+=p.vy;if(p.x<0)p.x=W;if(p.x>W)p.x=0;if(p.y<0)p.y=H;if(p.y>H)p.y=0;cx.beginPath();cx.arc(p.x,p.y,p.r,0,Math.PI*2);cx.fillStyle=p.c+p.a+')';cx.fill()});
    requestAnimationFrame(tick);
  }
  tick();
}
