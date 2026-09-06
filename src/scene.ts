import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export function mountScene(host: HTMLElement) {
 const heading=host.parentElement?.querySelector('h1');
 if(!heading)return()=>{};
 const textCanvas=document.createElement('canvas');
 const ctx=textCanvas.getContext('2d');
 if(!ctx)return()=>{};
 let renderer: THREE.WebGLRenderer;
 try { renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'}); } catch {return()=>{};}
 const pixelRatio=Math.min(window.devicePixelRatio,2);
 renderer.setPixelRatio(pixelRatio);
 renderer.setClearColor(0xe9e9e6,1);
 host.appendChild(renderer.domElement);
 const scene=new THREE.Scene();
 const camera=new THREE.PerspectiveCamera(34,1,.1,40);camera.position.z=7.5;
 const pmrem=new THREE.PMREMGenerator(renderer);
 const room=new RoomEnvironment();
 const environment=pmrem.fromScene(room,.04);
 scene.environment=environment.texture;room.dispose();
 // The letters must be inside WebGL: transmission cannot refract the DOM beneath a canvas.
 const texture=new THREE.CanvasTexture(textCanvas);texture.colorSpace=THREE.SRGBColorSpace;
 texture.anisotropy=renderer.capabilities.getMaxAnisotropy();
 const backdropGeometry=new THREE.PlaneGeometry(1,1);
 const backdropMaterial=new THREE.MeshBasicMaterial({map:texture,toneMapped:false});
 const backdrop=new THREE.Mesh(backdropGeometry,backdropMaterial);scene.add(backdrop);
 const geometry=new THREE.TorusKnotGeometry(1,.3,256,48,2,3);
 const material=new THREE.MeshPhysicalMaterial({color:0xffffff,metalness:0,roughness:0,transmission:1,thickness:.7,ior:1.45,dispersion:4,envMapIntensity:1,toneMapped:false});
 const knot=new THREE.Mesh(geometry,material);knot.position.set(0,0,1.6);scene.add(knot);
 let px=0,py=0,visible=true,disposed=false;
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 function resize(){
  if(disposed||!ctx||!heading)return;
  const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;
  renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();
  const planeHeight=2*camera.position.z*Math.tan(THREE.MathUtils.degToRad(camera.fov/2));
  backdrop.scale.set(planeHeight*camera.aspect,planeHeight,1);
  knot.scale.setScalar(w<650?.52:.73);
  textCanvas.width=Math.round(w*pixelRatio);textCanvas.height=Math.round(h*pixelRatio);
  ctx.setTransform(pixelRatio,0,0,pixelRatio,0,0);
  ctx.fillStyle=getComputedStyle(document.body).backgroundColor;ctx.fillRect(0,0,w,h);
  const hostRect=host.getBoundingClientRect();
  for(const line of Array.from(heading.children)){
   const style=getComputedStyle(line);const rect=line.getBoundingClientRect();
   ctx.font=`${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
   ctx.letterSpacing=style.letterSpacing;ctx.textBaseline='alphabetic';ctx.textAlign='left';
   const content=line.textContent||'';const metrics=ctx.measureText(content);
   const ascent=metrics.fontBoundingBoxAscent,descent=metrics.fontBoundingBoxDescent;
   const baseline=rect.top-hostRect.top+(rect.height-ascent-descent)/2+ascent;
   const x=style.textAlign==='right'?rect.right-hostRect.left-metrics.width:rect.left-hostRect.left;
   ctx.fillStyle=style.color;
   const dot=line.querySelector('.name-dot');
   if(dot){const prefix=content.slice(0,-1);ctx.fillText(prefix,x,baseline);ctx.fillStyle=getComputedStyle(dot).color;ctx.fillText('.',x+ctx.measureText(prefix).width,baseline)}
   else ctx.fillText(content,x,baseline);
  }
  texture.needsUpdate=true;draw(0);
 }
 function draw(t:number){if(disposed)return;const time=reduced.matches?0:t*.00022;knot.rotation.x=.65+Math.sin(time)*.3+py*.2;knot.rotation.y=time+px*.24;knot.rotation.z=-.4+Math.sin(time*.6)*.18;renderer.render(scene,camera)}
 function animate(t:number){if(visible&&!document.hidden)draw(t)}
 function sync(){renderer.setAnimationLoop(reduced.matches?null:animate);draw(0)}
 function pointer(e:PointerEvent){px=e.clientX/window.innerWidth-.5;py=e.clientY/window.innerHeight-.5}
 const observer=new ResizeObserver(resize);observer.observe(host);observer.observe(heading);
 const intersection=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting});intersection.observe(host);
 const lost=(event:Event)=>{event.preventDefault();renderer.setAnimationLoop(null);renderer.domElement.style.opacity='0'};
 renderer.domElement.addEventListener('webglcontextlost',lost);
 window.addEventListener('pointermove',pointer,{passive:true});reduced.addEventListener('change',sync);
 resize();sync();void document.fonts.ready.then(()=>{if(!disposed)resize()});
 return()=>{disposed=true;renderer.setAnimationLoop(null);observer.disconnect();intersection.disconnect();window.removeEventListener('pointermove',pointer);reduced.removeEventListener('change',sync);renderer.domElement.removeEventListener('webglcontextlost',lost);geometry.dispose();material.dispose();backdropGeometry.dispose();backdropMaterial.dispose();texture.dispose();environment.dispose();pmrem.dispose();renderer.dispose();renderer.domElement.remove()};
}
