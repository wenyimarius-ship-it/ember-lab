import { createThreadPath, progressAtY, arcDash } from './thread.mjs';
import { isBrowsing, canAnimateArtwork, nodeLight } from './motion.mjs';

(() => {
  'use strict';
  const translations = {
    skip:['跳到作品','Skip to experiments'],all:['所有作品','All experiments'],motion:['动效','Motion'],eyebrow:['灵感实验室','A LAB FOR CURIOSITY'],intro:['四个想法，四个网页实验。','Four ideas. Four web experiments.'],scroll:['向下浏览四件作品','Scroll through the four experiments'],playable:['可以体验','READY TO EXPLORE'],play:['进入体验','Explore'],story:["查看更新记录", "View update records"],demo:["起点日期未记录。以下仅记录 Lab 的接入与页面更新。", "The original creation date is not recorded. These entries cover Lab links and page updates only."],cinemaDescription:['回答三个故事问题，获得一部电影推荐。','Answer three questions about stories. Get a film recommendation.'],cityDescription:['比较两条示意路线，记录自己的路线。','Compare two illustrated routes. Record your own.'],puzzleDescription:['写下想法，拖拽分组，选出下一步。','Write ideas, drag them into groups, and choose a next step.'],cultureDescription:['创作文化短帖，核对语境，收集反馈。','Draft cultural posts, review context, and gather feedback.'],closing:['选择作品，\n进入体验。','Choose an experiment.\nTry it yourself.'],back:['返回页面顶部','Back to top'],previewNote:["更新记录来自仓库 · 作品按浏览顺序排列", "Updates are sourced from the repository; projects are in browsing order"],home:['Ember 主站','Ember Home'],directoryIntro:['选择作品，查看介绍并进入体验。','Choose an experiment to read about it and try it.'],directoryFoot:['四个作品分别在独立网页中体验。','Each experiment opens its own website.']
  };
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  Object.assign(translations, {
    notes:['作品介绍','Project notes'],notesLink:['查看完整作品介绍 ↗','Read the full project notes ↗'],
    labelCinema:['电影推荐','Films'],labelCity:['城市路线','Routes'],labelPuzzle:['想法拼图','Ideas'],labelCulture:['文化桥','Culture'],
    categoryCinema:['故事偏好与电影推荐','Story preferences & film recommendations'],categoryCity:['路线对照与观察记录','Route comparison & observation notes'],categoryPuzzle:['想法卡片与分组','Idea cards & grouping'],categoryCulture:['文化短帖创作与反馈','Cultural posts & reader feedback']
  });
  Object.assign(translations, {
    historyJoinedCinema:["Lab 加入 Cinema 的正式体验入口。", "Lab added the production entry for Cinema."],
    historyJoinedCity:["Lab 加入 City Observation Desk 的正式体验入口。", "Lab added the production entry for City Observation Desk."],
    historyJoinedPuzzle:["Lab 接入已确认的 Idea Puzzle 正式体验入口。", "Lab connected the confirmed production entry for Idea Puzzle."],
    historyJoinedCulture:["Lab 接入已有的 CultureBridge 原型，保留 Streamlit 体验地址。", "Lab connected the existing CultureBridge prototype at its Streamlit address."],
    historyFlow:["Lab 首页改为弧光串联四件作品，停稳后当前图案轻微变化。这次更新属于 Lab 聚合页。", "The Lab homepage began linking four experiments with a soft arc, with subtle motion on the active artwork after scrolling settles. This was a Lab overview update."],
    historyCinemaCopy:["新版 Lab 首页整合“关于故事的问题”文案，与实际题意保持一致；电影推荐流程未改。", "The new Lab homepage incorporated wording about story questions to match the actual questions. The film recommendation flow was unchanged."],
    historySource:["查看源码记录", "View source record"],
    historyPending:["待验证 · 尚未完成", "To validate · not completed"],
    historyPendingCinema:["继续核对入口文案与实际题意是否一致。", "Continue checking that entry copy matches the actual questions."],
    historyPendingCity:["在真实手机上检查路线绘制与返回入口。", "Check route drawing and return navigation on a real phone."],
    historyPendingPuzzle:["邀请使用者试试分组与选择下一步是否清楚。", "Invite users to assess whether grouping and choosing a next step are clear."],
    historyPendingCulture:["核对文化语境，并确认反馈数据的持久化方式。", "Review the cultural context and verify how feedback is persisted."]
  });
  let paused = reduced.matches;
  let english = new URLSearchParams(location.search).get('lang') === 'en';
  const motion = document.querySelector('#motion');
  const language = document.querySelector('#language');
  const directory = document.querySelector('#directory');
  const chapters = [...document.querySelectorAll('.chapter')];
  const progressLinks = [...document.querySelectorAll('.progress a')];
  const progress = document.querySelector('.progress');
  const chapterList = document.querySelector('.chapters');
  const thread = document.querySelector('.thread');
  const basePath = thread.querySelector('.thread-back');
  const lightPaths = [...thread.querySelectorAll('.thread-light, .thread-glow, .thread-haze')];
  const arcColor = thread.querySelector('#arc-color');
  const heads = [...thread.querySelectorAll('.thread-head, .thread-head-halo')];
  const nodeGroup = thread.querySelector('.thread-nodes');
  let threadLength = 0, arcTarget = 0, arcPosition = 0;
  let lastScrollAt = -Infinity, activeArtwork = 0, artworkInFocus = true;
  const threadNodes = [];

  function updateArtworkLight() {
    threadNodes.forEach((node, i) => {
      const brightness = nodeLight((arcPosition - node.progress) * threadLength, !paused && artworkInFocus);
      chapters[i].style.setProperty('--art-light', brightness.toFixed(3));
    });
  }

  function syncArcTarget() {
    if (!threadLength) return;
    arcTarget = progressAtY(basePath, innerHeight * .52 - chapterList.getBoundingClientRect().top);
  }
  function renderArc(immediate = false) {
    if (!threadLength) return;
    arcPosition = immediate || paused ? arcTarget : arcPosition + (arcTarget - arcPosition) * .16;
    if (Math.abs(arcTarget - arcPosition) < .00005) arcPosition = arcTarget;
    const dash = arcDash(arcPosition);
    lightPaths.forEach(path => { path.style.strokeDasharray = dash.array; path.style.strokeDashoffset = dash.offset; });
    const point = basePath.getPointAtLength(arcPosition * threadLength);
    const tail = basePath.getPointAtLength(Math.max(0, arcPosition - .048) * threadLength);
    arcColor.setAttribute('x1', tail.x); arcColor.setAttribute('y1', tail.y);
    arcColor.setAttribute('x2', point.x); arcColor.setAttribute('y2', Math.max(tail.y + 1, point.y));
    heads.forEach(head => { head.setAttribute('cx', point.x); head.setAttribute('cy', point.y); });
    threadNodes.forEach(node => node.element.classList.toggle('is-reached', arcPosition >= node.progress - .008));
    updateArtworkLight();
    thread.dataset.progress = arcPosition.toFixed(5);
  }
  function rebuildThread() {
    const bounds = chapterList.getBoundingClientRect();
    const width = bounds.width, mobile = width <= 700;
    const anchors = chapters.map(section => {
      const art = section.querySelector('.art').getBoundingClientRect();
      return { x: mobile ? width * .12 : Math.max(width * .52, Math.min(width * .83, art.left - bounds.left + art.width * .2)), y: art.top - bounds.top + art.height * .46 };
    });
    thread.setAttribute('viewBox', `0 0 ${width} ${bounds.height}`);
    const { d } = createThreadPath(anchors, width, mobile);
    [basePath, ...lightPaths].forEach(path => path.setAttribute('d', d));
    threadLength = basePath.getTotalLength();
    nodeGroup.replaceChildren();
    threadNodes.length = 0;
    anchors.forEach((anchor, i) => {
      const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      group.style.setProperty('--node-color', chapters[i].dataset.color);
      group.setAttribute('class', 'thread-node');
      group.classList.toggle('is-active', chapters[i].classList.contains('is-active'));
      [9, 3].forEach((radius, n) => {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', anchor.x); circle.setAttribute('cy', anchor.y); circle.setAttribute('r', radius);
        circle.setAttribute('class', n ? 'node-core' : 'node-ring'); group.append(circle);
      });
      nodeGroup.append(group);
      threadNodes.push({ element: group, progress: progressAtY(basePath, anchor.y) });
    });
    syncArcTarget();
    renderArc(true);
  }

  function setLanguage() {
    document.documentElement.lang = english ? 'en' : 'zh-CN';
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const entry = translations[el.dataset.i18n];
      if (entry) {
        el.textContent = entry[english ? 1 : 0];
        if (el.dataset.i18n === 'closing') el.style.whiteSpace = 'pre-line';
      }
    });
    document.querySelectorAll('[data-notes]').forEach(link => link.setAttribute('href', english ? '/about/?lang=en' : '/about/'));
    language.textContent = english ? '中' : 'EN';
    language.setAttribute('aria-label', english ? '切换为中文' : 'Switch to English');
    document.querySelector('#close-directory').setAttribute('aria-label', english ? 'Close experiments' : '关闭作品目录');
    const labels = ['labelCinema','labelCity','labelPuzzle','labelCulture'];
    const names = ['Cinema Experiment','City Observation Desk','Idea Puzzle','CultureBridge'];
    progressLinks.forEach((link,i) => link.setAttribute('aria-label', `${translations[labels[i]][english?1:0]} — ${names[i]}`));
    document.title = english ? 'Ember Lab · Four web experiments' : 'Ember Lab · 四个网页实验';
    updateMotion();
  }
  function updateMotion() {
    document.body.classList.toggle('paused', paused);
    motion.setAttribute('aria-pressed', String(paused));
    motion.setAttribute('aria-label', english ? (paused ? 'Resume motion' : 'Pause motion') : (paused ? '播放动效' : '暂停动效'));
    motion.querySelector('.motion-icon').textContent = paused ? '▷' : 'Ⅱ';
    motion.querySelector('.motion-label').textContent = english ? (paused ? 'Resume' : 'Motion') : (paused ? '播放' : '动效');
    updateArtworkLight();
  }
  language.addEventListener('click', () => { english = !english; setLanguage(); const url = new URL(location.href); english ? url.searchParams.set('lang', 'en') : url.searchParams.delete('lang'); history.replaceState(null, '', url); });
  motion.addEventListener('click', () => { paused = !paused; updateMotion(); });
  reduced.addEventListener('change', e => { paused = e.matches; updateMotion(); });
  function openDirectory() { directory.showModal(); document.body.classList.add('modal-open'); }
  document.querySelector('#open-directory').addEventListener('click', openDirectory);
  document.querySelectorAll('[data-open-directory]').forEach(button => button.addEventListener('click', openDirectory));
  document.querySelector('#close-directory').addEventListener('click', () => directory.close());
  directory.addEventListener('keydown', event => {
    if(event.key !== 'Tab')return;
    const targets=[...directory.querySelectorAll('button, a[href]')];
    const first=targets[0],last=targets.at(-1);
    if(event.shiftKey && document.activeElement === first){event.preventDefault();last.focus();}
    else if(!event.shiftKey && document.activeElement === last){event.preventDefault();first.focus();}
  });
  directory.addEventListener('close', () => document.body.classList.remove('modal-open'));
  directory.addEventListener('click', e => { if (e.target === directory) { const r = directory.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) directory.close(); } });
  document.querySelectorAll('[data-jump]').forEach(link => link.addEventListener('click', () => { directory.close(); const section = document.querySelector(link.getAttribute('href')); section.setAttribute('tabindex', '-1'); setTimeout(() => section.focus({preventScroll:true}), 80); }));
  setLanguage();

  let scheduled = false;
  function updateChapter() {
    scheduled = false;
    const middle = innerHeight * .5;
    let active = 0, distance = Infinity;
    chapters.forEach((section, i) => {
      const rect = section.getBoundingClientRect();
      const d = Math.abs(rect.top + Math.min(rect.height, innerHeight) * .5 - middle);
      if (d < distance) { distance = d; active = i; }
    });
    chapters.forEach((section, i) => section.classList.toggle('is-active', active === i));
    activeArtwork = active;
    threadNodes.forEach((node, i) => node.element.classList.toggle('is-active', active === i));
    progressLinks.forEach((link, i) => { link.classList.toggle('active', active === i); active === i ? link.setAttribute('aria-current', 'true') : link.removeAttribute('aria-current'); });
    document.documentElement.style.setProperty('--accent', chapters[active].dataset.color);
    artworkInFocus = document.querySelector('.closing').getBoundingClientRect().top >= innerHeight * .5;
    progress.classList.toggle('is-hidden', !artworkInFocus);
    syncArcTarget();
    if (paused) renderArc(true);
  }
  addEventListener('scroll', () => { lastScrollAt=performance.now();if (!scheduled) { scheduled = true; requestAnimationFrame(updateChapter); } }, {passive:true});
  addEventListener('resize', updateChapter);
  new ResizeObserver(rebuildThread).observe(chapterList);
  rebuildThread();
  updateChapter();

  // Each sculpture is drawn from original parametric geometry. No external assets.
  const TAU = Math.PI * 2;
  const vec = (x,y,z) => ({x,y,z});
  const lerp = (a,b,t) => a + (b-a)*t;
  function rotate(p, ay, ax, az) {
    let x=p.x*Math.cos(ay)+p.z*Math.sin(ay), z=-p.x*Math.sin(ay)+p.z*Math.cos(ay);
    const y=p.y*Math.cos(ax)-z*Math.sin(ax); z=p.y*Math.sin(ax)+z*Math.cos(ax);
    return vec(x*Math.cos(az)-y*Math.sin(az), x*Math.sin(az)+y*Math.cos(az), z);
  }
  function hex(value, alpha) { const h=value.replace('#',''); return `rgba(${parseInt(h.slice(0,2),16)},${parseInt(h.slice(2,4),16)},${parseInt(h.slice(4,6),16)},${alpha})`; }
  function blendColor(a,b,weight) { return '#' + [1,3,5].map(i=>Math.round(lerp(parseInt(a.slice(i,i+2),16),parseInt(b.slice(i,i+2),16),weight)).toString(16).padStart(2,'0')).join(''); }
  class Sculpture {
    constructor(section) {
      this.section=section; this.canvas=section.querySelector('canvas'); this.ctx=this.canvas.getContext('2d'); this.type=section.dataset.art; this.color=section.dataset.color; this.time=0; this.visible=false; this.width=0; this.height=0; this.pointer={x:0,y:0}; this.target={x:0,y:0}; this.frame=0;
      this.phase = {cinema:0,city:1.4,puzzle:2.8,culture:4.2}[this.type];
      if (!this.ctx) return;
      new ResizeObserver(() => this.resize()).observe(this.canvas.parentElement);
      const observer=new IntersectionObserver(entries=>{this.visible=entries[0].isIntersecting; if(this.visible) this.draw();},{rootMargin:'180px'}); observer.observe(this.canvas);
      section.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;const r=this.canvas.getBoundingClientRect();this.target.x=Math.max(-1,Math.min(1,(e.clientX-r.left)/r.width*2-1));this.target.y=Math.max(-1,Math.min(1,(e.clientY-r.top)/r.height*2-1));},{passive:true});
      section.addEventListener('pointerleave',()=>{this.target.x=0;this.target.y=0;});
      this.resize();
    }
    resize() { const r=this.canvas.parentElement.getBoundingClientRect();this.width=r.width;this.height=r.height;const ratio=Math.min(devicePixelRatio||1,1.8);this.canvas.width=Math.round(r.width*ratio);this.canvas.height=Math.round(r.height*ratio);this.ctx.setTransform(ratio,0,0,ratio,0,0);this.scale=Math.min(this.width/650,this.height/560);this.draw(); }
    project(p) { const depth=840/(840+p.z);return {x:this.width*.51+p.x*this.scale*depth,y:this.height*.46+p.y*this.scale*depth}; }
    stroke(points,color,alpha,width=1,close=false) { const ctx=this.ctx;ctx.beginPath();points.forEach((p,i)=>{const q=this.project(p);i?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y);});if(close)ctx.closePath();ctx.strokeStyle=hex(color,alpha);ctx.lineWidth=width;ctx.stroke(); }
    fill(points,color,alpha) {const ctx=this.ctx;ctx.beginPath();points.forEach((p,i)=>{const q=this.project(p);i?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y)});ctx.closePath();ctx.fillStyle=hex(color,alpha);ctx.fill();}
    glow(p,color,size=4) { const q=this.project(p),ctx=this.ctx;const g=ctx.createRadialGradient(q.x,q.y,0,q.x,q.y,size*6);g.addColorStop(0,hex(color,.65));g.addColorStop(.12,hex(color,.23));g.addColorStop(1,hex(color,0));ctx.fillStyle=g;ctx.beginPath();ctx.arc(q.x,q.y,size*6,0,TAU);ctx.fill();ctx.fillStyle=hex(color,.95);ctx.beginPath();ctx.arc(q.x,q.y,size*.65,0,TAU);ctx.fill(); }
    filmFrames() {
      const t = this.time * .55;
      const surface = (u,v) => rotate(vec(u*265, Math.sin(u*2.2+t*.18)*64+v*86, Math.sin(u*1.6+t*.12)*46+v*24), -.22+this.pointer.x*.08, -.16+this.pointer.y*.06, -.24);
      const edge = (u1,u2,v,n=65) => Array.from({length:n+1},(_,i)=>surface(lerp(u1,u2,i/n),v));
      const box = (u1,u2,v1,v2) => [...edge(u1,u2,v1),...edge(u2,u1,v2)];
      this.fill(box(-1,1,-1,1), '#c3b1ff', .025);
      [-1,-.77,.77,1].forEach(v=>this.stroke(edge(-1,1,v),v<0?'#c3b1ff':this.color,.42,.9));
      [-1,1].forEach(u=>this.stroke([surface(u,-1),surface(u,1)],this.color,.4,.8));
      for (let i=0;i<19;i++) {
        const u=-.93+i*.103;
        [-.89,.89].forEach(v=>{ const hole=box(u-.023,u+.023,v-.045,v+.045);this.fill(hole,'#dfddf2',.22);this.stroke(hole,'#c3b1ff',.36,.6,true); });
      }
      [[-.92,-.35],[-.285,.285],[.35,.92]].forEach(([left,right],i)=>{
        const focus = (1 + Math.cos(t*.32 - i*TAU/3)) * .5;
        const frame=box(left,right,-.65,.65), color=blendColor('#c3b1ff',this.color,focus*.65);
        this.fill(frame,color,.018+focus*.014);
        this.stroke(frame,color,.32+focus*.18,1,true);
        // Original geometric light within each empty frame; no film imagery.
        for(let j=0;j<6;j++) {
          const pts=[];
          for(let k=0;k<=35;k++){const u=lerp(left+.035,right-.035,k/35);const v=Math.sin(k/35*Math.PI+j*.35+t*.18)*.18+(j-2.5)*.095;pts.push(surface(u,v));}
          this.stroke(pts,color,.07+focus*.055,.65);
        }
      });
      const light=[];for(let i=0;i<=100;i++)light.push(surface(i/100*2-1,Math.sin(i/100*Math.PI+t*.2)*.08));
      this.stroke(light,this.color,.34,.8);
      this.glow(surface(Math.sin(t*.2)*.85,0),this.color,3.5);
    }
    terrain() {
      const t=this.time;
      for(let line=0;line<50;line++){
        const v=(line/49*2-1);const points=[];
        for(let i=0;i<=100;i++){
          const u=i/100*2-1;const x=u*270,z=v*190;
          const hill=Math.exp(-Math.pow((u+.2)*1.7,2)-Math.pow((v+.1)*1.6,2))*120;
          const y=-hill+Math.sin(u*4+v*2+t*.18)*12+52;
          points.push(rotate(vec(x,y,z),-.22+this.pointer.x*.09,.43+this.pointer.y*.07,-.17));
        }
        this.stroke(points,line%8===0?'#e5dfff':this.color,line%8===0?.32:.095,line%8===0?1:.65);
      }
      const route=[];
      for(let i=0;i<=120;i++){const u=i/120*2-1,v=Math.sin(u*3+t*.13)*.55;const x=u*270,z=v*190,y=-Math.exp(-Math.pow((u+.2)*1.7,2)-Math.pow((v+.1)*1.6,2))*120+Math.sin(u*4+v*2+t*.18)*12+51;route.push(rotate(vec(x,y,z),-.22+this.pointer.x*.09,.43+this.pointer.y*.07,-.17));}
      this.stroke(route,'#e3d8ff',.8,1.3);
      const cursor=(Math.sin(t*.16)*.44+.5)*120, index=Math.floor(cursor), amount=cursor-index;
      const a=route[index],b=route[Math.min(index+1,120)];
      this.glow(vec(lerp(a.x,b.x,amount),lerp(a.y,b.y,amount),lerp(a.z,b.z,amount)),'#d9ccff',4);
    }
    fragments() {
      const t=this.time;
      const pieces=[[-155,-75,20,80],[20,-105,-40,64],[160,-30,40,70],[-90,85,-20,65],[80,95,60,90],[4,0,0,50]];
      const centers=[];
      pieces.forEach((a,index)=>{
        const gather=1+Math.sin(t*.20)*.025;
        const shift=Math.sin(t*.22+index)*7;const center=vec(a[0]*gather+Math.cos(t*.13+index)*6,a[1]*gather+shift,a[2]);centers.push(rotate(center,-.25+this.pointer.x*.09,.12+this.pointer.y*.07,-.14));
        const s=a[3];const angle=Math.sin(t*.15+index)*.065;
        const corners=[[-s,-s],[s,-s],[s,s],[-s,s]].map(p=>rotate(vec(p[0]*.58,p[1]*.58,0),angle,.1,angle));
        const front=corners.map(p=>rotate(vec(center.x+p.x,center.y+p.y,center.z+p.z),-.25+this.pointer.x*.09,.12+this.pointer.y*.07,-.14));
        const back=corners.map(p=>rotate(vec(center.x+p.x+12,center.y+p.y-12,center.z+p.z+35),-.25+this.pointer.x*.09,.12+this.pointer.y*.07,-.14));
        this.fill(front,index%2?this.color:'#c3b1ff',.025);this.stroke(front,index%2?this.color:'#c3b1ff',.55,.8,true);this.stroke(back,this.color,.14,.65,true);
        front.forEach((p,i)=>this.stroke([p,back[i]],this.color,.12,.65));
        for(let l=1;l<7;l++){const u=l/7;this.stroke([vec(lerp(front[0].x,front[3].x,u),lerp(front[0].y,front[3].y,u),front[0].z),vec(lerp(front[1].x,front[2].x,u),lerp(front[1].y,front[2].y,u),front[1].z)],this.color,.05,.5);}
      });
      const ctx=this.ctx;ctx.setLineDash([3,7]);[[0,1],[1,2],[0,3],[3,4],[4,2],[1,5],[5,4]].forEach(([a,b])=>this.stroke([centers[a],centers[b]],this.color,.19,.7));ctx.setLineDash([]);this.glow(centers[5],this.color,3.5);
    }
    bridge() {
      const t=this.time;
      for(let side=0;side<2;side++){
        const color=side?'#c3b1ff':this.color;
        for(let j=0;j<24;j++){
          const pts=[];const tilt=j/24*Math.PI+Math.sin(t*.14+side)*.07;
          for(let i=0;i<=90;i++) {const a=i/90*TAU;const pulse=1+Math.sin(t*.18+side)*.015;const x=(side?102:-102)+Math.cos(a)*115*pulse;const y=Math.sin(a)*145*Math.cos(tilt);const z=Math.sin(a)*145*Math.sin(tilt);pts.push(rotate(vec(x,y,z),-.35+this.pointer.x*.08,.18+this.pointer.y*.07,-.25));}
          this.stroke(pts,color,j%6===0?.22:.055,j%6===0?.9:.5);
        }
      }
      for(let j=0;j<13;j++){const points=[];for(let i=0;i<=70;i++){const u=i/70;points.push(rotate(vec((u*2-1)*112,Math.sin(u*Math.PI*2+t*.27+j*.13)*29+(j-6)*5,Math.cos(u*Math.PI*2+j*.2)*35),-.35+this.pointer.x*.08,.18+this.pointer.y*.07,-.25));}this.stroke(points,j%2?this.color:'#c3b1ff',j===6?.6:.1,.7);}
      this.glow(vec(0,0,0),'#d2e5fd',4);
    }
    draw() {
      if(!this.ctx||!this.width)return;
      this.ctx.clearRect(0,0,this.width,this.height);
      this.pointer.x=lerp(this.pointer.x,this.target.x,.035);this.pointer.y=lerp(this.pointer.y,this.target.y,.035);
      // A few pixels of drift and less than half a degree of tilt, independent of hover.
      const drift=Math.sin(this.time*.48+this.phase)*3*this.scale;
      const tilt=Math.sin(this.time*.21+this.phase)*.007;
      this.ctx.save();
      this.ctx.translate(this.width*.51,this.height*.46+drift);
      this.ctx.rotate(tilt);
      this.ctx.translate(-this.width*.51,-this.height*.46);
      const draw={cinema:'filmFrames',city:'terrain',puzzle:'fragments',culture:'bridge'}[this.type];this[draw]();
      this.ctx.restore();
    }
    tick(delta, activity) {
      if(!canAnimateArtwork({ ...activity, visible:this.visible, paused, hidden:document.hidden }))return;
      this.time+=delta;this.frame++;if(innerWidth<700&&this.frame%2)return;this.draw();
    }
  }
  const sculptures=chapters.map(section=>new Sculpture(section));
  let last=performance.now();
  function animate(now) {
    const delta=Math.min((now-last)/1000,.06);last=now;
    const scrolling=isBrowsing(now,lastScrollAt,arcTarget-arcPosition);
    if(Math.abs(arcTarget-arcPosition)>.00001)renderArc();
    sculptures.forEach((s,i)=>s.tick(delta,{active:i===activeArtwork&&artworkInFocus,scrolling,modalOpen:directory.open}));
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
})();
