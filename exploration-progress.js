const keys=['flower','stream','fish','butterfly','tree','bird'];
export function memories(){try{const saved=JSON.parse(localStorage.getItem('indigo-memories-v1')||'{}');return keys.filter(k=>saved[k]);}catch{return [];}}
const found=new Set(memories());
export function isExplorationComplete(){return found.size===keys.length;}
const notice=document.createElement('div');notice.className='exploration-notice';notice.setAttribute('role','status');notice.hidden=true;document.body.append(notice);
let timer;
export function allowFlight(){if(isExplorationComplete())return true;clearTimeout(timer);notice.textContent=`山野里，还有几段故事等你发现。先去看看吧，染亭会在这里等你。还差 ${keys.length-found.size} 段记忆，可从右上角手记寻找。`;notice.hidden=false;timer=setTimeout(()=>notice.hidden=true,5500);return false;}
function update(){const button=document.getElementById('journal-open');if(!button)return;button.classList.add('journal-progress');button.innerHTML=`<span>山野手记 · ${found.size} / ${keys.length}</span><progress max="${keys.length}" value="${found.size}" aria-label="山野记忆收集进度"></progress><small>${isExplorationComplete()?'已集齐 · 点击蓝布继续':'继续探索山野'}</small>`;}
addEventListener('memory-collected',e=>{if(keys.includes(e.detail))found.add(e.detail);update();});
addEventListener('pavilion-flight',()=>{notice.hidden=true;clearTimeout(timer);});
export {update as updateProgress};
