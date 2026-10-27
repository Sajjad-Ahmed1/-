import fs from 'node:fs';
const file='dist/index.html';
let html=fs.readFileSync(file,'utf8');
const start=html.indexOf('<section class="hero');
const end=html.indexOf('<div class="category-band',start);
html=html.slice(0,start)+`<section class="hero editorial-hero section-wrap">
<div class="hero-heading"><p class="eyebrow"><span></span> بازار ميسان الثقافي · العمارة، العراق</p><h1>تمشاية بين<br><span>حكايات ميسان.</span></h1><div class="hero-intro"><p>من كتاب تختاره، إلى موهبة تلتقي بيها.<br>هنا نكتشف ميسان بعيون أهلها.</p><a class="button primary" href="#projects">ابدأ جولتك <span>↙</span></a></div></div>
<div class="album" aria-label="صور من أجواء البازار"><figure class="album-photo album-back"><img src="assets/painting.webp" alt="ألوان ولوحة من البازار"><figcaption>حكاية تبدأ بلون</figcaption></figure><figure class="album-photo album-front"><img src="assets/artist.webp" alt="حيدر يرسم على وجه طفل في البازار"><figcaption><span>من الناس، وللناس.</span><span>ميسان ♡</span></figcaption></figure><span class="album-note">هنا، الموهبة<br>تلگه ناسها.</span></div>
<div class="hero-bottom"><span>كتب، فنون، ومشاريع من أهلنا.</span><a href="#cinema">كمّل التمشاية <span>↓</span></a><button class="text-button" data-video="intro"><span class="play">▶</span> شاهد حكاية البازار</button></div>
</section>
<section class="cinema" id="cinema" aria-label="مشهد من البازار"><div class="cinema-sticky"><div class="cinema-heading"><span>للمدينة حكايات.</span><span>وهذه واحدة منها.</span></div><button class="cinema-frame" data-video="art" aria-label="شاهد فيلم الرسم في البازار"><img src="assets/child.webp" alt="لحظة رسم وفرح من بازار ميسان"><span class="cinema-shade"></span><span class="cinema-caption"><small>من قلب البازار</small><strong>فرحة صغيرة.<br>حكاية تبقى.</strong><span class="film-play">▶ <span>شاهد اللحظة</span></span></span></button><span class="cinema-foot">أهل ميسان هم الحكاية.</span></div></section>
`+html.slice(end);
html=html.replace('<link rel="stylesheet" href="style.css">','<link rel="stylesheet" href="style.css"><link rel="stylesheet" href="experience.css">');
html=html.replace('<script src="app.js"></script>','<script src="app.js"></script><script src="experience.js"></script>');
html=html.replace('01 / الحكاية','حكاية البازار').replace('02 / أهل البازار','تعرّف عليهم').replace('03 / من قلب الحدث','ألبوم البازار').replace('04 / نلتقي في ميسان','من العمارة، نلتقي').replace('05 / قبل زيارتك','قبل زيارتك');
html=html.replace('مو بس بازار.<br>مساحة <em>تشبهنا.</em>','على ضفاف دجلة،<br>للإبداع مكان.');
html=html.replace('نؤمن أن وراء كل مشروع صغير حكاية تستحق أن تُروى، ووراء كل موهبة فرصة تستحق أن تُمنح.','على كورنيش دجلة في العمارة، اجتمعت الكتب والأعمال اليدوية والفن في بازار تصنعه مواهب ميسان.');
html=html.replace('<span class="outline-star" aria-hidden="true">✳</span>','<svg class="river-mark" viewBox="0 0 220 70" fill="none" aria-hidden="true"><path d="M0 22 C50 -18 60 70 120 25 S180 15 220 27 M0 38 C50 -2 60 86 120 41 S180 31 220 43 M0 54 C50 14 60 102 120 57 S180 47 220 59" stroke="currentColor" stroke-width="1.4"/></svg>');
html=html.replace('<div class="places">','<div class="places"><a href="https://www.google.com/maps/search/?api=1&query=كورنيش+دجلة+العمارة" target="_blank" rel="noopener"><span>دجلة</span><div><h3>كورنيش دجلة</h3><p>العمارة · من محطات البازار</p></div><i>↗</i></a>');
html=html.replace('لم يُضف موعد مؤكد للفعالية القادمة بعد. الأماكن أعلاه استضافت لقاءات البازار، وقد يختلف مكان كل فعالية؛ تأكد من إعلان المنظمين قبل الزيارة.','تختلف المواعيد والأماكن من فعالية لأخرى. <a class="underlined" href="https://www.instagram.com/maysan_bazaar/" target="_blank" rel="noopener">تابع إعلانات البازار على إنستغرام ↗</a> لمعرفة الموعد والمكان قبل الزيارة.');
html=html.replace('<a class="button light" href="#projects">اكتشف المبدعين <span>↖</span></a>','<a class="button light" href="https://www.instagram.com/maysan_bazaar/" target="_blank" rel="noopener">تابع أخبار البازار <span>↗</span></a>');
html=html.replace('https://wattaennews.net/archives/101081','https://www.al-mirbad.com/detail/214559');
html=html.replace('<body>','<body><div class="reading-progress" aria-hidden="true"></div><button class="motion-toggle" aria-pressed="false" title="إيقاف الحركة">إيقاف الحركة Ⅱ</button>');
fs.writeFileSync(file,html);
