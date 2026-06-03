/* TV-man 3D centerpiece — Three.js, transparent canvas, no frame/watermark.
   Loaded as an ES module; bare 'three' imports resolve via the importmap in index.html. */
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const canvas = document.getElementById('scene3d');
const renderer = new THREE.WebGLRenderer({canvas, alpha:true, antialias:true});
renderer.setClearColor(0x000000,0);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.12;
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
camera.position.set(0, 2.85, 11.4);
camera.lookAt(0, 2.8, 0);

scene.add(new THREE.HemisphereLight(0xeef3ff, 0x6b5a3a, 0.9));
const key = new THREE.DirectionalLight(0xfff3d8, 2.1);
key.position.set(-5, 8, 6); key.castShadow = true;
key.shadow.mapSize.set(2048,2048); key.shadow.bias=-0.0004;
key.shadow.camera.near=1; key.shadow.camera.far=30;
key.shadow.camera.left=-6; key.shadow.camera.right=6;
key.shadow.camera.top=6; key.shadow.camera.bottom=-6; scene.add(key);
const rim = new THREE.DirectionalLight(0xbfe9ff, 1.05); rim.position.set(6,3,-5); scene.add(rim);
const rim2 = new THREE.DirectionalLight(0xffe2c0, 0.6); rim2.position.set(-6,2,-4); scene.add(rim2);
const fill = new THREE.DirectionalLight(0xffffff, 0.45); fill.position.set(4,1,7); scene.add(fill);

const root = new THREE.Group();
root.position.x = 0.42;
scene.add(root);
let screenMat=null, screenLight=null;

/* ============================================================
   Anime TV-man figure, matched to the flat reference silhouette.
   The body is built from tapered cloth forms, not capsule limbs.
   ============================================================ */
// smooth-shaded material
function mat(color, extra={}){
  return new THREE.MeshStandardMaterial({color, roughness:0.82, metalness:0.0, ...extra});
}
// cel-shaded (toon) material with a stepped gradient → anime banding
const toonGrad = (()=>{ const t=new THREE.DataTexture(new Uint8Array([78,140,200,255]),4,1,THREE.RedFormat);
  t.minFilter=t.magFilter=THREE.NearestFilter; t.needsUpdate=true; return t; })();
