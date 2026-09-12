// Story-first extension: keeps the existing landscape and reveal renderer.
import {dismissLetter} from './story.js?v=13';
const scenes=[
 ['空白','最后一笔，不在纸上。','木桌上的白布只画了一半。你试着延长外婆的线，却在空白处停住。','先别急着落刀。'],
 ['入山','走进一根线。','布面的纤维像山脊一样抬起。你沿着溪流走进去，远处晾晒的蓝布，是回家的方向。','花留在枝头就好。你记住它怎样开。'],
 ['相遇','山野，把话慢慢说完。','停下来听花、水和鸟，也看看藤蔓、鱼、蝴蝶、古树与村寨。每一次相遇，都会成为布上的一条线。','手长大了，别还照着旧印子画。'],
 ['风起','风把答案吹散。','纸页离开手心。你追着鸟群抬起头：花的弧、溪流的线、鸟翼的形，在蓝色空域重新相遇。','我以为忘了。原来，手还记得。'],
 ['回桌','把空白，留给自己。','选择你的主纹、连接线与边饰，再把自己的这一半接到旧纹旁。','这半边，照你的意思来。'],
 ['归途','这次，该我讲给你听了。','外婆留了半块布。你把一路看见的，接了上去。风掀起远处的蓝布，木椅旁的窗仍亮着。','你带回来的，是自己看见的山野。']
];
const style=document.createElement('style');style.textContent=`
.act-toggle{position:fixed;left:24px;top:85px;z-index:12;background:#153c50;color:#f3ecd8;border:1px solid #c8cbb977;padding:9px 16px}.act-book{width:min(920px,94vw);max-height:92svh;background:#eee8d8;color:#183b4d;padding:clamp(24px,5vw,58px);overflow:auto}.act-book::backdrop{background:#071c2bdf}.act-book h2{font:clamp(30px,5vw,58px)/1.2 serif;margin:24px 0}.act-book p{line-height:1.9}.act-quote{border-left:2px solid #9a7950;padding-left:20px;margin:24px 0;font-size:20px}.act-nav{display:flex;gap:8px;flex-wrap:wrap}.act-book button{padding:12px 16px;background:#173f53;color:#f6efd9;border:0}.act-nav button[aria-current=true]{background:#98754a}.act-tools{display:flex;gap:12px;flex-wrap:wrap;margin-top:24px}.act-choices{display:flex;gap:18px;flex-wrap:wrap;margin-top:24px}.act-choices label{display:grid;gap:8px}.act-choices select{padding:12px;background:#faf5e6;color:#193b50;border:1px solid #8b9b9c}.act-preview{width:100%;max-height:270px;object-fit:contain;margin-top:20px}.act-close{float:right}.act-book button:focus-visible,.act-book select:focus-visible{outline:3px solid #b47736;outline-offset:3px}`;document.head.append(style);
const panel=document.createElement('dialog');panel.className='act-book';document.body.append(panel);
const toggle=document.createElement('button');toggle.className='act-toggle';toggle.textContent='六幕 · 故事旅程';document.body.append(toggle);
let current=0;const choice={main:'花',link:'藤蔓',border:'年轮'};
const continueButton=document.createElement('button');continueButton.className='act-toggle';continueButton.style.cssText='top:auto;bottom:26%;left:24px';continueButton.textContent='继续故事 →';continueButton.hidden=true;document.body.append(continueButton);
continueButton.onclick=()=>{current=Math.min(5,current+1);toggle.click();continueButton.hidden=true};
panel.addEventListener('close',()=>{dismissLetter();dispatchEvent(new CustomEvent('story-scene',{detail:current}));continueButton.hidden=current===0||current>=4;continueButton.textContent=current===3?'回到木桌 →':'继续故事 →'});
panel.addEventListener('click',e=>{if(e.target.closest('#act-next')&&current>0&&current<4&&panel.open)panel.close()});
addEventListener('story-restart',()=>{current=0;continueButton.hidden=true;toggle.textContent='六幕 · 故事旅程'});
function artwork(){const canvas=document.createElement('canvas');canvas.width=1200;canvas.height=780;const c=canvas.getContext('2d');c.fillStyle='#103854';c.fillRect(0,0,1200,780);c.strokeStyle='#eee5c9';c.lineWidth=3;
 const flower=(x,y,r)=>{for(let i=0;i<8;i++){c.save();c.translate(x,y);c.rotate(i*Math.PI/4);c.beginPath();c.ellipse(0,-r*.5,r*.18,r*.48,0,0,Math.PI*2);c.stroke();c.restore()}};
 for(let x=140;x<600;x+=180)for(let y=160;y<700;y+=220)flower(x,y,65);
 for(let x=740;x<1150;x+=210)for(let y=180;y<650;y+=260){c.save();c.translate(x,y);if(choice.main==='花')flower(0,0,85);else{c.beginPath();if(choice.main==='鱼'){c.ellipse(0,0,70,33,0,0,Math.PI*2);c.moveTo(65,0);c.lineTo(100,-35);c.lineTo(100,35);c.closePath()}else if(choice.main==='蝴蝶'){for(const s of [-1,1])c.ellipse(s*35,0,35,65,s*.4,0,Math.PI*2)}else{c.moveTo(-85,-35);c.quadraticCurveTo(-40,45,0,10);c.quadraticCurveTo(40,-70,85,-35);c.moveTo(0,10);c.lineTo(15,55)}c.stroke()}c.restore()}
 for(let y=80;y<730;y+=100){c.beginPath();c.moveTo(600,y);c.bezierCurveTo(750,y-80,950,y+80,1120,y);c.stroke();if(choice.link==='藤蔓')for(let x=680;x<1120;x+=80){c.beginPath();c.ellipse(x,y,16,6,-.7,0,7);c.stroke()}}
 for(let x=35;x<1180;x+=35)for(const y of [30,750]){c.beginPath();if(choice.border==='年轮')c.arc(x,y,10,0,7);else c.rect(x-8,y-8,16,16);c.stroke()}
 c.setLineDash([5,9]);c.beginPath();c.moveTo(600,55);c.lineTo(600,725);c.stroke();c.setLineDash([]);c.beginPath();c.moveTo(540,390);c.bezierCurveTo(580,340,610,450,660,390);c.stroke();return canvas}
