/* ================= PLAY INQUIRY =================
   Everything specific to the Play Inquiry world. Runs inside the main script, so it shares $, esc, go, openLB,
   publishData and friends. Public API: Play.onShow, Play.scrollTo, Play.setInterest, Play.ownerReady.
   Pages: the Play Inquiry home, the Lagos session (field note 01), the art club, Collaborate and the enquiry form. */

/* section routes: #workshops etc. open the Play Inquiry page at that section */
const PI_SECTIONS={workshops:'pi-workshops','field-notes':'pi-notes','about-oselu':'pi-about'};
const PI_SECTION_LABELS={workshops:'Workshops','field-notes':'Field notes','about-oselu':'About Oselu'};
const PI_DESC='Play Inquiry creates playful, hands-on creative workshops using drawing, open-ended prompts and experimentation for individuals, communities and teams.';
/* per-page title and description where the default ("<label> | Play Inquiry by Oselu") isn't enough */
const PI_TITLES={'art-club':'The best part of small chops is puff puff | Play Inquiry by Oselu',
  'summer-school':'Summer art programme with Spark School Studio | Play Inquiry by Oselu',
  'team-workshop':'Plan a team workshop | Play Inquiry at Work'};
const PI_DESCS={'art-club':'A free art club by Oselu Irabor, part of Play Inquiry. It meets in person in Kaduna once a month and online on Instagram every week.',
  'summer-school':'Art classes for children aged 4 to 16 in summer 2026, in collaboration with Spark School Studio in Kaduna. Part of Play Inquiry by Oselu Irabor.',
  'team-workshop':'Plan a Play Inquiry at Work session: a facilitated creative workshop for companies and teams, adapted to your team\'s context, size and time.',
  'children-programme':'Start a conversation about an art programme for children with Play Inquiry by Oselu Irabor, run in collaboration with partners.'};

/* Lagos session documentation (internal names say "pilot"), saved by the owner from the case study page (see the owner panels).
   photos: [{id, src, w, h, section: stage1..stage4 | work | class, cap, alt, added}]; notes: {questionId: text} */
const PILOT_RAW=/*PILOT*/{}/*END*/;
const PILOT={photos:Array.isArray(PILOT_RAW.photos)?PILOT_RAW.photos:[],notes:(PILOT_RAW.notes&&typeof PILOT_RAW.notes==='object')?PILOT_RAW.notes:{}};
const REFLECT_QS=[
  ['surprised','What surprised me about the session?'],
  ['began','Which exercise helped participants begin?'],
  ['change','What would I change in the next version?'],
  ['document','Which moments would I like to document more carefully?']
];
const PILOT_SECTIONS={stage1:'Warm-up sketching',stage2:'Easing in',stage3:'Drawing',stage4:'Painting with oil pastel',work:"Participants' finished work",class:'During the session'};
/* Photos from the Lagos session on 17 October 2026, published with the site (img/play/lagos). The owner's own uploads
   (PILOT.photos) are added after these. section: class = during the session, work = finished work. */
const PILOT_BASE=[{"src":"img/play/lagos/lagos-01.jpg","th":"img/play/lagos/t-lagos-01.jpg","w":1125,"h":1500,"section":"class","alt":"Participants working around a long table covered with paper, pencils, water bottles and boxes of oil pastels"},
  {"src":"img/play/lagos/lagos-02.jpg","th":"img/play/lagos/t-lagos-02.jpg","w":1125,"h":1500,"section":"class","alt":"Participants sketching bottles and cups in pencil while a man stands at the table and talks to the group"},
  {"src":"img/play/lagos/lagos-03.jpg","th":"img/play/lagos/t-lagos-03.jpg","w":1125,"h":1500,"section":"work","alt":"Finished oil-pastel still lifes laid out on the table among loose pastels: a jug and bottle on blue, a vase of flowers on pink, and a stack of coloured cups on black"},
  {"src":"img/play/lagos/lagos-04.jpg","th":"img/play/lagos/t-lagos-04.jpg","w":1125,"h":1500,"section":"work","alt":"A smiling participant holds up three oil-pastel paintings, the front one of pink flowers in a purple vase"},
  {"src":"img/play/lagos/lagos-05.jpg","th":"img/play/lagos/t-lagos-05.jpg","w":1125,"h":1500,"section":"work","alt":"A participant holds three oil-pastel paintings in front of her face: flowers in a vase, a stack of cups, and a bottle, cup and orange"},
  {"src":"img/play/lagos/lagos-06.jpg","th":"img/play/lagos/t-lagos-06.jpg","w":1125,"h":1500,"section":"work","alt":"A smiling participant holds up an oil-pastel painting of pink tulips in a blue vase on a yellow background"},
  {"src":"img/play/lagos/lagos-07.jpg","th":"img/play/lagos/t-lagos-07.jpg","w":1125,"h":1500,"section":"work","alt":"A participant holds three oil-pastel paintings across his face: a jug and bottle on blue, stacked cups on black, and flowers in a vase on pink"},
  {"src":"img/play/lagos/lagos-08.jpg","th":"img/play/lagos/t-lagos-08.jpg","w":1125,"h":1500,"section":"work","alt":"A smiling participant holds up three oil-pastel paintings of cups and a vase of blue flowers"},
  {"src":"img/play/lagos/lagos-09.jpg","th":"img/play/lagos/t-lagos-09.jpg","w":1125,"h":1500,"section":"work","alt":"A participant holds three oil-pastel paintings in front of her face: stacked cups, a green bottle with a cup and orange, and a vase of flowers"},
  {"src":"img/play/lagos/lagos-10.jpg","th":"img/play/lagos/t-lagos-10.jpg","w":1125,"h":1500,"section":"work","alt":"A smiling participant holds up two oil-pastel paintings: stacked cups on black, and a bottle and cup on brown"},
  {"src":"img/play/lagos/lagos-11.jpg","th":"img/play/lagos/t-lagos-11.jpg","w":1125,"h":1500,"section":"work","alt":"A participant holds four oil-pastel paintings in front of her face, including flowers in a vase on red and a bottle on yellow"}];