function tmat(color){ return new THREE.MeshToonMaterial({color, gradientMap:toonGrad}); }
const COL = {
  tv:0xd3d6da, tvDark:0x6c7176, hood:0xf2a51c, hoodDk:0xc98212,
  pants:0x4b5230, pantsDk:0x39431f, sock:0xedd64e, sockB:0xf4eed6,
  shoe:0x3a3e84, shoeWh:0xefe9dc, skin:0xdcae8e, poleA:0xdcc64e,
  poleB:0x2b2b2b, cord:0x1e1e1e, dirt:0x6e4a2a, soil:0x57411f, grass:0x5f8d3d
};
function sph(r,m){ return new THREE.Mesh(new THREE.SphereGeometry(r,28,20), m); }
function cyl(rt,rb,h,m,seg=24){ return new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,seg), m); }
function rbox(w,h,d,r,m){ return new THREE.Mesh(new RoundedBoxGeometry(w,h,d,4,r), m); }
function box(w,h,d,m){ return new THREE.Mesh(new THREE.BoxGeometry(w,h,d), m); }
function add(parent,mesh,x,y,z,rx=0,ry=0,rz=0,sx,sy,sz){
  mesh.position.set(x,y,z); mesh.rotation.set(rx,ry,rz);
  if(sx!==undefined) mesh.scale.set(sx,sy,sz);
  mesh.castShadow=true; mesh.receiveShadow=true; parent.add(mesh); return mesh;
}
const _up=new THREE.Vector3(0,1,0);
// tapered cloth segment A->B. No spherical caps, so sleeves and legs keep a loose fabric edge.
function clothSeg(parent,A,B,rA,rB,m,segCount=18){
  const a=new THREE.Vector3(A[0],A[1],A[2]), b=new THREE.Vector3(B[0],B[1],B[2]);
  const dir=new THREE.Vector3().subVectors(b,a), len=dir.length();
  const mesh=new THREE.Mesh(new THREE.CylinderGeometry(rB,rA,len,segCount,1,false), m);
  mesh.position.copy(a).add(b).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(_up, dir.normalize());
  mesh.castShadow=mesh.receiveShadow=true; parent.add(mesh);
  return mesh;
}
function clothTube(parent, points, radii, m, radial=22){
  const rings=points.map(p=>new THREE.Vector3(p[0],p[1],p[2]));
  const verts=[], norms=[], idx=[];
  for(let i=0;i<rings.length;i++){
    const p=rings[i];
    const prev=rings[Math.max(0,i-1)], next=rings[Math.min(rings.length-1,i+1)];
    const tangent=new THREE.Vector3().subVectors(next,prev).normalize();
    const side=new THREE.Vector3().crossVectors(tangent, new THREE.Vector3(0,0,1));
    if(side.lengthSq()<0.001) side.crossVectors(tangent, new THREE.Vector3(1,0,0));
    side.normalize();
    const forward=new THREE.Vector3().crossVectors(side,tangent).normalize();
    for(let j=0;j<radial;j++){
      const a=(j/radial)*Math.PI*2;
      const rx=radii[i][0], rz=radii[i][1];
      const n=new THREE.Vector3()
        .addScaledVector(side, Math.cos(a)/rx)
        .addScaledVector(forward, Math.sin(a)/rz)
        .normalize();
      const v=p.clone()
        .addScaledVector(side, Math.cos(a)*rx)
        .addScaledVector(forward, Math.sin(a)*rz);
      verts.push(v.x,v.y,v.z); norms.push(n.x,n.y,n.z);
    }
  }
  for(let i=0;i<rings.length-1;i++){
    for(let j=0;j<radial;j++){
      const a=i*radial+j, b=i*radial+(j+1)%radial, c=(i+1)*radial+j, d=(i+1)*radial+(j+1)%radial;
      idx.push(a,c,b,b,c,d);
    }
  }
  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(verts,3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(norms,3));
  geo.setIndex(idx);
  const mesh=new THREE.Mesh(geo,m);
  mesh.castShadow=mesh.receiveShadow=true; parent.add(mesh); return mesh;
}
// surface-of-revolution from a (radius,height) profile → smooth organic forms
function lathe(parent, profile, m, x=0,y=0,z=0, seg=36){
  const pts=profile.map(p=>new THREE.Vector2(p[0],p[1]));
  const geo=new THREE.LatheGeometry(pts, seg); geo.computeVertexNormals();
  const mesh=new THREE.Mesh(geo,m); mesh.position.set(x,y,z);
  mesh.castShadow=mesh.receiveShadow=true; parent.add(mesh); return mesh;
}
function buildTVMan(){
  const g = new THREE.Group();
  const Mtv=mat(COL.tv,{roughness:0.45}), MtvDk=mat(COL.tvDark,{roughness:0.5}),
        Mhood=mat(COL.hood), MhoodDk=mat(COL.hoodDk), Mpants=mat(COL.pants),
        MpantsDk=mat(COL.pantsDk), Msock=mat(COL.sock), MsockB=mat(COL.sockB),
        Mshoe=mat(COL.shoe), MshoeWh=mat(COL.shoeWh), Mskin=mat(COL.skin),
        MpoleA=mat(COL.poleA), MpoleB=mat(COL.poleB), Mcord=mat(COL.cord),
        Mlogo=mat(COL.hoodDk), Mleather=mat(0x6d3d22), MleatherDk=mat(0x3d2418),
        Mwhite=mat(0xf1ead4);

  /* ---- loose green trousers: uneven cloth tubes, brown patches, narrow cuffs ---- */
  for(const s of [-1,1]){
    const leg=new THREE.Group();
    leg.position.set(s*0.21, 2.46, 0.02);
    leg.rotation.z = s*0.12;
    g.add(leg);
    const pts=[[0.0,-1.86],[0.13,-1.84],[0.18,-1.68],[0.22,-1.34],
               [0.18,-0.98],[0.23,-0.58],[0.27,-0.16],[0.22,0.08],[0.0,0.08]]
              .map(p=>new THREE.Vector2(p[0],p[1]));
    const lm=new THREE.Mesh(new THREE.LatheGeometry(pts,30), Mpants);
    lm.castShadow=lm.receiveShadow=true; leg.add(lm);
    add(leg, rbox(0.055,1.18,0.04,0.012,MpantsDk), s*0.16, -0.78, 0.3, 0.04,0,s*0.08);
    add(leg, rbox(0.1,0.36,0.05,0.012,MleatherDk), -s*0.085, -0.62, 0.32, 0.04,0,-s*0.08);

    const ax=s*0.48;
    add(g, cyl(0.17,0.2,0.14,MpantsDk,20), ax, 0.74, 0.05);
    add(g, cyl(0.1,0.125,0.56,Mwhite,18), ax, 0.48, 0.1);
    for(let k=0;k<6;k++) add(g, cyl(0.104,0.104,0.022,Mcord,18), ax, 0.69-k*0.075, 0.1);
    add(g, rbox(0.42,0.2,0.78,0.06,Mshoe), ax, 0.29, 0.5, 0,s*0.16,0);
    add(g, rbox(0.34,0.12,0.34,0.04,Mshoe), ax, 0.38, 0.74, 0.05,s*0.16,0);
    add(g, rbox(0.46,0.1,0.82,0.04,MshoeWh), ax, 0.2, 0.5, 0,s*0.16,0);
    add(g, rbox(0.24,0.1,0.2,0.035,MshoeWh), ax+s*0.02, 0.33, 0.92, 0,s*0.16,0);
    add(g, rbox(0.12,0.18,0.22,0.035,MshoeWh), ax, 0.39, 0.5, 0.4,s*0.08,0);
    for(let k=0;k<3;k++) add(g, cyl(0.012,0.012,0.22,Mwhite,8), ax, 0.37-k*0.04, 0.58, 0,0,Math.PI/2);
  }
  // hips / waist
  add(g, rbox(0.86,0.34,0.68,0.08,MleatherDk), 0, 2.44, 0.02);
  add(g, rbox(0.7,0.16,0.72,0.04,mat(0xb1a690)), 0, 2.58, 0.04);
  for(let k=0;k<8;k++) add(g, box(0.06,0.18,0.08,Mleather), -0.28+k*0.08, 2.58, 0.41);

  /* ---- loose yellow hoodie on a slim body: soft fabric without a bulky torso ---- */
  lathe(g, [
    [0.0,2.48],[0.32,2.48],[0.39,2.66],[0.36,2.94],[0.38,3.2],
    [0.43,3.48],[0.48,3.68],[0.45,3.86],[0.28,3.98],[0.14,4.08],[0.0,4.1]
  ], Mhood);
  add(g, cyl(0.34,0.39,0.18,MhoodDk,32), 0, 2.52, 0);
  add(g, rbox(1.0,0.16,0.3,0.06,Mhood), 0, 3.78, 0.0);
  add(g, rbox(0.52,0.24,0.08,0.04,MhoodDk), 0, 3.0, 0.5);
  add(g, rbox(0.38,0.2,0.1,0.04,Mhood), 0, 2.9, 0.56);
  for(const s of [-1,1]){
    add(g, cyl(0.018,0.018,0.82,Mwhite,8), s*0.09, 3.58, 0.51, 0.2,0,s*0.22);
    add(g, sph(0.034,Mwhite), s*0.18, 3.18, 0.53);
  }
  add(g, rbox(0.13,1.32,0.06,0.025,Mleather), -0.27, 3.18, 0.4, 0.02,0,-0.42);
  add(g, rbox(0.1,0.78,0.06,0.02,MleatherDk), 0.3, 2.88, 0.4, 0.02,0,0.16);
  add(g, rbox(0.3,0.24,0.09,0.04,Mleather), -0.36, 2.45, 0.22, 0.1,0,-0.14);
  add(g, rbox(0.22,0.2,0.09,0.035,MleatherDk), 0.34, 2.5, 0.21, 0.1,0,0.1);
  add(g, cyl(0.22,0.2,0.08,MhoodDk,28), 0, 3.88, 0.0, 0.1,0,0);

  /* ---- relaxed sleeves: dropped and baggy, not akimbo/capsule ---- */
  for(const s of [-1,1]){
    const wrist=[s*0.55, 2.56, 0.13];
    // mild square shoulder: a short flat top, then a smooth taper down the sleeve
    add(g, rbox(0.26,0.14,0.26,0.07,Mhood), s*0.48, 3.8, 0.02, 0,0,s*0.02);
    clothTube(g,
      [[s*0.3,3.82,0.0],[s*0.5,3.8,0.02],[s*0.57,3.5,0.04],[s*0.57,3.12,0.05],[s*0.55,2.78,0.1],[wrist[0],wrist[1],wrist[2]]],
      [[0.15,0.19],[0.16,0.18],[0.15,0.16],[0.14,0.15],[0.12,0.13],[0.09,0.1]],
      Mhood, 24);
    add(g, rbox(0.14,0.18,0.15,0.04,MhoodDk), wrist[0], wrist[1]-0.02, wrist[2]+0.02, 0.72,0,s*0.1);
    add(g, rbox(0.1,0.13,0.14,Mskin), wrist[0]-s*0.01,wrist[1]-0.08,wrist[2]+0.07, 0,s*0.16,s*0.06);
    add(g, sph(0.032,Mskin), wrist[0]+s*0.04,wrist[1]-0.07,wrist[2]+0.08, 0,0,0, 0.7,1.0,0.7);
  }

  /* ---- slim visible neck, separated from hoodie and TV casing ---- */
  lathe(g, [[0.0,3.86],[0.16,3.88],[0.13,4.02],[0.115,4.2],[0.12,4.42],[0.0,4.44]], Mskin, 0,0,0, 20);
  add(g, cyl(0.18,0.2,0.1,MhoodDk,24), 0, 3.9, 0.0, 0.1,0,0);
  const head = new THREE.Group(); head.position.set(0,4.84,0.04);
  head.rotation.set(0.13,0,-0.11); head.scale.setScalar(0.9); g.add(head);
  add(head, rbox(1.5,1.28,1.3,0.1,Mtv), 0,0,0);                   // casing
  add(head, rbox(1.5,0.2,1.32,0.06,MtvDk), 0,-0.66,0);           // base
  add(head, cyl(0.1,0.12,0.5,MtvDk,16), -0.9,-0.05,0.16, 0,0,0.1);// side knob
  // recessed bezel + glowing code screen
  add(head, rbox(1.3,1.08,0.06,0.05,MtvDk), 0,0.06,0.58);
  buildScreen(head);
  // rabbit-ear antennae on top
  for(const s of [-1,1]){
    add(head, sph(0.06,MtvDk), s*0.18,0.66,-0.1);                 // base joint
    add(head, cyl(0.018,0.026,0.62,Mtv,8), s*0.42,0.92,-0.16, 0,0,s*0.5); // rod
  }

  /* ---- reference-style horizontal katana across the back ---- */
  const Msteel=mat(0xc9cfd7,{metalness:0.92,roughness:0.18,envMapIntensity:1.6}),
        Mtsuka=mat(0x14161d), Mwrap=mat(0x8e1d1d),
        Mtsuba=mat(0x222831,{metalness:0.85,roughness:0.28,envMapIntensity:1.4}),
        Mfit  =mat(0xbf962e,{metalness:0.85,roughness:0.24,envMapIntensity:1.5}),
        Msaya =mat(0xd9c44d), MsayaDk=mat(0x303122);
  const katana=new THREE.Group();
  katana.position.set(-0.06, 2.78, -0.42);
  katana.rotation.set(0.06, 0, -0.025);
  add(katana, cyl(0.075,0.075,2.58,Msaya,18), -1.42,0,0, 0,0,Math.PI/2);
  add(katana, cyl(0.05,0.075,0.28,Msteel,18), -2.86,0,0, 0,0,Math.PI/2);
  for(let i=0;i<10;i++){
    add(katana, box(0.08,0.18,0.12,MsayaDk), -2.58+i*0.23, 0.0, 0.06, 0,0,0.7);
  }
  add(katana, cyl(0.08,0.08,0.64,Msteel,18), 0.06,0,0, 0,0,Math.PI/2);
  add(katana, cyl(0.2,0.2,0.08,Mfit,4), 0.44,0,0, 0,0,Math.PI/2, 1.0,1.0,0.62);
  add(katana, cyl(0.16,0.16,0.06,Mtsuba,4), 0.48,0,0, 0,0,Math.PI/2, 1.0,1.0,0.62);
  add(katana, cyl(0.07,0.075,1.02,Mtsuka,16), 1.06,0,0, 0,0,Math.PI/2);
  for(let i=0;i<8;i++) add(katana, box(0.07,0.16,0.14,Mwrap), 0.62+i*0.12,0,0.04, Math.PI/4,0,0);
  add(katana, cyl(0.06,0.05,0.22,Msteel,12), 1.68,0,0, 0,0,Math.PI/2);
  add(katana, cyl(0.016,0.016,0.38,MpoleA,6), -2.78,-0.22,0.02, 0,0,0.1);
  add(katana, cyl(0.014,0.014,0.44,MpoleA,6), 0.52,-0.26,0.02, 0,0,-0.08);
  for(let k=0;k<3;k++) add(katana, cyl(0.01,0.01,0.34,MpoleA,5), 0.62+k*0.08,-0.34,0.02, 0,0,0.2-k*0.12);
  g.add(katana);

  return g;
}

