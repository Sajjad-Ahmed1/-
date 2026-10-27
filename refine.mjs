import fs from 'node:fs';
const file='dist/index.html';
let html=fs.readFileSync(file,'utf8');
html=html.replace('href="experience.css"','href="experience.css?v=3"');
html=html.replace('src="experience.js"','src="experience.js?v=3"');
html=html.replace('</div></section>\n<div class="category-band"','</div></section>\n<div class="category-band"');
const start=html.indexOf('<section id="story"');
const end=html.indexOf('<section id="projects"',start);
html=html.slice(0,start)+`<section id="story" class="story section-wrap">
<div class="story-copy"><div class="section-label">حكاية البازار</div><h2>على ضفاف دجلة،<br>تزهر حكاياتنا.</h2><p class="lead">نهر يجمع ضفتين.<br>وبازار يجمع أهل المدينة.</p><p>من كورنيش العمارة إلى مساحات ميسان، تلتقي الكتب والفنون والمشاريع المحلية. وراء كل عمل وجه تعرفه، وحكاية تستحق أن تقترب منها.</p><a class="underlined" href="#projects">تعرّف على أهل البازار <span>←</span></a></div>
<figure class="river-photo"><div class="river-image-wrap"><img id="river-image" src="https://www.al-mayar.com/wp-content/uploads/2021/05/upload_1620398130_982553092.jpg" alt="كورنيش دجلة في مدينة العمارة" loading="lazy" referrerpolicy="no-referrer"><span class="river-location">العمارة<br><b>على ضفاف دجلة</b></span></div><figcaption id="river-credit"><span>من ملامح مدينتنا</span><a href="https://www.al-mayar.com/بالصور-شارع-الكورنيش-لوحة-جمالية-لمدي/" target="_blank" rel="noopener">تصوير: عبدالحسين بريسم · واع / الميار ↗</a></figcaption></figure>
</section>\n`+html.slice(end);
html=html.replace('class="cinema-frame"','class="cinema-frame"');
fs.writeFileSync(file,html);
let app=fs.readFileSync('dist/app.js','utf8');
const a=app.indexOf("document.querySelectorAll('[data-filter]')");
const b=app.indexOf('const projects=',a);
app=app.slice(0,a)+`document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
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
`+app.slice(b);
fs.writeFileSync('dist/app.js',app);
