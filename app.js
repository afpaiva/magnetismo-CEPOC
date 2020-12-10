import { GLTFLoader } from './tools/GLTFLoader.js';
import { OrbitControls } from './tools/OrbitControls.js';

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
var group_hand;
var play;

var mixer_field
var mixer_tetha_dif
var mixer_tetha_90
var mixer_tetha_0_180

var action_field
var action_tetha_dif
var action_tetha_90
var action_tetha_0_180

var tetha_dif;
var tetha_90;
var tetha_0_180;
var arrows;
var field;
var hand;
var magnet;

const loader = new GLTFLoader();
loader.load('./assets/modelo.glb',
  function (gltf){
    //console.log(gltf.scene);
    tetha_dif = gltf.scene.children[0];
    tetha_90 = gltf.scene.children[1];
    tetha_0_180 = gltf.scene.children[2];
    arrows = gltf.scene.children[3];
    field = gltf.scene.children[4];
    hand = gltf.scene.children[5];
    magnet = gltf.scene.children[6];

    group_hand = new THREE.Group();
    group_hand.add(hand);
    group_hand.add(arrows);
    group_hand.add(tetha_dif);
    group_hand.add(tetha_90);
    group_hand.add(tetha_0_180);

    scene.add(field);
    scene.add(magnet);
    scene.add(group_hand);

    group_hand.children[0].visible = true;//hand
    group_hand.children[1].visible = false;//arrows
    group_hand.children[2].visible = false;//tetha_dif
    group_hand.children[3].visible = false;//tetha_90
    group_hand.children[4].visible = false;//tetha_0_180

    play = true;
    mixer_field = new THREE.AnimationMixer(field);
    mixer_tetha_dif = new THREE.AnimationMixer(tetha_dif);
    mixer_tetha_90 = new THREE.AnimationMixer(tetha_90);
    mixer_tetha_0_180 = new THREE.AnimationMixer(tetha_0_180);

    action_field = mixer_field.clipAction(gltf.animations[6]);
    action_tetha_dif = mixer_tetha_dif.clipAction(gltf.animations[0]);
    action_tetha_90 = mixer_tetha_90.clipAction(gltf.animations[2]);
    action_tetha_0_180 = mixer_tetha_0_180.clipAction(gltf.animations[4]);
    console.log(gltf.animations);

    action_field.play();


  }),
  undefined,
  function(error){
    console.error(error);
  }

// define animação em loop
var clock1 = new THREE.Clock();
var clock2 = new THREE.Clock();
var clock3 = new THREE.Clock();
var clock4 = new THREE.Clock();
renderer.setAnimationLoop(render);
requestAnimationFrame(render);
// *****

function render() {
  renderer.render(scene, camera);
  if (play) {
    mixer_field.update(clock1.getDelta());
    mixer_tetha_dif.update(clock2.getDelta());
    mixer_tetha_90.update(clock3.getDelta());
    mixer_tetha_0_180.update(clock4.getDelta());
  }
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
var a = -1.5708; // rotaciona em 90graus - valor em radiano
function onClickRotate(){
  console.log (group_hand.rotation.x);
  TweenLite.to(group_hand.rotation, .5 , { x: a });
  a===-1.5708 ? a = 0 : a = -1.5708;
}

var b = 0;
document.querySelector(".botao3").addEventListener('click', onClickOpacity);
function onClickOpacity(){
  switch (b){
    case 0:
      group_hand.children[0].visible = true;//hand
      group_hand.children[1].visible = true;//arrows
      document.querySelector(".botao3").innerHTML = "<i class=\"far fa-hand-pointer\"></i> vetor + mão";
      break;

    case 1:
      group_hand.children[0].visible = false;//hand
      group_hand.children[1].visible = true;//arrows
      document.querySelector(".botao3").innerHTML = "<i class=\"far fa-hand-pointer\"></i> vetor";
      break;
      
    case 2:
      group_hand.children[0].visible = true;//hand
      group_hand.children[1].visible = false;//arrows
      document.querySelector(".botao3").innerHTML = "<i class=\"far fa-hand-pointer\"></i> mão esquerda";
      break;
  }
  console.log(b);
  b == 2 ? b = 0 : b++;
}

//slider
var sliderTetha = document.getElementById("sld_tetha");
sliderTetha.value = 0;
sliderTetha.oninput = ()=>{
  if (sliderTetha.value == 1){
    document.getElementById("tetha_label").src="assets/tetha_0_180.png";
    group_hand.children[2].visible = false;//tetha_dif
    group_hand.children[3].visible = false;//tetha_90
    group_hand.children[4].visible = true;//tetha_0_180
    action_tetha_0_180.play();
  }
  else if (sliderTetha.value == 2){
    document.getElementById("tetha_label").src="assets/tetha_dif.png";
    group_hand.children[2].visible = true;//tetha_dif
    group_hand.children[3].visible = false;//tetha_90
    group_hand.children[4].visible = false;//tetha_0_180
    action_tetha_dif.play();
  }
  else if (sliderTetha.value == 3){
    document.getElementById("tetha_label").src="assets/tetha_90.png";
    group_hand.children[2].visible = false;//tetha_dif
    group_hand.children[3].visible = true;//tetha_90
    group_hand.children[4].visible = false;//tetha_0_180
    action_tetha_90.play();
  }
  else{
    document.getElementById("tetha_label").src="assets/tetha_off.png";
    group_hand.children[2].visible = false;//tetha_dif
    group_hand.children[3].visible = false;//tetha_90
    group_hand.children[4].visible = false;//tetha_0_180
  }
}
// *****