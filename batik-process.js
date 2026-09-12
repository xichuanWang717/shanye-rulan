import {createEpilogue} from './epilogue.js?v=62';
const panel=document.createElement('dialog');panel.className='reveal-workshop';
panel.innerHTML='<div class="batik-stage"><canvas aria-label="上蜡白布的浸染与热水脱蜡过程"></canvas><img hidden src="./老师指定蜡染-无圆形.png" alt="老师指定的蓝白蜡染图" /></div><div class="batik-controls"><span aria-live="polite"></span><button id="process-next">将白布浸入染液</button><button id="batik-zoom" hidden>放大细看</button><button id="leave-reveal">回到亭子 ×</button></div>';document.body.append(panel);
const canvas=panel.querySelector('canvas'),ctx=canvas.getContext('2d'),image=panel.querySelector('img'),next=panel.querySelector('#process-next'),caption=panel.querySelector('.batik-controls span');
const stages=[['外婆留下的蜡还在布上。让这块已画蜡的白布，慢慢入蓝。','将白布浸入染液'],['布已浸染。把它提出染液，让空气唤出蓝色。','出缸，等待氧化'],['蜡仍保护着花鸟的白。将染好的布放入热水脱蜡。','热水煮布，融去蜡'],['融化的蜡离开布面。清洗、晾晒，让白色纹样显露。','清洗晾晒，展开全幅'],['外婆没有教我画一朵花。她教我，怎样等一朵花自己开口。','']];
let stage=0,frame=0,source=null,busy=false,generation=0;
const layers=[];
const processNote=document.createElement('p');processNote.className='process-note';processNote.textContent='工艺交互示意：浸染、氧化与热水脱蜡的时间已压缩；画面不代表实际操作时长。';panel.querySelector('.batik-controls').prepend(processNote);
const gestureHint=document.createElement('p');gestureHint.className='cloth-gesture-hint';panel.querySelector('.batik-stage').append(gestureHint);
const ending=document.createElement('section');ending.className='cloth-ending';ending.hidden=true;panel.append(ending);
const visited=new Set();addEventListener('observe-memory',e=>visited.add(e.detail));
const memories={flower:'你翻阅了花开的记忆。',stream:'你读到了溪边洗布的往事。',fish:'你读过等待游鱼的片刻。',bird:'你翻阅了鸟与归途的故事。',butterfly:'你读过蝴蝶停留的片刻。',vine:'你翻阅了藤蔓与露珠的记忆。',tree:'你读过外婆与老树的往事。',village:'你翻阅了晾布巷子的故事。'};
const startEpilogue=createEpilogue(panel);
addEventListener('story-restart',()=>visited.clear());
function showEnding(){startEpilogue([...visited].filter(k=>memories[k]).slice(-2).map(k=>memories[k]).join('')||'你从外婆的木桌出发，把这块白布带回了蓝里。');}
let gesture=null,manual=0;
canvas.style.touchAction='none';
canvas.addEventListener('pointerdown',e=>{if(busy||!source||stage===4)return;if(stage===2){next.click();return;}gesture={id:e.pointerId,x:e.clientX,y:e.clientY,base:manual};canvas.setPointerCapture(e.pointerId);dispatchEvent(new CustomEvent('batik-process',{detail:stage+1}));});
canvas.addEventListener('pointermove',e=>{if(!gesture||gesture.id!==e.pointerId)return;const distance=stage===0?e.clientY-gesture.y:stage===1?gesture.y-e.clientY:Math.abs(e.clientX-gesture.x);manual=Math.max(0,Math.min(1,gesture.base+distance/Math.max(120,canvas.getBoundingClientRect().height*.4)));draw(stage+1,manual);gestureHint.textContent=['向下浸入染液','向上提出，蓝色渐显','','向两侧展开白纹'][stage]+' · '+Math.round(manual*100)+'%';});
function finishGesture(){if(!gesture)return;gesture=null;if(manual>=.98){draw(stage+1,1);stage++;manual=0;sync();}}
canvas.addEventListener('pointerup',finishGesture);canvas.addEventListener('pointercancel',()=>gesture=null);
function prepare(){canvas.width=1200;canvas.height=Math.round(1200*image.naturalHeight/image.naturalWidth);ctx.drawImage(image,0,0,canvas.width,canvas.height);source=ctx.getImageData(0,0,canvas.width,canvas.height);
 for(let s=0;s<4;s++){const layer=document.createElement('canvas');layer.width=canvas.width;layer.height=canvas.height;const out=new ImageData(source.width,source.height);
  for(let i=0;i<source.data.length;i+=4){const r=source.data[i],g=source.data[i+1],b=source.data[i+2],motif=Math.max(0,Math.min(1,(Math.min(r,g,b)-65)/145)),texture=(r+g+b)/765;
   for(let c=0;c<3;c++){const paper=[235,229,211][c]*(.94+texture*.06),wax=[211,193,147][c],dyed=source.data[i+c]*(s===1?.78:1)+(s===1&&c===1?14:0);out.data[i+c]=s===0?paper*(1-motif)+wax*motif:s<3?dyed*(1-motif)+wax*motif:source.data[i+c];}out.data[i+3]=255;
  }layer.getContext('2d').putImageData(out,0,0);layers[s]=layer;
 }draw(stage,1);next.disabled=false;
}
function draw(s,t){if(!source)return;const w=canvas.width,h=canvas.height;ctx.globalAlpha=1;ctx.drawImage(layers[Math.max(0,Math.min(3,s-1))],0,0);
 if(s===1){ctx.save();ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(w,0);for(let x=w;x>=0;x-=12)ctx.lineTo(x,(h+40)*t-20+Math.sin(x/90+t*6)*14*Math.sin(Math.PI*t));ctx.closePath();ctx.clip();ctx.drawImage(layers[1],0,0);ctx.restore();}
 else if(s>1){ctx.globalAlpha=t;ctx.drawImage(layers[Math.min(s,3)],0,0);ctx.globalAlpha=1;}
 if(s===3&&t>0&&t<1){for(let j=0;j<7;j++){const x=w*(j/6),y=h*(1-t)+Math.sin(j+t*5)*h*.06;const mist=ctx.createRadialGradient(x,y,0,x,y,w*.2);mist.addColorStop(0,`rgba(240,239,220,${.2*Math.sin(t*Math.PI)})`);mist.addColorStop(1,'rgba(240,239,220,0)');ctx.fillStyle=mist;ctx.fillRect(0,0,w,h);}}
}
function sync(){caption.textContent=stages[stage][0];next.textContent='自动演示 · '+stages[stage][1];next.hidden=stage===4;panel.querySelector('#batik-zoom').hidden=stage!==4;canvas.hidden=stage===4;image.hidden=stage!==4;gestureHint.hidden=stage===4;gestureHint.textContent=['按住布面，向下拖动，让白布入染','按住布面，向上提起，观察空气带出的蓝','轻触布面，放入热水；等待热量融去蜡','清洗后的布，向一侧拖开，展开全幅',''][stage];if(stage===4)showEnding();}
export function openWorkbench(){if(panel.open)return;stage=0;manual=0;gesture=null;ending.hidden=true;busy=false;next.disabled=false;panel.showModal();sync();if(source)draw(0,0);else if(image.complete&&image.naturalWidth)prepare();dispatchEvent(new CustomEvent('story-panel',{detail:true}));}
image.addEventListener('load',prepare);image.addEventListener('error',()=>{caption.textContent='布面未能载入，请返回亭子后重试。';next.disabled=true;});
next.onclick=()=>{if(busy||!source)return;busy=true;next.disabled=true;const target=stage+1,token=++generation;caption.textContent=['','染液浸入纤维，蜡覆盖的地方保留着白。','提出布面，接触空气，蓝色渐渐变深。','热水使蜡融化，蜡离开纤维，白色花鸟显露。','洗去残蜡与浮色，晾干，展开山野。'][target];next.textContent='请稍候…';dispatchEvent(new CustomEvent('batik-process',{detail:target}));const start=performance.now(),duration=matchMedia('(prefers-reduced-motion: reduce)').matches?100:[0,3000,3500,4000,1800][target];function tick(now){if(token!==generation||!panel.open)return;const t=Math.max(0,Math.min(1,(now-start)/duration));draw(target,t);if(t<1)frame=requestAnimationFrame(tick);else{stage=target;busy=false;next.disabled=false;sync();}}frame=requestAnimationFrame(tick);};
panel.querySelector('#leave-reveal').onclick=()=>panel.close();panel.querySelector('#batik-zoom').onclick=()=>{const zoom=panel.classList.toggle('is-zoomed');panel.querySelector('#batik-zoom').textContent=zoom?'查看全幅':'放大细看';};
panel.addEventListener('close',()=>{generation++;cancelAnimationFrame(frame);panel.classList.remove('is-zoomed');panel.querySelector('#batik-zoom').textContent='放大细看';dispatchEvent(new CustomEvent('story-panel',{detail:false}));dispatchEvent(new Event('pavilion-return'));});
