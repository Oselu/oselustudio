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
/* pieces are labelled by number and medium, not by a title: "No. 03 · Oil pastel on paper". A piece in img/art keeps
   the number in its file name; pieces added later from the owner panel continue the count in the order they were added.
   it.cap stays as a plain description of the picture, used only for screen readers and search. */
const artMedium=a=>{const m=String(a.medium||'').trim();return !m||/^oil pastels?$/i.test(m)?'Oil pastel on paper':m};
(()=>{const fileNo=a=>+((String(a.src).match(/art-(\d+)\.\w+$/)||[])[1]||0);
  let next=ART_BASE.reduce((n,a)=>Math.max(n,fileNo(a)),0);
  ART_BASE.forEach(a=>{a.no=fileNo(a)||++next});
  ART_EXTRA.slice().sort((a,b)=>(a.added||'').localeCompare(b.added||'')).forEach(a=>{a.no=++next});
  ART.forEach(a=>{a.label='No. '+pad(a.no,2);a.mediumLabel=artMedium(a)})})();
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

/* ---------- WebGL: hover preview, page veil ---------- */
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
  /* the preview never draws over the header, even while the canvas is raised for a page change */
  const hdr=$('#hdr'),menuEl=$('#menu'),lbEl=$('#lb');
  function resize(){W=window.innerWidth;H=window.innerHeight;R.setSize(W,H,false);cam.right=W;cam.bottom=-H;cam.updateProjectionMatrix();place(veil,0,0,W,H);vu.aspect.value=W/H;
    const cy=(H-hdr.getBoundingClientRect().bottom)*R.getPixelRatio();pu.clipY.value=cy;force=true}
  resize();window.addEventListener('resize',resize);

  function frame(){
    let active=false;const overlay=!menuEl.hidden||!lbEl.hidden;
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
    const moving=force||preview.visible||veil.visible;force=false;
    if(moving||wasMoving)R.render(scene,cam);
    wasMoving=moving;
  }
  const api={frame,pvShow,pvHide,pvMove,veilCover,veilReveal,onLost:null};
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
    const lab=$('#veil-label');lab.textContent=label;lab.classList.toggle('play',world==='play');lab.classList.toggle('studio',world!=='play');
    if(!reduced)setTimeout(()=>{lab.style.opacity='1'},GL?260:160);
    if(GL){this.mode='gl';await GL.veilCover(world==='play'?'#f4b32b':'#121211')}
    else if(!reduced){this.mode='dom';const f=$('#veil-fallback');f.style.background=world==='play'?'#f4b32b':'#121211';f.style.opacity='1';await wait(240)}
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
  $$('.row,.tile,.wk-card,.cov-card,.art-grid figure,.pi-card,.pj-text > div,.pj-gallery .shot,.disc > *,.season-h,.wall button:nth-child(-n+30)',root).forEach(el=>{
    const r=el.getBoundingClientRect();if(r.top>window.innerHeight&&!el.classList.contains('rv')){el.classList.add('rv','rv-pre');io.observe(el)}});
}

/* ---------- home ---------- */
const rowHTML=e=>`<a class="row" href="#${e.id}" data-go="${e.id}" data-pv="${esc(e.pv)}" data-cursor="View"><span class="row-cat mono">${CAT[e.cat]}</span><span class="row-name">${esc(e.name)}</span><span class="row-kind mono">${esc(e.kind)}</span><img class="row-thumb" src="${esc(e.pv)}" alt="" loading="lazy"><span class="row-arrow" aria-hidden="true">→</span></a>`;
const cardHTML=(e,k)=>`<a class="wk-card" href="#${e.id}" data-go="${e.id}" data-cursor="View"><div class="wk-media"><img src="${esc(e.pv)}" alt="" loading="lazy"></div><div class="wk-meta"><b>${esc(e.name)}</b><span class="s-mono">${pad(k+1,2)}</span><span class="wk-kind">${CAT[e.cat]} · ${esc(e.kind)}</span></div></a>`;
const wcN=n=>WC.find(p=>p.n===n);
function tilesHTML(){
  const all=covAll(),latest=all[0];
  const mdNum=latest&&latest.md?pad(latest.md,2):pad(all.length,2);
  const picks=[1,6,13,17,22,30,33,41,47,62,64,71,77,85,88,94,97,103].map(wcN).filter(Boolean);
  return `<a class="tile" href="#coventry" data-go="coventry" data-cursor="Open series">
      <span class="live">Live · ${latest?seasonOf(latest.date):''} season</span>
      <div class="tile-media">${latest?`<img class="paper" src="${esc(latest.th||latest.src)}" alt="Latest Coventry poster: ${esc(covTitle(latest))}" loading="lazy">`:''}</div>
      <div class="tile-body"><span class="tile-num">${mdNum}</span><div><b>Coventry matchday</b><span>${latest?`Latest · ${esc(covTitle(latest))} · ${fmtDate(latest.date)}`:'A new poster every matchday'}</span></div></div></a>
    <a class="tile" href="#world-cup" data-go="world-cup" data-cursor="Open series">
      <div class="tile-media"><div class="mosaic">${picks.map(p=>`<img src="${p.th}" alt="" loading="lazy">`).join('')}</div></div>
      <div class="tile-body"><span class="tile-num">${WC.length}</span><div><b>World Cup 2026</b><span>A poster for every match · oil pastel</span></div></div></a>`;
}

