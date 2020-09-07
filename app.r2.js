import { GLTFLoader } from './tools/GLTFLoader.js';
import { OrbitControls } from './tools/OrbitControls.js';
import { AnimationMixer } from './tools/three.module.js';

const renderer = new THREE.WebGLRenderer({
  antialias:true,
  alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.querySelector("#viewport").appendChild(renderer.domElement);

const scene = new THREE.Scene();
//scene.background = new THREE.Color(0xdddddd);

const ambientLight = new THREE.AmbientLight (0x404040,100);
scene.add(ambientLight);

const camera = new THREE.PerspectiveCamera(75,
  window.innerWidth/window.innerHeight,
  0.1,
  1000);

const controls = new OrbitControls (camera, renderer.domElement);
camera.position.set (0,0,8);

const loader = new GLTFLoader();
loader.load('./assets/modelo.glb',
  function (gltf){
    var modelo = gltf.scene;



    scene.add(modelo);
  }),
  undefined,
  function(error){
    console.error(error);
  }

animate();
render();

function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}

function animate() {

  requestAnimationFrame( animate );
  controls.update();
	renderer.render( scene, camera );

}

window.addEventListener('resize', onResize);

function onResize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}