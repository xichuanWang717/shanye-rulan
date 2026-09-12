import * as T from './three.module.js';

// Pigment shading lives on the moving geometry, so lighting and occlusion survive.
export function paintScene(scene) {
  const ramp = new T.DataTexture(new Uint8Array([95,155,210,255]),4,1,T.RedFormat);
  ramp.minFilter=ramp.magFilter=T.NearestFilter;ramp.needsUpdate=true;
  const replacements=new Map();
  scene.traverse(object=>{
    if(!object.isMesh||!object.material?.isMeshStandardMaterial)return;
    const original=object.material;
    if(!replacements.has(original)){
      const color=original.color.clone();
      const hsl={};color.getHSL(hsl);
      color.setHSL(hsl.h,Math.min(.62,hsl.s*1.15),Math.min(.72,hsl.l*1.1));
      const mat=new T.MeshToonMaterial({color,gradientMap:ramp,side:original.side,map:original.map,transparent:original.transparent,opacity:original.opacity});
      mat.onBeforeCompile=shader=>{
        shader.vertexShader='varying vec3 pigmentPosition;\n'+shader.vertexShader;
        shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\npigmentPosition=position;');
        shader.fragmentShader='varying vec3 pigmentPosition;\n'+shader.fragmentShader;
        shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
          float paper=fract(sin(dot(floor(pigmentPosition.xz*95.0+pigmentPosition.y*31.0),vec2(12.9898,78.233)))*43758.5453);
          float wash=sin(pigmentPosition.x*3.1+sin(pigmentPosition.z*2.0))*sin(pigmentPosition.y*2.7);
          diffuseColor.rgb*=0.95+paper*0.07+wash*0.055;`);
      };
      replacements.set(original,mat);
    }
    object.material=replacements.get(original);
  });
}
