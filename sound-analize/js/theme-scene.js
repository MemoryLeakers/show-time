function theme() {
    'use strict';

    var container, stats, plane, scene;
    var camera, cameraControls, renderer;
    var cross, object, loader, sceneName = 'equalizer';

    var clock = new THREE.Clock();
    var chance = new Chance(new Date());

    var soundVolume = 0, frequency = [];

    // Coordinates for letters
    var cubesCoords = [
        // H
        [-180, 5, 0], [-180, 15, 0], [-180, 25, 0], [-180, 35, 0], [-180, 45, 0], [-170, 25, 0], [-160, 5, 0], [-160, 15, 0], [-160, 25, 0], [-160, 35, 0], [-160, 45, 0],
        // a
        [-140, 5, 0], [-140, 15, 0], [-140, 35, 0], [-130, 15, 0], [-130, 35, 0], [-120, 5, 0], [-120, 15, 0], [-120, 25, 0], [-120, 35, 0],
        // c
        [-100, 5, 0], [-100, 15, 0], [-100, 25, 0], [-100, 35, 0], [-90, 5, 0], [-90, 35, 0], [-80, 5, 0], [-80, 25, 0], [-80, 35, 0],
        // k
        [-60, 5, 0], [-60, 15, 0], [-60, 25, 0], [-60, 35, 0], [-60, 45, 0], [-50, 15, 0], [-50, 25, 0], [-40, 5, 0], [-40, 35, 0],

        // F
        [-20, 5, 0], [-20, 15, 0], [-20, 25, 0], [-20, 35, 0], [-20, 45, 0], [-10, 25, 0], [-10, 45, 0], [0, 25, 0], [0, 45, 0],
        // M
        [20, 5, 0], [20, 15, 0], [20, 25, 0], [20, 35, 0], [20, 45, 0], [30, 45, 0], [40, 5, 0], [40, 15, 0], [40, 25, 0], [40, 35, 0], [40, 45, 0], [50, 45, 0], [60, 5, 0], [60, 15, 0], [60, 25, 0], [60, 35, 0], [60, 45, 0],
        // I
        [80, 5, 0], [80, 45, 0], [90, 5, 0], [90, 15, 0], [90, 25, 0], [90, 35, 0], [90, 45, 0], [100, 5, 0], [100, 45, 0]
    ];

    // sort by y in order to make more proportional visualizations
    //cubesCoords.sort(function (a, b) {
    //    return a[1] - b[1];
    //});

    init();
    animateCamera();

    function init() {
        camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 1, 1000);

        // Set initial positions
        camera.position.x = 10;
        camera.position.z = 170;
        camera.position.y = 20;

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
        var spotLight = new THREE.SpotLight( 0xffffff, 2);
        spotLight.position.set(130, 100, 100);

        spotLight.castShadow = true;
        spotLight.shadowDarkness = 1;

        scene.add( spotLight );

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

        window.addEventListener('keydown', toggleScenes, false);

        connectionManager();

        render();
    }

    function connectionManager() {
        var ws = new WebSocket('ws://localhost:8888/ws');

        ws.onopen = function(){
            console.log('opened');
        };

        ws.onmessage = function(ev){
            soundVolume = JSON.parse(ev.data).volume;
            frequency = JSON.parse(ev.data).frequency;

            console.log('socket data:', ev.data);
            animateMusic(soundVolume, frequency, sceneName);
        };

        ws.onclose = function(ev){
            console.log('closed');
        };

        ws.onerror = function(ev){
            console.log('error: ', ev);
        };
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        //controls.handleResize();
        render();
    }

    function toggleScenes(event){
        var key = event.keyCode;

        console.log(key);
        if (key === 32) {
            sceneName = 'hack';
        } else {
            sceneName = 'equalizer';
        }
        render();
    }

    function animateCamera() {
        requestAnimationFrame(animateCamera);
        cameraControls.update();
    }

    function cleanBoxes(){
        var l = scene.children.length;
        //remove everything
        while (l--) {
            if(Object.keys(scene.children[l]).indexOf('geometry') > -1) {
                if(scene.children[l].geometry.type === 'BoxGeometry'){
                    scene.remove(scene.children[l]);
                }
            }
        }
    }

    function animateMusic(soundVolume, frequency, sceneName){
        cleanBoxes();

        //requestAnimationFrame(animateMusic);
        render();
    }

    function renderHackFMI(soundVolume, frequency){
        // redraw letter cubes
        cubesCoords.forEach(function (coords, i) {
            // create a cube
            var cubeGeometry = new THREE.BoxGeometry(10, 10, 10);
            var cubeMaterial;

            if (coords[0] > -30) {
                cubeMaterial = new THREE.MeshLambertMaterial({color: 0xCC9900});
            } else {
                cubeMaterial = new THREE.MeshLambertMaterial({color: 0xEEEEEE});
            }

            var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
            cube.castShadow = true;

            // position the cubes
            cube.position.x = coords[0] + frequency[i] * 100 + soundVolume;
            cube.position.y = coords[1] + frequency[i] * 100;
            cube.position.z = coords[2] + Math.round(soundVolume) * 3;

            // add the cubes to the scene
            scene.add(cube);
        });
    }

    function renderEqualizer(soundVolume, frequency){
        var columnHeight = soundVolume / 5;
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
    }

    function render() {

        if(sceneName === 'hack'){
            renderHackFMI(soundVolume, frequency);
        } else if (sceneName === 'equalizer' ){
            renderEqualizer(soundVolume, frequency);
        }

        renderer.render(scene, camera);
        stats.update();
    }
}

window.onload = theme;