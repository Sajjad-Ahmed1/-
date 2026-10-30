const fs=require('node:fs'),path=require('node:path');
const read=p=>fs.readFileSync(path.join('dist',p),'utf8');
fs.mkdirSync('offline-export',{recursive:true});
const mime={'.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.ttf':'font/ttf'},assets={};
for(const name of fs.readdirSync('dist/assets')){
 const ext=path.extname(name);if(!mime[ext])continue;
 assets['assets/'+name]='data:'+mime[ext]+';base64,'+fs.readFileSync('dist/assets/'+name).toString('base64');
}
for(const name of ['welcome-play.mp4','art-play.mp4'])assets['assets/'+name]='data:video/mp4;base64,'+fs.readFileSync('offline-media/'+name).toString('base64');
function asset(p){const r=assets[p.split('?')[0]];if(!r)throw Error('Missing '+p);return r;}
let html=read('index.html');
html=html.replace(/<link\b[^>]*rel="stylesheet"[^>]*>/g,tag=>{
 const filename=tag.match(/href="([^"]+)"/)[1].split('?')[0];
 return '<style>'+read(filename).replace(/url\(['"]?(assets\/[^)'"]+)['"]?\)/g,(_,p)=>'url("'+asset(p)+'")')+'</style>';
});
html=html.replace(/(src|href)="(assets\/[^"]+)"/g,(_,a,p)=>a+'="'+asset(p)+'"');
let app=read('app.js');
for(const [from,to] of [
 ["img.src='assets/'+p.image+'.webp'","img.src=offlineAsset('assets/'+p.image+'.webp')"],
 ["player.poster='assets/'+(activeVideo==='art'?'artist':'intro')+'.webp'","player.poster=offlineAsset('assets/'+(activeVideo==='art'?'artist':'intro')+'.webp')"],
 ["new URL('assets/'+(activeVideo==='art'?'art-play':'welcome-play')+'.mp4?v=16',document.baseURI).href","offlineAsset('assets/'+(activeVideo==='art'?'art-play':'welcome-play')+'.mp4')"]
]){if(!app.includes(from))throw Error('Source changed: '+from);app=app.replace(from,to);}
const bootstrap='const OFFLINE_ASSETS='+JSON.stringify(assets)+';\nconst offlineURLs={};\n'+
'function offlineAsset(p){p=p.split("?")[0];if(offlineURLs[p])return offlineURLs[p];const d=OFFLINE_ASSETS[p];if(!d)throw Error("Missing "+p);if(!p.endsWith(".mp4"))return d;const raw=atob(d.split(",")[1]);const bytes=new Uint8Array(raw.length);for(let i=0;i<raw.length;i++)bytes[i]=raw.charCodeAt(i);const url=URL.createObjectURL(new Blob([bytes],{type:"video/mp4"}));offlineURLs[p]=url;delete OFFLINE_ASSETS[p];return url;}\n'+
'document.addEventListener("click",event=>{const a=event.target.closest("a[href]");if(a&&/^https?:/.test(a.getAttribute("href"))&&!navigator.onLine){event.preventDefault();alert("هذا الرابط يحتاج إنترنت. باقي الموقع والفيديوهات تعمل بدون نت.");}},true);\n';
html=html.replace(/<script src="app\.js[^"]*">\s*<\/script>/,()=>'<script>'+bootstrap+app+'</script>');
const motion=read('experience.js').replace("river.src='assets/intro.webp'","river.src=offlineAsset('assets/intro.webp')");
html=html.replace(/<script src="experience\.js[^"]*">\s*<\/script>/,()=>'<script>'+motion+'</script>');
fs.writeFileSync('offline-export/Bazaar-Maysan-Offline.html',html);
fs.writeFileSync('offline-export/READ-ME.txt','بازار ميسان — نسخة بدون إنترنت\n\nإذا حمّلت ZIP فك الضغط أولاً.\nافتح Bazaar-Maysan-Offline.html بمتصفح يدعم ملفات HTML المحلية مثل Chrome على أندرويد.\nأرسل ملف HTML كمستند (Document) لصديقك. كل الصور والخطوط والفيديوهات داخله.\nروابط إنستغرام والخرائط تحتاج إنترنت عند فتحها.\n\nبعض تطبيقات المعاينة، خصوصاً على الآيفون، لا تشغّل JavaScript أو الفيديو. استخدم عارض HTML يدعم JavaScript والوسائط المحلية.\n');
console.log('HTML_BYTES',fs.statSync('offline-export/Bazaar-Maysan-Offline.html').size);