/* Studio motion. Every piece is drawn from the one animation loop, only while its page is showing and it is on
   screen. Without motion (reduced motion) each one settles into a still, readable arrangement. */
let scrollV=0;
const onScreen=el=>{if(!el||!el.getClientRects().length)return null;const r=el.getBoundingClientRect();return r.bottom>-40&&r.top<window.innerHeight+40?r:null};
const homeOn=()=>document.body.dataset.view==='home';

/* the hero: a ring of work turning slowly around the headline; scrolling spins it on and opens it out */
const HeroWheel=(()=>{
  const root=$('#h-wheel'),hero=$('#h-hero'),copy=$('#h-copy');if(!root)return null;
  const P=id=>[PV[id],id,byId[id]?byId[id].name:''];
  const W_=n=>{const p=wcN(n);return p?[p.th,'world-cup',`World Cup · ${wcTitle(p)}`]:null};
  const items=[P('i-bitnob'),W_(72),P('sports'),P('doom'),P('i-editorial'),P('coventry'),W_(1),P('i-food'),P('birds'),P('roland'),P('i-info'),[ART_BASE[1]&&ART_BASE[1].src,'visual-art','Visual art'],W_(53),P('i-genx'),P('voiture'),P('i-roqqu')].filter(x=>x&&x[0]);
  root.innerHTML=items.map(([src,go,label],i)=>`<a class="hw-card" href="#${go}" data-go="${go}" tabindex="-1" draggable="false" data-cursor="${esc(label)}"><img src="${esc(src)}" alt="" draggable="false"${i>7?' loading="lazy"':''}></a>`).join('');
  const cards=$$('.hw-card',root),N=cards.length,hov=new Array(N).fill(0);
  let rot=-Math.PI*.98,spd=0,hoverI=-1,mx=0,my=0,tmx=0,tmy=0,lastT=0,intro=0;
  cards.forEach((c,i)=>{c.addEventListener('pointerenter',()=>{hoverI=i});c.addEventListener('pointerleave',()=>{if(hoverI===i)hoverI=-1})});
  hero.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse')return;tmx=e.clientX/window.innerWidth*2-1;tmy=e.clientY/window.innerHeight*2-1},{passive:true});
  function frame(t){
    const dt=lastT?Math.min(64,t-lastT):16;lastT=t;
    if(!homeOn())return;const r=onScreen(hero);if(!r)return;
    const W=hero.clientWidth,H=hero.clientHeight,mob=W<760;
    const p=clamp(-r.top/H,0,1);
    intro=reduced?1:Math.min(1,intro+dt/1600);const ie=EASE.out(intro);
    mx+=(tmx-mx)*.05;my+=(tmy-my)*.05;
    const open=1+p*.42+(1-ie)*.25;
    const cx=W*.5+mx*14,cy=H*(mob?.43:.735)+my*10,rx=W*(mob?.72:.42)*open,ry=H*(mob?.215:.53)*open;
    if(!reduced){const target=hoverI>=0?0:.000052+Math.min(.0009,Math.abs(scrollV)*.00005)+(1-ie)*.0012;spd+=(target-spd)*.06;rot+=spd*dt}
    for(let i=0;i<N;i++){
      const th=rot+i/N*Math.PI*2,x=cx+rx*Math.cos(th),y=cy+ry*Math.sin(th);
      let a=Math.atan2(ry*Math.cos(th),-rx*Math.sin(th))*.6;
      hov[i]+=((i===hoverI?1:0)-hov[i])*.12;
      const fadeY=cy-ry*(mob?-.3:.1),al=clamp(1-(y-fadeY)/(ry*.22),0,1)*ie;
      const s=(1+hov[i]*.08)*(.92+.08*ie);
      const c=cards[i];
      c.style.transform=`translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) rotate(${(a*(1-hov[i]*.35)).toFixed(4)}rad) scale(${s.toFixed(4)})`;
      c.style.opacity=al.toFixed(3);c.style.pointerEvents=al>.5?'':'none';c.style.zIndex=i===hoverI?20:'';
    }
    if(copy){copy.style.transform=`translate(-50%,${(-p*70).toFixed(1)}px)`;copy.style.opacity=clamp(1-p*1.5,0,1).toFixed(3)}
  }
  return {frame};
})();