/* ---- hacker-code (matrix-rain) screen ---- */
let scCanvas, scCtx, screenTex, drops, COLS, FS=13;
function buildScreen(head){
  scCanvas = document.createElement('canvas'); scCanvas.width=288; scCanvas.height=232;
  scCtx = scCanvas.getContext('2d');
  scCtx.fillStyle='#03100a'; scCtx.fillRect(0,0,scCanvas.width,scCanvas.height);
  COLS = Math.floor(scCanvas.width/(FS*0.62));
  drops = Array.from({length:COLS}, ()=> Math.floor(Math.random()*scCanvas.height/FS));
  screenTex = new THREE.CanvasTexture(scCanvas);
  screenTex.colorSpace = THREE.SRGBColorSpace;
  screenMat = new THREE.MeshStandardMaterial({map:screenTex, emissive:0xffffff,
    emissiveMap:screenTex, emissiveIntensity:1.5, roughness:0.42, metalness:0.0, toneMapped:false});
  add(head, rbox(1.2,0.98,0.1,0.04,screenMat), 0,0.06,0.66);
  // glass sheen + green spill light
  add(head, new THREE.Mesh(new THREE.PlaneGeometry(1.2,0.98),
    new THREE.MeshPhysicalMaterial({color:0x081410, metalness:0, roughness:0.05,
      transparent:true, opacity:0.16, clearcoat:1, clearcoatRoughness:0.03, envMapIntensity:1.4})),
    0,0.06,0.73);
  screenLight = new THREE.PointLight(0x49ffb0, 3.4, 7, 2.0);
  screenLight.position.set(0,0.1,1.6); head.add(screenLight);
}
const GLYPHS='01<>/\\{}[]()=+*$#%&|;:abcdef0123456789ABCDEFGHJKLMNPQRxyz▮λΣØ';
function drawScreen(){
  const W=scCanvas.width, H=scCanvas.height;
  scCtx.fillStyle='rgba(3,16,10,0.16)'; scCtx.fillRect(0,0,W,H);   // trailing fade
  scCtx.font = FS+'px "JetBrains Mono", monospace';
  for(let i=0;i<COLS;i++){
    const x=i*(FS*0.62)+2, y=drops[i]*FS;
    const c=GLYPHS[(Math.random()*GLYPHS.length)|0];
    scCtx.fillStyle='#d9fff0'; scCtx.fillText(c, x, y);            // bright head
    scCtx.fillStyle='#1ec96a'; scCtx.fillText(GLYPHS[(Math.random()*GLYPHS.length)|0], x, y-FS);
    if(y>H && Math.random()>0.965) drops[i]=0; else drops[i]++;
  }
  screenTex.needsUpdate=true;
}

