/* ═══════════════════════════════════════════════
   THRAGG EMPIRE — SHARED DATA ENGINE
   Agora com captura de IP e localização aproximada
═══════════════════════════════════════════════ */

const DB = {
  /* ── RAW STORAGE ── */
  get(key){ 
    try{ return JSON.parse(localStorage.getItem(key)) } catch{ return null } 
  },
  set(key, val){ 
    try{ localStorage.setItem(key, JSON.stringify(val)) } catch{} 
  },

  /* ── VISITS ── */
  getVisits(){ 
    return this.get('tg_visits') || { total:0, today:0, todayKey:'', days:{}, log:[] } 
  },

  /* Função atualizada com IP */
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
    const basicEntry = {
      time: now.toLocaleString('pt-BR'),
      page: page || 'Início',
      browser,
      os,
      lang: navigator.language || '—',
      screen: window.screen.width + '×' + window.screen.height,
      ip: '—',
      location: '—'
    };

    // Tentativa de capturar IP e localização
    fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => {
        const ip = data.ip || '—';
        basicEntry.ip = ip;

        // Tenta pegar cidade e país
        return fetch(`https://ipapi.co/${ip}/json/`);
      })
      .then(res => res.json())
      .then(loc => {
        basicEntry.location = `${loc.city || ''}, ${loc.country_name || ''}`.trim() || 'Desconhecido';
        this.saveVisitEntry(basicEntry, v);
      })
      .catch(() => {
        // Fallback caso a API falhe
        this.saveVisitEntry(basicEntry, v);
      });
  },

  saveVisitEntry(entry, v){
    v.log = v.log || [];
    v.log.unshift(entry);
    if(v.log.length > 200) v.log = v.log.slice(0,200);
    this.set('tg_visits', v);

    // Atualiza tabela automaticamente se estiver na página admin
    if (typeof renderDB === 'function') renderDB();
  },

  resetVisits(){
    this.set('tg_visits', { total:0, today:0, todayKey:'', days:{}, log:[] });
  },

  /* ── PLAY COUNTS ── */
  getPlays(){ return this.get('tg_plays') || { audio:0, video:0 } },
  bumpPlay(type){ 
    const p = this.getPlays(); 
    p[type] = (p[type]||0) + 1; 
    this.set('tg_plays', p); 
  },
  resetPlays(){ 
    this.set('tg_plays', {audio:0, video:0}); 
  },

  /* ── ACTIVITY LOG ── */
  getLog(){ return this.get('tg_log') || [] },
  log(msg, type='info'){
    const l = this.getLog();
    l.unshift({ time: new Date().toLocaleString('pt-BR'), msg, type });
    if(l.length > 300) l.pop();
    this.set('tg_log', l);
  },
  clearLog(){ this.set('tg_log', []); },

  /* ── CREDENTIALS ── */
  MASTER: { 
    user: 'Zenin', 
    pass: 'supremoregente@2026', 
    role: 'Grão-Regente', 
    master: true 
  },

  getCreds(){ return this.get('tg_creds') || [] },

  addCred(user, pass, label){
    const list = this.getCreds();
    list.push({ 
      user: user.trim(), 
      pass: pass.trim(), 
      label: label || 'Sem apelido', 
      role: 'Convidado', 
      created: new Date().toLocaleString('pt-BR'), 
      active: true 
    });
    this.set('tg_creds', list);
  },

  revokeCred(user){
    const list = this.getCreds().map(c => c.user === user ? {...c, active: false} : c);
    this.set('tg_creds', list);
  },

  deleteCred(user){
    const list = this.getCreds().filter(c => c.user !== user);
    this.set('tg_creds', list);
  },

  checkLogin(user, pass){
    if(!user || !pass) return { ok: false };
    const u = user.trim();
    const p = pass.trim();

    if(u === this.MASTER.user && p === this.MASTER.pass) {
      return { ok: true, ...this.MASTER };
    }

    const creds = this.getCreds() || [];
    const found = creds.find(c => c.user === u && c.pass === p && c.active === true);
    if(found) return { ok: true, ...found };

    return { ok: false };
  },

  /* ── CONTENT ── */
  getContent(){ return this.get('tg_content') || {} },
  saveContent(obj){ this.set('tg_content', { ...this.getContent(), ...obj }); },
};

/* ── GENERATE RANDOM CREDENTIAL ── */
function generateCredential(label){
  const adj = ['Ferro','Aço','Sangue','Chama','Sombra','Viltrum','Eterno','Supremo','Cinza','Imperial'];
  const noun = ['Guerreiro','Soldado','Regente','Lâmina','Escudo','Punho','Império','Estrela','Corvo','Lobo'];
  const user = adj[Math.floor(Math.random()*adj.length)] + noun[Math.floor(Math.random()*noun.length)] + Math.floor(10 + Math.random()*89);

  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#$!';
  let pass = '';
  for(let i = 0; i < 14; i++) pass += chars[Math.floor(Math.random()*chars.length)];
  return { user, pass };
}

/* ── SHARED NAV RENDERER ── */
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

/* ── SHARED STYLES ── */
const SHARED_CSS = `... (mesmo CSS anterior - mantido igual) ...`;
// (Cole aqui o SHARED_CSS completo que você já tinha, ou mantenha o anterior)

function initBgCanvas(){
  // (mesma função de canvas que você já tinha)
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