/* a curved strip, seen from inside the curve: drag it, scroll past it, or let it drift */
function Cylinder(root,items,o={}){
  if(!root||!items.length)return null;
  const auto=o.auto||0,link=o.link==null?.45:o.link,tab=o.tab!==false;
  root.innerHTML=items.map((it,i)=>`<a class="cyl-card" href="#${it.go}" data-go="${it.go}" draggable="false"${tab?'':' tabindex="-1"'}${it.cursor?` data-cursor="${esc(it.cursor)}"`:''}><img src="${esc(it.src)}" alt="${esc(it.alt||'')}" draggable="false" loading="lazy">${o.tags?`<span class="cyl-tag">${esc(it.label)}<span aria-hidden="true">↗</span></span>`:''}</a>`).join('');
  const cards=$$('.cyl-card',root),N=cards.length;
  let s=0,v=0,drag=null,wasDrag=false,target=null,idle=0,cw=0,step=1,R=1,L=1,active=-1,lastT=0;
  function measure(){const W=root.clientWidth;cw=cards[0].offsetWidth||1;step=cw+Math.max(14,cw*.08);L=step*N;R=Math.max(W*(W<760?1.05:.95),cw*2.4)}
  const nearest=i=>{const k=Math.round((s-i*step)/L);return i*step+k*L};
  root.addEventListener('pointerdown',e=>{if(e.button!==0)return;drag={x:e.clientX,s,lx:e.clientX,lt:performance.now(),moved:0,id:e.pointerId};v=0;target=null});
  window.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.id)return;const dx=e.clientX-drag.x;drag.moved=Math.max(drag.moved,Math.abs(dx));if(drag.moved>6)root.classList.add('is-drag');s=drag.s-dx*1.15;const now=performance.now();v=-(e.clientX-drag.lx)*1.15*(16/Math.max(8,now-drag.lt));drag.lx=e.clientX;drag.lt=now},{passive:true});
  const up=e=>{if(!drag||(e&&e.pointerId!==drag.id))return;wasDrag=drag.moved>6;drag=null;root.classList.remove('is-drag');idle=performance.now()};
  window.addEventListener('pointerup',up);window.addEventListener('pointercancel',up);
  root.addEventListener('click',e=>{if(wasDrag){e.preventDefault();e.stopPropagation();wasDrag=false}},true);
  root.addEventListener('wheel',e=>{if(Math.abs(e.deltaX)>Math.abs(e.deltaY)*1.2){s+=e.deltaX;target=null;idle=performance.now();e.preventDefault()}},{passive:false});
  cards.forEach((c,i)=>c.addEventListener('focus',()=>{target=nearest(i)}));
  function frame(t,sy,visible){
    const dt=lastT?Math.min(64,t-lastT):16;lastT=t;
    if(!visible)return;const r=onScreen(root);if(!r)return;
    if(!cw||cw<2)measure();
    if(!drag){
      if(target!=null){s+=(target-s)*.12;if(Math.abs(target-s)<.4){s=target;target=null}}
      else{
        s+=v;v*=.93;
        if(!reduced){s+=auto*dt/16;s+=scrollV*link;if(scrollV)idle=performance.now()}
        if(!auto&&Math.abs(v)<.35&&performance.now()-idle>260){const g=Math.round(s/step)*step;s+=(g-s)*.09}
      }
    }
    for(let i=0;i<N;i++){
      let u=((i*step-s)%L+L)%L;if(u>L/2)u-=L;
      const ph=u/R,c=cards[i];
      if(Math.abs(ph)>1.05){if(c.style.visibility!=='hidden')c.style.visibility='hidden';continue}
      const x=R*Math.sin(ph),z=R*(1-Math.cos(ph));
      c.style.visibility='visible';
      c.style.transform=`translate3d(${x.toFixed(1)}px,0,${z.toFixed(1)}px) rotateY(${(-ph).toFixed(4)}rad)`;
    }
    const a=((Math.round(s/step)%N)+N)%N;if(a!==active){active=a;if(o.onActive)o.onActive(a)}
  }
  return {frame,measure,go(d){target=Math.round((target!=null?target:s)/step)*step+d*step}};
}

/* posters standing in a row: the front one folds forward onto the floor and shows the next */
function FlipStack(root,n,thumb,full){
  if(!root||!n)return null;
  const SL=7;root.innerHTML=Array.from({length:SL},()=>'<div class="flip-card"><img alt="" draggable="false"></div>').join('');
  const els=$$('.flip-card',root).map(el=>({el,img:el.firstChild,idx:-1,full:false}));
  let f=-1,settle=0;
  function render(fv){
    fv=clamp(fv,0,n-1);if(Math.abs(fv-f)<.0005&&f>=0){return}
    f=fv;settle=performance.now();
    const k=Math.floor(f);const show=new Set();
    for(let i=k-1;i<=k+5;i++){
      if(i<0||i>=n)continue;show.add(i%SL);
      const E=els[i%SL];
      if(E.idx!==i){E.idx=i;E.full=false;E.img.src=thumb(i)}
      const d=i-f;let tr,sh,z,op=1;
      if(d<=-1){tr='rotateX(-90deg)';sh=.62;z=30;op=clamp(2+d,0,1)}
      else if(d<=0){tr=`rotateX(${(d*90).toFixed(2)}deg)`;sh=-d*.62;z=60}
      else{tr=`translate3d(0,${(-d*14).toFixed(1)}px,${(-d*80).toFixed(1)}px)`;sh=Math.min(.75,d*.13);z=50-Math.ceil(d);op=clamp(5-d,0,1)}
      E.el.style.transform=tr;E.el.style.setProperty('--sh',sh.toFixed(3));E.el.style.zIndex=z;E.el.style.opacity=op.toFixed(3);E.el.style.visibility='visible';
    }
    els.forEach((E,s)=>{if(!show.has(s))E.el.style.visibility='hidden'});
    const pre=Math.min(n-1,k+7);if(pre>=0){const im=new Image();im.src=thumb(pre)}
  }
  function tick(){
    if(!full||f<0||performance.now()-settle<350)return;
    const i=Math.round(f);if(Math.abs(f-i)>.02)return;const E=els[i%SL];
    if(E.idx===i&&!E.full){E.full=true;const im=new Image();im.onload=()=>{if(E.idx===i)E.img.src=im.src};im.src=full(i)}
  }
  return {render,tick,get f(){return f}};
}

