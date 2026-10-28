
const {chromium}=require(process.env.PLAYWRIGHT_MODULE);
const fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({headless:true});
 let failures=0;
 for(const width of [390,1366]){
 const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'no-preference'});
 page.on('pageerror',e=>console.log('PAGE_ERROR',e.message));
 page.on('response',r=>{if(r.url().includes('.mp4')||r.status()>=400)console.log('RESPONSE',r.status(),r.url(),r.headers()['content-type']);});
 await page.goto('https://sajjad-ahmed1.github.io/-/?check='+Date.now(),{waitUntil:'networkidle',timeout:60000});
 console.log('PAGE',width,page.url());
 await page.waitForFunction(()=>!!document.querySelector('.video-play-icon'),null,{timeout:30000});
 console.log('LAYOUT',await page.evaluate(()=>{
 const a=document.querySelector('.hero-bottom').getBoundingClientRect(), b=document.querySelector('.cinema-heading').getBoundingClientRect();
 return {gap:b.top-a.bottom,overflow:document.documentElement.scrollWidth-innerWidth,badges:[...document.querySelectorAll('.video-badge')].map(x=>({text:x.textContent,display:getComputedStyle(x).display}))};
 }));
 const selectors=['.album-center .video-play-icon','.album-left .video-play-icon','.album-right .video-play-icon','.cinema-frame',...Array.from({length:3},(_,i)=>'.moments .moment-tall:nth-child('+(i+1)+') .video-play-icon')];
 for(const selector of selectors){
 try{
 await page.locator(selector).click({timeout:10000});
 await page.waitForFunction(()=>{const v=document.querySelector('#video-dialog video');return v.currentTime>3&&!v.paused},null,{timeout:20000});
 console.log('PLAY_PASS',width,selector,await page.locator('video').evaluate(v=>({time:v.currentTime,src:v.currentSrc,duration:v.duration})));
 }catch(e){failures++;console.log('PLAY_FAIL',width,selector,e.message,await page.evaluate(()=>{const v=document.querySelector('video');return {src:v.currentSrc,ready:v.readyState,error:v.error?.message,status:document.querySelector('#video-status')?.textContent,dialog:document.querySelector('#video-dialog').open}}));}
 if(await page.locator('#video-dialog').evaluate(d=>d.open))await page.locator('#video-dialog .close-dialog').click();
 }
 await page.screenshot({path:'site-'+width+'.png',fullPage:true});
 await page.close();
 }
 await browser.close();
 if(failures)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1});
