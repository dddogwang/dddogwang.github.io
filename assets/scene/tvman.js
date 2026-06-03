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

const root = new THREE.Group(); scene.add(root);
let screenMat=null, screenLight=null;

/* ============================================================
   Smooth low-poly "TV-man" (original asset, capsule-based body)
   ============================================================ */
// smooth-shaded material (no flatShading → rounded look)
function mat(color, extra={}){
  return new THREE.MeshStandardMaterial({color, roughness:0.82, metalness:0.0, ...extra});
}
// cel-shaded (toon) material with a stepped gradient → anime banding
const toonGrad = (()=>{ const t=new THREE.DataTexture(new Uint8Array([78,140,200,255]),4,1,THREE.RedFormat);
  t.minFilter=t.magFilter=THREE.NearestFilter; t.needsUpdate=true; return t; })();
function tmat(color){ return new THREE.MeshToonMaterial({color, gradientMap:toonGrad}); }
const COL = {
  tv:0xd3d6da, tvDark:0x6c7176, hood:0xf0b81e, hoodDk:0xcc9a17,
  pants:0x4b5230, pantsDk:0x39431f, sock:0xedd64e, sockB:0xf4eed6,
  shoe:0x3a3e84, shoeWh:0xefe9dc, skin:0xdcae8e, poleA:0xdcc64e,
  poleB:0x2b2b2b, cord:0x1e1e1e, dirt:0x6e4a2a, soil:0x57411f, grass:0x5f8d3d
};
function cap(r,len,m){ return new THREE.Mesh(new THREE.CapsuleGeometry(r,len,10,20), m); }
function sph(r,m){ return new THREE.Mesh(new THREE.SphereGeometry(r,28,20), m); }
function cyl(rt,rb,h,m,seg=24){ return new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,seg), m); }
function rbox(w,h,d,r,m){ return new THREE.Mesh(new RoundedBoxGeometry(w,h,d,4,r), m); }
function box(w,h,d,m){ return new THREE.Mesh(new THREE.BoxGeometry(w,h,d), m); }
function add(parent,mesh,x,y,z,rx=0,ry=0,rz=0,sx,sy,sz){
  mesh.position.set(x,y,z); mesh.rotation.set(rx,ry,rz);
  if(sx!==undefined) mesh.scale.set(sx,sy,sz);
  mesh.castShadow=true; mesh.receiveShadow=true; parent.add(mesh); return mesh;
}
// capsule limb spanning two points A→B (robust joints, no manual rotations)
const _up=new THREE.Vector3(0,1,0);
function limb(parent,A,B,r,m){
  const a=new THREE.Vector3(A[0],A[1],A[2]), b=new THREE.Vector3(B[0],B[1],B[2]);
  const dir=new THREE.Vector3().subVectors(b,a), len=dir.length();
  const mesh=new THREE.Mesh(new THREE.CapsuleGeometry(r, Math.max(0.04,len-2*r), 10, 18), m);
  mesh.position.copy(a).add(b).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(_up, dir.normalize());
  mesh.castShadow=mesh.receiveShadow=true; parent.add(mesh); return mesh;
}
// tapered limb segment A→B (radius rA at A, rB at B) + rounded joints
function seg(parent,A,B,rA,rB,m){
  const a=new THREE.Vector3(A[0],A[1],A[2]), b=new THREE.Vector3(B[0],B[1],B[2]);
  const dir=new THREE.Vector3().subVectors(b,a), len=dir.length();
  const mesh=new THREE.Mesh(new THREE.CylinderGeometry(rB,rA,len,22,1,false), m);
  mesh.position.copy(a).add(b).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(_up, dir.normalize());
  mesh.castShadow=mesh.receiveShadow=true; parent.add(mesh);
  const j=new THREE.Mesh(new THREE.SphereGeometry(rA,18,14), m);  // joint cap at A
  j.position.copy(a); j.castShadow=j.receiveShadow=true; parent.add(j);
  return mesh;
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
        Mlogo=mat(COL.hoodDk);

  /* ---- legs: one smooth tapered shape per leg (thigh→calf→ankle, no pinch), spread wide ---- */
  for(const s of [-1,1]){
    const leg=new THREE.Group();
    leg.position.set(s*0.24, 2.5, 0.04);
    leg.rotation.z = s*0.2;                                        // splay outward (wide stance)
    g.add(leg);
    const pts=[[0.0,-2.32],[0.155,-2.29],[0.185,-2.02],[0.218,-1.55],
               [0.2,-1.05],[0.218,-0.6],[0.252,-0.14],[0.24,0.0],[0.0,0.04]]
              .map(p=>new THREE.Vector2(p[0],p[1]));
    const lm=new THREE.Mesh(new THREE.LatheGeometry(pts,30), Mpants);
    lm.castShadow=lm.receiveShadow=true; leg.add(lm);
    // ankle cuff + chunky streetwear sneaker (flat on the ground, world space)
    add(g, cyl(0.19,0.21,0.14,MpantsDk,20), s*0.68, 0.33, 0.04);
    add(g, sph(0.23,Mshoe), s*0.68, 0.3, 0.04, 0,s*0.22,0, 1.0,0.9,1.05);     // padded ankle collar
    add(g, sph(0.31,Mshoe), s*0.68, 0.21, 0.14, 0,s*0.22,0, 0.85,0.85,1.3);   // body
    add(g, sph(0.2,MshoeWh), s*0.73, 0.22, 0.5, 0,s*0.22,0, 1.05,0.85,1.0);   // toe cap
    add(g, rbox(0.5,0.2,0.98,0.09,MshoeWh), s*0.68, 0.08, 0.16, 0,s*0.22,0);  // thick white sole
    add(g, box(0.52,0.05,1.0,Mshoe), s*0.68, 0.16, 0.16, 0,s*0.22,0);         // sole accent stripe
    add(g, rbox(0.18,0.24,0.24,0.06,MshoeWh), s*0.66, 0.3, 0.22, 0.35,s*0.22,0); // tongue
    for(let k=0;k<3;k++) add(g, cyl(0.02,0.02,0.24,Mcord,8), s*0.68, 0.32-k*0.07, 0.26+k*0.02, 0,0,Math.PI/2); // laces
  }
  // hips / waist
  add(g, sph(0.5,Mpants), 0, 2.48, 0, 0,0,0, 1.16,0.58,0.82);

  /* ---- hoodie torso (athletic V-taper: broad shoulders, slim waist, no belly) ---- */
  lathe(g, [
    [0.0,2.5],[0.4,2.5],[0.43,2.66],[0.4,2.92],[0.43,3.2],
    [0.51,3.48],[0.58,3.66],[0.55,3.8],[0.36,3.94],[0.2,4.02],[0.0,4.04]
  ], Mhood);
  add(g, cyl(0.44,0.42,0.26,MhoodDk,32), 0, 2.6, 0);            // ribbed hem (snug)
  add(g, sph(0.6,Mhood), 0, 3.68, 0.02, 0,0,0, 1.2,0.58,0.78);  // broad shoulder yoke
  for(const s of [-1,1]) add(g, sph(0.24,Mhood), s*0.56,3.62,0.0, 0,0,0, 1.0,0.95,0.95); // deltoid caps
  // centre zip + collar
  add(g, cyl(0.02,0.02,1.1,MtvDk,8), 0, 3.05, 0.4, 0.06,0,0);
  add(g, cyl(0.42,0.4,0.12,MhoodDk,28), 0, 3.86, 0.0, 0.1,0,0);  // ribbed collar
  // drawstrings
  for(const s of [-1,1]){ add(g, cyl(0.022,0.022,0.42,MtvDk,8), s*0.12, 3.5, 0.44);
    add(g, sph(0.04,MtvDk), s*0.12, 3.28, 0.44); }

  /* ---- arms: hands on the waist (akimbo) — tapered, natural flow ---- */
  for(const s of [-1,1]){
    const shoulder=[s*0.52, 3.64, 0.02];
    const elbow   =[s*0.84, 3.02,-0.06];                // elbow flared out
    const wrist   =[s*0.52, 2.66, 0.16];                // forearm end, near the hip
    const hand    =[s*0.42, 2.58, 0.2];                 // fist on the hip
    seg(g, shoulder, elbow, 0.18, 0.13, Mhood);         // upper arm (thick→thin)
    seg(g, elbow,    wrist, 0.135,0.105, Mhood);        // forearm
    add(g, cyl(0.115,0.12,0.12,MhoodDk,16), wrist[0],wrist[1],wrist[2], 0.9,0,s*0.5); // ribbed sleeve cuff
    // fist resting on the hip
    add(g, rbox(0.19,0.17,0.2,0.06,Mskin), hand[0],hand[1],hand[2], 0,s*0.2,0);
    for(let k=0;k<4;k++) add(g, sph(0.026,Mskin), hand[0]-s*0.06+k*s*0.04, hand[1]+0.06, hand[2]+0.06, 0,0,0); // knuckles
    add(g, sph(0.04,Mskin), hand[0]+s*0.07, hand[1]-0.02, hand[2]+0.02); // thumb
  }

  /* ---- neck (flowing taper: trapezius → throat) + TV head ---- */
  lathe(g, [[0.0,3.82],[0.34,3.84],[0.22,3.96],[0.17,4.12],[0.18,4.3],[0.0,4.32]], Mskin, 0,0,0, 20);
  const head = new THREE.Group(); head.position.set(0,4.74,0.04);
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
    add(head, sph(0.04,MtvDk), s*0.64,1.18,-0.22);               // tip ball
  }

  /* ---- one sleek horizontal katana, held behind the arms ---- */
  const Msteel=mat(0xc9cfd7,{metalness:0.92,roughness:0.18,envMapIntensity:1.6}),
        Medge =mat(0xeef4fb,{metalness:0.6, roughness:0.1, envMapIntensity:1.3}),
        Mtsuka=mat(0x14161d), Mwrap=mat(0x0c0e12),
        Mtsuba=mat(0x222831,{metalness:0.85,roughness:0.28,envMapIntensity:1.4}),
        Mfit  =mat(0xbf962e,{metalness:0.85,roughness:0.24,envMapIntensity:1.5});
  const katana=new THREE.Group();
  katana.position.set(-0.5, 3.0, -0.2);
  katana.rotation.set(0, 0, 0.035);                            // a touch of swagger
  // blade: extruded silhouette with a pronounced curve + pointed kissaki
  const bs=new THREE.Shape();
  bs.moveTo(0,0.078);
  bs.quadraticCurveTo(1.7,0.135, 2.85,0.12);                  // curved spine (sori)
  bs.quadraticCurveTo(3.3,0.105, 3.55,0.0);                   // tip
  bs.quadraticCurveTo(3.1,-0.02, 2.7,-0.045);
  bs.quadraticCurveTo(1.4,0.02, 0,-0.058);                    // curved edge
  bs.lineTo(0,0.078);
  const bgeo=new THREE.ExtrudeGeometry(bs,{depth:0.03,bevelEnabled:true,
    bevelThickness:0.012,bevelSize:0.011,bevelSegments:1});
  bgeo.translate(0,0,-0.015); bgeo.computeVertexNormals();
  const blade=new THREE.Mesh(bgeo,Msteel); blade.position.set(0.05,0,0);
  blade.castShadow=blade.receiveShadow=true; katana.add(blade);
  // habaki + tsuba (guard) + brass rim
  add(katana, cyl(0.075,0.08,0.1,Mfit,16), -0.04,0,0, 0,0,Math.PI/2);
  add(katana, cyl(0.18,0.18,0.045,Mtsuba,4), -0.14,0,0, 0,0,Math.PI/2, 1,1,0.62); // squared tsuba
  add(katana, cyl(0.2,0.2,0.02,Mfit,4),   -0.14,0,0, 0,0,Math.PI/2, 1,1,0.62);
  // tsuka (handle) + diamond ito wrap
  add(katana, cyl(0.058,0.064,0.74,Mtsuka,16), -0.55,0,0, 0,0,Math.PI/2);
  for(let i=0;i<8;i++){ const x=-0.22-i*0.085;
    add(katana, box(0.05,0.14,0.14,Mwrap), x,0,0, Math.PI/4,0,0); }
  add(katana, box(0.06,0.07,0.07,Mfit), -0.55,0.0,0.07);      // menuki ornament
  add(katana, cyl(0.07,0.06,0.07,Mfit,8), -0.95,0,0, 0,0,Math.PI/2); // kashira (pommel)
  // sageo tassel hanging from the guard
  add(katana, cyl(0.016,0.016,0.34,Mtsuka,6), -0.14,-0.2,0.04, 0,0,0.1);
  add(katana, sph(0.03,Mfit), -0.16,-0.38,0.04);
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
tvman.position.y = -0.1; root.add(tvman);

/* ---- cartoon outlines (inverted-hull) for an anime-figure look ---- */
const outlineMat = new THREE.MeshBasicMaterial({color:0x16140f, side:THREE.BackSide});
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
addOutlines(tvman, 0.045);

/* ---- grass + dirt mound base ---- */
const base = new THREE.Group(); root.add(base);
add(base, sph(1.4,mat(COL.dirt)), 0,-0.5,0, 0,0,0, 1.0,0.55,1.0);  // rounded mound
add(base, cyl(1.34,1.3,0.16,mat(COL.soil),28), 0,0.16,0);
add(base, cyl(1.3,1.34,0.1,mat(COL.grass),28), 0,0.26,0);
const Mgrass=mat(COL.grass), Mgrass2=mat(0x6fa048);
for(let i=0;i<60;i++){
  const a=i/60*Math.PI*2, rr=0.42+(i*0.37%1)*0.82;
  const blade=cyl(0.0,0.05,0.26+(i*0.13%1)*0.28, (i%2?Mgrass2:Mgrass),5);
  add(base, blade, Math.cos(a)*rr, 0.34, Math.sin(a)*rr, (i*0.21%1-0.5)*0.5, a, (i*0.17%1-0.5)*0.5);
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
