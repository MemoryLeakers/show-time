var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 100000);
camera.position.set(0, -60, 0);
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
var cubes = new Array();
var controls;
//var array = new Array();
var array = [];
for (var i = 0, l = 4000; i < l; i++) {
    array.push(Math.round(Math.random() * l))
}
var boost;

document.body.appendChild(renderer.domElement);

var i = 0;
for(var x = 0; x < 20; x += 2) {
	var j = 0;
	cubes[i] = new Array();
	for(var y = 0; y < 20; y += 2) {
		//var rnd = Math.floor((Math.random() * 10) + 1);
		var geometry = new THREE.CubeGeometry(1.5, 1.5, 3);
		
		var material = new THREE.MeshPhongMaterial({
			color: randomFairColor(),
			ambient: 0x808080,
			specular: 0xffffff,
			shininess: 20,
			reflectivity: 5.5 
		});
		
		cubes[i][j] = new THREE.Mesh(geometry, material);
		cubes[i][j].position = new THREE.Vector3(x, y, 10);
		
		scene.add(cubes[i][j]);
		j++;
	}
	i++;
}

//var light = new THREE.AmbientLight(0x505050);
//scene.add(light);

var directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
directionalLight.position.set(0, 1, 1);
scene.add(directionalLight);

directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
directionalLight.position.set(1, 0, 0);
scene.add(directionalLight);


// directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
// directionalLight.position.set(0, -1, -1);
// scene.add(directionalLight);

directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
directionalLight.position.set(-1, -1, 0);
scene.add(directionalLight);

camera.position.z = 30;

controls = new THREE.OrbitControls(camera);
controls.addEventListener('change', render);

for (var i = 0; i < array.length; i++) {
    boost += array[i];
}
boost = boost / array.length;

for(var i = 0; i < 7; i++) {
	controls.pan(new THREE.Vector3( 1, 0, 0 ));
	controls.pan(new THREE.Vector3( 0, 1, 0 ));
}

var MAX_VALUE = 50;
var render = function () {
	requestAnimationFrame(render);
	//console.log(4);
	//cubes[2][3].scale.z += 0.01;
	// if(typeof array === 'object' && array.length > 0) {
	// var k = 0;
	// 	for(var i = 0; i < cubes.length; i++) {
	// 		for(var j = 0; j < cubes[i].length; j++) {
	// 			//cubes[i][j].scale.z += 0.01;
	// 			var scaleTo = getRandomInt(0, 2) / 30;
	// 			cubes[i][j].scale.z += scaleTo;//slcale < 1 ? 1 : scale);
	// 			//k += (k < array.length ? 1 : 0);
	// 		}
	// 	}
	// 	//cubes[i][j].scale.x += 1;
	// }

	//if(typeof array === 'object' && array.length > 0) {
		// var k = 0;
		// for(var i = 0; i < cubes.length; i++) {
		// 	var scale_value = 30;
		// 	for(var j = 0; j < cubes[i].length; j++) {
		// 		cubes[i][j].scale.z = frequency;
		// 		console.log(frequency);
		// 		// var scale = (array[k] + boost) * 30;
		// 		// cubes[i][j].scale.z = (scale < 1 ? 1 : scale);
		// 		// k += (k < array.length ? 1 : 0);
		// 	}
		// //}
		// 
	controls.update();
	renderer.render(scene, camera);
};

render();
//renderer.setSize($(window).width(), $(window).height());

function changeStuff(i,j){
    cubes[i][j].scale.z += 0.001;

    render();
}

function randomFairColor() {
	var min = 64;
	var max = 224;
	var r = (Math.floor(Math.random() * (max - min + 1)) + min) * 65536;
	var g = (Math.floor(Math.random() * (max - min + 1)) + min) * 256;
	var b = (Math.floor(Math.random() * (max - min + 1)) + min);
	return r + g + b;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
