const panel=document.createElement('dialog');panel.className='reveal-workshop';
panel.innerHTML='<div class="batik-stage"><img src="./老师指定蜡染-无圆形.png" alt="老师指定的蓝白蜡染图" /></div><div class="batik-controls"><span>山野，留在了布上。</span><button id="batik-zoom">放大细看</button><button id="leave-reveal">回到亭子 ×</button></div>';document.body.append(panel);
export function openWorkbench(){if(panel.open)return;panel.showModal();dispatchEvent(new CustomEvent('story-panel',{detail:true}));}
panel.querySelector('#leave-reveal').onclick=()=>panel.close();panel.querySelector('#batik-zoom').onclick=()=>{const zoom=panel.classList.toggle('is-zoomed');panel.querySelector('#batik-zoom').textContent=zoom?'查看全幅':'放大细看';};
panel.addEventListener('close',()=>{panel.classList.remove('is-zoomed');panel.querySelector('#batik-zoom').textContent='放大细看';dispatchEvent(new CustomEvent('story-panel',{detail:false}));dispatchEvent(new Event('pavilion-return'));});
