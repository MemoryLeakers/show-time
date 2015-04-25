function init() {
    'use strict';

    var container, stats;
    var camera, controls, scene, renderer;
    var cross, light;

    init();
    animate();

    function init() {
        camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);

        // Set initial pozitions
        camera.position.x = 10;
        camera.position.z = 150;
        camera.position.y = 15;

        controls = new THREE.TrackballControls(camera);

        controls.rotateSpeed = 1.0;
        controls.zoomSpeed = 1.2;
        controls.panSpeed = 0.8;

        controls.noZoom = false;
        controls.noPan = false;

        controls.staticMoving = true;
        controls.dynamicDampingFactor = 0.3;

        controls.keys = [65, 83, 68];

        controls.addEventListener('change', render);

        // world
        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x000000, 0.002);

        // create the ground plane
        var planeGeometry = new THREE.PlaneGeometry(window.innerHeight, window.innerWidth);
        var planeMaterial = new THREE.MeshPhongMaterial({color: 0xcccccc, shading: THREE.FlatShading});
        var plane = new THREE.Mesh(planeGeometry, planeMaterial);

        // rotate and position the plane
        plane.rotation.x = -0.5 * Math.PI;
        plane.position.x = 15;
        plane.position.y = 0;
        plane.position.z = 0;

        // add the plane to the scene
        scene.add(plane);

        // create a cube
        var cubeGeometry = new THREE.BoxGeometry(10, 10, 10);
        var cubeMaterial = new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: true});

        var cubesH = [
            [-80, 5, 0],
            [-80, 15, 0],
            [-80, 25, 0],
            [-80, 35, 0],
            [-80, 45, 0],

            [-70, 25, 0],

            [-60, 5, 0],
            [-60, 15, 0],
            [-60, 25, 0],
            [-60, 35, 0],
            [-60, 45, 0]
        ];

        cubesH.forEach(function (coords) {
            var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
            cube.castShadow = true;

            // position the cubes
            cube.position.x = coords[0];
            cube.position.y = coords[1];
            cube.position.z = coords[2];

            // add the cubes to the scene
            scene.add(cube);
        });

        // add spotlight for the shadows
        var spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(-90, 100, -10);
        spotLight.castShadow = true;
        scene.add(spotLight);

        // renderer
        renderer = new THREE.WebGLRenderer({antialias: false});
        renderer.setClearColor(scene.fog.color);
        renderer.setSize(window.innerWidth, window.innerHeight);

        container = document.getElementById('WebGL-output');
        container.appendChild(renderer.domElement);

        stats = new Stats();
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.top = '0px';
        stats.domElement.style.zIndex = 100;
        container.appendChild(stats.domElement);

        window.addEventListener('resize', onWindowResize, false);

        render();
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        controls.handleResize();
        render();
    }

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
    }

    function render() {
        renderer.render(scene, camera);
        stats.update();
    }
}

window.onload = init;