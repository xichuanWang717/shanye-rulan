// Local recordings. Playback is unlocked only by an explicit visitor gesture.
const files={room:'老屋环境.mp3',page:'纸张翻动，旧本子.mp3',wind:'山谷混合.mp3',water:'纹样如水流动.mp3',cloth:'点击布料.mp3',dye:'染缸搅动.mp3'};
const tracks=Object.fromEntries(Object.entries(files).map(([key,file])=>{const audio=new Audio(new URL(`./audio/${file}`,import.meta.url));audio.preload='none';return [key,audio];}));
const levels={room:.16,wind:.22,water:.23,page:.45,birds:.38,cloth:.28,dye:.3};
for(const key of ['room','wind','water'])tracks[key].loop=true;
let enabled=false,unlocked=false,scene='room',fade=0;
const button=document.createElement('button');button.className='sound-toggle';button.type='button';button.setAttribute('aria-label','开启环境声音');button.setAttribute('aria-pressed','false');button.textContent='声音：关闭';document.body.append(button);
function label(){button.textContent=enabled?'声音：开启':'声音：关闭';button.setAttribute('aria-pressed',String(enabled));button.setAttribute('aria-label',enabled?'关闭环境声音':'开启环境声音');}
function play(key){if(!enabled||document.hidden)return;const a=tracks[key];a.volume=levels[key];a.play().catch(()=>{if(key===scene){enabled=false;stop();label();}});}
function stop(){cancelAnimationFrame(fade);Object.values(tracks).forEach(a=>a.pause());}
function atmosphere(next){scene=next;cancelAnimationFrame(fade);if(!enabled||document.hidden)return;const keys=['room','wind','water'],initial=keys.map(k=>tracks[k].volume);const a=tracks[next];a.volume=0;a.play().catch(()=>{enabled=false;stop();label();});const started=performance.now();function tick(now){const t=Math.max(0,Math.min(1,(now-started)/1400));keys.forEach((k,i)=>{tracks[k].volume=k===next?levels[k]*t:initial[i]*(1-t);if(t===1&&k!==next)tracks[k].pause();});if(t<1)fade=requestAnimationFrame(tick);}fade=requestAnimationFrame(tick);}
function effect(key){if(!enabled)return;tracks[key].currentTime=0;play(key);}
button.addEventListener('click',()=>{unlocked=true;enabled=!enabled;label();if(enabled)atmosphere(scene);else stop();});
document.getElementById('enter-world').addEventListener('click',()=>{if(!unlocked){unlocked=true;enabled=true;label();}effect('page');atmosphere('wind');});
// The valley mix already contains birds and stream ambience; do not double it.
addEventListener('open-workshop',()=>{atmosphere('water');effect('cloth');});
addEventListener('pavilion-return',()=>atmosphere('wind'));
addEventListener('batik-process',e=>{if(e.detail===1)effect('dye');if(e.detail===4)effect('cloth');});
// Keep the control reachable inside the browser's modal top layer.
const dialog=document.querySelector('.reveal-workshop');
if(dialog)new MutationObserver(()=>{if(dialog.open){dialog.append(button);if(scene!=='water')atmosphere('water');}else document.body.append(button);}).observe(dialog,{attributes:true,attributeFilter:['open']});
document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else if(enabled)atmosphere(scene);});
addEventListener('pagehide',stop);
