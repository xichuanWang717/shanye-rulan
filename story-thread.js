// The same unfinished sentence connects departure, discovery and return.
const intro=document.querySelector('.cover-copy p');
intro.textContent='外婆留下一块已画好蜡花、尚未染色的白布。手记最后一页写着：“蓝里，最后一笔，不在纸上。”你决定先去看看她笔下的山野，再回来完成这块布。';
import {hasCollectedMemory} from './journey-state.js';
const discovery=document.createElement('div');discovery.className='pavilion-discovery';discovery.hidden=true;discovery.setAttribute('role','status');document.body.append(discovery);
let timeout;
addEventListener('pavilion-flight',()=>{clearTimeout(timeout);discovery.textContent=hasCollectedMemory('stream')?'布上的曲线，原来是刚才那道溪水。外婆把山野，留在了这里。':hasCollectedMemory('flower')?'布上的花，原来也有山野里舒展的模样。你开始懂得外婆的笔。':'晾晒布上的花、水和鸟，与山野彼此呼应。原来外婆画下的，是她认真看过的生活。';discovery.hidden=false;timeout=setTimeout(()=>discovery.hidden=true,3600);});
for(const event of ['open-workshop','pavilion-return','story-restart'])addEventListener(event,()=>{clearTimeout(timeout);discovery.hidden=true;});
