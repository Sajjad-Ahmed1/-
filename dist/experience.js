(() => {
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  const toggle=document.querySelector('.motion-toggle');
  const cinema=document.querySelector('.cinema');
  const frame=document.querySelector('.cinema-frame');
  const progress=document.querySelector('.reading-progress');
  const album=document.querySelector('.album');
  const moments=document.querySelector('.moments');
  const albumPhotos=album?[...album.querySelectorAll('.album-photo')]:[];
  let pointerX=0,pointerY=0;
  let paused=reduce.matches, queued=false;
  function setAlbumMotion(spread=0){
    if(!albumPhotos.length)return;
    const values=[
      {x:-spread-pointerX*5,y:pointerY*3,r:-pointerX*.35},
      {x:pointerX*3,y:pointerY*4,r:pointerX*.2},
      {x:spread+pointerX*6,y:-pointerY*3,r:pointerX*.4}
    ];
    albumPhotos.forEach((photo,index)=>{
      const value=values[index]||values[1];
      photo.style.setProperty('--motion-x',value.x.toFixed(2)+'px');
      photo.style.setProperty('--motion-y',value.y.toFixed(2)+'px');
      photo.style.setProperty('--motion-rotation',value.r.toFixed(2)+'deg');
    });
  }
  function update(){
    queued=false;
    const max=document.documentElement.scrollHeight-innerHeight;
    progress.style.transform=`scaleX(${max>0?scrollY/max:0})`;
    if(paused||innerWidth<=760){setAlbumMotion(0);return;}
    if(album){
      const albumRect=album.getBoundingClientRect();
      const albumProgress=Math.min(1,Math.max(0,(innerHeight-albumRect.top)/(innerHeight+albumRect.height)));
      setAlbumMotion(Math.max(0,(albumProgress-.28)*18));
    }
    const rect=cinema.getBoundingClientRect();
    const p=Math.min(1,Math.max(0,(innerHeight*.3-rect.top)/(rect.height-innerHeight*.5)));
    frame.style.setProperty('--film-scale',String(.96+p*.04));
    frame.style.setProperty('--film-angle',String(-2+p*2)+'deg');
  }
  function schedule(){if(!queued){queued=true;requestAnimationFrame(update)}}
  function state(){document.documentElement.classList.toggle('motion-paused',paused);toggle.setAttribute('aria-pressed',String(paused));toggle.textContent=paused?'تشغيل الحركة ▷':'إيقاف الحركة Ⅱ';toggle.title=paused?'تشغيل الحركة':'إيقاف الحركة';schedule()}
  toggle.addEventListener('click',()=>{paused=!paused;state()});
  reduce.addEventListener('change',()=>{paused=reduce.matches;state()});
  addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);
  if(album){
    requestAnimationFrame(()=>requestAnimationFrame(()=>album.classList.add('album-ready')));
    album.addEventListener('pointermove',event=>{
      if(paused||innerWidth<=760)return;
      const rect=album.getBoundingClientRect();
      pointerX=((event.clientX-rect.left)/rect.width-.5)*2;
      pointerY=((event.clientY-rect.top)/rect.height-.5)*2;
      schedule();
    },{passive:true});
    album.addEventListener('pointerleave',()=>{pointerX=0;pointerY=0;schedule()},{passive:true});
  }
  if(moments&&'IntersectionObserver' in window){
    const momentsObserver=new IntersectionObserver(entries=>{
      for(const entry of entries){
        if(entry.isIntersecting){moments.classList.add('moments-visible');momentsObserver.disconnect();break;}
      }
    },{threshold:.12});
    momentsObserver.observe(moments);
  }
  const river=document.querySelector('#river-image');
  if(river){
    river.addEventListener('error',()=>{
      river.src='assets/intro.webp';
      river.alt='لقطة من الفيديو التعريفي بالبازار على كورنيش العمارة';
      river.closest('figure').classList.add('river-fallback');
      document.querySelector('#river-credit').textContent='من الفيديو التعريفي ببازار ميسان';
    },{once:true});
    if(river.complete&&river.naturalWidth===0)river.dispatchEvent(new Event('error'));
  }
  toggle.addEventListener('click',()=>{
    if(paused)document.querySelectorAll('.project-card').forEach(card=>card.getAnimations().forEach(animation=>animation.cancel()));
  });
  state();
})();
