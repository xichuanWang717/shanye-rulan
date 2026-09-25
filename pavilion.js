import {allowFlight} from './exploration-progress.js?v=58';
import * as T from './three.module.js';
import {createBird} from './fauna.js';
import {getPavilionBirdPosition} from './pavilion-flight-path.js?v=2';
import {isPavilionFlightComplete} from './flight-transition-state.js?v=1';
export function createPavilion(scene){
 const group=new T.Group();scene.add(group);group.position.set(3.8,0,-16);group.scale.setScalar(.62);
 const wood=new T.MeshStandardMaterial({color:'#715038',roughness:1}),roof=new T.MeshStandardMaterial({color:'#234657',roughness:1}),paper=new T.MeshStandardMaterial({color:'#eee3c9',roughness:1});
 const box=(w,h,d,m,x,y,z)=>{const o=new T.Mesh(new T.BoxGeometry(w,h,d),m);o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;group.add(o);return o};
 box(7,.3,4.8,wood,0,.2,0);
 for(const x of [-3,3])for(const z of [-2,2])box(.22,4.4,.22,wood,x,2.5,z);
 for(const z of [-2,2])box(6.7,.2,.24,wood,0,4.5,z);
 for(const side of [-1,1]){const r=box(7.8,.18,3,roof,0,5,side*1.25);r.rotation.x=side*.34;}
 box(8,.18,.22,wood,0,5.53,0);
 const hit=new T.Mesh(new T.PlaneGeometry(13,9),new T.MeshBasicMaterial({visible:false}));hit.position.set(0,3,1);group.add(hit);
 const map=new T.TextureLoader().load('./老师指定蜡染-无圆形.png');map.colorSpace=T.SRGBColorSpace;
 const textiles=[];for(const x of [-1.8,1.8]){const g=new T.PlaneGeometry(2.2,1.7,16,16);const o=new T.Mesh(g,new T.MeshStandardMaterial({map,side:T.DoubleSide,roughness:1}));o.position.set(x,3.35,-1.96);group.add(o);textiles.push(o);}
 box(3.5,.18,1.6,wood,0,1.7,.1);box(2.8,.035,1.2,paper,0,1.81,.1);
 for(const x of [-1.3,1.3]){
  const person=new T.Group();group.add(person);person.position.set(x,.35,.95);
  const body=new T.Mesh(new T.CylinderGeometry(.25,.46,1.15,12),new T.MeshStandardMaterial({color:x<0?'#3c677b':'#b4b9a3',roughness:1}));body.position.y=.95;person.add(body);
  const head=new T.Mesh(new T.SphereGeometry(.25,16,12),new T.MeshStandardMaterial({color:'#d2ad80',roughness:1}));head.position.set(0,1.75,-.08);person.add(head);
  const hair=new T.Mesh(new T.SphereGeometry(.255,16,8,0,Math.PI*2,0,Math.PI*.55),wood);hair.position.copy(head.position);person.add(hair);
  for(const side of [-1,1]){const arm=new T.Mesh(new T.CylinderGeometry(.075,.09,.75,8),body.material);arm.position.set(side*.27,1.38,-.35);arm.rotation.x=-.9;person.add(arm);}
  person.userData.phase=x;person.userData.arms=person.children.slice(-2);
 }
 const flock=[createBird(.7,true),...Array.from({length:47},(_,i)=>createBird(i%9===0?.52:.22+(i%4)*.04,false))];flock.forEach((o,i)=>{scene.add(o.b);o.b.position.set((i%5-2)*.7,2.8+Math.floor(i/5)*.4,-14+(i%3)*.3);o.offset=i*.42;});const bird=flock[0];let flight=-1,done=false;
 const launch=()=>{if(flight>=0||!allowFlight())return;flight=0;done=false;dispatchEvent(new Event('pavilion-flight'));};
 function update(time,dt,reduced){
  textiles.forEach((o,j)=>{const a=o.geometry.attributes.position;for(let i=0;i<a.count;i++)a.setZ(i,reduced?0:Math.sin(a.getX(i)*3+time*1.3+j)*.055*(1-(a.getY(i)+.85)/1.7));a.needsUpdate=true;});
  group.children.filter(o=>o.userData.arms).forEach(p=>p.userData.arms.forEach((a,i)=>a.rotation.x=-.9+(reduced?0:Math.sin(time*1.7+p.userData.phase+i)*.09)));
  if(flight>=0&&!done){flight+=dt;if(isPavilionFlightComplete(flight,reduced)){done=true;dispatchEvent(new Event('pavilion-flight-complete'));}}
  flock.forEach((o,i)=>{const rise=Math.max(0,flight-(i%8)*.12),position=getPavilionBirdPosition(rise,i);o.b.position.set(position.x,position.y,position.z);o.b.visible=flight>=0&&!done&&flight>=(i%8)*.12;o.b.rotation.z=Math.sin(rise*.8+o.offset)*.18;o.wings.forEach(w=>w.rotation.z=w.userData.side*(.25+Math.sin(time*12+o.offset)*.65));});
 }
 return {group,update,launch,bird:bird.b,get flying(){return flight>=0&&!done;},get flightTime(){return Math.max(0,flight);},reset(){flight=-1;done=false;}};
}
