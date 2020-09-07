// cria a variável onde será incluida a Cena
var scene = new THREE.Scene();
// cria uma camera para possibilitar a visualização
// do modelo tridimensional
var camera = new THREE.PerspectiveCamera(
  75, // ângulo de visão (fov = field of view)
  window.innerWidth / window.innerHeight,// aspect da câmera
  // neste caso será o tamanho da janela atual do navegador
  0.1, // primeiro clipping da camera (posso explicar depois)
  1000 // último clipping da camera (também :P)
  );

// ok! Acima temos uma uma cena e uma camera configurados!

// abaixo, preparamos o renderizador
var renderer = new THREE.WebGLRenderer();
// define o tamanho do renderizador para o tamanho da janela
renderer.setSize( window.innerWidth, window.innerHeight );
// busca lá no html a div com ID = viewport
var viewport = document.querySelector("#viewport");
// e coloca na div o renderizador
viewport.appendChild( renderer.domElement );

// agora vamos inserir a geometria
// entende-se por geometria, o modelo tridimensional
var geometry = new THREE.BoxGeometry();
// também o material, que seria a textura, no caso a cor 00ff00
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// e é aplicado à geometria o seu material
var cube = new THREE.Mesh( geometry, material );
// adiciona à variável "scene" criada lá em cima o nosso cube
scene.add( cube );

// posiciona a camera na altura 5, lembra do Will? (0,0,5);
camera.position.z = 5;

// a função abaixo vai animar o cubo
function animate() {

  // a função abaixo é do JavaScript, ela pede para o navegador
  // para performar uma animação, quando chamada uma função.
  // reparem a recursividade, pois chama "animate" dentro dela mesma.
  // (me parece que é recursiva..)
  requestAnimationFrame( animate );

  // soma à rotação... e lá vem o Will de novo.. rsrs...
  // incrementa 0.01 (float) na rotação em x, e em y ao mesmo tempo.
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  // a função render está dentro do objeto renderer, pois foi criada a
  // partir de uma classe (isso é orientação ao objeto, vamos ver ainda)
  // por isso do ponto depois do nome da variável.
  // assim a gente renderiza a cena e a camera.
	renderer.render( scene, camera );
}

// executa a função
animate();

// atualiza o tamanho da página em tempo real
window.addEventListener('resize', onResize);

function onResize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}