const tvman = buildTVMan();
tvman.position.y = 0.06; root.add(tvman);

/* ---- cartoon outlines (inverted-hull) for an anime-figure look ---- */
const outlineMat = new THREE.MeshBasicMaterial({color:0x3f3c35, side:THREE.BackSide});
function addOutlines(obj, grow){
  const meshes=[]; obj.traverse(o=>{ if(o.isMesh && o.material!==screenMat) meshes.push(o); });
  for(const m of meshes){
    const o=new THREE.Mesh(m.geometry, outlineMat);
    o.position.copy(m.position); o.quaternion.copy(m.quaternion);
    const r=m.geometry.boundingSphere?.radius || (m.geometry.computeBoundingSphere(),m.geometry.boundingSphere.radius) || 1;
    const f=1 + grow/Math.max(0.12, r*Math.max(m.scale.x,m.scale.y,m.scale.z));
    o.scale.copy(m.scale).multiplyScalar(f);
    o.renderOrder=-1; m.parent.add(o);
  }
}
addOutlines(tvman, 0.01);

/* ---- grass + dirt mound base ---- */
const base = new THREE.Group(); root.add(base);
add(base, cyl(1.34,1.2,0.28,mat(COL.soil),36), 0,0.02,0);
add(base, cyl(1.34,1.34,0.16,mat(COL.grass),36), 0,0.2,0);
const Mgrass=mat(COL.grass), Mgrass2=mat(0x6fa048);
for(let i=0;i<48;i++){
  const a=i/60*Math.PI*2, rr=0.42+(i*0.37%1)*0.82;
  const blade=cyl(0.0,0.04,0.16+(i*0.13%1)*0.2, (i%2?Mgrass2:Mgrass),5);
  add(base, blade, Math.cos(a)*rr, 0.32, Math.sin(a)*rr, (i*0.21%1-0.5)*0.45, a, (i*0.17%1-0.5)*0.45);
}