function apply(){const canvas=artwork();dispatchEvent(new CustomEvent('pattern-selected',{detail:canvas}));return canvas}
function render(){const s=scenes[current];panel.innerHTML=`<button class="act-close">返回山野 ×</button><p>蓝里，有人等你 · ${current+1} / 6</p><h2>${s[1]}</h2><p>${s[2]}</p><p class="act-quote">“${s[3]}”</p><nav class="act-nav" aria-label="六幕章节">${scenes.map((a,i)=>`<button data-act="${i}" aria-current="${i===current}">${a[0]}</button>`).join('')}</nav>${current===4?`<div class="act-choices">${[['main','主纹',['花','鱼','蝴蝶','鸟']],['link','连接',['藤蔓','溪流']],['border','边饰',['年轮','晾布']]].map(([key,label,options])=>`<label>${label}<select data-choice="${key}">${options.map(o=>`<option ${choice[key]===o?'selected':''}>${o}</option>`).join('')}</select></label>`).join('')}</div><img class="act-preview" alt="左侧旧花纹与右侧个人组合纹样的预览">`:''}<div class="act-tools"><button id="act-next">${current===4?'带着纹样，进入显纹':current===5?'重新展开故事':'继续 →'}</button>${current===2?'<button id="act-explore">进入山野，观察八段记忆</button>':''}</div>`;
 panel.querySelector('.act-close').onclick=()=>panel.close();panel.querySelectorAll('[data-act]').forEach(b=>b.onclick=()=>{current=+b.dataset.act;render()});panel.querySelectorAll('select').forEach(el=>el.onchange=()=>{choice[el.dataset.choice]=el.value;panel.querySelector('img').src=apply().toDataURL()});if(current===4)panel.querySelector('img').src=apply().toDataURL();panel.querySelector('#act-explore')?.addEventListener('click',()=>panel.close());panel.querySelector('#act-next').onclick=()=>{if(current===4){apply();panel.close();dispatchEvent(new Event('open-workshop'))}else{current=(current+1)%6;render()}}}
toggle.onclick=()=>{render();panel.showModal();dispatchEvent(new CustomEvent('story-panel',{detail:true}))};panel.addEventListener('close',()=>dispatchEvent(new CustomEvent('story-panel',{detail:false})));
addEventListener('cloth-finished',()=>{current=5;toggle.textContent='查看第六幕 · 归途'});
