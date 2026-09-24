import {updateProgress} from './exploration-progress.js?v=72';
import {collectMemory,getCollectedMemories,hasCollectedMemory} from './journey-state.js';
import {chapters as allChapters} from './chapters.js?v=59';
const chapters=Object.fromEntries(Object.entries(allChapters).filter(([key])=>!['vine','village'].includes(key)));
import {storyCopy} from './story-copy.js?v=64';
for(const [key,parts] of Object.entries(storyCopy)){if(!chapters[key])continue;chapters[key].parts=parts;chapters[key].line=`读过「${chapters[key].name}」`;}
import './six-act.js?v=22';
import {openWorkbench as openWorkshop} from './batik-process.js?v=73';
const $=id=>document.getElementById(id);let current=null,page=0,previousFocus=null;
const rail=document.createElement('nav');rail.className='encounters';rail.setAttribute('aria-label','在山野中停下来观察');rail.innerHTML=Object.entries(chapters).map(([k,v])=>`<button data-memory="${k}">${v.name}<span>${hasCollectedMemory(k)?'已记住':'观察'}</span></button>`).join('');$('experience').append(rail);
const journalButton=document.createElement('button');journalButton.id='journal-open';journalButton.textContent=`手记 ${getCollectedMemories().length}/${Object.keys(chapters).length}`;document.querySelector('.top-controls').prepend(journalButton);updateProgress();
const panel=document.createElement('dialog');panel.className='memory-book';panel.innerHTML='<button class="close-book" aria-label="合上手记">合上 ×</button><div id="book-content"></div><div id="book-actions"></div>';document.body.append(panel);
const directions={vine:'左侧近岸垂着露珠的藤蔓',tree:'左侧山脚的古树',village:'右侧远处屋檐下的晾布小巷',flower:'两侧山脚的花朵',stream:'中央流动的溪水',fish:'溪水中的游鱼',butterfly:'右侧低飞的蝴蝶',bird:'偏左中部飞翔的鸟'};
const storyIllustrations={"flower":"露水中的半开野花与花苞","vine":"连接枝干的藤蔓上垂着露珠","stream":"外婆与孩子在绕石流动的溪水边触水","fish":"岩石旁的浅水里游着几尾小鱼","butterfly":"蝴蝶停在叶上，双翅半开","tree":"外婆与孩子把手放在古树的树皮上","village":"山间巷子晾着蓝白蜡染，两人在檐下整理工具","bird":"窗边的小鸟与桌上花鸟纹蓝布"};
function notifyPause(open){dispatchEvent(new CustomEvent('story-panel',{detail:open}))}
function openPanel(){previousFocus=document.activeElement;if(!panel.open){panel.showModal();notifyPause(true)}}
panel.querySelector('.close-book').onclick=()=>panel.close();panel.addEventListener('close',()=>{notifyPause(false);previousFocus?.focus()});
function read(k){if(!chapters[k])return;current=k;page=0;render();openPanel();dispatchEvent(new CustomEvent('observe-memory',{detail:k}))}
function render(){const c=chapters[current];$('book-content').innerHTML=`<p class="book-page">${page+1} / ${c.parts.length} · ${c.name}</p><h2>${c.title}</h2><figure class="story-illustration"><img src="./story-images/${current}.png" alt="${storyIllustrations[current]}" width="1536" height="1024" decoding="async"><figcaption>故事插画 · ${c.name}</figcaption></figure><p class="book-prose">${c.parts[page]}</p>`;$('book-actions').innerHTML=`<button id="previous-page" ${page===0?'disabled':''}>上一页</button><button id="next-page">${page===c.parts.length-1?(hasCollectedMemory(current)?'记忆已在手记里':'把这一刻收进手记'):'继续读故事 →'}</button>`;$('previous-page').onclick=()=>{page--;render()};$('next-page').onclick=()=>{if(page<c.parts.length-1){page++;render()}else{collectMemory(current);panel.close()}}}
rail.querySelectorAll('button').forEach(b=>b.onclick=()=>read(b.dataset.memory));journalButton.onclick=()=>{current=null;const count=getCollectedMemories().length;$('book-content').innerHTML=`<h2>带回家的记忆</h2><p class="book-prose">${count?'花留在枝头，鱼仍在水里。你把这些时刻，带进了外婆留下的空白。':'手记还空着。先在山野里停一停，读完一个故事，再把它收进来。'}</p>${Object.keys(chapters).map(k=>`<button class="memory-index" data-read="${k}">${chapters[k].name}<small>${hasCollectedMemory(k)?'已收进手记':'待寻找 · '+directions[k]}</small></button>`).join('')}`;$('book-actions').innerHTML='<button id="to-table">合上手记，继续探索</button>';$('to-table').onclick=()=>panel.close();panel.querySelectorAll('[data-read]').forEach(b=>b.onclick=()=>{if(hasCollectedMemory(b.dataset.read))read(b.dataset.read);else panel.close();});openPanel()};
const tableButton=document.createElement('button');tableButton.id='return-table';tableButton.textContent='回工坊，完成白布';tableButton.onclick=()=>{panel.close();document.getElementById('action').click()};rail.append(tableButton);
window.addEventListener('open-workshop',openWorkshop);window.addEventListener('open-memory',e=>read(e.detail));
window.addEventListener('journey-stage',e=>{rail.classList.toggle('in-flight',e.detail>=2)});
window.addEventListener('journey-progress-changed',()=>{journalButton.textContent=`手记 ${getCollectedMemories().length}/${Object.keys(chapters).length}`;rail.querySelectorAll('[data-memory]').forEach(button=>button.querySelector('span').textContent=hasCollectedMemory(button.dataset.memory)?'已记住':'观察');updateProgress();});
window.addEventListener('journey-reset',()=>{if(panel.open)panel.close();current=null;page=0;});
