import * as T from './three.module.js';
export function addLandmarks(earth,picks){
 const tree=new T.Group();tree.position.set(-6.2,0,-5);tree.userData.memory='tree';earth.add(tree);picks.push(tree);
 const bark=new T.MeshStandardMaterial({color:'#655b50',roughness:1}),dark=new T.MeshStandardMaterial({color:'#363d39',roughness:1}),moss=new T.MeshStandardMaterial({color:'#697d6c',roughness:1});
 function tube(points,r,mat=bark){const curve=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)));const geometry=new T.TubeGeometry(curve,24,r,9,false);const vertices=geometry.attributes.position;for(let i=0;i<vertices.count;i++){const u=Math.floor(i/10)/24,center=curve.getPointAt(u),factor=1-u*.92;vertices.setXYZ(i,center.x+(vertices.getX(i)-center.x)*factor,center.y+(vertices.getY(i)-center.y)*factor,center.z+(vertices.getZ(i)-center.z)*factor);}geometry.computeVertexNormals();const mesh=new T.Mesh(geometry,mat);tree.add(mesh);return mesh;}
 const trunk=new T.CylinderGeometry(.38,.88,3.5,20,20);const pos=trunk.attributes.position;
 for(let i=0;i<pos.count;i++){const y=pos.getY(i),angle=Math.atan2(pos.getZ(i),pos.getX(i));const corr=1+.11*Math.sin(angle*7+y*1.9)+.065*Math.cos(angle*13-y);pos.setXYZ(i,pos.getX(i)*corr+.15*Math.sin(y*1.2),y+1.65,pos.getZ(i)*corr);}
 trunk.computeVertexNormals();tree.add(new T.Mesh(trunk,bark));
 for(let i=0;i<7;i++){const a=i*2.399;const length=1.1+(i%4)*.27;tube([[Math.cos(a)*.35,.6,Math.sin(a)*.35],[Math.cos(a)*.75,.12,Math.sin(a)*.75],[Math.cos(a)*length,-.30,Math.sin(a)*length]],.10+(i%3)*.035);}
 const branches=[
 [[0,2.5,0],[-.7,3.1,.1],[-1.5,3.3,.2],[-2.2,3.9,.1]],
 [[.1,2.8,0],[.7,3.4,-.1],[1.6,3.6,-.3],[2.1,4.3,-.4]],
 [[0,3,0],[-.2,3.9,-.2],[.3,4.6,-.4]],
 [[.2,2.2,.1],[1,2.8,.5],[1.7,2.9,.7]],
 [[-.2,2.6,0],[-.8,3.6,-.7],[-1.2,4.4,-1]]
 ];
 branches.forEach((pts,i)=>{tube(pts,.16-i*.014);const end=pts[pts.length-1];tube([pts[2],end,[end[0]+.4,end[1]+.3,end[2]+.2]],.05);});
 const shades=['#355563','#426877','#617e7d','#80948b'];
 // Small overlapping leaf sprays build a full crown without solid, flattened lobes.
 let seed=731;const random=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296;};
 const leafGeo=new T.SphereGeometry(1,6,4);
 const foliage=new T.InstancedMesh(leafGeo,new T.MeshStandardMaterial({color:'#527572',roughness:1}),1200);
 const dummy=new T.Object3D(),tint=new T.Color();
 for(let i=0;i<1200;i++){const a=random()*Math.PI*2,r=Math.sqrt(random()),height=random();dummy.position.set(Math.cos(a)*r*2.35-.25,3.3+height*1.95+(.5-r)*.7,Math.sin(a)*r*1.55);dummy.scale.set(.10+random()*.15,.05+random()*.07,.15+random()*.17);dummy.rotation.set(random(),random()*6,random()*.8);dummy.updateMatrix();foliage.setMatrixAt(i,dummy.matrix);tint.set(shades[Math.floor(random()*shades.length)]);foliage.setColorAt(i,tint);}tree.add(foliage);
 const hit=new T.Mesh(new T.SphereGeometry(1.35,8,6),new T.MeshBasicMaterial({visible:false}));hit.position.y=2;tree.add(hit);
 return ()=>{};
}
