const intro=document.createElement('section');intro.className='letter';intro.innerHTML=`<div><p class="letter-line">外婆留给你一块没有画完的布。</p><h1>她说，山里<br>还有几句话，<br>等你带回来。</h1><p>木桌上的蜡已经凉了。白布只画了一半，另一半仍空着。<br>手记最后一页写着：先去看花，听水，再看看鸟飞向哪里。<br>等你回来，我们就把它做完。</p><button id="begin">带着这块布，进山去</button></div><span class="thread-mark" aria-hidden="true"></span>`;document.body.append(intro);
export function dismissLetter(){if(intro.hidden)return;intro.classList.add('leaving');setTimeout(()=>intro.hidden=true,800)}
document.getElementById('begin').onclick=dismissLetter;
export function reopenLetter(){intro.hidden=false;intro.classList.remove('leaving')}
export function clothTexture(THREE){
 const c=document.createElement('canvas');c.width=1024;c.height=1024;const x=c.getContext('2d');x.fillStyle='#173b61';x.fillRect(0,0,1024,1024);x.strokeStyle='#eae5d2';x.lineWidth=3;x.lineCap='round';
 const line=(p)=>{x.beginPath();p(x);x.stroke()};
 // Original narrative arrangement: paired birds and lotus branches, not a facsimile of a documented textile.
 for(let row=0;row<3;row++)for(let col=0;col<3;col++){x.save();x.translate(170+col*342,170+row*342);const r=75;
 for(let k=0;k<8;k++){x.save();x.rotate(k*Math.PI/4);line(p=>{p.moveTo(0,0);p.bezierCurveTo(-35,-30,-31,-73,0,-r);p.bezierCurveTo(31,-73,35,-30,0,0)});line(p=>{p.moveTo(0,-12);p.quadraticCurveTo(9,-39,0,-65)});x.restore()}
 for(let side of [-1,1]){x.save();x.scale(side,1);line(p=>{p.moveTo(35,110);p.bezierCurveTo(60,55,115,70,119,105);p.bezierCurveTo(140,97,138,76,131,70);p.bezierCurveTo(175,96,153,149,100,143);p.lineTo(55,175);p.lineTo(73,134);p.quadraticCurveTo(48,130,35,110)});for(let n=0;n<4;n++)line(p=>{p.moveTo(70+n*10,114);p.quadraticCurveTo(95+n*7,110,102+n*6,90)});x.beginPath();x.arc(129,98,3,0,Math.PI*2);x.stroke();x.restore()}
 line(p=>{p.moveTo(0,78);p.bezierCurveTo(-25,130,30,170,0,194)});x.restore()}
 for(let i=18;i<1008;i+=10){x.fillStyle=i%20?'#eae5d299':'#eae5d2';x.fillRect(i,18,4,9);x.fillRect(i,997,4,9);x.fillRect(18,i,9,4);x.fillRect(997,i,9,4)}
 for(let j=0;j<1024;j+=3){x.fillStyle=j%2?'#ffffff09':'#0000000b';x.fillRect(j,0,1,1024);x.fillRect(0,j,1024,1)}
 const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;return tex;
}
