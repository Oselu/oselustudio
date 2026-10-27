(()=>{
'use strict';
/* ---------- utilities ---------- */
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=t=>String(t==null?'':t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const EASE={io:t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2,io2:t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2,out:t=>1-Math.pow(1-t,4)};
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer=matchMedia('(hover:hover) and (pointer:fine)').matches;
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const pad=(n,l=3)=>String(n).padStart(l,'0');
function tween(ms,fn,e=EASE.io){return new Promise(res=>{const t0=performance.now();const step=now=>{const k=clamp((now-t0)/ms,0,1);fn(e(k),k);k<1?requestAnimationFrame(step):res()};requestAnimationFrame(step)})}

/* ---------- content ---------- */
const WHATSAPP="2348103645200";
const PV=/*@PV@*/;
const PROJECTS=/*@PROJECTS@*/;
const ILL_DATA=/*@ILL_DATA@*/;
const PRODUCT_PROJECTS=/*@PRODUCT_PROJECTS@*/;
const T_ILL=['Adobe Illustrator'], T_BOTH=['Procreate','Adobe Illustrator'];
const PP=Object.fromEntries(PRODUCT_PROJECTS.map(p=>[p.id,p]));
const ILL_PROJECTS=/*@ILL_PROJECTS@*/;
const WC=/*@WC@*/;
const COV_BASE=/*@COV_BASE@*/;
const COV_POSTERS=/*COV*/[]/*END*/;
const ART_BASE=/*@ART_BASE@*/;
const ART_EXTRA=/*EXTRA*/[]/*END*/;

const ART_CATS=[['all','All'],['sports','Sports'],['animals','Animals'],['people','People & places'],['still','Still life']];
ART_EXTRA.forEach(a=>{if(a.cat==='football')a.cat='sports'});
const ART=[...ART_EXTRA.slice().sort((a,b)=>(b.added||'').localeCompare(a.added||'')),...ART_BASE];
const DAY=864e5;
const isNew=it=>it.added&&(Date.now()-new Date(it.added+'T00:00:00').getTime())<14*DAY;
const covAll=()=>[...COV_BASE,...COV_POSTERS].sort((a,b)=>(b.date||'').localeCompare(a.date||''));
const covTitle=p=>p.ha==='away'?`${p.opp} v Coventry`:`Coventry v ${p.opp}`;
const wcTitle=p=>p.t.join(' v ');
const seasonOf=d=>{const y=+d.slice(0,4),m=+d.slice(5,7);return m>=7?`${y}/${String(y+1).slice(2)}`:`${y-1}/${String(y).slice(2)}`};
const fmtDate=d=>new Date(d+'T12:00:00').toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'});
const WC_SORTED=WC.slice().sort((a,b)=>a.n-b.n);

const CAT={series:'Poster series',gd:'Graphic design',ill:'Illustration',art:'Visual art'};
const ENTRIES=[
  {id:'coventry',name:'Coventry matchday',cat:'series',kind:'Ongoing · a poster every matchday',pv:PV.coventry},
  {id:'world-cup',name:'World Cup 2026',cat:'series',kind:'100 posters · one per match',pv:PV['world-cup']},
  ...PROJECTS.map(p=>({id:p.id,name:p.title,cat:'gd',kind:p.kind,pv:PV[p.id]||p.cover})),
  ...ILL_PROJECTS.map(p=>({id:p.id,name:p.name,cat:'ill',kind:p.kind,pv:PV[p.id]||p.cover,earlier:!!p.earlier})),
  {id:'visual-art',name:'Visual art',cat:'art',kind:`Oil pastel on paper · ${ART.length} pieces`,pv:PV['visual-art']}
];
const byId=Object.fromEntries(ENTRIES.map(e=>[e.id,e]));
const SELECTED=['coventry','world-cup','i-bitnob','i-roqqu','doom','i-editorial','birds','sports','i-info','visual-art'];

/* ---------- libraries load async; the site works fully before (or without) them ---------- */
function whenLib(id,test){return new Promise(res=>{if(test())return res(true);const s=document.getElementById(id);if(!s)return res(false);s.addEventListener('load',()=>res(test()),{once:true});s.addEventListener('error',()=>res(false),{once:true})})}

/* ---------- smooth scroll ---------- */
let lenis=null;
function initLenis(){
  if(reduced||lenis||!window.Lenis)return;
  try{lenis=new window.Lenis({lerp:.1,smoothWheel:true})}catch(_){lenis=null;return}
  if(!$('#lb').hidden||!$('#menu').hidden)lenis.stop();
}
const scrollY_=()=>lenis?lenis.scroll:window.scrollY;
function scrollTop(smooth){if(lenis)lenis.scrollTo(0,{immediate:!smooth,force:true});else window.scrollTo({top:0,behavior:smooth&&!reduced?'smooth':'auto'})}
function scrollToEl(el){const y=el.getBoundingClientRect().top+scrollY_()-90;if(lenis)lenis.scrollTo(y,{duration:1.2});else window.scrollTo({top:y,behavior:reduced?'auto':'smooth'})}

/* ---------- WebGL: hero poster, hover preview, page veil ---------- */
let GL=null;
function makeGL(){
  if(reduced||!window.THREE)return null;
  const T=window.THREE, canvas=$('#gl');
  let R;
  try{R=new T.WebGLRenderer({canvas,alpha:true,antialias:false,premultipliedAlpha:true,powerPreference:'high-performance'})}catch(_){return null}
  if(!R||!R.getContext())return null;
  R.setClearColor(0x000000,0);R.setPixelRatio(Math.min(window.devicePixelRatio||1,1.75));
  const scene=new T.Scene(), cam=new T.OrthographicCamera(0,1,0,-1,-100,100);
  const NOISE=`
    float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
    float noise(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);
      return mix(mix(hash(i),hash(i+vec2(1.,0.)),u.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),u.x),u.y);}
    float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*noise(p);p=p*2.03+17.1;a*=.5;}return v;}
    /* oil-pastel strokes: rows sweep across at staggered times, with waxy streaks along each stroke */
    float strokes(vec2 uv,float prog,float aspect,float rows,float seed,out float streak){
      vec2 p=uv-.5;p.x*=aspect;
      float an=-.13;float cs=cos(an),sn=sin(an);
      p=vec2(cs*p.x-sn*p.y,sn*p.x+cs*p.y);
      float x=p.x/(aspect*cs+abs(sn))+.5;
      float gy=noise(vec2(x*70.,p.y*70.+seed))-.5;
      float yy=(p.y+.5)*rows+(fbm(vec2(x*2.2,seed*3.1))-.5)*1.2+gy*.22;
      float r=floor(yy),f=fract(yy)-.5;
      float d=hash(vec2(r,seed))*.42;
      float head=clamp((prog-d)/.58,0.,1.)*1.5-.2;
      streak=fbm(vec2(x*55.,yy*6.5+seed));
      float tex=streak*.11+fbm(vec2(x*8.,yy*1.6+seed*2.))*.08;
      float cap=f*f*.34;
      float grain=(noise(uv*vec2(300.,360.)+seed)-.5)*.035;
      return smoothstep(head+.01,head-.01,x+tex+cap+grain-.07);
    }
    vec2 cover(vec2 uv,float pa,float ia){vec2 s=pa>ia?vec2(1.,ia/pa):vec2(pa/ia,1.);return (uv-.5)*s+.5;}`;
  const VERT=`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
  const mk=(u,frag,vert,geo)=>{const m=new T.ShaderMaterial({uniforms:u,vertexShader:vert||VERT,fragmentShader:frag,transparent:true,depthTest:false,depthWrite:false});m.premultipliedAlpha=true;const mesh=new T.Mesh(geo||new T.PlaneGeometry(1,1),m);mesh.visible=false;mesh.frustumCulled=false;scene.add(mesh);return mesh};
  const place=(m,x,y,w,h)=>{m.position.set(x+w/2,-(y+h/2),0);m.scale.set(w,h,1)};
  const loader=new T.TextureLoader(), cache=new Map();
  function load(url){
    if(cache.has(url))return cache.get(url);
    const p=new Promise((res,rej)=>loader.load(url,t=>{t.minFilter=T.LinearFilter;t.magFilter=T.LinearFilter;t.generateMipmaps=false;t._aspect=t.image.width/t.image.height;t._url=url;res(t)},undefined,rej));
    cache.set(url,p);p.catch(()=>cache.delete(url));return p;
  }
  function release(t){if(!t||!t._url)return;cache.delete(t._url);t.dispose()}
  const blank=new T.DataTexture(new Uint8Array([242,242,238,255]),1,1,T.RGBAFormat);blank.needsUpdate=true;blank._aspect=.8;

  /* hero */
  const heroEl=$('#hero-sheet');
  const hu={t0:{value:blank},t1:{value:blank},a0:{value:.8},a1:{value:.8},pa:{value:.8},prog:{value:0},seed:{value:1.7},mouse:{value:new T.Vector2(.5,.5)},vel:{value:new T.Vector2()},hover:{value:0},clipY:{value:1e5}};
  const hero=mk(hu,`uniform sampler2D t0,t1;uniform float a0,a1,pa,prog,seed,hover,clipY;uniform vec2 mouse,vel;varying vec2 vUv;${NOISE}
    void main(){
      if(gl_FragCoord.y>clipY)discard;
      vec2 d=vUv-mouse;d.x*=pa;float f=exp(-dot(d,d)*22.)*hover;
      vec2 suv=vUv-vel*f*.32;
      float streak=0.,c=0.;if(prog>0.)c=strokes(vUv,prog,pa,9.,seed,streak);
      vec3 A=texture2D(t0,cover(suv,pa,a0)).rgb;
      vec3 B=texture2D(t1,cover(suv,pa,a1)).rgb;
      vec3 col=mix(A,B,c);
      float edge=c*(1.-c)*4.;
      col=mix(col,col*(.8+.32*streak),edge*.7);
      col+=(hash(vUv*vec2(733.,911.))-.5)*.022;
      gl_FragColor=vec4(col,1.);
    }`);
  hero.renderOrder=1;
  let heroReady=false,heroBusy=false;
  const hm={x:.5,y:.5,tx:.5,ty:.5,px:.5,py:.5,vx:0,vy:0,h:0};
  async function heroTo(src,first,onStart){
    const tex=await load(src);
    if(first||!heroReady){hu.t0.value=tex;hu.a0.value=tex._aspect;hu.prog.value=0;heroReady=true;if(onStart)onStart();return}
    heroBusy=true;
    hu.t1.value=tex;hu.a1.value=tex._aspect;hu.seed.value=Math.random()*9+1;
    if(onStart)onStart();
    await tween(1800,k=>{hu.prog.value=k},EASE.io2);
    const old=hu.t0.value;hu.t0.value=tex;hu.a0.value=hu.a1.value;hu.prog.value=0;
    if(old!==tex&&old!==blank)release(old);
    heroBusy=false;
  }
  if(heroEl){
    heroEl.addEventListener('pointermove',e=>{const r=heroEl.getBoundingClientRect();hm.tx=(e.clientX-r.left)/r.width;hm.ty=1-(e.clientY-r.top)/r.height;hm.h=1});
    heroEl.addEventListener('pointerleave',()=>{hm.h=0});
  }

  /* hover preview */
  const pu={t0:{value:blank},t1:{value:blank},a0:{value:.8},a1:{value:.8},pa:{value:.8},mixv:{value:1},alpha:{value:0},vel:{value:new T.Vector2()},clipY:{value:1e5}};
  const preview=mk(pu,`uniform sampler2D t0,t1;uniform float a0,a1,pa,mixv,alpha,clipY;uniform vec2 vel;varying vec2 vUv;${NOISE}
    vec3 samp(sampler2D t,float a,vec2 uv){vec2 o=vel*.014;return vec3(texture2D(t,cover(uv+o,pa,a)).r,texture2D(t,cover(uv,pa,a)).g,texture2D(t,cover(uv-o,pa,a)).b);}
    void main(){if(gl_FragCoord.y>clipY)discard;vec3 col=mix(samp(t0,a0,vUv),samp(t1,a1,vUv),mixv);gl_FragColor=vec4(col*alpha,alpha);}`,
    `uniform vec2 vel;varying vec2 vUv;void main(){vUv=uv;vec3 p=position;p.x+=sin(uv.y*3.14159)*vel.x*.16;p.y-=sin(uv.x*3.14159)*vel.y*.16;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}`,
    new T.PlaneGeometry(1,1,24,24));
  preview.renderOrder=5;
  const pv={x:0,y:0,tx:0,ty:0,on:false,url:'',a:0,cur:blank,token:0,init:false};
  async function pvShow(url){
    pv.on=true;
    if(url===pv.url)return;
    pv.url=url;const tk=++pv.token;
    let tex;try{tex=await load(url)}catch(_){return}
    if(tk!==pv.token)return;
    if(pv.a<.05){pu.t0.value=tex;pu.a0.value=tex._aspect;pu.t1.value=tex;pu.a1.value=tex._aspect;pu.mixv.value=1;pv.cur=tex;return}
    pu.t0.value=pv.cur;pu.a0.value=pv.cur._aspect||.8;pu.t1.value=tex;pu.a1.value=tex._aspect;pu.mixv.value=0;pv.cur=tex;
    tween(380,k=>{if(tk===pv.token)pu.mixv.value=k},EASE.out);
  }
  function pvHide(now){pv.on=false;pv.url='';pv.token++;if(now){pv.a=0;preview.visible=false}}
  function pvMove(x,y){pv.tx=x;pv.ty=y;if(!pv.init){pv.x=x;pv.y=y;pv.init=true}}

  /* page veil */
  const vu={prog:{value:0},phase:{value:0},aspect:{value:1},seed:{value:2},col:{value:new T.Color('#193940')}};
  const veil=mk(vu,`uniform float prog,phase,aspect,seed;uniform vec3 col;varying vec2 vUv;${NOISE}
    void main(){float streak;float c=strokes(vUv,prog,aspect,7.,seed,streak);float a=phase<.5?c:1.-c;vec3 cc=col*(.86+.24*streak);gl_FragColor=vec4(cc*a,a);}`);
  veil.renderOrder=10;
  async function veilCover(hex){canvas.style.zIndex='90';vu.col.value.set(hex);vu.phase.value=0;vu.prog.value=0;vu.seed.value=Math.random()*9+1;veil.visible=true;await tween(380,k=>{vu.prog.value=k},EASE.io)}
  async function veilReveal(){vu.phase.value=1;vu.prog.value=0;vu.seed.value=Math.random()*9+1;await tween(520,k=>{vu.prog.value=k},EASE.io);veil.visible=false;canvas.style.zIndex=''}

  let W=0,H=0,wasMoving=true,lastSig='',force=true;
  /* hero and preview never draw over the header, even while the canvas is raised for a page change */
  const hdr=$('#hdr'),menuEl=$('#menu'),lbEl=$('#lb');
  function resize(){W=window.innerWidth;H=window.innerHeight;R.setSize(W,H,false);cam.right=W;cam.bottom=-H;cam.updateProjectionMatrix();place(veil,0,0,W,H);vu.aspect.value=W/H;
    const cy=(H-hdr.getBoundingClientRect().bottom)*R.getPixelRatio();hu.clipY.value=cy;pu.clipY.value=cy;force=true}
  resize();window.addEventListener('resize',resize);

  function frame(){
    let active=false;const overlay=!menuEl.hidden||!lbEl.hidden;
    if(heroReady&&!overlay&&document.body.dataset.view==='home'&&heroEl){
      const r=heroEl.getBoundingClientRect();
      if(r.width>0&&r.bottom>0&&r.top<H){
        hero.visible=true;place(hero,r.left-.5,r.top-.5,r.width+1,r.height+1);hu.pa.value=r.width/r.height;active=true;
        hm.x+=(hm.tx-hm.x)*.16;hm.y+=(hm.ty-hm.y)*.16;
        hm.vx=hm.vx*.86+(hm.x-hm.px)*1.4;hm.vy=hm.vy*.86+(hm.y-hm.py)*1.4;hm.px=hm.x;hm.py=hm.y;
        hu.mouse.value.set(hm.x,hm.y);hu.vel.value.set(clamp(hm.vx,-.4,.4),clamp(hm.vy,-.4,.4));
        hu.hover.value+=(hm.h-hu.hover.value)*.07;
        if(hu.hover.value<.002&&hm.h===0)hu.hover.value=0;
      }else hero.visible=false;
    }else hero.visible=false;
    /* skip drawing when the hero has not changed since the last frame */
    let sig='';if(hero.visible){const r=heroEl.getBoundingClientRect();sig=[r.left,r.top,r.width,r.height,hu.prog.value,hu.hover.value.toFixed(4),hu.vel.value.x.toFixed(4),hu.vel.value.y.toFixed(4),hu.mouse.value.x.toFixed(3),hu.mouse.value.y.toFixed(3),hu.t0.value.id,hu.t1.value.id].join()}
    const heroChanged=sig!==lastSig;lastSig=sig;
    const target=pv.on?1:0;
    pv.a+=(target-pv.a)*.14;
    if(pv.a>.003&&!overlay){
      const w=Math.min(280,W*.22),h=w*1.25;
      const ox=pv.tx+w*.62+w/2>W?-w*.62:w*.62;
      const px=pv.x,py=pv.y;
      pv.x+=(pv.tx+ox-pv.x)*.13;pv.y+=(pv.ty-pv.y)*.13;
      pu.vel.value.set(clamp((pv.x-px)/36,-1,1),clamp((pv.y-py)/36,-1,1));
      const s=.86+.14*pv.a;
      place(preview,pv.x-w*s/2,pv.y-h*s/2,w*s,h*s);pu.alpha.value=pv.a;pu.pa.value=.8;preview.visible=true;active=true;
    }else{preview.visible=false;pv.init=false}
    const moving=force||heroChanged||preview.visible||veil.visible;force=false;
    if(moving||wasMoving)R.render(scene,cam);
    wasMoving=moving;
  }
  const api={heroTo,frame,pvShow,pvHide,pvMove,veilCover,veilReveal,onLost:null};
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();if(api.onLost)api.onLost()},{once:true});
  return api;
}

/* ---------- hover previews ---------- */
const DomPV=(()=>{const el=$('#pv-fallback'),img=$('img',el);let x=0,y=0,tx=0,ty=0,on=false;
  return {show(u){if(img.getAttribute('src')!==u)img.src=u;on=true;el.style.opacity=1},hide(){on=false;el.style.opacity=0},move(cx,cy){tx=cx;ty=cy},
    frame(){if(!on&&el.style.opacity==='0')return;x+=(tx-x)*.15;y+=(ty-y)*.15;el.style.transform=`translate3d(${(x+40).toFixed(1)}px,${(y-175).toFixed(1)}px,0)`}}})();
const Preview={show:u=>{GL?GL.pvShow(u):DomPV.show(u)},hide:now=>{GL?GL.pvHide(now):DomPV.hide()},move:(x,y)=>{GL?GL.pvMove(x,y):DomPV.move(x,y)}};
const Ptr={x:-1,y:-1,in:false};
/* content scrolls under a still pointer: re-check what is under it */
let lastSy=null;
function hoverRecheck(sy){
  if(sy===lastSy)return;const first=lastSy===null;lastSy=sy;
  if(first||!finePointer||!Ptr.in||!$('#lb').hidden)return;
  const t=document.elementFromPoint(Ptr.x,Ptr.y);const r=t&&t.closest&&t.closest('.row');
  if(r&&r.dataset.pv)Preview.show(r.dataset.pv);else Preview.hide();
  if(Cursor)Cursor.target(t);
}
if(finePointer){
  document.addEventListener('pointerover',e=>{const r=e.target.closest&&e.target.closest('.row');if(r&&r.dataset.pv)Preview.show(r.dataset.pv)});
  document.addEventListener('pointerout',e=>{const r=e.target.closest&&e.target.closest('.row');if(!r)return;if(e.relatedTarget&&r.contains(e.relatedTarget))return;Preview.hide()});
  window.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse')return;Ptr.x=e.clientX;Ptr.y=e.clientY;Ptr.in=true;Preview.move(e.clientX,e.clientY)},{passive:true});
  document.documentElement.addEventListener('mouseleave',()=>{Ptr.in=false;Preview.hide()});
}

/* ---------- page veil ---------- */
const Veil={
  mode:null,
  async cover(world,label){
    const lab=$('#veil-label');lab.textContent=label;lab.classList.toggle('play',world==='play');
    if(!reduced)setTimeout(()=>{lab.style.opacity='1'},GL?260:160);
    if(GL){this.mode='gl';await GL.veilCover(world==='play'?'#f4b32b':'#193940')}
    else if(!reduced){this.mode='dom';const f=$('#veil-fallback');f.style.background=world==='play'?'#f4b32b':'#193940';f.style.opacity='1';await wait(240)}
    if(!reduced)await wait(110);
  },
  async reveal(){
    $('#veil-label').style.opacity='0';
    if(this.mode==='gl'&&GL)await GL.veilReveal();
    else if(this.mode==='dom'){$('#veil-fallback').style.opacity='0';await wait(240)}
    this.mode=null;
  }
};

/* ---------- text reveals ---------- */
function splitWords(el){
  if(!el||el.dataset.split)return;el.dataset.split='1';
  const walk=node=>{[...node.childNodes].forEach(n=>{
    if(n.nodeType===3){const frag=document.createDocumentFragment();n.textContent.split(/(\s+)/).forEach(part=>{if(!part)return;if(/^\s+$/.test(part)){frag.appendChild(document.createTextNode(part));return}const w=document.createElement('span');w.className='w';const i=document.createElement('span');i.textContent=part;w.appendChild(i);frag.appendChild(w)});n.replaceWith(frag)}
    else if(n.nodeType===1&&n.tagName!=='svg'&&!n.classList.contains('w'))walk(n)})};
  walk(el);
}
function playSplit(el,delay=0){
  if(reduced||!el)return;splitWords(el);const ws=$$('.w>span',el);
  ws.forEach((s,i)=>{s.style.transition='none';s.style.transform='translateY(110%)'});
  void el.offsetWidth;
  ws.forEach((s,i)=>{s.style.transition=`transform 1s cubic-bezier(.2,.7,.1,1) ${delay+i*26}ms`;s.style.transform=''});
}
const io=('IntersectionObserver' in window)&&!reduced?new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){en.target.classList.remove('rv-pre');io.unobserve(en.target)}}),{rootMargin:'0px 0px -6% 0px'}):null;
function armReveals(root){
  if(!io||!root)return;
  $$('.row,.tile,.card,.cov-card,.art-grid figure,.pi-card,.pj-text > div,.pj-gallery .shot,.disc > *,.season-h,.wall button:nth-child(-n+30)',root).forEach(el=>{
    const r=el.getBoundingClientRect();if(r.top>window.innerHeight&&!el.classList.contains('rv')){el.classList.add('rv','rv-pre');io.observe(el)}});
}

/* ---------- home ---------- */
const rowHTML=e=>`<a class="row" href="#${e.id}" data-go="${e.id}" data-pv="${esc(e.pv)}" data-cursor="View"><span class="row-cat mono">${CAT[e.cat]}</span><span class="row-name">${esc(e.name)}</span><span class="row-kind mono">${esc(e.kind)}</span><img class="row-thumb" src="${esc(e.pv)}" alt="" loading="lazy"><span class="row-arrow" aria-hidden="true">→</span></a>`;
const cardHTML=e=>`<a class="card" href="#${e.id}" data-go="${e.id}" data-cursor="View"><div class="card-media"><img src="${esc(e.pv)}" alt="" loading="lazy"></div><div class="card-meta"><b>${esc(e.name)}</b><span class="mono">${CAT[e.cat]} · ${esc(e.kind)}</span></div></a>`;
function tilesHTML(){
  const all=covAll(),latest=all[0];
  const mdNum=latest&&latest.md?pad(latest.md,2):pad(all.length,2);
  const picks=[1,6,13,17,22,30,33,41,47,62,64,71,77,85,88,94,97,103].map(k=>WC.find(p=>p.n===k)).filter(Boolean);
  return `<a class="tile" href="#coventry" data-go="coventry" data-cursor="Open series">
      <span class="live mono">Live · ${latest?seasonOf(latest.date):''} season</span>
      <div class="tile-media">${latest?`<img class="paper" src="${esc(latest.th||latest.src)}" alt="Latest Coventry poster: ${esc(covTitle(latest))}" loading="lazy">`:''}</div>
      <div class="tile-body"><span class="tile-num">${mdNum}</span><div><b>Coventry matchday</b><span class="mono">${latest?`Latest · ${esc(covTitle(latest))} · ${fmtDate(latest.date)}`:'A new poster every matchday'}</span></div></div></a>
    <a class="tile" href="#world-cup" data-go="world-cup" data-cursor="Open series">
      <div class="tile-media"><div class="mosaic">${picks.map(p=>`<img src="${p.th}" alt="" loading="lazy">`).join('')}</div></div>
      <div class="tile-body"><span class="tile-num">${WC.length}</span><div><b>World Cup 2026</b><span class="mono">A poster for every match · oil pastel</span></div></div></a>`;
}
function renderHome(){
  $('#home-rows').innerHTML=SELECTED.map(id=>byId[id]).filter(Boolean).map(rowHTML).join('');
  $('#sel-count').textContent=`(${SELECTED.length})`;
  $('#home-tiles').innerHTML=tilesHTML();
  $('#series-tiles').innerHTML=tilesHTML();
  const l=covAll()[0];
  const items=[
    l?`<span>Matchday ${l.md?pad(l.md,2):''} · <b>${esc(covTitle(l))}</b> · ${fmtDate(l.date)}</span>`:'',
    `<span>World Cup 2026 · <b>${WC.length} posters</b> · one for every match</span>`,
    `<span>Currently · <b>product illustration at Roqqu</b></span>`,
    `<span>Open to <b>freelance commissions</b> · illustration and design</span>`,
    `<span>Visual art · <b>${ART.length} pieces</b> in oil pastel</span>`,
    `<span>Play Inquiry · <b>creative workshops</b> for individuals, communities and teams</span>`].join('');
  $('#ticker').innerHTML=items+items;
}

/* ---------- work index ---------- */
const work={filter:'all',mode:'list',earlier:false};
const WORK_INTRO={
  all:'Every project in one index: poster series, graphic design, illustration and visual art.',
  series:'Two personal, ongoing poster series built around football: one for every match of the 2026 World Cup, and one for every Coventry matchday.',
  gd:'Posters, editorial covers, campaigns and identity systems built from bold typography and illustration.',
  ill:"In two words, I'm a world builder. My illustrations live across digital products, editorial platforms and games, turning complex ideas into clear, engaging visuals.",
  art:'Personal work made by hand: sports moments, animals, people, places and still life, built up in thick layers of oil pastel.'
};
function renderWork(){
  const F=[['all','All'],['series','Poster series'],['gd','Graphic design'],['ill','Illustration'],['art','Visual art']];
  const cnt=f=>f==='all'?ENTRIES.length:ENTRIES.filter(e=>e.cat===f).length;
  $('#work-filters').innerHTML=F.map(([f,l])=>`<button type="button" class="chip" data-wf="${f}" aria-pressed="${work.filter===f}">${l}<sup>${cnt(f)}</sup></button>`).join('');
  $$('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===work.mode)));
  $('#work-total').textContent=`${ENTRIES.length} projects`;
  $('#work-intro').textContent=WORK_INTRO[work.filter]||WORK_INTRO.all;
  const list=ENTRIES.filter(e=>!e.earlier&&(work.filter==='all'||e.cat===work.filter));
  const early=ENTRIES.filter(e=>e.earlier);
  const wrapL=a=>work.mode==='list'?`<div class="rows">${a.map(rowHTML).join('')}</div>`:`<div class="cards">${a.map(cardHTML).join('')}</div>`;
  $('#work-list').innerHTML=wrapL(list);
  const showE=work.filter==='all'||work.filter==='ill';
  $('#earlier-wrap').hidden=!showE;
  $('#work-earlier').hidden=!showE||!work.earlier;
  const eb=$('#earlier-btn');eb.setAttribute('aria-expanded',String(work.earlier));eb.innerHTML=work.earlier?'Hide earlier projects <span class="ar">↑</span>':'Read earlier projects <span class="ar">↓</span>';
  $('#work-earlier-list').innerHTML=wrapL(early);
  armReveals($('#v-work'));
}
$('#work-filters').addEventListener('click',e=>{const b=e.target.closest('[data-wf]');if(!b)return;work.filter=b.dataset.wf;renderWork()});
$$('[data-mode]').forEach(b=>b.addEventListener('click',()=>{work.mode=b.dataset.mode;renderWork()}));
$('#earlier-btn').addEventListener('click',()=>{work.earlier=!work.earlier;renderWork();if(work.earlier){const f=$('#work-earlier-list a');f&&f.focus({preventScroll:true});scrollToEl($('#work-earlier'))}});

/* ---------- project pages ---------- */
const LBSETS={};
const marks='<span class="marks" aria-hidden="true"><i></i><i></i><i></i><i></i></span>';
const sectionsHTML=s=>s.map(([h,items,list])=>`<div><h2 class="mono">${esc(h)}</h2>${list?`<ul>${items.map(t=>`<li>${esc(t)}</li>`).join('')}</ul>`:items.map(t=>`<p>${esc(t)}</p>`).join('')}</div>`).join('');
const nextHTML=(id,title,label)=>`<a class="pj-next" href="#${id}" data-go="${id}" data-cursor="Next"><span class="mono">${label}</span><b>${esc(title)} →</b></a>`;
function renderProject(p){
  const i=PROJECTS.indexOf(p),next=PROJECTS[(i+1)%PROJECTS.length];
  const first=p.sections[0][1][0];const lede=first.split('. ')[0].replace(/\.$/,'')+'.';
  LBSETS.project=[p.cover,...p.images].map((src,k)=>({src,cap:k?`${p.title} · page ${k}`:`${p.title} · cover`}));
  const del=(p.sections.find(s=>s[0]==='Deliverables')||[0,[]])[1];
  $('#project-detail').innerHTML=`${marks}
    <a class="back mono" href="#work" data-go="work" data-filter="gd">← Index</a>
    <header class="pj-head">
      <p class="pj-eyebrow mono">Graphic design · ${esc(p.kind)}</p>
      <h1 class="pj-title" tabindex="-1">${esc(p.title)}</h1>
      <p class="pj-lede">${esc(lede)}</p>
      <dl class="pj-meta"><div><dt class="mono">Discipline</dt><dd>${esc(p.kind)}</dd></div>${del.length?`<div style="grid-column:1/-1"><dt class="mono">Deliverables</dt><dd>${del.map(esc).join(' · ')}</dd></div>`:''}</dl>
    </header>
    <button class="shot pj-cover${p.dark?' dark':''}" type="button" data-lb="project" data-i="0" data-cursor="Enlarge"><img src="${p.cover}" alt="${esc(p.title)}, cover"></button>
    <div class="pj-text">${sectionsHTML(p.sections.filter(s=>s[0]!=='Deliverables'))}</div>
    <div class="pj-gallery">${p.images.map((src,k)=>`<button class="shot" type="button" data-lb="project" data-i="${k+1}" data-cursor="Enlarge"><img src="${src}" alt="${esc(p.title)}, project page ${k+1}" loading="lazy"></button>`).join('')}</div>
    ${nextHTML(next.id,next.title,'Next project')}`;
}
function renderIll(p){
  const i=ILL_PROJECTS.indexOf(p),next=ILL_PROJECTS[(i+1)%ILL_PROJECTS.length];
  LBSETS.ill=p.items.map(it=>({src:it.src,cap:it.cap?`${p.name} · ${it.cap}`:p.name}));
  const grid=p.layout==='masonry'
    ?`<div class="masonry">${p.items.map((it,k)=>`<figure><button class="shot" type="button" data-lb="ill" data-i="${k}" data-cursor="Enlarge"><img src="${it.src}" width="${it.w}" height="${it.h}" alt="${esc(it.cap||p.name)}" loading="lazy"></button>${it.cap?`<figcaption class="mono">${esc(it.cap)}</figcaption>`:''}</figure>`).join('')}</div>`
    :`<div class="pp-grid">${p.items.map((it,k)=>`<button class="shot" type="button" data-lb="ill" data-i="${k}" data-cursor="Enlarge"><img src="${it.src}" alt="${esc(it.cap||p.name)}" loading="lazy"></button>`).join('')}</div>`;
  $('#ill-detail').innerHTML=`${marks}
    <a class="back mono" href="#work" data-go="work" data-filter="ill">← Illustration</a>
    <header class="pj-head">
      <p class="pj-eyebrow mono">Illustration · ${esc(p.kind)}</p>
      <h1 class="pj-title" tabindex="-1">${esc(p.name)}</h1>
      <p class="pj-lede">${esc(p.text)}</p>
      <dl class="pj-meta"><div><dt class="mono">Tools</dt><dd><div class="pj-tags mono">${p.tools.map(t=>`<span>${esc(t)}</span>`).join('')}</div></dd></div><div><dt class="mono">Pieces</dt><dd>${p.items.length}</dd></div>${p.link?`<div style="grid-column:1/-1"><dt class="mono">More</dt><dd><a class="pj-ext" href="${esc(p.link)}" target="_blank" rel="noopener">${/behance/.test(p.link)?'Full case study on Behance':'Visit the live site'} ↗</a></dd></div>`:''}</dl>
    </header>
    ${grid}
    ${nextHTML(next.id,next.name,'Next illustration project')}`;
}

/* ---------- world cup ---------- */
let wcStage='all',wcQ='',wcVisible=WC_SORTED;
function renderWC(){
  const q=wcQ.trim().toLowerCase();
  wcVisible=WC_SORTED.filter(p=>(wcStage==='all'||p.s===wcStage)&&(!q||p.t.some(t=>t.toLowerCase().includes(q))));
  const cnt=id=>id==='all'?WC.length:WC.filter(p=>p.s===id).length;
  $('#wc-stages').innerHTML=[['all','All'],['group','Group stage'],['ko','Knockout rounds']].map(([id,l])=>`<button type="button" class="chip" data-stage="${id}" aria-pressed="${wcStage===id}">${l}<sup>${cnt(id)}</sup></button>`).join('');
  $('#wc-num').textContent=WC.length;
  $('#wc-count').textContent=q||wcStage!=='all'?`${wcVisible.length} ${wcVisible.length===1?'poster':'posters'}`:`All ${WC.length} posters, in match order`;
  $('#wc-wall').innerHTML=wcVisible.length?wcVisible.map((p,k)=>`<button type="button" data-wc="${k}" data-cursor="Enlarge" aria-label="Poster ${p.n}: ${esc(wcTitle(p))}"><img src="${p.th}" alt="" loading="lazy"><span class="cap mono"><b>No. ${pad(p.n)}</b><span class="cap-t">${esc(wcTitle(p))}</span></span></button>`).join(''):`<p class="lede">No posters match “${esc(wcQ)}”. Try another team name.</p>`;
}
$('#wc-stages').addEventListener('click',e=>{const b=e.target.closest('[data-stage]');if(!b)return;wcStage=b.dataset.stage;renderWC()});
$('#wc-q').addEventListener('input',e=>{wcQ=e.target.value;renderWC()});
const Scrub=(()=>{
  const ruler=$('#scrub-ruler'),head=$('#scrub-head'),img=$('#scrub-img'),no=$('#scrub-no'),title=$('#scrub-title'),stage=$('#scrub-stage');
  const N=WC_SORTED.length;let idx=0,pre=false,drag=false;
  let labs='';for(let i=0;i<N;i+=10)labs+=`<span class="lab mono" style="left:${(i+.5)/N*100}%">${pad(WC_SORTED[i].n)}</span>`;
  const ko=WC_SORTED.findIndex(p=>p.s==='ko');if(ko>0)labs+=`<span class="ko" style="left:${ko/N*100}%"><span class="mono">Knockouts →</span></span>`;
  ruler.insertAdjacentHTML('beforeend',labs);
  ruler.setAttribute('aria-valuemax',String(N));
  function set(i){idx=clamp(i,0,N-1);const p=WC_SORTED[idx];if(img.getAttribute('src')!==p.th)img.src=p.th;img.alt=`Poster ${p.n}: ${wcTitle(p)}`;no.textContent=pad(p.n);title.textContent=wcTitle(p);stage.textContent=p.s==='ko'?'Knockout rounds':'Group stage';head.style.left=((idx+.5)/N*100)+'%';ruler.setAttribute('aria-valuenow',String(idx+1));ruler.setAttribute('aria-valuetext',`Poster ${p.n}, ${wcTitle(p)}`)}
  const preload=()=>{if(pre)return;pre=true;WC_SORTED.forEach(p=>{const im=new Image();im.src=p.th})};
  const fromX=x=>{const r=ruler.getBoundingClientRect();return Math.floor(clamp((x-r.left)/r.width,0,.9999)*N)};
  ruler.addEventListener('pointerenter',preload);
  ruler.addEventListener('pointerdown',e=>{preload();drag=true;try{ruler.setPointerCapture(e.pointerId)}catch(_){}set(fromX(e.clientX))});
  ruler.addEventListener('pointermove',e=>{if(e.pointerType==='mouse'||drag)set(fromX(e.clientX))});
  ['pointerup','pointercancel'].forEach(t=>ruler.addEventListener(t,()=>{drag=false}));
  ruler.addEventListener('keydown',e=>{const k=e.key,m={ArrowRight:1,ArrowUp:1,ArrowLeft:-1,ArrowDown:-1,PageUp:10,PageDown:-10};if(k in m){set(idx+m[k]);e.preventDefault()}else if(k==='Home'){set(0);e.preventDefault()}else if(k==='End'){set(N-1);e.preventDefault()}});
  $('#scrub-sheet').addEventListener('click',e=>openLB(WC_SORTED.map(p=>({src:p.src,cap:`No. ${pad(p.n)} · ${wcTitle(p)}`})),idx,e.currentTarget));
  set(0);return {set};
})();

/* ---------- coventry ---------- */
let covList=[],covLB=[],covStart=[],artAdmin=null;
function renderCov(){
  covList=covAll();covLB=[];covStart=[];
  covList.forEach(p=>{covStart.push(covLB.length);const cap=`${p.md?`Matchday ${p.md} · `:''}${covTitle(p)} · ${fmtDate(p.date)}${p.score?' · '+p.score:''}`;covLB.push({src:p.src,cap});(p.alts||[]).forEach((a,i)=>covLB.push({src:a.src,cap:`${cap} · alternate version ${i+1}`}))});
  const latest=covList[0];$('#cov-md').textContent=latest&&latest.md?pad(latest.md,2):pad(covList.length,2);
  const el=$('#cov-feed');
  if(!covList.length){el.innerHTML='<p class="lede">The first posters are coming soon.</p>';return}
  const groups={};covList.forEach((p,k)=>{(groups[seasonOf(p.date)]=groups[seasonOf(p.date)]||[]).push([p,k])});
  el.innerHTML=Object.entries(groups).map(([season,items])=>`<section class="season"><div class="season-h"><h2>${season} season</h2><span class="mono">${items.length} ${items.length===1?'poster':'posters'} · newest first</span></div><div class="cov-grid">${items.map(([p,k])=>`<figure class="cov-card"><button class="shotc" type="button" data-cov="${k}" data-cursor="Enlarge" aria-label="View poster: ${esc(covTitle(p))}"><img src="${esc(p.th||p.src)}" width="${p.w}" height="${p.h}" alt="" loading="lazy">${p.md?`<span class="md-tag mono">MD ${pad(p.md,2)}</span>`:''}</button><figcaption><b>${esc(covTitle(p))}</b><div class="meta mono">${fmtDate(p.date)} · ${esc(p.comp||'League')}${p.score?` · ${esc(p.score)}`:''}</div>${p.alts&&p.alts.length?`<div class="mono alt-note">+${p.alts.length} alternate ${p.alts.length===1?'version':'versions'}</div>`:''}${artAdmin&&p.id?`<button type="button" class="rm-btn" data-covrm="${esc(p.id)}">Remove</button>`:''}</figcaption></figure>`).join('')}</div></section>`).join('');
}

/* ---------- visual art ---------- */
let artFilter='all',artVisible=ART;
function renderArt(){
  artVisible=artFilter==='all'?ART:ART.filter(a=>a.cat===artFilter);
  $('#art-filters').innerHTML=ART_CATS.map(([id,l])=>{const n=id==='all'?ART.length:ART.filter(a=>a.cat===id).length;return `<button type="button" class="chip" data-cat="${id}" aria-pressed="${artFilter===id}">${esc(l)}<sup>${n}</sup></button>`}).join('');
  $('#art-total').textContent=`${ART.length} pieces`;
  $('#art-grid').innerHTML=artVisible.map((it,k)=>`<figure><button class="shotc" type="button" data-art="${k}" data-cursor="Enlarge" aria-label="View larger: ${esc(it.cap)}"><img src="${esc(it.src)}" width="${it.w}" height="${it.h}" alt="${esc(it.cap)}, ${esc(it.medium||'oil pastel')}" loading="lazy"></button><figcaption class="mono">${isNew(it)?'<span class="new-badge">New</span>':''}<b>${esc(it.cap)}</b>${it.medium&&it.medium!=='Oil pastel'?`<span>${esc(it.medium)}</span>`:''}${artAdmin&&it.id?`<button type="button" class="rm-btn" data-rm="${esc(it.id)}">Remove</button>`:''}</figcaption></figure>`).join('');
}
$('#art-filters').addEventListener('click',e=>{const b=e.target.closest('[data-cat]');if(!b)return;artFilter=b.dataset.cat;renderArt()});

/* ---------- about ---------- */
$('#disc').innerHTML=[
  ['ill','Illustration','Editorial illustration, drawing and painting.',`${ILL_PROJECTS.length} projects`],
  ['gd','Graphic design','Posters, editorial covers, campaigns and identity systems.',`${PROJECTS.length} projects`],
  ['series','Poster series','Posters, made one match at a time.','2 ongoing'],
  ['play','Creative workshops','Play Inquiry: guided, hands-on creative experiences for individuals, communities and teams.','Play Inquiry']
].map(([f,t,d,s])=>`<a href="#${f==='play'?'play-inquiry':'work'}" data-go="${f==='play'?'play-inquiry':'work'}"${f==='play'?'':` data-filter="${f}"`}><b>${t}</b><p>${d}</p><span class="mono">${s} →</span></a>`).join('');

/* ---------- lightbox ---------- */
let lbList=[],lbI=0,lbFrom=null;
function openLB(list,i,from){if(!list||!list.length)return;lbList=list;lbFrom=from||null;$('#lb').hidden=false;lbShow(i);if(lenis)lenis.stop();document.documentElement.style.overflow='hidden';Preview.hide();$('#lb-close').focus()}
function lbShow(i){lbI=(i+lbList.length)%lbList.length;const it=lbList[lbI];const im=$('#lb-img');im.src=it.src;im.alt=it.cap||'';$('#lb-cap').textContent=it.cap||'';$('#lb-count').textContent=`${lbI+1} / ${lbList.length}`;$('#lb-prev').hidden=$('#lb-next').hidden=lbList.length<2}
function closeLB(){$('#lb').hidden=true;if(lenis)lenis.start();document.documentElement.style.overflow='';if(lbFrom)lbFrom.focus({preventScroll:true})}
$('#lb-close').addEventListener('click',closeLB);
$('#lb-prev').addEventListener('click',()=>lbShow(lbI-1));
$('#lb-next').addEventListener('click',()=>lbShow(lbI+1));
$('#lb').addEventListener('click',e=>{if(e.target.id==='lb'||e.target.id==='lb-fig')closeLB()});
(()=>{let sx=null;const f=$('#lb-fig');f.addEventListener('pointerdown',e=>{sx=e.clientX});f.addEventListener('pointerup',e=>{if(sx==null)return;const dx=e.clientX-sx;sx=null;if(Math.abs(dx)>50)lbShow(lbI+(dx<0?1:-1))})})();
document.addEventListener('keydown',e=>{
  if(!$('#lb').hidden){
    if(e.key==='Escape')closeLB();else if(e.key==='ArrowLeft')lbShow(lbI-1);else if(e.key==='ArrowRight')lbShow(lbI+1);
    else if(e.key==='Tab'){const f=$$('#lb button:not([hidden])');const a=f.indexOf(document.activeElement);if(e.shiftKey&&a<=0){f[f.length-1].focus();e.preventDefault()}else if(!e.shiftKey&&a===f.length-1){f[0].focus();e.preventDefault()}}
    return;
  }
  if(e.key==='Escape'&&!$('#menu').hidden)closeMenu();
});

/* ---------- menu ---------- */
function openMenu(){$('#menu').hidden=false;$('#menu-btn').setAttribute('aria-expanded','true');if(lenis)lenis.stop();$('#menu-close').focus()}
function closeMenu(){if($('#menu').hidden)return;$('#menu').hidden=true;$('#menu-btn').setAttribute('aria-expanded','false');if(lenis)lenis.start()}
$('#menu-btn').addEventListener('click',openMenu);
$('#menu-close').addEventListener('click',()=>{closeMenu();$('#menu-btn').focus()});

/* ---------- copy ---------- */
async function copy(btn){
  const label=btn.querySelector('[data-copy-label]');const before=label?label.textContent:'';
  try{await navigator.clipboard.writeText(btn.dataset.copy);if(label)label.textContent='Copied';else btn.dataset.cursor='Copied'}
  catch(_){const t=btn.querySelector('.sel')||btn;const r=document.createRange();r.selectNodeContents(t);const s=getSelection();s.removeAllRanges();s.addRange(r);if(label)label.textContent='Selected, press copy'}
  if(label)setTimeout(()=>{label.textContent=before||'Copy'},2200);
}

/*@PLAY_JS@*/

/* ---------- router ----------
   Each view is a hash route. Section routes (#workshops, #field-notes, #about-oselu) open the
   Play Inquiry page at that section. Old Wonderful Labs links still resolve through ALIAS. */
const PLAY=['play-inquiry','lagos-session','art-club','summer-school','collaborate','join','team-workshop','children-programme'];
const ALIAS={labs:'play-inquiry','lagos-class':'lagos-session','lagos-pilot':'lagos-session',enquire:'join','how-it-works':'workshops','puff-puff':'art-club','small-chops':'art-club','spark-school':'summer-school',kids:'summer-school','at-work':'team-workshop'};
let current='',currentView='',busy=false;
const resolveRoute=n=>ALIAS[n]||n;
function viewOf(n){n=resolveRoute(n);if(PI_SECTIONS[n])return 'play-inquiry';if(PROJECTS.some(p=>p.id===n))return 'project';if(ILL_PROJECTS.some(p=>p.id===n))return 'illproject';if(n&&n!=='project'&&n!=='illproject'&&$(`.view[data-view="${CSS.escape(n)}"]`))return n;return 'home'}
const routeOf=(n,view)=>(view==='project'||view==='illproject'||PI_SECTIONS[n])?n:view;
const NAVKEY={project:'work',illproject:'work',work:'work',series:'series','world-cup':'series',coventry:'series','visual-art':'visual-art',about:'about','work-with-me':'work-with-me','lagos-session':'field-notes','art-club':'field-notes','summer-school':'field-notes',collaborate:'collaborate',join:'join','team-workshop':'join','children-programme':'join'};
const LABELS={home:'Oselu Irabor',work:'Work',series:'Poster series','world-cup':'World Cup 2026',coventry:'Coventry matchday','visual-art':'Visual art',about:'About','work-with-me':'Work with me','play-inquiry':'Play Inquiry','lagos-session':'The Lagos session','art-club':'The art club','summer-school':'The summer programme',collaborate:'Collaborate',join:'Join the next experiment','team-workshop':'Plan a team workshop','children-programme':'Plan a programme for children',...PI_SECTION_LABELS};
const labelFor=n=>byId[n]?byId[n].name:(LABELS[n]||'');
const STUDIO_DESC=$('meta[name="description"]')?$('meta[name="description"]').getAttribute('content'):'';
function setMeta(view,route){
  const play=PLAY.includes(view);
  document.title=PI_TITLES[route]||(play?(view==='play-inquiry'&&!PI_SECTIONS[route]?'Play Inquiry by Oselu | Creative Workshops & Experiences':`${labelFor(route)} | Play Inquiry by Oselu`)
    :(view==='home'?'Oselu Irabor | Visual artist, illustrator and designer':`${labelFor(route)} | Oselu Irabor`));
  const m=$('meta[name="description"]');if(m)m.setAttribute('content',play?(PI_DESCS[route]||PI_DESC):STUDIO_DESC);
}
function show(name,initial){
  const n=resolveRoute(name),view=viewOf(n),route=routeOf(n,view),sec=PI_SECTIONS[route];
  if(view==='project')renderProject(PROJECTS.find(p=>p.id===route));
  if(view==='illproject')renderIll(ILL_PROJECTS.find(p=>p.id===route));
  if(view==='work')renderWork();
  $$('.view').forEach(v=>{v.hidden=v.dataset.view!==view});
  const world=PLAY.includes(view)?'play':'studio';
  document.body.dataset.world=world;document.body.dataset.view=view;
  current=route;currentView=view;
  const nk=NAVKEY[view]||'';$$('[data-nav]').forEach(a=>{a.dataset.nav===nk?a.setAttribute('aria-current','page'):a.removeAttribute('aria-current')});
  $('#ftr-name').textContent=world==='play'?'Play Inquiry':'Oselu Irabor.';fitFooter();
  if(initial){try{history.replaceState(null,'','#'+route)}catch(_){}}
  Preview.hide(true);closeMenu();scrollTop(false);
  if(lenis)lenis.resize();
  setMeta(view,route);
  const v=$(`.view[data-view="${view}"]`);
  if(!initial){
    const h=sec?document.getElementById(sec):v&&v.querySelector('[tabindex="-1"]');
    if(h){if(sec&&!h.hasAttribute('tabindex'))h.setAttribute('tabindex','-1');h.focus({preventScroll:true})}
    if(!sec)playSplit(v&&v.querySelector('.page-h,.pj-title,.pi-h1,.wc-intro h1,#v-coventry h1'),80);
  }
  if(world==='play')Play.onShow(view,sec,initial);
  requestAnimationFrame(()=>armReveals(v));
}
let pendingNav=null;
async function go(name,push=true){
  /* a request that arrives mid-transition (back button, a fast second click) runs once this one finishes */
  if(busy){pendingNav={name,push};return}
  const n=resolveRoute(name),view=viewOf(n),route=routeOf(n,view),sec=PI_SECTIONS[route];
  const samePage=view===currentView&&(view!=='project'&&view!=='illproject'||route===current);
  if(samePage){
    closeMenu();
    if(sec){Play.scrollTo(sec,true);const el=document.getElementById(sec);if(el){if(!el.hasAttribute('tabindex'))el.setAttribute('tabindex','-1');el.focus({preventScroll:true})}}
    else{if(view==='work')renderWork();scrollTop(true)}
    if(route!==current){current=route;if(push){try{history.pushState(null,'','#'+route)}catch(_){}}setMeta(view,route)}
    return;
  }
  busy=true;
  try{
    await Veil.cover(PLAY.includes(view)?'play':'studio',labelFor(route));
    show(route);
    try{if(push)history.pushState(null,'','#'+route);else if(location.hash.slice(1)!==route)history.replaceState(null,'','#'+route)}catch(_){}
    await Veil.reveal();
  }finally{
    busy=false;
    if(pendingNav){const q=pendingNav;pendingNav=null;if(resolveRoute(q.name)!==current)go(q.name,q.push)}
  }
}
window.addEventListener('popstate',()=>{const n=decodeURIComponent(location.hash.slice(1))||'home';if(n!==current)go(n,false)});
document.addEventListener('click',e=>{
  const t=e.target;if(!t.closest)return;
  const lb=t.closest('[data-lb]');if(lb){openLB(LBSETS[lb.dataset.lb],+lb.dataset.i,lb);return}
  const w=t.closest('[data-wc]');if(w){openLB(wcVisible.map(p=>({src:p.src,cap:`No. ${pad(p.n)} · ${wcTitle(p)}`})),+w.dataset.wc,w);return}
  const c=t.closest('[data-cov]');if(c){openLB(covLB,covStart[+c.dataset.cov],c);return}
  const rm=t.closest('[data-rm]');if(rm){removeArt(rm);return}
  const crm=t.closest('[data-covrm]');if(crm){removeCov(crm);return}
  const a=t.closest('[data-art]');if(a){openLB(artVisible.map(x=>({src:x.src,cap:x.cap+(x.medium&&x.medium!=='Oil pastel'?` · ${x.medium}`:'')})),+a.dataset.art,a);return}
  const cp=t.closest('[data-copy]');if(cp){copy(cp);return}
  const sc=t.closest('[data-scroll]');if(sc){const el=document.getElementById(sc.dataset.scroll);if(el){scrollToEl(el);if(!el.hasAttribute('tabindex'))el.setAttribute('tabindex','-1');el.focus({preventScroll:true})}return}
  const g=t.closest('[data-go]');if(g){if(e.metaKey||e.ctrlKey||e.shiftKey)return;e.preventDefault();if(g.dataset.filter){work.filter=g.dataset.filter;work.earlier=false}if(g.dataset.interest)Play.setInterest(g.dataset.interest);go(g.dataset.go)}
});
$('.skip').addEventListener('click',e=>{e.preventDefault();const h=$('.view:not([hidden]) [tabindex="-1"]')||$('#main');h.setAttribute('tabindex','-1');h.focus()});
window.addEventListener('hashchange',()=>{const n=decodeURIComponent(location.hash.slice(1));if(!n||n===current)return;if(viewOf(n)==='home'&&n!=='home')return;go(n,false)});

/* ---------- hero rotation (random World Cup poster every 30–60 s) ---------- */
const Hero=(()=>{
  const sheet=$('#hero-sheet'),imgs=[$('#hero-a'),$('#hero-b')],no=$('#hero-no'),title=$('#hero-title'),bar=$('#hero-bar');
  let cur=0,last=-1,dur=45000,remain=45000,lastT=0,swapping=false,started=false;
  const pick=()=>{let i;do{i=Math.floor(Math.random()*WC.length)}while(WC.length>1&&i===last);last=i;return WC[i]};
  const caption=p=>{no.textContent='No. '+pad(p.n);title.textContent=wcTitle(p);document.documentElement.style.setProperty('--tint',p.c||'#ff5b3a')};
  const schedule=()=>{dur=30000+Math.random()*30000;remain=dur};
  /* plain crossfade between the two stacked images (no WebGL, or before it loads) */
  function domSwap(p){return new Promise(res=>{const next=imgs[1-cur];
    const done=()=>{next.onload=next.onerror=null;caption(p);imgs[cur].classList.remove('on');next.classList.add('on');cur=1-cur;res()};
    next.onload=done;next.onerror=()=>{next.onload=next.onerror=null;res()};next.src=p.src;if(next.complete&&next.naturalWidth)done()})}
  async function swap(p){
    if(swapping)return;swapping=true;
    try{
      if(GL&&sheet.classList.contains('gl-on')){await GL.heroTo(p.src,false,()=>caption(p));imgs[cur].src=p.src}
      else await domSwap(p);
    }catch(_){await domSwap(p)}
    swapping=false;schedule();
  }
  async function attachGL(){
    if(!GL)return;
    while(swapping)await wait(150);
    swapping=true;
    try{await GL.heroTo(imgs[cur].getAttribute('src'),true);sheet.classList.add('gl-on')}catch(_){}
    swapping=false;
  }
  function start(){
    started=true;const first=WC.find(p=>imgs[0].getAttribute('src')===p.src)||WC[0];last=WC.indexOf(first);caption(first);
    /* open on a random poster: the first change comes a moment after load, the rest every 30–60 s */
    dur=remain=reduced?1:2600;
  }
  $('#hero-next').addEventListener('click',()=>{if(!swapping)swap(pick())});
  return {start,attachGL,frame(t){
    const dt=lastT?Math.min(100,t-lastT):0;lastT=t;
    if(!started||swapping||document.hidden||document.body.dataset.view!=='home')return;
    remain-=dt;bar.style.transform=`scaleX(${clamp(1-remain/dur,0,1).toFixed(4)})`;
    if(remain<=0)swap(pick());
  }};
})();

/* ---------- mat ruler & cursor ---------- */
const Ruler=(()=>{const el=$('#ruler');const sp=[];for(let i=0;i<16;i++){const s=document.createElement('span');el.appendChild(s);sp.push(s)}let last=-1;
  return {frame(sy){if(window.innerWidth<1100)return;const y=Math.round(sy);if(y===last)return;last=y;const off=y%200;el.style.setProperty('--off',(-off)+'px');for(let i=0;i<sp.length;i++){sp[i].style.top=(i*200-off)+'px';sp[i].textContent=String(Math.round((y-off+i*200)/40))}}}})();
const Cursor=(()=>{
  if(!finePointer||reduced)return null;
  document.documentElement.classList.add('has-cursor');
  const el=$('#cur'),xy=$('#cur-xy'),lab=$('#cur-label');let tx=-200,ty=-200,x=-200,y=-200,n=0;
  function target(node){
    const t=node&&node.closest&&node.closest('[data-cursor],a,button,[role=slider],label.drop,select');
    if(t){el.classList.add('act');const l=t.dataset.cursor||(t.tagName==='A'?'Open':'');lab.textContent=l;lab.style.visibility=l?'':'hidden'}else el.classList.remove('act');
  }
  window.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse')return;tx=e.clientX;ty=e.clientY;el.classList.add('on');target(e.target)},{passive:true});
  window.addEventListener('mouseout',e=>{if(!e.relatedTarget)el.classList.remove('on')});
  return {target,frame(sy){x+=(tx-x)*.42;y+=(ty-y)*.42;el.style.transform=`translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0)`;if((n++&3)===0)xy.textContent=`x ${pad(Math.max(0,Math.round(tx/4)),3)} · y ${pad(Math.max(0,Math.round((ty+sy)/4)),4)} mm`}};
})();

/* ---------- clock & footer ---------- */
let fmtClock=null;try{fmtClock=new Intl.DateTimeFormat('en-GB',{hour:'2-digit',minute:'2-digit',timeZone:'Africa/Lagos'})}catch(_){}
function tickClock(){if(!fmtClock)return;const t=fmtClock.format(new Date());$('#clock').textContent=`Kaduna ${t} WAT`;$$('.clock-any').forEach(e=>{e.textContent=`Kaduna, Nigeria · ${t} WAT`})}
tickClock();setInterval(tickClock,20000);
function fitFooter(){const el=$('#ftr-name');if(!el)return;const par=el.parentElement,cs=getComputedStyle(par);const w=par.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight);el.style.display='inline-block';el.style.fontSize='100px';const sw=el.getBoundingClientRect().width;if(sw)el.style.fontSize=(100*w/sw*.99).toFixed(2)+'px'}
window.addEventListener('resize',fitFooter);if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>{fitFooter();if(lenis)lenis.resize()});

/* ---------- owner-only uploads (the page republishes itself) ---------- */
async function loadBitmap(file){try{return await createImageBitmap(file)}catch(_){}const url=URL.createObjectURL(file);try{return await new Promise((res,rej)=>{const i=new Image();i.onload=()=>res(i);i.onerror=rej;i.src=url})}finally{setTimeout(()=>URL.revokeObjectURL(url),1000)}}
async function prepImage(file){const img=await loadBitmap(file);const w0=img.width||img.naturalWidth,h0=img.height||img.naturalHeight,sc=Math.min(1,1800/Math.max(w0,h0));const c=document.createElement('canvas');c.width=Math.round(w0*sc);c.height=Math.round(h0*sc);const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(img,0,0,c.width,c.height);const blob=await new Promise(r=>c.toBlob(r,'image/jpeg',.86));if(!blob)throw new Error('encode');return {blob,w:c.width,h:c.height}}
const todayISO=()=>{const t=new Date();return t.getFullYear()+'-'+String(t.getMonth()+1).padStart(2,'0')+'-'+String(t.getDate()).padStart(2,'0')};
/* The page republishes itself from tpl/page.html with the owner's data written into four markers:
   artwork, Coventry posters, the Lagos session (photos and reflections) and the next public session. */
async function publishData(next){
  const res=await fetch('tpl/page.html',{cache:'no-store'});if(!res.ok)throw {code:'template'};
  let tpl=await res.text();const m1='/*EXTRA'+'*/[]/*END*/',m2='/*COV'+'*/[]/*END*/',m3='/*PILOT'+'*/{}/*END*/',m4='/*NEXT'+'*/{}/*END*/';
  if(!tpl.includes(m1)||!tpl.includes(m2)||!tpl.includes(m3)||!tpl.includes(m4))throw {code:'template'};
  const j=v=>JSON.stringify(v).replace(/</g,'\\u003c');
  const art=next.art||ART_EXTRA,cov=next.cov||COV_POSTERS,pl=next.pilot||PILOT;
  const pilot=(pl.photos&&pl.photos.length)||(pl.notes&&Object.keys(pl.notes).length)?pl:{};
  const ses=next.session!==undefined?next.session:NEXT_SESSION,session=ses&&ses.date?ses:{};
  tpl=tpl.replace(m1,()=>'/*EXTRA*/'+j(art)+'/*END*/').replace(m2,()=>'/*COV*/'+j(cov)+'/*END*/').replace(m3,()=>'/*PILOT*/'+j(pilot)+'/*END*/').replace(m4,()=>'/*NEXT*/'+j(session)+'/*END*/');
  await artAdmin.artifact.publish(tpl);
}
function publishError(e){const c=e&&e.code;
  if(c==='conflict')return 'A newer version of the site was just saved, so the page is reloading. Add it again once it loads.';
  if(c==='not_writer'||c==='not_granted'||c==='capability_disabled'||c==='capability_removed'||c==='not_declared')return 'Saving is not available in this view. Open the site from your own Claude account to add work.';
  if(c==='rate_limited')return 'Too many saves in a short time. Wait a minute, then try again.';
  if(c==='too_large'||c==='quota_or_state')return 'The site has reached its storage limit. Remove an older piece, then try again.';
  if(c==='template')return 'The site template could not be loaded. Ask Claude to republish the site.';
  return 'Something went wrong while saving. Try again in a moment.'}
const aa={form:$('#aa-form'),file:$('#aa-file'),prev:$('#aa-preview'),drop:$('#aa-drop-text'),title:$('#aa-title'),cat:$('#aa-cat'),medium:$('#aa-medium'),status:$('#aa-status'),save:$('#aa-save')};
let aaBlob=null,aaSize=null;const aaMsg=(t,err)=>{aa.status.textContent=t;aa.status.classList.toggle('err',!!err)};
aa.file.addEventListener('change',async()=>{const f=aa.file.files[0];if(!f)return;aaMsg('Preparing image…');
  try{const r=await prepImage(f);aaBlob=r.blob;aaSize=[r.w,r.h];aa.prev.src=URL.createObjectURL(r.blob);aa.prev.hidden=false;aa.drop.hidden=true;aaMsg('');if(!aa.title.value)aa.title.value=f.name.replace(/\.[^.]+$/,'').replace(/[_-]+/g,' ').replace(/^IMG \d+$/i,'')}
  catch(_){aaBlob=null;aaMsg("This image type can't be read here. Export it as JPG or PNG and try again.",true)}});
$('#aa-open').addEventListener('click',()=>{aa.form.hidden=false;$('#aa-open').hidden=true;aa.title.focus()});
$('#aa-cancel').addEventListener('click',()=>{aa.form.reset();aa.medium.value='Oil pastel';aaBlob=null;aa.prev.hidden=true;aa.drop.hidden=false;aaMsg('');aa.form.hidden=true;$('#aa-open').hidden=false});
aa.form.addEventListener('submit',async e=>{e.preventDefault();
  if(!aaBlob){aaMsg('Choose an image first.',true);return}
  const title=aa.title.value.trim();if(!title){aaMsg('Add a title.',true);aa.title.focus();return}
  aa.save.disabled=true;aaMsg('Uploading image…');
  try{const up=await artAdmin.assets.upload(aaBlob,{type:'image/jpeg'});aaMsg('Publishing to the site…');
    const item={id:up.id,src:up.url,w:aaSize[0],h:aaSize[1],cap:title,cat:aa.cat.value,medium:aa.medium.value.trim()||'Oil pastel',added:todayISO()};
    await publishData({art:[...ART_EXTRA,item]});aaMsg('Published. The page is reloading with your new piece.')}
  catch(err){aa.save.disabled=false;aaMsg(publishError(err),true)}});
async function removeArt(btn){
  if(!btn.classList.contains('armed')){btn.classList.add('armed');btn.textContent='Confirm remove';setTimeout(()=>{btn.classList.remove('armed');btn.textContent='Remove'},4000);return}
  const id=btn.dataset.rm;btn.disabled=true;btn.textContent='Removing…';
  try{await publishData({art:ART_EXTRA.filter(a=>a.id!==id)});artAdmin.assets.delete(id).catch(()=>{})}
  catch(err){btn.disabled=false;btn.textContent='Remove';btn.classList.remove('armed');aa.form.hidden=false;aaMsg(publishError(err),true)}}
const cv={form:$('#cov-form'),file:$('#cov-file'),prev:$('#cov-preview'),drop:$('#cov-drop-text'),opp:$('#cov-opp'),date:$('#cov-date'),ha:$('#cov-ha'),comp:$('#cov-comp'),md:$('#cov-md-in'),score:$('#cov-score'),status:$('#cov-status'),save:$('#cov-save')};
let cvBlob=null,cvSize=null;const cvMsg=(t,err)=>{cv.status.textContent=t;cv.status.classList.toggle('err',!!err)};
cv.file.addEventListener('change',async()=>{const f=cv.file.files[0];if(!f)return;cvMsg('Preparing image…');
  try{const r=await prepImage(f);cvBlob=r.blob;cvSize=[r.w,r.h];cv.prev.src=URL.createObjectURL(r.blob);cv.prev.hidden=false;cv.drop.hidden=true;cvMsg('')}
  catch(_){cvBlob=null;cvMsg("This image type can't be read here. Export it as JPG or PNG and try again.",true)}});
$('#cov-open').addEventListener('click',()=>{cv.form.hidden=false;$('#cov-open').hidden=true;if(!cv.date.value)cv.date.value=todayISO();if(!cv.md.value){const m=Math.max(0,...covAll().map(p=>p.md||0));cv.md.value=m+1}cv.opp.focus()});
$('#cov-cancel').addEventListener('click',()=>{cv.form.reset();cv.comp.value='Premier League';cvBlob=null;cv.prev.hidden=true;cv.drop.hidden=false;cvMsg('');cv.form.hidden=true;$('#cov-open').hidden=false});
cv.form.addEventListener('submit',async e=>{e.preventDefault();
  if(!cvBlob){cvMsg('Choose the poster image first.',true);return}
  const opp=cv.opp.value.trim();if(!opp){cvMsg('Add the opponent.',true);cv.opp.focus();return}
  if(!cv.date.value){cvMsg('Add the match date.',true);cv.date.focus();return}
  cv.save.disabled=true;cvMsg('Uploading poster…');
  try{const up=await artAdmin.assets.upload(cvBlob,{type:'image/jpeg'});cvMsg('Publishing to the site…');
    const md=parseInt(cv.md.value,10);
    const item={id:up.id,src:up.url,w:cvSize[0],h:cvSize[1],opp,date:cv.date.value,ha:cv.ha.value,comp:cv.comp.value.trim()||'Premier League',score:cv.score.value.trim()};if(md>0)item.md=md;
    await publishData({cov:[...COV_POSTERS,item]});cvMsg('Published. The page is reloading with the new poster.')}
  catch(err){cv.save.disabled=false;cvMsg(publishError(err),true)}});
async function removeCov(btn){
  if(!btn.classList.contains('armed')){btn.classList.add('armed');btn.textContent='Confirm remove';setTimeout(()=>{btn.classList.remove('armed');btn.textContent='Remove'},4000);return}
  const id=btn.dataset.covrm;btn.disabled=true;btn.textContent='Removing…';
  try{await publishData({cov:COV_POSTERS.filter(p=>p.id!==id)});artAdmin.assets.delete(id).catch(()=>{})}
  catch(err){btn.disabled=false;btn.textContent='Remove';btn.classList.remove('armed');cv.form.hidden=false;cvMsg(publishError(err),true)}}
(async()=>{
  const c=window.claude;if(!c||!c.use)return;
  const user=await c.use('user');if(!user)return;
  const can=await user.canEdit().catch(()=>false);if(!can)return;
  const [artifact,assets]=await Promise.all([c.use('artifact'),c.use('assets')]);if(!artifact||!assets)return;
  artAdmin={artifact,assets};$('#art-admin').hidden=false;$('#cov-admin').hidden=false;renderArt();renderCov();Play.ownerReady();
})();

/* ---------- boot ---------- */
renderHome();renderWC();renderCov();renderArt();
show(decodeURIComponent(location.hash.slice(1))||'home',true);
if(document.body.dataset.view==='home')playSplit($('#hero-h'),120);
Hero.start();
if(!reduced){
  whenLib('lib-lenis',()=>!!window.Lenis).then(ok=>{if(ok)initLenis()});
  whenLib('lib-three',()=>!!window.THREE).then(ok=>{
    if(!ok||GL)return;
    GL=makeGL();if(!GL)return;
    /* if the GPU drops the context, fall back to the plain page for the rest of the visit */
    GL.onLost=()=>{GL=null;document.documentElement.classList.remove('gl');$('#hero-sheet').classList.remove('gl-on');$('#gl').style.zIndex='';$('#gl').style.display='none'};
    document.documentElement.classList.add('gl');DomPV.hide();Hero.attachGL();
  });
}
function loop(t){
  if(lenis)lenis.raf(t);
  const sy=scrollY_();
  Ruler.frame(sy);if(Cursor)Cursor.frame(sy);hoverRecheck(sy);Hero.frame(t);
  if(GL)GL.frame(t);else DomPV.frame();
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
})();
