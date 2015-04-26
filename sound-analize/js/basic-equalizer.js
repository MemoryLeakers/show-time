function init() {
    'use strict';

    var container, stats, plane, scene, particle, sphere;
    var camera, cameraControls, controls, renderer;
    var cross, yellowLight, greyLight, object, loader;

    var clock = new THREE.Clock();
    var chance = new Chance(new Date());

    var soundVolume = 0;

    // Coordinates for letters
    var cubesCoords = [[-180, 5, 0], [-180, 15, 0], [-180, 25, 0], [-180, 35, 0], [-180, 45, 0]];

    init();
    animateCamera();

    function init() {
        camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1, 1000);

        // Set initial positions
        camera.position.x = 1;
        camera.position.z = 1;
        camera.position.y = 150;

        loader = new THREE.BinaryLoader(true);

        // Set camera controls
        cameraControls = new THREE.TrackballControls(camera);

        cameraControls.rotateSpeed = 1.0;
        cameraControls.zoomSpeed = 1.2;
        cameraControls.panSpeed = 0.8;

        cameraControls.noZoom = false;
        cameraControls.noPan =- false;

        cameraControls.staticMoving = true;
        cameraControls.dynamicDampingFactor = 0.3;

        cameraControls.keys = [65, 83, 68];
        cameraControls.addEventListener('change', render);

        // world
        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x000000, 0.003);

        // create the ground plane
        var planeGeometry = new THREE.CircleGeometry(700, 64);
        var planeMaterial = new THREE.MeshLambertMaterial({color: 0x161616, shading: THREE.FlatShading});
        plane = new THREE.Mesh(planeGeometry, planeMaterial);

        // rotate and position the plane
        plane.rotation.x = -0.5 * Math.PI;
        plane.position.y = 0;
        plane.position.z = -20;

        // add the plane to the scene
        scene.add(plane);

        // white spotlight shining from the side, casting shadow
        var spotLight = new THREE.SpotLight(0xffffff, 2);
        spotLight.position.set(130, 100, 100);

        spotLight.castShadow = true;
        spotLight.shadowDarkness = 1;

        scene.add(spotLight);

        // Additional lights
        var light = new THREE.HemisphereLight(0xffffff, 0x000000, 1);
        scene.add(light);

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

        container.appendChild(loader.statusDomElement);
        container.appendChild(stats.domElement);

        window.addEventListener('resize', onWindowResize, false);

        var ws = new WebSocket('ws://localhost:8888/ws');

        ws.onopen = function(){
            console.log('opened');
        };
        ws.onmessage = function(ev){
            //console.log('value set to: ', ev.data);
            soundVolume = chance.integer({min: 0, max: 10});
            animateMusic(soundVolume);
        };
        ws.onclose = function(ev){
            console.log('closed');
        };
        ws.onerror = function(ev){
            console.log('error: ', ev);
        };

        render();
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        //controls.handleResize();
        render();
    }

    function animateCamera() {
        requestAnimationFrame(animateCamera);
        cameraControls.update();
    }

    function animateMusic(soundVolume){
        var l = scene.children.length;
        //remove everything
        while (l--) {
            if(Object.keys(scene.children[l]).indexOf('geometry') > -1) {
                if(scene.children[l].geometry.type === 'BoxGeometry'){
                    scene.remove(scene.children[l]);
                }
            }
        }

        var columnHeight = soundVolume;
        var columnColor = chance.color();

        var coords  = {x: 0, z: 0, y: 0};

        var cubeGeometry = new THREE.BoxGeometry(10, 10, 10);
        var cubeMaterial = new THREE.MeshLambertMaterial({color: columnColor});
        var cube, cubes, cols, hue;

        for(cols = 0; cols <= columnHeight; cols += 1) {
            hue = Math.floor(cols/10 * 30) * 12;

            columnColor = $.Color({
                hue: hue,
                saturation: 0.9,
                lightness: 0.6,
                alpha: 1
            }).toHexString();

            cubeMaterial = new THREE.MeshLambertMaterial({color: columnColor});
            console.log(columnColor);

            for (cubes = 0; cubes <= columnHeight; cubes += 1) {
                coords.y = (cubes * 10);
                coords.x = (cols * 10);

                cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
                cube.castShadow = true;

                // position the cubes
                cube.position.x = coords.x;
                cube.position.y = coords.y - coords.x;
                cube.position.z = coords.z;

                // add the cubes to the scene
                scene.add(cube);
            }
        }

        for(cols = 0; cols <= 10; cols += 1) {
            hue = Math.floor(cols/10 * 30) * 12;

            columnColor = $.Color({
                hue: hue,
                saturation: 0.9,
                lightness: 0.6,
                alpha: 1
            }).toHexString();
            cubeMaterial = new THREE.MeshLambertMaterial({color: columnColor});

            for (cubes = 0; cubes <= columnHeight; cubes += 1) {
                coords.y = (cubes * 10);
                coords.x = (cols * -10);

                cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
                cube.castShadow = true;

                // position the cubes
                cube.position.x = coords.x;
                cube.position.y = coords.y + coords.x;
                cube.position.z = coords.z;

                // add the cubes to the scene
                scene.add(cube);
            }
        }

        for(cols = 0; cols <= 10; cols += 1) {
            hue = Math.floor(cols/10 * 30) * 12;

            columnColor = $.Color({
                hue: hue,
                saturation: 0.9,
                lightness: 0.6,
                alpha: 1
            }).toHexString();

            cubeMaterial = new THREE.MeshLambertMaterial({color: columnColor});

            for (cubes = 0; cubes <= columnHeight; cubes += 1) {
                coords.z = (cubes * -10);
                coords.y = (cubes * 10);

                cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
                cube.castShadow = true;

                // position the cubes
                cube.position.x = 0;
                cube.position.y = coords.y;
                cube.position.z = coords.z + coords.y;

                // add the cubes to the scene
                scene.add(cube);
            }
        }

        for(cols = 0; cols <= 10; cols += 1) {
            hue = Math.floor(cols/10 * 30) * 12;

            columnColor = $.Color({
                hue: hue,
                saturation: 0.9,
                lightness: 0.6,
                alpha: 1
            }).toHexString();
            cubeMaterial = new THREE.MeshLambertMaterial({color: columnColor});

            for (cubes = 0; cubes <= columnHeight; cubes += 1) {
                coords.x = 0;
                coords.y = (cubes * 10);
                coords.z = (cols * -10);

                cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
                cube.castShadow = true;

                // position the cubes
                cube.position.x = coords.x;
                cube.position.y = coords.y + coords.z;
                cube.position.z = coords.z;

                // add the cubes to the scene
                scene.add(cube);
            }
        }

        for(cols = 0; cols <= 10; cols += 1) {
            hue = Math.floor(cols/10 * 30) * 12;

            columnColor = $.Color({
                hue: hue,
                saturation: 0.9,
                lightness: 0.6,
                alpha: 1
            }).toHexString();
            cubeMaterial = new THREE.MeshLambertMaterial({color: columnColor});
            for (cubes = 0; cubes <= columnHeight; cubes += 1) {
                coords.x = 0;
                coords.y = (cubes * 10);
                coords.z = (cols * 10);

                cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
                cube.castShadow = true;

                // position the cubes
                cube.position.x = coords.x;
                cube.position.y = coords.y - coords.z;
                cube.position.z = coords.z;

                // add the cubes to the scene
                scene.add(cube);
            }
        }

        render();
    }

    function render() {
        renderer.render(scene, camera);
        stats.update();
    }
}

window.onload = init;