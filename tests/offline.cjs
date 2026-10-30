const {chromium}=require(process.env.PLAYWRIGHT_MODULE);
const {pathToFileURL}=require('node:url'),path=require('node:path');
(async()=>{
 const browser=await chromium.launch();
 for(const width of [390,1366]){
 const context=await browser.newContext({viewport:{width,height:844},offline:true});
 const page=await context.newPage(),errors=[],requests=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('request',r=>{if(/^https?:/.test(r.url()))requests.push(r.url())});
 await page.goto(pathToFileURL(path.resolve('offline-export/Bazaar-Maysan-Offline.html')).href,{waitUntil:'load'});
 await page.evaluate(()=>document.fonts.ready);
 const bad=await page.locator('img').evaluateAll(imgs=>imgs.filter(i=>!i.complete||i.naturalWidth===0).map(i=>i.alt));
 if(bad.length)throw Error('Broken images: '+JSON.stringify(bad));
 const selectors=['.album-center .video-play-icon','.album-left .video-play-icon','.album-right .video-play-icon','.cinema-frame',...Array.from({length:3},(_,i)=>'.moments .moment-tall:nth-child('+(i+1)+') .video-play-icon')];
 for(const selector of selectors){
 await page.locator(selector).click();
 await page.waitForFunction(()=>{const v=document.querySelector('video');return v.currentTime>2&&!v.paused},null,{timeout:20000});
 console.log('OFFLINE_PLAY_PASS',width,selector);
 await page.locator('#video-dialog .close-dialog').click();
 }
 await page.locator('[data-filter="books"]').click();
 if(await page.locator('.project-card:visible').count()!==3)throw Error('Books filter failed');
 await page.locator('[data-project="sarai"]').click();
 if(!await page.locator('#project-content img').evaluate(i=>i.complete&&i.naturalWidth>0))throw Error('Dynamic logo missing');
 await page.locator('#project-dialog .close-dialog').click();
 await page.locator('.questions summary').first().click();
 if(!await page.locator('.questions details').first().evaluate(d=>d.open))throw Error('FAQ failed');
 if(errors.length||requests.length)throw Error(JSON.stringify({errors,requests}));
 console.log('OFFLINE_PASS',width,'images, filters, dialogs, FAQ, videos, zero HTTP requests');
 await context.close();
 }
 await browser.close();
})().catch(e=>{console.error(e);process.exitCode=1});
