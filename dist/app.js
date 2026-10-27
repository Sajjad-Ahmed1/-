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
const pd=document.querySelector('#project-dialog'),vd=document.querySelector('#video-dialog'),player=vd.querySelector('video');
document.querySelectorAll('[data-project]').forEach(button=>button.addEventListener('click',()=>{const p=projects[button.dataset.project];const content=document.querySelector('#project-content');content.replaceChildren();const img=document.createElement('img');img.src='assets/'+p.image+'.webp';img.alt='شعار '+p.name;const h=document.createElement('h2');h.textContent=p.name;const desc=document.createElement('p');desc.textContent=p.description;content.append(img,h,desc);const actions=document.createElement('div');actions.className='dialog-actions';(p.links||[]).forEach(([label,url])=>{const a=document.createElement('a');a.textContent=label+' ↗';a.href=url;a.target='_blank';a.rel='noopener';a.className='button primary';actions.append(a)});if(p.video){const v=document.createElement('button');v.className='button primary';v.textContent='شاهد حيدر أثناء الرسم ▶';v.addEventListener('click',()=>{pd.close();openVideo(p.video)});actions.append(v)}content.append(actions);pd.showModal();document.body.classList.add('modal-open')}));
let videoUrl,videoRequest=0;
async function openVideo(key){
 const request=++videoRequest;
 player.poster='assets/'+(key==='art'?'artist':'intro')+'.webp';
 document.querySelector('#video-title').textContent=key==='art'?'ألوان من البازار':'حكاية بازار ميسان الثقافي';
 vd.showModal();document.body.classList.add('modal-open');
 if(videoUrl){URL.revokeObjectURL(videoUrl);videoUrl=undefined}
 if(key==='intro'){
  try{
   const chunkPaths=[];
   for(let i=0;i<63;i++){
    if(i===0||i===57||i===58)for(let j=0;j<5;j++)chunkPaths.push('assets/intro/chunk'+String(i).padStart(2,'0')+'_'+j+'.bin');
    else chunkPaths.push('assets/intro/chunk'+String(i).padStart(2,'0')+'.bin');
   }
   const pieces=await Promise.all(chunkPaths.map(async path=>{
    const response=await fetch(path);
    if(!response.ok)throw new Error('Video part missing');
    return response.arrayBuffer();
   }));
   if(request!==videoRequest||!vd.open)return;
   videoUrl=URL.createObjectURL(new Blob(pieces,{type:'video/mp4'}));
   player.src=videoUrl;
  }catch(error){if(request===videoRequest)document.querySelector('#video-title').textContent='تعذّر تحميل الفيديو، حاول مرة ثانية';return}
 }else player.src='assets/art.mp4';
 player.play().catch(()=>{});
}
document.querySelectorAll('[data-video]').forEach(b=>b.addEventListener('click',()=>openVideo(b.dataset.video)));
[pd,vd].forEach(dialog=>{dialog.querySelector('.close-dialog').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close()}});dialog.addEventListener('close',()=>{if(dialog===vd){videoRequest++;player.pause();player.removeAttribute('src');player.load();if(videoUrl){URL.revokeObjectURL(videoUrl);videoUrl=undefined}}if(!pd.open&&!vd.open)document.body.classList.remove('modal-open')})});
if('IntersectionObserver' in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('js-motion');const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.08});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el))}

