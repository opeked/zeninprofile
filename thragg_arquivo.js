<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Arquivo — THRAGG</title>
<style id="shared-inject"></style>
<style>
.arquivo-hero{position:relative;height:100vh;min-height:680px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;overflow:hidden}
.arquivo-glow{position:absolute;inset:0;background:radial-gradient(ellipse 80% 60% at 50% 55%,rgba(130,0,20,.25) 0%,transparent 65%),radial-gradient(ellipse 100% 40% at 50% 100%,rgba(100,0,0,.3) 0%,transparent 60%),linear-gradient(180deg,var(--void) 0%,var(--abyss) 30%,#0A0110 65%,var(--void) 100%)}
.blade{position:absolute;left:0;right:0;height:1px}
.blade::before{content:'';display:block;height:1px;background:linear-gradient(90deg,transparent 5%,rgba(180,0,20,.5) 25%,rgba(240,60,30,1) 50%,rgba(180,0,20,.5) 75%,transparent 95%)}
.blade.t{top:13%}.blade.b{bottom:13%}
.pip{position:absolute;left:50%;top:13%;transform:translate(-50%,-50%);width:10px;height:10px;background:var(--fire);clip-path:polygon(50% 0%,100% 50%,50% 100%,0% 50%);animation:pip-pulse 3s ease-in-out infinite;z-index:4}
.pip.b{top:auto;bottom:13%;transform:translate(-50%,50%)}
.plate{position:absolute;pointer-events:none;z-index:4}
.plate.tl{top:0;left:0}.plate.tr{top:0;right:0;transform:scaleX(-1)}
.plate.bl{bottom:0;left:0;transform:scaleY(-1)}.plate.br{bottom:0;right:0;transform:scale(-1,-1)}
.hero-content{position:relative;z-index:10}
.hero-eyebrow{font-family:'Orbitron',sans-serif;font-size:.52rem;letter-spacing:.9em;color:var(--crimson);text-transform:uppercase;margin-bottom:2.8rem;display:flex;align-items:center;gap:1.6rem;opacity:0;animation:rise .9s ease .3s forwards}
.hero-eyebrow::before,.hero-eyebrow::after{content:'';display:block;width:60px;height:1px;background:linear-gradient(90deg,transparent,var(--crimson))}
.hero-eyebrow::after{transform:scaleX(-1)}
.hero-name{font-family:'Cinzel Decorative',serif;font-size:clamp(3.5rem,10vw,8rem);font-weight:900;line-height:.88;letter-spacing:.06em;color:transparent;background:linear-gradient(155deg,#FFF8E0 0%,var(--pale) 15%,var(--gold3) 30%,var(--gold2) 42%,#FFF5D0 50%,var(--gold2) 58%,var(--gold3) 70%,var(--pale) 85%,#FFF8E0 100%);background-size:250% auto;-webkit-background-clip:text;background-clip:text;filter:drop-shadow(0 0 50px rgba(200,154,24,.4));opacity:0;animation:name-in 1.6s cubic-bezier(.1,1,.2,1) .5s forwards,gold-flow 7s linear 2.5s infinite}
.hero-divider{display:flex;align-items:center;gap:1.2rem;margin:2rem auto;width:fit-content;opacity:0;animation:rise .8s ease 1.6s forwards}
.hd-line{height:1px;background:linear-gradient(90deg,transparent,var(--gold2),transparent)}
.hd-line.long{width:160px}.hd-line.short{width:50px}
.hd-gem{width:8px;height:8px;background:var(--gold3);clip-path:polygon(50% 0%,100% 50%,50% 100%,0% 50%)}
.hero-sub{font-family:'Cinzel',serif;font-size:clamp(.6rem,1.3vw,.78rem);letter-spacing:.4em;color:var(--muted);text-transform:uppercase;line-height:2.4;opacity:0;animation:rise .8s ease 2s forwards}
.scroll-down{position:absolute;bottom:2.5rem;left:50%;transform:translateX(-50%);z-index:10;display:flex;flex-direction:column;align-items:center;gap:.8rem;opacity:0;animation:rise .8s ease 2.8s forwards}
.scroll-down span{font-family:'Orbitron',sans-serif;font-size:.4rem;letter-spacing:.7em;color:var(--dim);text-transform:uppercase}
.sd-line{width:1px;height:0;background:linear-gradient(180deg,var(--crimson),transparent);animation:drip 2.5s ease-in-out 3.5s infinite}

/* VIDEO SECTION */
.video-section{position:relative;padding:6rem 2rem 7rem;overflow:hidden;background:linear-gradient(180deg,var(--void),var(--abyss) 30%,var(--abyss) 70%,var(--void))}
.video-section::before,.video-section::after{content:'';position:absolute;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--blood),var(--crimson),var(--blood),transparent)}
.video-section::before{top:0}.video-section::after{bottom:0}
.vid-wrap{max-width:920px;margin:0 auto;position:relative;z-index:1}
.vid-frame-outer{position:relative;padding:2px;background:linear-gradient(135deg,var(--blood) 0%,var(--gold) 25%,var(--crimson) 50%,var(--gold2) 75%,var(--blood) 100%);background-size:300%;animation:border-flow 10s linear infinite}
.vid-frame-mid{background:var(--abyss);padding:8px;position:relative}
.vid-frame-mid::before{content:'';position:absolute;inset:0;background:linear-gradient(to right,rgba(120,0,0,.15) 0%,transparent 15%),linear-gradient(to left,rgba(120,0,0,.15) 0%,transparent 15%);pointer-events:none;z-index:2}
.vid-inner{position:relative;background:#000;line-height:0;overflow:hidden}
.vid-inner video{display:block;width:100%;max-height:540px;object-fit:contain;background:#000}
.va{position:absolute;width:32px;height:32px;z-index:5;border-color:var(--gold2);border-style:solid}
.va.tl{top:-1px;left:-1px;border-width:2px 0 0 2px}.va.tr{top:-1px;right:-1px;border-width:2px 2px 0 0}
.va.bl{bottom:-1px;left:-1px;border-width:0 0 2px 2px}.va.br{bottom:-1px;right:-1px;border-width:0 2px 2px 0}
.vid-status{background:var(--deep2);border:1px solid rgba(120,0,0,.3);border-top:none;padding:1.2rem 1.5rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:.8rem}
.vs-item{display:flex;flex-direction:column;gap:.3rem}
.vs-k{font-family:'Orbitron',sans-serif;font-size:.38rem;letter-spacing:.55em;color:var(--dim);text-transform:uppercase}
.vs-v{font-family:'Cinzel',serif;font-size:.78rem;color:var(--gold3);letter-spacing:.05em}

/* classified ribbon */
.classified{display:flex;align-items:center;justify-content:center;gap:1.2rem;margin-bottom:2.5rem;flex-wrap:wrap}
.classified-badge{font-family:'Orbitron',sans-serif;font-size:.45rem;letter-spacing:.5em;padding:.5rem 1.4rem;border:1px solid rgba(200,16,32,.5);color:var(--crimson);text-transform:uppercase;background:rgba(200,16,32,.05);position:relative;overflow:hidden}
.classified-badge::before{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(200,16,32,.08),transparent);background-size:200%;animation:sweep 3s linear infinite}
@media(max-width:600px){.vid-status{flex-direction:column}}
</style>
</head>
<body>
<canvas id="bg-canvas"></canvas>
<div id="nav-mount"></div>

<div class="page-wrap">
  <section class="arquivo-hero">
    <div class="arquivo-glow"></div>
    <div class="blade t"></div><div class="blade b"></div>
    <div class="pip"></div><div class="pip b"></div>
    <div class="plate tl"><svg width="90" height="90" viewBox="0 0 90 90"><polyline points="0,65 0,0 65,0" fill="none" stroke="#A87808" stroke-width="1.5" opacity=".6"/><polyline points="0,35 0,0 35,0" fill="none" stroke="#C89A18" stroke-width="2.5" opacity=".7"/></svg></div>
    <div class="plate tr"><svg width="90" height="90" viewBox="0 0 90 90"><polyline points="0,65 0,0 65,0" fill="none" stroke="#A87808" stroke-width="1.5" opacity=".6"/><polyline points="0,35 0,0 35,0" fill="none" stroke="#C89A18" stroke-width="2.5" opacity=".7"/></svg></div>
    <div class="plate bl"><svg width="90" height="90" viewBox="0 0 90 90"><polyline points="0,65 0,0 65,0" fill="none" stroke="#A87808" stroke-width="1.5" opacity=".6"/><polyline points="0,35 0,0 35,0" fill="none" stroke="#C89A18" stroke-width="2.5" opacity=".7"/></svg></div>
    <div class="plate br"><svg width="90" height="90" viewBox="0 0 90 90"><polyline points="0,65 0,0 65,0" fill="none" stroke="#A87808" stroke-width="1.5" opacity=".6"/><polyline points="0,35 0,0 35,0" fill="none" stroke="#C89A18" stroke-width="2.5" opacity=".7"/></svg></div>
    <div class="hero-content">
      <div class="hero-eyebrow">Arquivo Visual · Classificação Suprema</div>
      <h1 class="hero-name">ARQUIVO</h1>
      <div class="hero-divider"><div class="hd-line long"></div><div class="hd-gem"></div><div class="hd-line short"></div><div class="hd-gem"></div><div class="hd-line long"></div></div>
      <p class="hero-sub">Transmissão do Grão-Regente · Ultra-Secreto</p>
    </div>
    <div class="scroll-down"><span>Assistir</span><div class="sd-line"></div></div>
  </section>

  <div class="video-section">
    <div class="s-tag">Arquivo Visual Imperial</div>
    <h2 class="s-title">Transmissão do Grão-Regente</h2>
    <div class="classified">
      <div class="classified-badge">⬛ Classificação: Suprema Imperial</div>
      <div class="classified-badge">◆ Acesso Restrito · Olhos Viltrumitas Somente</div>
    </div>
    <div class="vid-wrap">
      <div class="vid-frame-outer">
        <div class="vid-frame-mid">
          <div class="vid-inner">
            <div class="va tl"></div><div class="va tr"></div><div class="va bl"></div><div class="va br"></div>
            <video controls preload="metadata" id="main-video">
              <source src="Download__3_.mp4" type="video/mp4">
            </video>
          </div>
        </div>
      </div>
      <div class="vid-status">
        <div class="vs-item"><span class="vs-k">Origem</span><span class="vs-v">Planeta Viltrum · Arquivo Central</span></div>
        <div class="vs-item"><span class="vs-k">Sujeito</span><span class="vs-v">Thragg — O Grão-Regente</span></div>
        <div class="vs-item"><span class="vs-k">Classificação</span><span class="vs-v" style="color:var(--crimson)">⬛ Ultra-Secreto</span></div>
        <div class="vs-item"><span class="vs-k">Era Imperial</span><span class="vs-v">Ano 3.000 · Ciclo VII</span></div>
      </div>
    </div>
  </div>

  <footer class="site-footer">
    <span class="ft-logo">THRAGG</span>
    <div class="ft-sub">Arquivo Visual · Viltrum · Classificado</div>
  </footer>
</div>

<script src="thragg_data.js"></script>
<script>
document.getElementById('shared-inject').textContent = SHARED_CSS;
document.getElementById('nav-mount').innerHTML = renderNav('arquivo');
initBgCanvas();
DB.bumpVisit('Arquivo');
const vid = document.getElementById('main-video');
let vidCounted = false;
vid.addEventListener('play', () => { if(!vidCounted){ DB.bumpPlay('video'); DB.log('Vídeo do Grão-Regente reproduzido','play'); vidCounted=true; } });
</script>
</body>
</html>