/* "What I do": one red card follows the discipline under the pointer */
const DoCard=(()=>{
  const list=$('#do-list'),card=$('#do-card');if(!list||!card)return null;
  const D=[
    ['Illustration','Product, brand and editorial illustration for fintech and tech companies, from a set of spot illustrations to a whole system.',[PV['i-bitnob'],PV['i-editorial'],PV['i-roqqu']],'See illustration work'],
    ['Graphic design','Posters, covers, campaigns and identities for sport, music and culture, and personal series like a poster for every match.',[PV.sports,PV.doom,PV.birds],'See design work'],
    ['Visual art','Sports moments, animals, people, places and still life, built up in thick layers of oil pastel.',ART_BASE.slice(1,4).map(a=>a.src),'See the artwork'],
    ['Play Inquiry','Hands-on creative workshops for teams, communities and children. No drawing experience required.',['img/play/lagos/t-lagos-01.jpg','img/play/lagos/t-lagos-06.jpg','img/play/club/strip-club.jpg'],'Visit Play Inquiry']];
  let cur=-1;
  function set(i,row){
    if(!finePointer||window.innerWidth<900)return;
    if(i!==cur){cur=i;const d=D[i];$('#do-card-t').textContent=d[0];$('#do-card-n').textContent=pad(i+1,2)+' / 04';$('#do-card-p').textContent=d[1];$('#do-card-imgs').innerHTML=d[2].map(s=>`<img src="${esc(s)}" alt="">`).join('');$('#do-card-more').textContent=d[3]}
    const w=$('.h-do-w',row),lr=list.getBoundingClientRect(),wr=w.getBoundingClientRect(),cw=card.offsetWidth,par=card.offsetParent.getBoundingClientRect();
    const x=clamp(wr.left-par.left+wr.width*.62-cw*.3,0,par.width-cw-8),y=wr.top-par.top-cw*.16;
    card.style.transform=`translate3d(${x.toFixed(0)}px,${y.toFixed(0)}px,0) rotate(${i%2?2.5:-2.5}deg)`;card.classList.add('on');
  }
  $$('.h-do-row',list).forEach(r=>{r.addEventListener('pointerenter',()=>set(+r.dataset.do,r));r.addEventListener('focus',()=>set(+r.dataset.do,r))});
  list.addEventListener('pointerleave',()=>card.classList.remove('on'));
  $$('.h-do-row',list).forEach(r=>r.addEventListener('blur',()=>card.classList.remove('on')));
  return {};
})();

/* selected work on the curved strip */
let SelCyl=null,FtrCyl=null;
(()=>{
  const items=SELECTED.map(id=>byId[id]).filter(Boolean).map(e=>({src:e.pv,go:e.id,label:e.name,alt:e.name,cursor:'View'}));
  SelCyl=Cylinder($('#sel-cyl'),items,{tags:true,link:.5,onActive:i=>{const e=byId[SELECTED[i]];if(!e)return;$('#sel-name').textContent=e.name;$('#sel-cat').textContent=`${pad(i+1,2)} / ${pad(items.length,2)} · ${CAT[e.cat]}`}});
  $('#sel-prev').addEventListener('click',()=>SelCyl&&SelCyl.go(-1));
  $('#sel-next').addEventListener('click',()=>SelCyl&&SelCyl.go(1));
  const fItems=['i-bitnob','sports','world-cup','i-editorial','doom','coventry','i-food','birds','visual-art','roland','i-info','grupe','i-genx','voiture'].map(id=>byId[id]).filter(Boolean).map(e=>({src:e.pv,go:e.id,label:e.name}));
  FtrCyl=Cylinder($('#ftr-cyl'),fItems,{auto:.45,link:.25,tab:false});
})();

/* the World Cup series: posters fold forward as the page scrolls */
const SeriesHome=(()=>{
  const sec=$('#h-series');if(!sec)return null;
  const list=[72,1,6,13,17,22,30,33,41,47,53,62,64,71,77,85,88,94,97,103,100].map(wcN).filter(Boolean);
  const flip=FlipStack($('#hs-flip'),list.length,i=>list[i].th,i=>list[i].src);
  const no=$('#hs-no'),mt=$('#hs-match'),bar=$('#hs-bar');let last=-1;
  function frame(){
    if(!homeOn())return;const r=onScreen(sec);if(!r)return;
    const H=window.innerHeight,p=clamp(-r.top/Math.max(1,r.height-H),0,1);
    const f=reduced?Math.round(p*(list.length-1)):p*(list.length-1);
    flip.render(f);flip.tick();bar.style.transform=`scaleX(${p.toFixed(4)})`;
    const i=clamp(Math.round(f),0,list.length-1);if(i!==last){last=i;no.textContent=pad(list[i].n);mt.textContent=wcTitle(list[i])}
  }
  return {frame};
})();

