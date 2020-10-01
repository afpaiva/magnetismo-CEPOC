import { GLTFLoader } from './tools/GLTFLoader.js';
import { OrbitControls } from './tools/OrbitControls.js';

const renderer = new THREE.WebGLRenderer({
  antialias:true,
  alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.querySelector("#viewport").appendChild(renderer.domElement);

const scene = new THREE.Scene();

const ambientLight = new THREE.AmbientLight (0x404040,5);
scene.add(ambientLight);
const directLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
directLight.position.set(.2,.1,0);
scene.add(directLight);

const camera = new THREE.PerspectiveCamera(75,
  window.innerWidth/window.innerHeight,
  0.1,
  1000);

const controls = new OrbitControls (camera, renderer.domElement);
camera.position.set (0,0,8);

var mixer, magnetField;
const loader = new GLTFLoader();
loader.load('./assets/modelo.glb',
  function (gltf){
    var magnets = gltf.scene.children[0];
    magnetField = gltf.scene.children[1];
    scene.add(magnets);
    scene.add(magnetField);

    mixer = new THREE.AnimationMixer(magnetField);
    var action = mixer.clipAction(gltf.animations[0]);
    action.play();
  }),
  undefined,
  function(error){
    console.error(error);
  }

var clock = new THREE.Clock();
renderer.setAnimationLoop(render);
requestAnimationFrame(render);
  
function render() {
  renderer.render(scene, camera);
  if (mixer) mixer.update(clock.getDelta());
}

window.addEventListener('resize', onResize);
function onResize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}