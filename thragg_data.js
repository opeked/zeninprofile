/* ═══════════════════════════════════════════════
   THRAGG EMPIRE — SHARED DATA ENGINE
   Captura de IP + Localização corrigida
═══════════════════════════════════════════════ */

const DB = {
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

    // Adiciona imediatamente na tabela
    v.log = v.log || [];
    v.log.unshift(entry);
    if(v.log.length > 200) v.log = v.log.slice(0,200);
    this.set('tg_visits', v);

    if (typeof renderDB === 'function') renderDB();

    // Captura real do IP
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
      .catch(err => {
        console.log("Erro ao buscar IP:", err);
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

  /* CREDENTIALS */
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

/* ── Outras funções (gerar credencial, nav, css, canvas) ── */
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

const SHARED_CSS = `... (cole aqui seu SHARED_CSS completo do arquivo antigo) ...`;

function initBgCanvas(){
  const cv = document.getElementById('bg-canvas');
  if(!cv) return;
  const cx = cv.getContext('2d');
  let W, H;
  function resize(){ W = cv.width = window.innerWidth; H = cv.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);
  const C = ['rgba(200,16,32,','rgba(184,100,8,','rgba(232,184,48,','rgba(120,0,120,','rgba(80,0,140,'];
  const pts = Array.from({length:130}, () => ({
    x: Math.random()*9999, y: Math.random()*9999, r: Math.random()*1.3 + .2,
    vx: (Math.random()-.5)*.1, vy: (Math.random()-.5)*.1,
    c: C[Math.floor(Math.random()*C.length)], a: Math.random()*.4 + .08
  }));
  function tick(){
    cx.clearRect(0,0,W,H);
    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if(p.x<0) p.x=W; if(p.x>W) p.x=0;
      if(p.y<0) p.y=H; if(p.y>H) p.y=0;
      cx.beginPath();
      cx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      cx.fillStyle = p.c + p.a + ')';
      cx.fill();
    });
    requestAnimationFrame(tick);
  }
  tick();
}