/* visual art on a wheel: scrolling turns it, one piece at a time */
const ArtWheel=(()=>{
  const sec=$('#h-art'),root=$('#ha-wheel');if(!sec||!root)return null;
  const items=ART.slice(0,16);
  root.innerHTML=items.map(a=>`<a class="ha-card" href="#visual-art" data-go="visual-art" tabindex="-1" draggable="false" data-cursor="Visual art"><img src="${esc(a.src)}" width="${a.w}" height="${a.h}" alt="" loading="lazy" draggable="false"></a>`).join('');
  const cards=$$('.ha-card',root),N=cards.length,cap=$('#ha-cap'),num=$('#ha-n');let last=-1,sm=-1;
  $('#ha-total').textContent=ART.length;
  function frame(){
    if(!homeOn())return;const r=onScreen(sec);if(!r)return;
    const W=window.innerWidth,H=window.innerHeight,mob=W<900;
    const p=clamp(-r.top/Math.max(1,r.height-H),0,1),target=p*(N-1);
    sm=sm<0||reduced?target:sm+(target-sm)*.14;
    const st=mob?.62:.46,R=mob?W*1.08:Math.max(W*.6,H*.95),cx=mob?W*.5:Math.min(W*.4,W*.44-R*.05)-R,cy=mob?H*.36-R:H*.5,base=mob?Math.PI/2:0;
    for(let i=0;i<N;i++){
      const ph=(i-sm)*st,a=base+ph,c=cards[i];
      if(Math.abs(ph)>1.35){c.style.visibility='hidden';continue}
      const x=cx+R*Math.cos(a),y=cy+R*Math.sin(a),k=Math.min(1,Math.abs(ph)/1.2);
      c.style.visibility='visible';
      c.style.transform=`translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) rotate(${(mob?-ph:ph).toFixed(4)}rad) scale(${(1-k*.22).toFixed(4)})`;
      c.style.opacity=(1-k*.55).toFixed(3);c.style.zIndex=100-Math.round(Math.abs(ph)*20);
    }
    const i=clamp(Math.round(sm),0,N-1);if(i!==last){last=i;num.textContent=items[i].label;cap.textContent=items[i].mediumLabel}
  }
  return {frame};
})();

function renderHome(){
  $('#sel-count').textContent=`(${SELECTED.length})`;
  $('#series-tiles').innerHTML=tilesHTML();
  const C=['Bitnob','Roqqu','Lendsqr','Gen X','Oko Insurance','Cismetrics','Ruwah','Pressure Is a Privilege'];
  const once=`<em>Illustration for</em>${C.map(c=>`<i aria-hidden="true"></i><span>${c}</span>`).join('')}<i aria-hidden="true"></i>`;
  $('#clients').innerHTML=once+`<span class="sr">.</span>`+once.replace(/<span>/g,'<span aria-hidden="true">').replace('<em>','<em aria-hidden="true">');
  const l=covAll()[0];
  $('#h-cov').innerHTML=l?`<img src="${esc(l.th||l.src)}" alt=""><span><span class="live">Live</span> · Matchday ${l.md?pad(l.md,2):''}<b>${esc(covTitle(l))}</b></span>`:'';
  $('#hs-total').textContent=WC.length;
  const faces=['i-bitnob','i-roqqu','i-lendsqr','i-genx'].map(id=>PV[id]).filter(Boolean);
  const fc=$('#ab-faces');if(fc)fc.innerHTML=faces.map(s=>`<img src="${esc(s)}" alt="" loading="lazy">`).join('');
}
function studioFrame(t,sy){
  const v=document.body.dataset.view;
  if(HeroWheel)HeroWheel.frame(t);
  if(SelCyl)SelCyl.frame(t,sy,v==='home');
  if(SeriesHome)SeriesHome.frame();
  if(ArtWheel)ArtWheel.frame();
  if(FtrCyl)FtrCyl.frame(t,sy,document.body.dataset.world!=='play');
  if(WcFlip&&v==='world-cup')WcFlip.frame();
}
function studioShow(){requestAnimationFrame(()=>{[SelCyl,FtrCyl].forEach(c=>c&&c.measure())})}
window.addEventListener('resize',()=>{[SelCyl,FtrCyl].forEach(c=>c&&c.measure())});
/* About: the notes drift a little with the pointer */
(()=>{const st=$('#ab-stage');if(!st||!finePointer||reduced)return;st.addEventListener('pointermove',e=>{const r=st.getBoundingClientRect();st.style.setProperty('--mx',((e.clientX-r.left)/r.width*2-1).toFixed(3));st.style.setProperty('--my',((e.clientY-r.top)/r.height*2-1).toFixed(3))});st.addEventListener('pointerleave',()=>{st.style.setProperty('--mx','0');st.style.setProperty('--my','0')})})();

