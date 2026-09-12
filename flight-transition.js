// A screen-space wind layer bridges the moving flock and the patterned cloth.
export function createFlightTransition(){
 const canvas=document.createElement('canvas');canvas.className='flight-wind';canvas.setAttribute('aria-hidden','true');document.body.append(canvas);
 const ctx=canvas.getContext('2d');let width=0,height=0;
 const motif=[];const pattern=new Image();pattern.onload=()=>{const sample=document.createElement('canvas');sample.width=180;sample.height=110;const sc=sample.getContext('2d');sc.drawImage(pattern,0,0,180,110);const pixels=sc.getImageData(0,0,180,110).data;for(let y=0;y<110;y+=2)for(let x=0;x<180;x+=2){const i=(y*180+x)*4;if(Math.min(pixels[i],pixels[i+1],pixels[i+2])>160)motif.push([x/180,y/110]);}};pattern.src='./老师指定蜡染-无圆形.png';
 function resize(){width=innerWidth;height=innerHeight;const ratio=Math.min(devicePixelRatio,1.5);canvas.width=width*ratio;canvas.height=height*ratio;ctx.setTransform(ratio,0,0,ratio,0,0);}
 resize();addEventListener('resize',resize);
 return function update(time,active,reduced){canvas.hidden=!active||reduced;if(canvas.hidden)return;ctx.clearRect(0,0,width,height);const power=Math.sin(Math.min(1,time/8)*Math.PI),cx=width*.5,cy=height*.38;
  ctx.lineWidth=1;for(let i=0;i<65;i++){const angle=i*2.399963,r=((i*.037+time*.38)%1),length=(.025+.035*power)*Math.max(width,height),distance=r*r*Math.max(width,height)*.8;const x=cx+Math.cos(angle)*distance,y=cy+Math.sin(angle)*distance;ctx.strokeStyle=`rgba(232,237,219,${power*.32*r})`;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(angle)*length,y+Math.sin(angle)*length);ctx.stroke();}
  const gather=Math.max(0,Math.min(1,(time-4.8)/2.5));if(gather>0){const ease=gather*gather*(3-2*gather);ctx.fillStyle=`rgba(7,30,49,${ease*.95})`;ctx.fillRect(0,0,width,height);ctx.fillStyle=`rgba(241,232,206,${gather})`;motif.forEach(([u,v],i)=>{const angle=i*2.399963;const sx=cx+Math.cos(angle+time*.2)*width*.6,sy=cy+Math.sin(angle)*height*.55;const x=sx*(1-ease)+u*width*ease,y=sy*(1-ease)+v*height*ease;ctx.fillRect(x,y,Math.max(1,width/250),Math.max(1,height/170));});}
 };
}
