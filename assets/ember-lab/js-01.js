(function activate(name){
  if(name==='home'){
    const chapters=[...document.querySelectorAll('main .page')];
    const progress=document.createElement('div');
    progress.className='ember-progress';
    progress.setAttribute('aria-hidden','true');
    document.body.prepend(progress);
    for(const chapter of chapters){
      chapter.classList.add('motion-chapter');
      const layers=document.createElement('div');
      layers.className='motion-plane';
      layers.setAttribute('aria-hidden','true');
      chapter.prepend(layers);
      const line=document.createElement('div');
      line.className='chapter-line';
      line.setAttribute('aria-hidden','true');
      chapter.prepend(line);
      if(chapter.id!=='start'){
        const cue=document.createElement('span');
        cue.className='chapter-cue';
        cue.textContent=chapter.dataset.chapter;
        cue.setAttribute('aria-hidden','true');
        chapter.prepend(cue);
        chapter.querySelector('.section-head')?.classList.add('motion-heading');
      }
    }
    const shots=[
      ['.project-preview',1,0],['.city-panel',-1,0],
      ['#work .lab',0,1],['.case-summary',1,0],['.fragment',1,0],['.archive-doors',0,1],
    ].flatMap(([selector,x,y])=>[...document.querySelectorAll(selector)].map(element=>{
      element.classList.add('motion-content');
      return {element,x,y,offset:0};
    }));
    const reduced=matchMedia('(prefers-reduced-motion: reduce)');

    const route=document.querySelector('#cityRoute');
    route.setAttribute('pathLength','1');
    const cityMap=route.closest('.city-map');
    const shelf=document.querySelector('.film-shelf');
    const reels=[...shelf.querySelectorAll('.film-art')];
    function updateObservation(){
      if(reduced.matches)return;
      const ease=(from,to,progress)=>{
        const t=Math.max(0,Math.min(1,(progress-from)/(to-from)));
        return t*t*(3-2*t);
      };
      const mapProgress=(innerHeight-cityMap.getBoundingClientRect().top)/(innerHeight*.36);
      cityMap.style.setProperty('--route-offset',1-ease(0,.85,mapProgress));
      cityMap.style.setProperty('--route-end',ease(.65,.9,mapProgress));
      const filmProgress=(innerHeight-shelf.querySelector('.films').getBoundingClientRect().top)/(innerHeight*.43);
      shelf.style.setProperty('--projector',ease(0,.27,filmProgress)*(1-ease(.65,1,filmProgress)));
      shelf.style.setProperty('--beam-width',.18+ease(.10,.80,filmProgress)*.82);
      reels.forEach((reel,index)=>{
        const offset=index*.10;
        const open=ease(.10+offset,.66+offset,filmProgress);
        reel.style.setProperty('--shutter',(1-open)*50+'%');
        reel.style.setProperty('--exposure',.58+open*.42);
      });
    }
    let frame;
    function update(){
      frame=undefined;
      const height=innerHeight;
      progress.style.setProperty('--read',scrollY/Math.max(1,document.documentElement.scrollHeight-height));
      for(const chapter of chapters){
        const rect=chapter.getBoundingClientRect();
        const travel=Math.max(-1,Math.min(1,(height*.35-rect.top)/height));
        const distance=innerWidth<=600?55:120;
        chapter.style.setProperty('--near',reduced.matches?'0px':travel*distance+'px');
        chapter.style.setProperty('--far',reduced.matches?'0px':travel*-distance*.55+'px');
        chapter.style.setProperty('--chapter',Math.max(0,Math.min(1,(height*.9-rect.top)/height)));
        const ramp=(start,end,position)=>Math.max(0,Math.min(1,(height*start-position)/(height*(start-end))));
        const architecture=ramp(1,.48,rect.top);
        const heading=ramp(.88,.52,rect.top);
        chapter.style.setProperty('--architecture',architecture);
        chapter.style.setProperty('--aperture',(1-architecture)*46+'%');
        chapter.style.setProperty('--heading-rise',(1-heading)*32+'px');
        chapter.style.setProperty('--heading-opacity',.82+heading*.18);
      }
      for(const shot of shots){
        const {element,x,y}=shot;
        const top=element.getBoundingClientRect().top-(element.querySelector(':focus-visible')?0:shot.offset);
        const progress=Math.max(0,Math.min(1,(height*.97-top)/(height*.42)));
        const remaining=(1-progress)**1.45;
        const distance=innerWidth<=600?54:164;
        shot.offset=reduced.matches?0:remaining*y*(innerWidth<=600?52:100);
        element.style.setProperty('--entry-x',(reduced.matches?0:remaining*x*distance)+'px');
        element.style.setProperty('--entry-y',shot.offset+'px');
        element.style.setProperty('--entry-opacity',.46+progress*.54);
      }
      updateObservation();
    }
    const schedule=()=>{if(frame===undefined)frame=requestAnimationFrame(update)};
    addEventListener('scroll',schedule,{passive:true});
    addEventListener('resize',schedule);
    reduced.addEventListener('change',schedule);
    update();
  }
  if(name==='lab'){
    for(const link of document.querySelectorAll('.directory-card')){
      const row=document.createElement('div');
      row.className='motion-lab-row';
      link.before(row);
      row.append(link);
      const details=document.createElement('details');
      details.name='experiment-preview';
      const summary=document.createElement('summary');
      summary.innerHTML='<span data-zh="展开实验说明" data-en="Preview experiment">展开实验说明</span>';
      const panel=document.createElement('div');
      panel.className='motion-lab-panel';
      const description=link.querySelector('p').cloneNode(true);
      description.removeAttribute('id');
      const open=document.createElement('a');
      open.href=link.href;
      open.innerHTML='<span data-zh="打开实验 ↗" data-en="Open experiment ↗">打开实验 ↗</span>';
      panel.append(description,open);
      details.append(summary,panel);
      row.append(details);
    }
  }
  for(const link of document.querySelectorAll('a[href]')){
    const href=link.getAttribute('href');
    if(href==='#'||href.startsWith('#')||href.startsWith('mailto:'))continue;
    if(href==='spaces/'||/^(https:\/\/(www\.|home\.)?mariustang\.com)?\/spaces\/?$/.test(href)||name==='spaces'&&href==='./'){
      link.href='https://www.mariustang.com/spaces/';
    }else if(/^https:\/\/lab\.mariustang\.com\/?$/.test(href)||name==='lab'&&href==='/'){
      link.href='https://lab.mariustang.com/';
    }else if(/^https:\/\/(www\.|home\.)?mariustang\.com\/?$/.test(href)){
      link.href='https://www.mariustang.com/';
    }else if(name==='spaces'&&href.startsWith('../index.html')){
      link.href=href.replace('../index.html','https://www.mariustang.com/');
    }else if(name==='lab'&&href.startsWith('/about/')){
      link.href=href;
    }
  }
})("lab");