/* ---------- work index ---------- */
const work={filter:'all',mode:'grid',earlier:false};
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
  $('#work-total').textContent=`${ENTRIES.length} projects`;$('#work-sup').textContent=`(${ENTRIES.length})`;
  $('#work-intro').textContent=WORK_INTRO[work.filter]||WORK_INTRO.all;
  const list=ENTRIES.filter(e=>!e.earlier&&(work.filter==='all'||e.cat===work.filter));
  const early=ENTRIES.filter(e=>e.earlier);
  const wrapL=a=>work.mode==='list'?`<div class="rows">${a.map(rowHTML).join('')}</div>`:`<div class="wk-grid">${a.map(cardHTML).join('')}</div>`;
  $('#work-list').innerHTML=wrapL(list);
  const showE=work.filter==='all'||work.filter==='ill';
  $('#earlier-wrap').hidden=!showE;
  $('#work-earlier').hidden=!showE||!work.earlier;
  const eb=$('#earlier-btn');eb.setAttribute('aria-expanded',String(work.earlier));eb.innerHTML=work.earlier?'Hide earlier projects <span class="ar" aria-hidden="true">↑</span>':'Read earlier projects <span class="ar" aria-hidden="true">↓</span>';
  $('#work-earlier-list').innerHTML=wrapL(early);
  armReveals($('#v-work'));
}
$('#work-filters').addEventListener('click',e=>{const b=e.target.closest('[data-wf]');if(!b)return;work.filter=b.dataset.wf;renderWork()});
$$('[data-mode]').forEach(b=>b.addEventListener('click',()=>{work.mode=b.dataset.mode;renderWork()}));
$('#earlier-btn').addEventListener('click',()=>{work.earlier=!work.earlier;renderWork();if(work.earlier){const f=$('#work-earlier-list a');f&&f.focus({preventScroll:true});scrollToEl($('#work-earlier'))}});

/* ---------- project pages ---------- */
const LBSETS={};
const sectionsHTML=s=>s.map(([h,items,list])=>`<div><h2 class="mono">${esc(h)}</h2>${list?`<ul>${items.map(t=>`<li>${esc(t)}</li>`).join('')}</ul>`:items.map(t=>`<p>${esc(t)}</p>`).join('')}</div>`).join('');
const nextHTML=(id,title,label)=>`<a class="pj-next" href="#${id}" data-go="${id}" data-cursor="Next"><div><span class="s-kicker">${label}</span><b>${esc(title)}</b></div><img src="${esc(PV[id]||'')}" alt="" loading="lazy"></a>`;
function renderProject(p){
  const i=PROJECTS.indexOf(p),next=PROJECTS[(i+1)%PROJECTS.length];
  const first=p.sections[0][1][0];const lede=first.split('. ')[0].replace(/\.$/,'')+'.';
  LBSETS.project=[p.cover,...p.images].map((src,k)=>({src,cap:k?`${p.title} · page ${k}`:`${p.title} · cover`}));
  const del=(p.sections.find(s=>s[0]==='Deliverables')||[0,[]])[1];
  $('#project-detail').innerHTML=`
    <a class="s-back" href="#work" data-go="work" data-filter="gd">← Index</a>
    <header class="pj-head">
      <p class="pj-eyebrow s-kicker">Graphic design · ${esc(p.kind)}</p>
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
  $('#ill-detail').innerHTML=`
    <a class="s-back" href="#work" data-go="work" data-filter="ill">← Illustration</a>
    <header class="pj-head">
      <p class="pj-eyebrow s-kicker">Illustration · ${esc(p.kind)}</p>
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
let WcFlip=null;
const Scrub=(()=>{
  const ruler=$('#scrub-ruler'),head=$('#scrub-head'),no=$('#scrub-no'),title=$('#scrub-title'),stage=$('#scrub-stage'),stack=$('#wc-flip');
  const N=WC_SORTED.length;let idx=0,drag=false,f=0;
  const flip=FlipStack(stack,N,i=>WC_SORTED[i].th,i=>WC_SORTED[i].src);
  let labs='';for(let i=0;i<N;i+=10)labs+=`<span class="lab mono" style="left:${(i+.5)/N*100}%">${pad(WC_SORTED[i].n)}</span>`;
  const ko=WC_SORTED.findIndex(p=>p.s==='ko');if(ko>0)labs+=`<span class="ko" style="left:${ko/N*100}%"><span class="mono">Knockouts →</span></span>`;
  ruler.insertAdjacentHTML('beforeend',labs);
  ruler.setAttribute('aria-valuemax',String(N));
  function set(i){idx=clamp(i,0,N-1);const p=WC_SORTED[idx];no.textContent=pad(p.n);title.textContent=wcTitle(p);stage.textContent=p.s==='ko'?'Knockout rounds':'Group stage';head.style.left=((idx+.5)/N*100)+'%';ruler.setAttribute('aria-valuenow',String(idx+1));ruler.setAttribute('aria-valuetext',`Poster ${p.n}, ${wcTitle(p)}`);stack.setAttribute('aria-label',`Enlarge poster ${p.n}: ${wcTitle(p)}`)}
  const fromX=x=>{const r=ruler.getBoundingClientRect();return Math.floor(clamp((x-r.left)/r.width,0,.9999)*N)};
  ruler.addEventListener('pointerdown',e=>{drag=true;try{ruler.setPointerCapture(e.pointerId)}catch(_){}set(fromX(e.clientX))});
  ruler.addEventListener('pointermove',e=>{if(e.pointerType==='mouse'||drag)set(fromX(e.clientX))});
  ['pointerup','pointercancel'].forEach(t=>ruler.addEventListener(t,()=>{drag=false}));
  ruler.addEventListener('keydown',e=>{const k=e.key,m={ArrowRight:1,ArrowUp:1,ArrowLeft:-1,ArrowDown:-1,PageUp:10,PageDown:-10};if(k in m){set(idx+m[k]);e.preventDefault()}else if(k==='Home'){set(0);e.preventDefault()}else if(k==='End'){set(N-1);e.preventDefault()}});
  const open=()=>openLB(WC_SORTED.map(p=>({src:p.src,cap:`No. ${pad(p.n)} · ${wcTitle(p)}`})),idx,stack);
  stack.addEventListener('click',open);
  stack.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open()}else if(e.key==='ArrowRight'){set(idx+1);e.preventDefault()}else if(e.key==='ArrowLeft'){set(idx-1);e.preventDefault()}});
  /* the stack eases toward the chosen poster; a long jump folds through the posters in between, quickly */
  WcFlip={frame(){if(!flip)return;const d=idx-f;if(reduced||Math.abs(d)<.002)f=idx;else{const st=Math.sign(d)*Math.min(Math.abs(d),Math.max(.05,Math.abs(d)*.14));f+=st}flip.render(f);flip.tick()}};
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
  $('#art-grid').innerHTML=artVisible.map((it,k)=>`<figure><button class="shotc" type="button" data-art="${k}" data-cursor="Enlarge" aria-label="View larger: ${esc(it.label)}, ${esc(it.cap)}"><img src="${esc(it.src)}" width="${it.w}" height="${it.h}" alt="${esc(it.cap)}. ${esc(it.mediumLabel)}" loading="lazy"></button><figcaption class="mono">${isNew(it)?'<span class="new-badge">New</span>':''}<b>${esc(it.label)}</b><span>${esc(it.mediumLabel)}</span>${artAdmin&&it.id?`<button type="button" class="rm-btn" data-rm="${esc(it.id)}">Remove</button>`:''}</figcaption></figure>`).join('');
}
$('#art-filters').addEventListener('click',e=>{const b=e.target.closest('[data-cat]');if(!b)return;artFilter=b.dataset.cat;renderArt()});

