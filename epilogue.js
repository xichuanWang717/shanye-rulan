export function createEpilogue(panel){
 const scene=document.createElement('section');scene.className='epilogue';scene.hidden=true;scene.setAttribute('aria-label','归来');
 scene.innerHTML='<div class="epilogue-table"><img class="epilogue-desk" src="./结尾木桌蜡染-v62.png" alt="完成的蓝白蜡染自然铺在外婆的木桌上"></div><div class="epilogue-copy" aria-live="polite"><h2></h2><p></p></div><button class="epilogue-next">继续这段归途</button><div class="epilogue-actions" hidden><button data-end="view">重看这块布</button><button data-end="journal">翻阅手记</button><button data-end="restart">重新出发</button></div>';
 panel.append(scene);let timer=0,index=0,lines=[];const durations=[4500,6500,7500,6500];
 function stop(){clearTimeout(timer);scene.hidden=true;panel.classList.remove('telling-ending');}
 function advance(){clearTimeout(timer);index++;render();}
 function render(){if(!panel.open)return;const last=index>=4;scene.dataset.beat=String(index);scene.querySelector('h2').textContent=last?'蓝里，有人等你。':lines[index][0];scene.querySelector('.epilogue-copy p').textContent=last?'山野留在布上，你的故事还会继续。':lines[index][1];scene.querySelector('.epilogue-actions').hidden=!last;scene.querySelector('.epilogue-next').hidden=last;if(!last)timer=setTimeout(advance,durations[index]);else dispatchEvent(new Event('ending-home'));}
 scene.querySelector('.epilogue-next').onclick=advance;
 scene.querySelector('[data-end="view"]').onclick=stop;
 scene.querySelector('[data-end="journal"]').onclick=()=>{stop();panel.close();document.getElementById('journal-open').click();};
 scene.querySelector('[data-end="restart"]').onclick=()=>{stop();panel.close();dispatchEvent(new Event('story-restart'));document.getElementById('replay').click();const cover=document.getElementById('cover');cover.classList.remove('is-leaving');cover.hidden=false;dispatchEvent(new Event('ending-restart'));};
 panel.addEventListener('close',stop);
 return function start(recollection){stop();index=0;lines=[['山野，留在了布上。','让这块布在风里，慢慢晾干。'],['你又回到了外婆的木桌。','出发前留在这里的白布，如今已经入蓝。'],['“最后一笔，不在纸上。”',recollection],['原来，空白是在等你。','我终于明白，外婆留下的空白，是让我把自己的故事带回来。']];scene.hidden=false;panel.classList.add('telling-ending');render();};
}
