const nav=document.querySelector('header nav');
const menu=document.querySelector('.menu-toggle');
menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'إغلاق القائمة':'فتح القائمة');menu.textContent=open?'×':'☰'});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','فتح القائمة');menu.textContent='☰'}));
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
 const cards=[...document.querySelectorAll('[data-category]')];
 const before=new Map(cards.filter(c=>!c.hidden).map(c=>[c,c.getBoundingClientRect()]));
 document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button))});
 cards.forEach(card=>card.hidden=button.dataset.filter!=='all'&&card.dataset.category!==button.dataset.filter);
 if(matchMedia('(prefers-reduced-motion: reduce)').matches||document.documentElement.classList.contains('motion-paused'))return;
 cards.filter(c=>!c.hidden).forEach((card,i)=>{
   card.getAnimations().forEach(animation=>animation.cancel());
   const from=before.get(card),to=card.getBoundingClientRect();
   card.animate(from?[{transform:'translate('+ (from.left-to.left)+'px,'+(from.top-to.top)+'px)'},{transform:'translate(0,0)'}]:[{opacity:0,transform:'translateY(16px)'},{opacity:1,transform:'translateY(0)'}],{duration:450,delay:from?0:i*45,easing:'cubic-bezier(.22,1,.36,1)'});
 });
}));
const projects={haider:{name:'حيدر الرسام',image:'haider',description:'رسام تشكيلي يشارك في البازار بالرسم على الوجوه واللوحات المصغرة. ألوان تتحول إلى تجربة يتذكرها الصغار بابتسامة.',video:'art'},sarai:{name:'مكتبة السراي',image:'sarai',description:'إحدى مكتبات بازار ميسان الثقافي. تعرّف على المكتبة واكتشف عناوينها عند مشاركتها في فعاليات البازار.'},shanashil:{name:'مكتبة شناشيل',image:'shanashil',description:'من المكتبات التي يجمعها بازار ميسان الثقافي بالقرّاء. مساحة لاكتشاف الكتب والحديث عنها، واللقاء بأهلها.'},tswahn:{name:'مكتبة تسواهن',image:'tswahn',description:'مكتبة مشاركة في حكاية البازار. يمكنك التواصل معها مباشرة للاستفسار عن الكتب والعناوين المتوفرة.',links:[['واتساب المكتبة','https://wa.me/9647515767117'],['حساب إنستغرام','https://www.instagram.com/bookstore.tswahn/']]}};
Object.assign(projects,{
 haider:{name:'حيدر الرسام',image:'haider',description:'حيدر الرسام يضيف الألوان والفرح إلى تجربة الأطفال داخل البازار.',video:'art'},
 sarai:{name:'مكتبة السراي',image:'sarai',description:'مكتبة السراي، مساحة للقرّاء وبداية لحكاية جديدة.',links:[['حساب إنستغرام','https://www.instagram.com/alsaray_library/']]},
 shanashil:{name:'مكتبة شناشيل',image:'shanashil',description:'ميسان، العمارة، قطاع 30، مجاور مطعم الجندول.',links:[['اتصال بالمكتبة','tel:07764445002'],['صفحة المكتبة','https://www.facebook.com/100080801284722/']]},
 tswahn:{name:'مكتبة تسواهن',image:'tswahn',description:'مكتبة محلية تجمع القرّاء حول الكتب والإصدارات.',links:[['اتصال بالمكتبة','https://wa.me/9647515767117'],['حساب إنستغرام','https://www.instagram.com/bookstore.tswahn/']]}
});
const pd=document.querySelector('#project-dialog'),vd=document.querySelector('#video-dialog'),player=vd.querySelector('video');
document.querySelectorAll('[data-project]').forEach(button=>button.addEventListener('click',()=>{const p=projects[button.dataset.project];const content=document.querySelector('#project-content');content.replaceChildren();const img=document.createElement('img');img.src='assets/'+p.image+'.webp';img.alt='شعار '+p.name;const h=document.createElement('h2');h.textContent=p.name;const desc=document.createElement('p');desc.textContent=p.description;content.append(img,h,desc);const actions=document.createElement('div');actions.className='dialog-actions';(p.links||[]).forEach(([label,url])=>{const a=document.createElement('a');a.textContent=label+' ↗';a.href=url;a.target='_blank';a.rel='noopener';a.className='button primary';actions.append(a)});if(p.video){const v=document.createElement('button');v.className='button primary';v.textContent='شاهد حيدر أثناء الرسم ▶';v.addEventListener('click',()=>{pd.close();openVideo(p.video)});actions.append(v)}content.append(actions);pd.showModal();document.body.classList.add('modal-open')}));
let videoRequest=0, videoTimer, activeVideo='intro';
const videoStatus=document.querySelector('#video-status');
const videoRetry=document.querySelector('#video-retry');
const videoDirect=document.querySelector('#video-direct');
function reportVideo(message,retry=false){
 videoStatus.textContent=message;
 videoRetry.hidden=!retry;
}
function startPlayback(){
 const request=videoRequest;
 const play=player.play();
 if(play)play.catch(async error=>{
  if(request!==videoRequest||!vd.open||error.name==='AbortError')return;
  if(error.name==='NotAllowedError'){
   player.muted=true;
   try{await player.play();reportVideo('الفيديو يعمل بدون صوت؛ فعّل الصوت من أزرار المشغّل.');return;}catch{}
  }
  reportVideo('اضغط إعادة المحاولة أو زر التشغيل داخل الفيديو.',true);
 });
}
function openVideo(key){
 activeVideo=key==='art'?'art':'intro';
 ++videoRequest;
 clearTimeout(videoTimer);
 player.pause();
 player.poster='assets/'+(activeVideo==='art'?'artist':'intro')+'.webp';
 document.querySelector('#video-title').textContent=activeVideo==='art'?'ألوان من البازار':'حكاية بازار ميسان الثقافي';
 player.src=new URL('assets/'+(activeVideo==='art'?'art-play':'welcome-play')+'.mp4?v=16',document.baseURI).href;
 videoDirect.href=player.src;
 reportVideo('جاري تحميل الفيديو…');
 if(!vd.open)vd.showModal();
 document.body.classList.add('modal-open');
 player.load();
 startPlayback();
 videoTimer=setTimeout(()=>{
  if(vd.open&&player.readyState<3)reportVideo('التحميل أخذ وقت أطول؛ تگدر تعيد المحاولة أو تفتح الفيديو مباشرة.',true);
 },12000);
}
player.addEventListener('playing',()=>{clearTimeout(videoTimer);reportVideo('')});
player.addEventListener('error',()=>{
 if(!vd.open||!player.hasAttribute('src'))return;
 clearTimeout(videoTimer);
 reportVideo('تعذّر تحميل الفيديو. جرّب إعادة المحاولة أو فتحه مباشرة.',true);
});
videoRetry.addEventListener('click',()=>openVideo(activeVideo));
document.querySelectorAll('[data-video]').forEach(b=>b.addEventListener('click',()=>openVideo(b.dataset.video)));
[pd,vd].forEach(dialog=>{dialog.querySelector('.close-dialog').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close()}});dialog.addEventListener('close',()=>{if(dialog===vd){videoRequest++;player.pause();player.removeAttribute('src');player.load();clearTimeout(videoTimer);reportVideo('')}if(!pd.open&&!vd.open)document.body.classList.remove('modal-open')})});
if('IntersectionObserver' in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('js-motion');const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.08});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el))}