/* ---------- about ---------- */
$('#disc').innerHTML=[
  ['ill','Illustration','Product, brand and editorial illustration, drawing and painting.',`${ILL_PROJECTS.length} projects`],
  ['gd','Graphic design','Posters, editorial covers, campaigns and identity systems.',`${PROJECTS.length} projects`],
  ['series','Poster series','Posters, made one match at a time.','2 ongoing'],
  ['play','Creative workshops','Play Inquiry: guided, hands-on creative experiences for individuals, communities and teams.','Play Inquiry']
].map(([f,t,d,s],k)=>`<a href="#${f==='play'?'play-inquiry':'work'}" data-go="${f==='play'?'play-inquiry':'work'}"${f==='play'?'':` data-filter="${f}"`}><span class="mono">${pad(k+1,2)}</span><b>${t}</b><p>${d}</p><span>${s} →</span></a>`).join('');

/* ---------- lightbox ---------- */
let lbList=[],lbI=0,lbFrom=null;
function openLB(list,i,from){if(!list||!list.length)return;lbList=list;lbFrom=from||null;$('#lb').hidden=false;lbShow(i);if(lenis)lenis.stop();document.documentElement.style.overflow='hidden';Preview.hide();$('#lb-close').focus()}
function lbShow(i){lbI=(i+lbList.length)%lbList.length;const it=lbList[lbI];const im=$('#lb-img');im.src=it.src;im.alt=it.alt||it.cap||'';$('#lb-cap').textContent=it.cap||'';$('#lb-count').textContent=`${lbI+1} / ${lbList.length}`;$('#lb-prev').hidden=$('#lb-next').hidden=lbList.length<2}
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
  $('#ftr-name').innerHTML=world==='play'?'Play Inquiry':'Oselu Irabor<span>.</span>';fitFooter();
  $('#hdr').removeAttribute('data-hide');studioShow(view);
  if(initial){try{history.replaceState(null,'','#'+route)}catch(_){}}
  Preview.hide(true);closeMenu();scrollTop(false);
  if(lenis)lenis.resize();
  setMeta(view,route);
  const v=$(`.view[data-view="${view}"]`);
  if(!initial){
    const h=sec?document.getElementById(sec):v&&v.querySelector('[tabindex="-1"]');
    if(h){if(sec&&!h.hasAttribute('tabindex'))h.setAttribute('tabindex','-1');h.focus({preventScroll:true})}
    if(!sec)playSplit(v&&v.querySelector('.s-h1,.h-title,.ab-title,.pj-title,.pi-h1,.wc-intro h1,#v-coventry h1'),80);
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
  const a=t.closest('[data-art]');if(a){openLB(artVisible.map(x=>({src:x.src,cap:`${x.label} · ${x.mediumLabel}`,alt:x.cap})),+a.dataset.art,a);return}
  const cp=t.closest('[data-copy]');if(cp){copy(cp);return}
  const sc=t.closest('[data-scroll]');if(sc){const el=document.getElementById(sc.dataset.scroll);if(el){scrollToEl(el);if(!el.hasAttribute('tabindex'))el.setAttribute('tabindex','-1');el.focus({preventScroll:true})}return}
  const g=t.closest('[data-go]');if(g){if(e.metaKey||e.ctrlKey||e.shiftKey)return;e.preventDefault();if(g.dataset.filter){work.filter=g.dataset.filter;work.earlier=false}if(g.dataset.interest)Play.setInterest(g.dataset.interest);go(g.dataset.go)}
});
$('.skip').addEventListener('click',e=>{e.preventDefault();const h=$('.view:not([hidden]) [tabindex="-1"]')||$('#main');h.setAttribute('tabindex','-1');h.focus()});
window.addEventListener('hashchange',()=>{const n=decodeURIComponent(location.hash.slice(1));if(!n||n===current)return;if(viewOf(n)==='home'&&n!=='home')return;go(n,false)});