const PHOTOS=()=>[...PILOT_BASE,...PILOT.photos];

/* The next public session, set by the owner from the panel under the photos on the Play Inquiry page.
   {date, place, price, link, note, added}; empty until a date is announced (the box then invites people to get notified). */
const NEXT_RAW=/*NEXT*/{}/*END*/;
const NEXT_SESSION=(NEXT_RAW&&typeof NEXT_RAW==='object'&&NEXT_RAW.date)?NEXT_RAW:{};
const photoKey=p=>p.id||p.src;

/* The art club ("The best part of small chops is puff puff"): photos from its meetups in Kaduna (img/play/club).
   group: cover = the photo on the page header, table = around the table, made = the drawings.
   One file per photo serves the grid and the viewer (the site is close to its file limit, so there are no separate thumbnails).
   wide: shown as a wide crop (th is a 3:2 crop of the room; pos sets the crop); the lightbox always shows the full photo. */
const CLUB=[
  {src:'img/play/club/club-01.jpg',group:'cover',alt:'Participants bent over their drawings around a long table, some working from photos on their phones'},
  {src:'img/play/club/club-02.jpg',th:'img/play/club/club-02-wide.jpg',group:'table',wide:true,pos:'50% 52%',alt:'A wide view of the room: people drawing at long tables, heads down over sheets of paper'},
  {src:'img/play/club/club-03.jpg',group:'table',alt:'Looking down at the table: one participant starts on a blank sheet beside pencil outlines of stacked cups'},
  {src:'img/play/club/club-04.jpg',group:'table',alt:'A participant draws stacked cups in pencil from a photo on his phone, with a larger outline of the cups on the table in front of him'},
  {src:'img/play/club/club-05.jpg',group:'table',alt:'Participants drawing at two tables; in the foreground, two of them sketch with blue pencils'},
  {src:'img/play/club/club-06.jpg',group:'made',alt:'A participant in a cap grins and holds up a shaded pencil drawing of a coffee pot, a jug and a piece of fruit'},
  {src:'img/play/club/club-07.jpg',group:'made',alt:'Close-up of a shaded pencil drawing of a bottle, a mug and a round fruit'},
  {src:'img/play/club/club-08.jpg',group:'made',alt:'A participant in a red polo shirt holds up a pencil drawing of four cups stacked on a saucer'},
  {src:'img/play/club/club-09.jpg',group:'made',alt:'A participant gives a thumbs up and holds a pencil drawing of a coffee pot, a jug and a piece of fruit'},
  {src:'img/play/club/club-10.jpg',group:'made',alt:'A participant smiles with her eyes closed, holding a pencil drawing of a mug, a bottle and a piece of fruit'},
  {src:'img/play/club/club-11.jpg',group:'made',alt:'A participant smiles and holds a pencil drawing of a bottle, a mug and a piece of fruit while others draw at a table behind him'}];
const CLUB_GROUPS={cover:'At the art club',table:'Around the table',made:'The drawings'};

/* The summer programme for children with Spark School Studio, Kaduna, summer 2026 (img/play/kids).
   group: cover = page header, table = during the classes, made = the children's drawings, shown = showing their work.
   Privacy: every child's face is blurred and the names and signatures written on the drawings are removed
   (photos 01-03 and 11-15 have faces; names were on 04, 05, 07, 11 and 12). The adult in 15 and 16 is not blurred.
   Photo 04 is cropped above the photographer's feet, so it is wide in the viewer too. */
const KIDS=[
  {src:'img/play/kids/summer-01.jpg',group:'cover',alt:'Four children drawing at black tables in a room with green and blue painted cupboards, a sketch pad in the foreground'},
  {src:'img/play/kids/summer-02.jpg',group:'table',pos:'50% 62%',alt:'Four children bent over their drawings at two black tables, with a sketch pad and a pencil drawing in the foreground'},
  {src:'img/play/kids/summer-03.jpg',group:'table',pos:'50% 86%',alt:'Four children drawing around a table in a room with colourfully painted doors and cupboards'},
  {src:'img/play/kids/summer-04-wide.jpg',th:'img/play/kids/summer-04-wide.jpg',group:'made',wide:true,pos:'50% 50%',alt:'Dozens of the children\'s crayon drawings laid out side by side on a tiled floor'},
  {src:'img/play/kids/summer-05.jpg',group:'made',alt:'A closer view of the drawings on the floor: bold shapes, flowers, faces and swirls of colour'},
  {src:'img/play/kids/summer-06.jpg',group:'made',alt:'A crayon drawing of eye shapes among scribbles of pink, blue, yellow, red and orange'},
  {src:'img/play/kids/summer-07.jpg',group:'made',alt:'A pastel drawing of a large red, orange and yellow shape surrounded by rounded shapes in green, purple, grey and orange on blue'},
  {src:'img/play/kids/summer-08.jpg',group:'made',alt:'A crayon drawing of a grinning figure in a yellow cap and a red top with a black spider on it'},
  {src:'img/play/kids/summer-09.jpg',group:'made',alt:'A drawing of a smiling sun, black hair, two brown eyes, a zigzag mouth, a rainbow, a red rose and three small figures'},
  {src:'img/play/kids/summer-10.jpg',group:'made',alt:'A crayon drawing of a large red superhero mask on a blue background, with small figures around it'},
  {src:'img/play/kids/summer-11.jpg',group:'shown',alt:'A child holds up three drawings: a page of coloured shapes and two shaded pencil still lifes of bottles and jugs'},
  {src:'img/play/kids/summer-12.jpg',group:'shown',alt:'A child looks down at three drawings: a pencil drawing of a stack of books, a heart among coloured shapes, and a rainbow over a bottle'},
  {src:'img/play/kids/summer-13.jpg',group:'shown',alt:'A child in a pink top holds up two crayon drawings of stripes and bold shapes'},
  {src:'img/play/kids/summer-14.jpg',group:'shown',alt:'Two children stand against a wall, showing their colourful alphabet drawings'},
  {src:'img/play/kids/summer-15.jpg',group:'shown',alt:'An adult crouches between two children who hold up colourful alphabet drawings; one of them looks up at him'},
  {src:'img/play/kids/summer-16.jpg',group:'shown',alt:'A smiling adult in a crochet hat holds up a colourful drawing of the alphabet'}];
