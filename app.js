import { GLTFLoader } from './tools/GLTFLoader.js';
import { OrbitControls } from './tools/OrbitControls.js';
import { MeshLambertMaterial } from './tools/three.module.js';

// carrega o renderizador
const renderer = new THREE.WebGLRenderer({
  antialias:true,
  alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.querySelector("#viewport").appendChild(renderer.domElement);
// *****

// cria uma instância para cena
const scene = new THREE.Scene();

// insere luz na cena
const ambientLight = new THREE.AmbientLight (0x404040,5);
scene.add(ambientLight);
const directLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
directLight.position.set(.2,.1,0);
scene.add(directLight);
// *****

// cria uma instância para câmera
const camera = new THREE.PerspectiveCamera(75,
  window.innerWidth/window.innerHeight,
  0.1,
  1000);
// *****

// cria uma instância para controle de órbita
const controls = new OrbitControls (camera, renderer.domElement);
camera.position.set (0,0,8);
// *****

// mixer = instância de animação
// magnetField = objeto animado  -> campo magnético
// magnets     = objeto estático -> imãs
var mixer, play;
var magnets, magnetField, hand;
const loader = new GLTFLoader();
loader.load('./assets/modelo.glb',
  function (gltf){
    magnets = gltf.scene.children[0];
    magnetField = gltf.scene.children[1];
    hand = gltf.scene.children[2];
    scene.add(magnets);
    scene.add(magnetField);
    scene.add(hand);

    mixer = new THREE.AnimationMixer(magnetField);
    play = true;
    var action = mixer.clipAction(gltf.animations[0]);
    action.play();
  }),
  undefined,
  function(error){
    console.error(error);
  }

// define animação em loop
var clock = new THREE.Clock();
renderer.setAnimationLoop(render);
requestAnimationFrame(render);
// *****

function render() {
  renderer.render(scene, camera);
  if (play) mixer.update(clock.getDelta());
}

// listeners: ajuste conforme tamanho da janela do navegador
window.addEventListener('resize', onResize);
function onResize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}
// *****

// listeners: cliques e alterações de inputs
document.querySelector(".botao1").addEventListener('click', onClickPauseAnim);
function onClickPauseAnim(){
  if (play) play = false;
  else if (!play) play = true;
}
document.querySelector(".botao2").addEventListener('click', onClickRotate);
var a = 1.5708; // rotaciona em 90graus - valor em radiano
function onClickRotate(){
  console.log (hand.rotation.x);
  TweenLite.to(hand.rotation, .5 , { x: a });
  a+=1.5708;
}
// *****
document.querySelector(".botao3").addEventListener('click', onClickOpacity);
function onClickOpacity(){
  console.log(hand);
  hand.visible = true;
}
// *****