/* ---------- cursor ---------- */
const Cursor=(()=>{
  if(!finePointer||reduced)return null;
  document.documentElement.classList.add('has-cursor');
  const el=$('#cur'),xy=$('#cur-xy'),lab=$('#cur-label');let tx=-200,ty=-200,x=-200,y=-200,n=0;
  function target(node){
    const t=node&&node.closest&&node.closest('[data-cursor],a,button,[role=slider],label.drop,select');
    if(t){el.classList.add('act');const l=t.dataset.cursor||(t.tagName==='A'?'Open':'');lab.textContent=l;lab.style.visibility=l?'':'hidden';el.classList.toggle('lab',!!t.dataset.cursor)}else el.classList.remove('act','lab');
  }
  window.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse')return;tx=e.clientX;ty=e.clientY;el.classList.add('on');target(e.target)},{passive:true});
  window.addEventListener('mouseout',e=>{if(!e.relatedTarget)el.classList.remove('on')});
  return {target,frame(sy){x+=(tx-x)*.42;y+=(ty-y)*.42;el.style.transform=`translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0)`;if((n++&3)===0)xy.textContent=`x ${pad(Math.max(0,Math.round(tx/4)),3)} · y ${pad(Math.max(0,Math.round((ty+sy)/4)),4)} mm`}};
})();

/* ---------- clock & footer ---------- */
let fmtClock=null;try{fmtClock=new Intl.DateTimeFormat('en-GB',{hour:'2-digit',minute:'2-digit',timeZone:'Africa/Lagos'})}catch(_){}
function tickClock(){if(!fmtClock)return;const t=fmtClock.format(new Date());$('#clock').textContent=`Kaduna ${t} WAT`;$$('.clock-any').forEach(e=>{e.textContent=`Kaduna, Nigeria · ${t} WAT`});$$('.clock-short').forEach(e=>{e.textContent=`${t} WAT`})}
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
$('#aa-cancel').addEventListener('click',()=>{aa.form.reset();aa.medium.value='Oil pastel on paper';aaBlob=null;aa.prev.hidden=true;aa.drop.hidden=false;aaMsg('');aa.form.hidden=true;$('#aa-open').hidden=false});
aa.form.addEventListener('submit',async e=>{e.preventDefault();
  if(!aaBlob){aaMsg('Choose an image first.',true);return}
  const title=aa.title.value.trim();if(!title){aaMsg('Add a title.',true);aa.title.focus();return}
  aa.save.disabled=true;aaMsg('Uploading image…');
  try{const up=await artAdmin.assets.upload(aaBlob,{type:'image/jpeg'});aaMsg('Publishing to the site…');
    const item={id:up.id,src:up.url,w:aaSize[0],h:aaSize[1],cap:title,cat:aa.cat.value,medium:aa.medium.value.trim()||'Oil pastel on paper',added:todayISO()};
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
if(!reduced){
  whenLib('lib-lenis',()=>!!window.Lenis).then(ok=>{if(ok)initLenis()});
  whenLib('lib-three',()=>!!window.THREE).then(ok=>{
    if(!ok||GL)return;
    GL=makeGL();if(!GL)return;
    /* if the GPU drops the context, fall back to the plain page for the rest of the visit */
    GL.onLost=()=>{GL=null;document.documentElement.classList.remove('gl');$('#gl').style.zIndex='';$('#gl').style.display='none'};
    document.documentElement.classList.add('gl');DomPV.hide();
  });
}
let prevSy=null;const hdrEl=$('#hdr');
/* the header steps aside while reading, and comes straight back for a keyboard user moving into it */
hdrEl.addEventListener('focusin',()=>hdrEl.removeAttribute('data-hide'));
function headerFrame(sy){
  const d=prevSy==null?0:sy-prevSy;
  if(sy>8)hdrEl.setAttribute('data-scrolled','');else hdrEl.removeAttribute('data-scrolled');
  if(sy>160&&d>3&&$('#menu').hidden&&!hdrEl.contains(document.activeElement))hdrEl.setAttribute('data-hide','');else if(d<-3||sy<=160)hdrEl.removeAttribute('data-hide');
}
function loop(t){
  if(lenis)lenis.raf(t);
  const sy=scrollY_();
  scrollV=prevSy==null?0:clamp(sy-prevSy,-120,120);headerFrame(sy);prevSy=sy;
  if(Cursor)Cursor.frame(sy);hoverRecheck(sy);studioFrame(t,sy);
  if(GL)GL.frame(t);else DomPV.frame();
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
})();