const KIDS_GROUPS={cover:'At the summer programme',table:'Around the table',made:'What the children made',shown:'Showing their work'};

/* photo sets shown on the art club and summer programme pages: containers carry data-pset="set:group" */
const PSETS={
  club:{photos:CLUB,groups:CLUB_GROUPS,where:'The art club, Kaduna'},
  kids:{photos:KIDS,groups:KIDS_GROUPS,where:'Summer programme with Spark School Studio, Kaduna'}};

const Play=(()=>{
  /* ---------- motifs: one hand-drawn mark per idea, drawn in a 120×120 box ---------- */
  const MOTIFS={
    notice:{p:['M28 66C26 40 48 24 70 30C92 36 98 62 86 80C74 96 44 94 34 80','M96 26L104 16','M104 42L114 40','M84 18L86 8'],d:[[63,60,7]]},
    play:{p:['M10 86L28 46L44 80L60 34C68 18 86 22 84 40C82 56 62 52 70 68C76 80 96 78 110 62']},
    make:{p:['M22 96C34 72 46 48 62 22','M62 22C76 48 88 72 102 96','M12 94C44 100 78 96 110 98'],d:[[62,70,6]]},
    reflect:{p:['M12 46C26 20 44 20 58 40C70 56 88 54 108 30','M12 74C26 100 44 100 58 80C70 64 88 66 108 90'],d:[[16,60,2.8],[38,60,2.8],[60,60,2.8],[82,60,2.8],[104,60,2.8]]},
    team:{p:['M10 20C32 30 42 50 60 60','M110 18C90 32 78 48 60 60','M12 106C30 90 44 74 60 60','M108 104C92 90 78 72 60 60'],d:[[60,60,7.5]]},
    partner:{p:['M52 60C52 40 32 30 22 44C12 58 24 80 42 78C58 76 64 58 70 46C78 32 98 30 104 46C110 62 96 80 80 78C66 76 58 66 54 60']},
    community:{p:['M20 64C20 38 40 22 62 24C86 26 102 44 100 66C98 88 78 100 58 98C38 96 22 84 22 70'],d:[[60,12,5],[95,28,5],[108,64,5],[88,102,5],[44,106,5],[14,90,5],[10,46,5],[30,18,5],[60,62,7]]},
    sun:{p:['M60 40C72 40 80 50 78 62C76 74 64 80 54 76C44 72 40 60 46 50C50 44 54 41 60 40','M60 10L60 24','M60 96L60 110','M10 60L24 60','M96 60L110 60','M24 24L34 34','M86 86L96 96','M96 24L86 34','M34 86L24 96']},
    /* three puff puff, piled up: the art club's mark */
    puff:{p:['M60 10C74 10 84 21 84 34C84 48 73 58 60 58C46 58 36 47 36 34C36 21 47 11 62 11','M36 52C50 52 60 63 60 76C60 90 49 100 36 100C22 100 12 89 12 76C12 63 23 53 38 53','M84 52C98 52 108 63 108 76C108 90 97 100 84 100C70 100 60 89 60 76C60 63 71 53 86 53']}
  };
  const motifSVG=name=>{const m=MOTIFS[name];if(!m)return '';
    return `<svg viewBox="0 0 120 120" aria-hidden="true" focusable="false"><g class="mp" filter="url(#crayon)" fill="none" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">${m.p.map(d=>`<path pathLength="1" d="${d}"/>`).join('')}</g>${m.d?`<g class="md">${m.d.map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}"/>`).join('')}</g>`:''}</svg>`};
  $$('[data-motif]').forEach(el=>{el.innerHTML=motifSVG(el.dataset.motif)});

  /* the four-stage progression, drawn: used where the Lagos session has no photos yet */
  const PROGRESSION=`<svg class="pi-prog" viewBox="0 0 400 300" role="img" aria-label="Diagram of the session: warm-up sketches, easing in, a drawing, then colour in oil pastel" focusable="false">
    <rect class="frame" x="14" y="14" width="178" height="128" rx="12"/><rect class="frame" x="208" y="14" width="178" height="128" rx="12"/>
    <rect class="frame" x="14" y="158" width="178" height="128" rx="12"/><rect class="frame" x="208" y="158" width="178" height="128" rx="12"/>
    <g filter="url(#crayon)" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path d="M40 92C52 60 64 112 78 80S104 52 116 86S144 108 160 70" stroke="#8a7f6c" stroke-width="3.5"/><path d="M44 112C70 100 98 118 128 104S156 98 168 108" stroke="#8a7f6c" stroke-width="3"/>
      <path d="M262 100C258 72 282 52 304 58C330 64 338 92 322 108C306 122 270 120 262 100" stroke="#8a7f6c" stroke-width="3.5"/><path d="M300 56C302 46 308 40 318 38" stroke="#8a7f6c" stroke-width="3"/>
      <path d="M66 246C60 218 82 196 106 202C132 208 140 236 124 252C108 266 72 264 66 246Z" stroke="#231d13" stroke-width="4.5"/><path d="M104 200C106 190 112 184 122 182" stroke="#231d13" stroke-width="4"/>
      <path d="M262 246C256 218 278 196 302 202C328 208 336 236 320 252C304 266 268 264 262 246Z" stroke="#e8634a" stroke-width="20"/><path d="M276 238C282 222 300 214 312 224" stroke="#f4b32b" stroke-width="10"/><path d="M300 200C302 190 308 184 318 182" stroke="#3e9a62" stroke-width="7"/>
    </g>
    <text x="28" y="36">1 · warm-up</text><text x="222" y="36">2 · easing in</text><text x="28" y="180">3 · drawing</text><text x="222" y="180">4 · oil pastel</text>
  </svg>`;

  /* ---------- reveal: motif lines draw when they scroll into view (copy is never hidden) ---------- */
  const drawIO=('IntersectionObserver' in window)&&!reduced?new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){en.target.classList.remove('draw-pre');drawIO.unobserve(en.target)}}),{rootMargin:'0px 0px -10% 0px'}):null;
  function armDraw(root){if(!drawIO||!root)return;$$('[data-draw]',root).forEach(el=>{if(el.getBoundingClientRect().top>window.innerHeight*.9){el.classList.add('draw-pre');drawIO.observe(el)}})}

  /* ---------- hero: lines start apart and meet, then a loop circles "curiosity" ---------- */
  /* delay: seconds to wait (the page-change veil is still lifting); lines stay undrawn until then */
  function heroIntro(delay){const h=$('#pi-hero');if(!h||reduced)return;h.style.setProperty('--pi-d',(delay||0)+'s');h.classList.remove('pi-anim');h.classList.add('pi-pre');void h.offsetWidth;h.classList.add('pi-anim');requestAnimationFrame(()=>requestAnimationFrame(()=>h.classList.remove('pi-pre')))}
  /* art club and summer programme pages: the same loop circles a word in the title once the page is showing */
  function loopIntro(id,delay){const h=document.getElementById(id);if(!h||reduced)return;h.style.setProperty('--pi-d',(delay||0)+'s');h.classList.add('pi-pre');void h.offsetWidth;requestAnimationFrame(()=>requestAnimationFrame(()=>h.classList.remove('pi-pre')))}
  const LOOP_HEADS={'art-club':'club-head','summer-school':'kids-head'};

  /* ---------- section scrolling + scroll spy for the header nav and the case-study contents ---------- */
  function scrollToId(id,smooth){const el=document.getElementById(id);if(!el)return;const y=el.getBoundingClientRect().top+scrollY_()-(document.getElementById('hdr').offsetHeight+12);
    if(lenis)lenis.scrollTo(Math.max(0,y),{immediate:!smooth,force:true,duration:1.1});else window.scrollTo({top:Math.max(0,y),behavior:smooth&&!reduced?'smooth':'auto'})}
  const spyGroups=[];
  const spyIO=('IntersectionObserver' in window)?new IntersectionObserver(es=>{es.forEach(en=>{en.target._vis=en.isIntersecting});spyGroups.forEach(update)},{rootMargin:'-38% 0px -56% 0px'}):null;
  function update(g){if(document.body.dataset.view!==g.view)return;let on=null;g.items.forEach(([s,els])=>{if(s._vis)on=els});g.items.forEach(([s,els])=>els.forEach(el=>{els===on?el.setAttribute('aria-current','true'):el.removeAttribute('aria-current')}))}
  function spy(view,pairs){if(!spyIO)return;const g={view,items:pairs.filter(([s])=>s)};spyGroups.push(g);g.items.forEach(([s])=>spyIO.observe(s))}
  spy('play-inquiry',Object.entries(PI_SECTIONS).map(([route,id])=>[document.getElementById(id),$$(`.nav-play [data-nav="${route}"]`)]));
  spy('lagos-session',$$('.pi-toc [data-scroll]').map(b=>[document.getElementById(b.dataset.scroll),[b]]));

  /* ---------- try-a-prompt drawing pad ---------- */
  (()=>{
    const wrap=$('#pi-pad-wrap'),cv=$('#pi-pad');if(!wrap||!cv||!cv.getContext)return;
    const ctx=cv.getContext('2d');let W=0,H=0,dpr=1,color='#231d13',cur=null;const strokes=[];
    const pt=e=>{const r=cv.getBoundingClientRect();return {x:(e.clientX-r.left)/r.width,y:(e.clientY-r.top)/r.height}};
    const rnd=k=>{const x=Math.sin(k*12.9898)*43758.5453;return x-Math.floor(x)};
    /* crayon: a solid waxy line, then flecks of paper showing through it */
    function seg(a,b,c,seed){const ax=a.x*W,ay=a.y*H,bx=b.x*W,by=b.y*H,lw=6.5*Math.min(1.35,Math.max(.85,W/520));
      ctx.globalAlpha=1;ctx.strokeStyle=c;ctx.lineWidth=lw;ctx.lineCap='round';ctx.lineJoin='round';
      ctx.beginPath();ctx.moveTo(ax,ay);ctx.lineTo(bx,by);ctx.stroke();
      const n=Math.ceil(Math.hypot(bx-ax,by-ay)*1.6);ctx.fillStyle='#fff';
      for(let i=0;i<n;i++){const t=i/n;ctx.globalAlpha=.2+rnd(seed*7+i)*.45;
        ctx.fillRect(ax+(bx-ax)*t+(rnd(seed*31+i*3)-.5)*lw,ay+(by-ay)*t+(rnd(seed*17+i*5)-.5)*lw,1.3,1.3)}
      ctx.globalAlpha=1}
    function redraw(){ctx.clearRect(0,0,W,H);strokes.forEach(s=>{for(let i=1;i<s.pts.length;i++)seg(s.pts[i-1],s.pts[i],s.c,i)})}
    function size(){const r=cv.getBoundingClientRect();if(!r.width)return;dpr=Math.min(window.devicePixelRatio||1,2);W=r.width;H=r.height;cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);redraw()}
    if('ResizeObserver' in window)new ResizeObserver(size).observe(wrap);else window.addEventListener('resize',size);
    cv.addEventListener('pointerdown',e=>{if(e.button&&e.button!==0)return;if(!W)size();try{cv.setPointerCapture(e.pointerId)}catch(_){}cur={c:color,pts:[pt(e)]};strokes.push(cur);wrap.classList.add('drawn');e.preventDefault()});
    cv.addEventListener('pointermove',e=>{if(!cur)return;const p=pt(e),l=cur.pts[cur.pts.length-1];if(Math.hypot((p.x-l.x)*W,(p.y-l.y)*H)<1.5)return;cur.pts.push(p);seg(l,p,cur.c,cur.pts.length-1)});
    ['pointerup','pointercancel','lostpointercapture'].forEach(t=>cv.addEventListener(t,()=>{cur=null}));
    $('#pi-pad-clear').addEventListener('click',()=>{strokes.length=0;cur=null;ctx.clearRect(0,0,W,H);wrap.classList.remove('drawn')});
    const sw=$$('.pi-swatches [role=radio]');
    const pick=b=>{sw.forEach(x=>{x.setAttribute('aria-checked',String(x===b));x.tabIndex=x===b?0:-1});color=b.dataset.c};
    sw.forEach((b,i)=>{b.tabIndex=i?-1:0;b.addEventListener('click',()=>pick(b));b.addEventListener('keydown',e=>{const k={ArrowRight:1,ArrowDown:1,ArrowLeft:-1,ArrowUp:-1}[e.key];if(!k)return;e.preventDefault();const n=sw[(i+k+sw.length)%sw.length];pick(n);n.focus()})});
  })();

  /* ---------- enquiry forms: one per offer, each an honest hand-off to WhatsApp or email (the site has no backend) ----------
     sessions (#join): join a session, co-host one or come to the art club · team (#team-workshop): Play Inquiry at Work ·
     children (#children-programme). The markup drives everything: fields with name + data-label go into the message
     (textareas at the end), data-req marks a required field and holds its error, data-when="<choice>" shows a block for
     one choice of the sessions form. */
  const FORMS={
    sessions:{submit:'Keep me in the loop',subject:'Play Inquiry Sessions',
      choices:{
        join:{label:'Joining a Play Inquiry Session',subject:'Play Inquiry Sessions: keep me in the loop',submit:'Keep me in the loop'},
        cohost:{label:'Co-hosting a Play Inquiry Session',subject:'Play Inquiry Sessions: co-hosting',submit:'Start a conversation'},
        club:{label:'Coming to the free art club',subject:'Art club: the next meetup',submit:'Ask about the next meetup',city:'Kaduna'}}},
    team:{intro:"I'd like to plan a Play Inquiry at Work session for my team.",subject:'Play Inquiry at Work: team workshop enquiry',submit:'Start a conversation'},
    children:{intro:"I'd like to talk about an art programme for children.",subject:"Play Inquiry: children's programme enquiry",submit:'Start a conversation'},
    /* the studio's Work with me page (#work-with-me) */
    studio:{submit:'Start a project',subject:'Commission enquiry',from:"Oselu Irabor's website",
      choices:{
        illustration:{label:'An illustration project',subject:'Commission enquiry: illustration',submit:'Start a project'},
        design:{label:'A graphic design project',subject:'Commission enquiry: graphic design',submit:'Start a project'},
        art:{label:'Artwork',subject:'Artwork enquiry',submit:'Ask about artwork'}}}
  };
  const emailOK=v=>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  const Forms={};
  $$('form[data-form]').forEach(form=>{
    const cfg=FORMS[form.dataset.form];if(!cfg)return;
    const one=sel=>form.querySelector(sel),all=sel=>[...form.querySelectorAll(sel)];
    const radios=all('input[name=choice]'),city=one('select[name=city]'),cityOther=one('[data-city-other]');
    const submit=one('.pi-submit'),sum=one('.pi-err-summary'),done=one('.pi-ready');
    const choice=()=>{const r=radios.find(x=>x.checked);return r?r.value:''};
    const pick=()=>cfg.choices&&cfg.choices[choice()];
    const shown=el=>!el.closest('[hidden]');
    let cityTouched=false;
    /* each required field gets an error line wired to it with aria-describedby */
    all('[data-req]').forEach(ctl=>{const err=ctl.closest('.pi-field').querySelector('.pi-field-err');if(!err)return;err.id=ctl.id+'-err';
      const d=ctl.tagName==='FIELDSET'?ctl:ctl;d.setAttribute('aria-describedby',[d.getAttribute('aria-describedby'),err.id].filter(Boolean).join(' '))});
    function sync(){const p=pick();submit.textContent=(p&&p.submit)||cfg.submit;
      all('[data-when]').forEach(b=>{b.hidden=!b.dataset.when.split(' ').includes(choice())});
      if(cityOther)cityOther.hidden=!city||city.value!=='other'}
    function setErr(ctl,msg){const err=document.getElementById(ctl.id+'-err');if(!err)return;
      if(msg){err.textContent=msg;err.hidden=false;ctl.setAttribute('aria-invalid','true')}else{err.hidden=true;err.textContent='';ctl.removeAttribute('aria-invalid')}}
    function check(){const errs=[];
      all('[data-req]').forEach(ctl=>{if(!shown(ctl)){setErr(ctl,'');return}
        let msg='';
        if(ctl.tagName==='FIELDSET'){if(!ctl.querySelector('input:checked'))msg=ctl.dataset.req}
        else{const v=ctl.value.trim();if(!v)msg=ctl.dataset.req;else if(ctl.type==='email'&&!emailOK(v))msg='Check your email address. It looks incomplete.'}
        setErr(ctl,msg);if(msg)errs.push([ctl,msg])});
      return errs}
    function message(){const p=pick(),lines=['Hello Oselu,',''],notes=[];
      if(p)lines.push(`I'm interested in: ${p.label}`,'');else if(cfg.intro)lines.push(cfg.intro,'');
      /* someone joining while a public session is announced: name the session, so Oselu knows which one */
      if(form.dataset.form==='sessions'&&choice()==='join'&&NEXT_SESSION.date)lines.splice(lines.length-1,0,`Session: ${[NEXT_SESSION.date,NEXT_SESSION.place].filter(Boolean).join(' · ')}`);
      all('input[name],select[name],textarea[name]').forEach(el=>{
        if(el.type==='radio'||el.name==='city-other'||!shown(el))return;
        let v=el.value.trim();
        if(el.name==='city'&&v==='other'){const o=one('[name="city-other"]');v=(o&&o.value.trim())||'Somewhere else'}
        if(!v)return;
        if(el.tagName==='TEXTAREA'){notes.push(el.dataset.label?`${el.dataset.label}:\n${v}`:v);return}
        lines.push(`${el.dataset.label||el.name}: ${v}`)});
      notes.forEach(n=>lines.push('',n));
      lines.push('',`(Sent from ${cfg.from||'the Play Inquiry website'})`);
      return {text:lines.join('\n'),subject:(p&&p.subject)||cfg.subject}}
    radios.forEach(r=>r.addEventListener('change',()=>{const p=pick();if(p&&p.city&&city&&!cityTouched)city.value=p.city;sync()}));
    if(city)city.addEventListener('change',()=>{cityTouched=true;sync()});
    /* after a first attempt, errors update as people type; a prepared message is withdrawn if the details change */
    ['input','change'].forEach(t=>form.addEventListener(t,ev=>{if(ev.target.closest('.pi-ready'))return;if(form.dataset.tried)check();if(!done.hidden)done.hidden=true}));
    form.addEventListener('submit',ev=>{ev.preventDefault();form.dataset.tried='1';
      const errs=check();
      if(errs.length){sum.innerHTML=`<p>${errs.length===1?'One thing to fix':errs.length+' things to fix'} before you continue:</p><ul>${errs.map(([c,m])=>`<li><a href="#" data-fix="${c.id}">${esc(m)}</a></li>`).join('')}</ul>`;
        sum.hidden=false;done.hidden=true;sum.focus();return}
      sum.hidden=true;sum.innerHTML='';
      const m=message();
      one('.r-msg').textContent=m.text;
      one('.r-wa').href='https://wa.me/'+WHATSAPP+'?text='+encodeURIComponent(m.text);
      one('.r-mail').href='mailto:iraborianlu@gmail.com?subject='+encodeURIComponent(m.subject)+'&body='+encodeURIComponent(m.text.replace(/\n/g,'\r\n'));
      one('.r-copy').textContent='Copy message';
      done.hidden=false;done.focus({preventScroll:true});scrollToElement(done)});
    form.addEventListener('click',ev=>{const a=ev.target.closest('[data-fix]');if(!a)return;ev.preventDefault();
      const el=document.getElementById(a.dataset.fix);const f=el.tagName==='FIELDSET'?el.querySelector('input'):el;scrollToElement(el);f.focus({preventScroll:true})});
    one('.r-copy').addEventListener('click',async e=>{const b=e.currentTarget,pre=one('.r-msg');
      try{await navigator.clipboard.writeText(pre.textContent);b.textContent='Copied'}
      catch(_){const r=document.createRange();r.selectNodeContents(pre);const s=getSelection();s.removeAllRanges();s.addRange(r);b.textContent='Selected. Press copy'}});
    sync();
    Forms[form.dataset.form]={set(k){const r=radios.find(x=>x.value===k);if(!r)return;r.checked=true;const p=pick();if(p&&p.city&&city&&!cityTouched)city.value=p.city;sync();if(form.dataset.tried)check()}};
  });
  /* buttons elsewhere preselect an option on the sessions form (older names still work) */
  const LEGACY={public:'join',venue:'cohost',collab:'cohost'};
  function scrollToElement(el){const y=el.getBoundingClientRect().top+scrollY_()-(document.getElementById('hdr').offsetHeight+24);if(lenis)lenis.scrollTo(Math.max(0,y),{duration:.9});else window.scrollTo({top:Math.max(0,y),behavior:reduced?'auto':'smooth'})}

  /* ---------- Lagos session: photos and reflections ---------- */
  let owner=false;
  const paras=t=>String(t).trim().split(/\n\s*\n/).map(p=>`<p>${esc(p.trim()).replace(/\n/g,'<br>')}</p>`).join('');
  const lbList=()=>PHOTOS().map(p=>({src:p.src,cap:[p.cap,PILOT_SECTIONS[p.section],'Lagos, 17 October 2026'].filter(Boolean).join(' · ')}));
  const canRemove=p=>owner&&!!p.id;
  const fig=p=>`<figure class="pi-shotfig"><button type="button" class="pi-shot" data-pilot="${esc(photoKey(p))}" data-cursor="Enlarge" aria-label="View larger: ${esc(p.alt||p.cap||'Photo from the Lagos session')}"><img src="${esc(p.th||p.src)}" width="${p.w}" height="${p.h}" alt="${esc(p.alt||p.cap||'')}" loading="lazy"></button>${p.cap||canRemove(p)?`<figcaption>${p.cap?esc(p.cap):''}${canRemove(p)?`<button type="button" class="rm-btn" data-pilotrm="${esc(p.id)}">Remove</button>`:''}</figcaption>`:''}</figure>`;
  function renderPilot(){
    const ph=PHOTOS();
    $$('[data-photos]').forEach(el=>{const items=ph.filter(p=>p.section===el.dataset.photos);el.innerHTML=items.map(fig).join('');el.hidden=!items.length});
    const during=ph.filter(p=>p.section==='class'),cls=$('#pilot-class');
    cls.innerHTML=during.length?`<p class="pi-meta mono">During the session · 17 October 2026</p><div class="pi-gallery pi-gallery-2">${during.map(fig).join('')}</div>`:'';cls.hidden=!during.length;
    const shown=ph.filter(p=>p.section==='work');
    $('#pilot-gallery').innerHTML=shown.length?`<div class="pi-gallery">${shown.map(fig).join('')}</div>`:
      `<div class="pi-card pi-docs" data-tone="yellow"><div class="pi-docs-art">${PROGRESSION}</div><div class="pi-docs-text"><p class="pi-tag">Documentation in progress</p><p>Photos of the session and of the work participants made will be added here once they're ready to share, with participants' permission.</p></div></div>`;
    const lead=ph.find(p=>p.section==='class')||ph.find(p=>p.section==='work')||ph[0];
    $$('[data-pilot-media]').forEach(m=>{m.innerHTML=lead?`<img src="${esc(lead.th||lead.src)}" alt="" loading="lazy">`:PROGRESSION});
    const notes=$('#pilot-notes'),answered=REFLECT_QS.filter(([k])=>String(PILOT.notes[k]||'').trim());
    const unwritten=!answered.length&&!owner,learned=$('#cs-learned'),tocL=$('.pi-toc [data-scroll="cs-learned"]');
    if(learned)learned.hidden=unwritten;if(tocL)tocL.hidden=unwritten;
    notes.innerHTML=answered.length?`<dl class="pi-reflect">${answered.map(([k,qq])=>`<div><dt>${esc(qq)}</dt><dd>${paras(PILOT.notes[k])}</dd></div>`).join('')}</dl>`:
      `<p>I'm writing up my reflections from the session. These are the questions guiding them:</p><ul class="pi-qs">${REFLECT_QS.map(([,qq])=>`<li>${esc(qq)}</li>`).join('')}</ul>`;
  }
  renderPilot();

  /* ---------- next public session: shown on the Play Inquiry page and beside the sessions form ---------- */
  function renderNext(){
    const n=NEXT_SESSION,has=!!n.date,link=has&&n.link&&/^https?:\/\/\S+$/i.test(n.link)?n.link:'';
    const ig='<a class="pi-link" href="https://www.instagram.com/oselucoded/" target="_blank" rel="noopener">Follow @oselucoded on Instagram <span aria-hidden="true">↗</span></a>';
    $$('[data-next]').forEach(el=>{
      const compact=el.dataset.next==='compact';
      const info=has?`<p class="pi-next-k mono">Next public session</p><p class="pi-next-date">${esc(n.date)}</p>${n.place||n.price?`<p class="pi-next-meta">${[n.place,n.price].filter(Boolean).map(esc).join(' · ')}</p>`:''}${n.note?`<p class="pi-next-text">${esc(n.note)}</p>`:''}`
        :`<p class="pi-next-k mono">Next public session</p><p class="pi-next-date">Date to be announced</p><p class="pi-next-text">${compact?'Leave your details below to hear when the next one is on.':'Leave your details to hear when the next one is on.'}</p>`;
      let cta;
      if(has)cta=link?`<a class="pi-btn" href="${esc(link)}" target="_blank" rel="noopener">Book a spot <span aria-hidden="true">↗</span></a>${compact?'':`<a class="pi-link" href="#join" data-go="join" data-interest="join">Ask a question</a>`}`
        :(compact?'':`<a class="pi-btn" href="#join" data-go="join" data-interest="join">Save a spot <span aria-hidden="true">→</span></a>`);
      else cta=compact?ig:`<a class="pi-btn" href="#join" data-go="join" data-interest="join">Get notified <span aria-hidden="true">→</span></a>${ig}`;
      el.innerHTML=`<div class="pi-next-info">${info}</div>${cta?`<div class="pi-cta">${cta}</div>`:''}`;
      el.classList.toggle('is-set',has)});
  }
  renderNext();
  const ns={form:$('#ns-form'),date:$('#ns-date'),place:$('#ns-place'),price:$('#ns-price'),link:$('#ns-link'),note:$('#ns-note'),status:$('#ns-status'),save:$('#ns-save'),clear:$('#ns-clear')};
  const nsMsg=(t,err)=>{ns.status.textContent=t;ns.status.classList.toggle('err',!!err)};
  $('#ns-open').addEventListener('click',()=>{['date','place','price','link','note'].forEach(k=>{ns[k].value=NEXT_SESSION[k]||''});
    ns.clear.hidden=!NEXT_SESSION.date;ns.form.hidden=false;$('#ns-open').hidden=true;ns.date.focus()});
  $('#ns-cancel').addEventListener('click',()=>{ns.form.hidden=true;$('#ns-open').hidden=false;nsMsg('')});
  ns.form.addEventListener('submit',async e=>{e.preventDefault();const v=k=>ns[k].value.trim();
    if(!v('date')){nsMsg('Add the date and time.',true);ns.date.focus();return}
    if(!v('place')){nsMsg('Add the city and venue.',true);ns.place.focus();return}
    if(v('link')&&!/^https?:\/\/\S+$/i.test(v('link'))){nsMsg('The booking link should start with https://',true);ns.link.focus();return}
    ns.save.disabled=true;nsMsg('Publishing to the site…');
    try{await publishData({session:{date:v('date'),place:v('place'),price:v('price'),link:v('link'),note:v('note'),added:todayISO()}});nsMsg('Published. The page is reloading with the new date.')}
    catch(err){ns.save.disabled=false;nsMsg(publishError(err),true)}});
  ns.clear.addEventListener('click',async()=>{const b=ns.clear;
    if(!b.classList.contains('armed')){b.classList.add('armed');b.textContent='Confirm: remove the date';setTimeout(()=>{b.classList.remove('armed');b.textContent='Remove the date'},4000);return}
    b.disabled=true;nsMsg('Removing the date…');
    try{await publishData({session:{}});nsMsg('Removed. The page is reloading.')}
    catch(err){b.disabled=false;nsMsg(publishError(err),true)}});

  /* ---------- art club + summer programme: cover photo and galleries from PSETS ---------- */
  const psetLB=k=>PSETS[k].photos.map(p=>({src:p.src,cap:[PSETS[k].groups[p.group],PSETS[k].where].join(' · ')}));
  const psetShot=(k,p,i,src)=>`<button type="button" class="pi-shot" data-shot="${k}:${i}" data-cursor="Enlarge" aria-label="View larger: ${esc(p.alt)}"><img src="${esc(src||p.th||p.src)}" width="${p.wide?1800:600}" height="${p.wide?1200:800}" alt="${esc(p.alt)}" loading="lazy"${p.pos?` style="object-position:${p.pos}"`:''}></button>`;
  $$('[data-pset]').forEach(el=>{
    const [k,g]=el.dataset.pset.split(':'),set=PSETS[k];if(!set)return;
    const items=set.photos.map((p,i)=>[p,i]).filter(([p])=>p.group===g);
    /* the cover is shown large, so it uses the full-size file */
    if(g==='cover'){const [p,i]=items[0]||[];if(p)el.innerHTML=psetShot(k,p,i,p.src)+`<figcaption class="mono">${esc(el.dataset.cap||'')}</figcaption>`;return}
    el.innerHTML=items.map(([p,i])=>`<figure class="pi-shotfig${p.wide?' is-wide':''}">${psetShot(k,p,i)}</figure>`).join('');
  });

  document.addEventListener('click',e=>{
    const t=e.target;if(!t.closest)return;
    const rm=t.closest('[data-pilotrm]');if(rm){removePhoto(rm);return}
    const s=t.closest('[data-pilot]');if(s){const i=PHOTOS().findIndex(p=>photoKey(p)===s.dataset.pilot);if(i>-1)openLB(lbList(),i,s);return}
    const ps=t.closest('[data-shot]');if(ps){const [k,i]=ps.dataset.shot.split(':');if(PSETS[k])openLB(psetLB(k),+i,ps)}
  });

  /* owner panels (shown only to people who can edit this page) */
  const pa={form:$('#pa-form'),file:$('#pa-file'),prev:$('#pa-preview'),drop:$('#pa-drop-text'),section:$('#pa-section'),cap:$('#pa-cap'),alt:$('#pa-alt'),ok:$('#pa-ok'),status:$('#pa-status'),save:$('#pa-save')};
  let paBlob=null,paSize=null;const paMsg=(t,err)=>{pa.status.textContent=t;pa.status.classList.toggle('err',!!err)};
  pa.file.addEventListener('change',async()=>{const f=pa.file.files[0];if(!f)return;paMsg('Preparing photo…');
    try{const r=await prepImage(f);paBlob=r.blob;paSize=[r.w,r.h];pa.prev.src=URL.createObjectURL(r.blob);pa.prev.hidden=false;pa.drop.hidden=true;paMsg('')}
    catch(_){paBlob=null;paMsg("This image type can't be read here. Export it as JPG or PNG and try again.",true)}});
  $('#pa-open').addEventListener('click',()=>{pa.form.hidden=false;$('#pa-open').hidden=true;pa.section.focus()});
  $('#pa-cancel').addEventListener('click',()=>{pa.form.reset();paBlob=null;pa.prev.hidden=true;pa.drop.hidden=false;paMsg('');pa.form.hidden=true;$('#pa-open').hidden=false});
  pa.form.addEventListener('submit',async e=>{e.preventDefault();
    if(!paBlob){paMsg('Choose a photo first.',true);return}
    if(!pa.alt.value.trim()){paMsg("Add a short description of the photo for people who can't see it.",true);pa.alt.focus();return}
    if(!pa.ok.checked){paMsg('Confirm you have permission to share this photo.',true);pa.ok.focus();return}
    pa.save.disabled=true;paMsg('Uploading photo…');
    try{const up=await artAdmin.assets.upload(paBlob,{type:'image/jpeg'});paMsg('Publishing to the site…');
      const item={id:up.id,src:up.url,w:paSize[0],h:paSize[1],section:pa.section.value,cap:pa.cap.value.trim(),alt:pa.alt.value.trim(),added:todayISO()};
      await publishData({pilot:{photos:[...PILOT.photos,item],notes:PILOT.notes}});paMsg('Published. The page is reloading with the new photo.')}
    catch(err){pa.save.disabled=false;paMsg(publishError(err),true)}});
  async function removePhoto(btn){
    if(!btn.classList.contains('armed')){btn.classList.add('armed');btn.textContent='Confirm remove';setTimeout(()=>{btn.classList.remove('armed');btn.textContent='Remove'},4000);return}
    const id=btn.dataset.pilotrm;btn.disabled=true;btn.textContent='Removing…';
    try{await publishData({pilot:{photos:PILOT.photos.filter(p=>p.id!==id),notes:PILOT.notes}});artAdmin.assets.delete(id).catch(()=>{})}
    catch(err){btn.disabled=false;btn.textContent='Remove';btn.classList.remove('armed');pa.form.hidden=false;paMsg(publishError(err),true)}}
  const na={form:$('#na-form'),fields:$('#na-fields'),status:$('#na-status'),save:$('#na-save')};
  const naMsg=(t,err)=>{na.status.textContent=t;na.status.classList.toggle('err',!!err)};
  na.fields.innerHTML=REFLECT_QS.map(([k,qq])=>`<div class="field"><label for="na-${k}">${esc(qq)}</label><textarea id="na-${k}" data-note="${k}" rows="4" maxlength="2400"></textarea></div>`).join('');
  $('#na-open').addEventListener('click',()=>{$$('[data-note]',na.fields).forEach(t=>{t.value=PILOT.notes[t.dataset.note]||''});na.form.hidden=false;$('#na-open').hidden=true;$('[data-note]',na.fields).focus()});
  $('#na-cancel').addEventListener('click',()=>{na.form.hidden=true;$('#na-open').hidden=false;naMsg('')});
  na.form.addEventListener('submit',async e=>{e.preventDefault();const notes={};$$('[data-note]',na.fields).forEach(t=>{const v=t.value.trim();if(v)notes[t.dataset.note]=v});
    na.save.disabled=true;naMsg('Publishing to the site…');
    try{await publishData({pilot:{photos:PILOT.photos,notes}});naMsg('Published. The page is reloading with your reflections.')}
    catch(err){na.save.disabled=false;naMsg(publishError(err),true)}});

  return {
    onShow(view,sec,initial){
      if(view==='play-inquiry'){if(!sec)heroIntro(initial?.2:.62);else{requestAnimationFrame(()=>scrollToId(sec,false));
        if(initial&&document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>{if(current===Object.keys(PI_SECTIONS).find(k=>PI_SECTIONS[k]===sec))scrollToId(sec,false)})}}
      if(LOOP_HEADS[view])loopIntro(LOOP_HEADS[view],initial?.2:.62);
      requestAnimationFrame(()=>armDraw($(`.view[data-view="${view}"]`)));
      spyGroups.forEach(update);
    },
    scrollTo:scrollToId,
    setInterest:k=>{const [f,v]=k.includes(':')?k.split(':'):['sessions',LEGACY[k]||k];if(Forms[f])Forms[f].set(v)},
    ownerReady(){owner=true;$('#pilot-admin').hidden=false;$('#notes-admin').hidden=false;$('#next-admin').hidden=false;renderPilot()}
  };
})();