/* interaction: gentle sway + mouse parallax */
let mx=0,my=0,tmx=0,tmy=0;
addEventListener('mousemove',e=>{ tmx=e.clientX/innerWidth-0.5; tmy=e.clientY/innerHeight-0.5; });
let spin=0;
document.getElementById('reload').onclick=()=>{ spin += Math.PI*2; };

function resize(){
  const r=canvas.getBoundingClientRect(), w=Math.max(1,r.width), h=Math.max(1,r.height);
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  renderer.setSize(w,h,false);
  camera.aspect=w/h; camera.updateProjectionMatrix();
}
new ResizeObserver(resize).observe(canvas); resize();

const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
const clock = new THREE.Clock();
let codeAccum=0;
function tick(){
  const dt = clock.getDelta(); const T=clock.elapsedTime;
  mx+=(tmx-mx)*0.05; my+=(tmy-my)*0.05;
  spin *= 0.94;
  if(!reduce){
    root.rotation.y = Math.sin(T*0.4)*0.16 + mx*0.6 + spin;
    root.rotation.x = my*0.16;
    root.position.y = Math.sin(T*0.8)*0.05;
  }
  // advance the matrix-rain screen ~16 fps
  codeAccum += dt;
  if(codeAccum > 0.06){ codeAccum = 0; drawScreen(); }
  if(screenLight) screenLight.intensity = 3.0 + Math.sin(T*6.0)*0.35;
  renderer.render(scene,camera);
  requestAnimationFrame(tick);
}
tick();
