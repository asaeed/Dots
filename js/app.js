
/*
  Dots
  www.niltoid.com
  asaeed@gmail.com

  TODO:
  - how do dots look when glowy
  * stick dots on 3d frog
  - make blob mirror
  - make blobs into lumps in 3d space
  * tween camera in addition to point-cloud
  - perspective issues on wide screen

*/

var gridGap = 30, gridW = 180, gridH = 24;
var fov = 20;

var container, stats;
var camera, scene, renderer, controls, uniforms;

var intersects;
var elements = new THREE.Object3D();
var raycaster = new THREE.Raycaster();
raycaster.params.Points.threshold = 70;  // radius around each point that will be detected
var vector = new THREE.Vector2();
var textureLoader = new THREE.TextureLoader();

var dotController;
var waveAnimator, sphereAnimator, mouseAnimator, modelAnimator, blobAnimator, holeAnimator, newAnimator;
var screenBox = {};

var ww = window.innerWidth;
var wh = window.innerHeight;

var mouseX = 0, mouseY = 0;

var adjustMouseX = gridGap * gridW/2 - ww/2;
var adjustMouseY = gridGap * gridH/2 - wh/2;

var objPerson;
var objLoader = new THREE.OBJLoader();

var stlFrog;
var stlLoader = new THREE.STLLoader();

var yellowMaterial = new THREE.MeshBasicMaterial({ visible: true, color: 'yellow', side: THREE.DoubleSide });
var lineMaterial = new THREE.LineBasicMaterial({ color: '#de3e1c' });

// size of incoming blob data
var bw = 480;
var bh = 360;
var lines = [];

// objLoader.load('img/person.obj', function (obj) {
//     obj.traverse(function (child) {
//         if (child instanceof THREE.Mesh) {
//             child.material = objMaterial;
//         }
//     });
//     init();

//     objPerson = obj;
//     objPerson.scale.set(400, 400, 400);

//     console.log(objPerson);

//     //scene.add(obj);
//     animate();
// });

stlLoader.load('img/frog.stl', function (geometry) {

    geometry.rotateX(3*Math.PI/2);
    geometry.rotateY(-Math.PI/4);
    //geometry.rotateZ(Math.PI/4);

    stlFrog = new THREE.Mesh(geometry, yellowMaterial);

    init();
    //scene.add(stlFrog);
    animate();
});

// init();
// animate();

function init() {
    initWebSocket('localhost', 0.25, 0.50);

    container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(fov, ww/wh, 1, 10000);
    //camera = new THREE.OrthographicCamera(ww/-2, ww/2, wh/2, wh/-2, 1, 10000);

    // adding controls breaks code based camera rotation
    // controls = new THREE.OrbitControls(camera);
    // controls.enableDamping = true;
    // controls.dampingFactor = 0.25;
    // controls.enableZoom = true;

    scene = new THREE.Scene();

    camera.position.set(0, 1000, 0);
    //camera.up = new THREE.Vector3(0, 1, 0);
    camera.lookAt(scene.position);

    waveAnimator = new WaveAnimator();
    sphereAnimator = new SphereAnimator();
    mouseAnimator = new MouseAnimator();
    modelAnimator = new ModelAnimator(stlFrog);
    blobAnimator = new BlobAnimator();
    holeAnimator = new HoleAnimator();
    newAnimator = new NewAnimator();

    dotController = new DotController(scene, gridW, gridH, gridGap, blobAnimator);
    dotController.setup();

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    //renderer.autoClear = false;
    renderer.setClearColor(0x000000, 0.0);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(ww, wh);
    container.appendChild(renderer.domElement);
    renderer.render(scene, camera);

    stats = new Stats();
    stats.showPanel(0);
    document.body.appendChild(stats.dom);

    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('click', onClick, false);

    window.setInterval(function() {
        if (typeof dotController.animator.blobHandler !== 'undefined') {
            var data = {};
            data.blobs = [
                [
                    { x: 240, y: 100 },
                    { x: 400, y: 100 },
                    { x: 480, y: 200 },
                    { x: 400, y: 360 },
                    { x: 300, y: 360 },
                    { x: 240, y: 100 }
                ],
                [
                    { x: 0, y: 0 },
                    { x: 100, y: 200 },
                    { x: 200, y: 200 },
                    { x: 200, y: 0 }
                ]
            ];

            // a quarter of the screen in the middle
            //drawBlobs(data, 0.75, 1);
            dotController.animator.blobHandler(data.blobs, 0.75, 1);
        }
    }, 10);

    onWindowResize();
}

function initWebSocket(host, min, max) {
    var ws = new WebSocket('ws://' + host + ':8181/');

    ws.onopen = function() {
      ws.send('{ type: "blob" }');
      console.log('Message is sent...');
    };

    ws.onmessage = function(e) {
      var data = JSON.parse(e.data);

      // for debugging - red line blobs
      //drawBlobs(data, min, max);

      // if the animator can handle blobs...
      if (typeof dotController.animator.blobHandler !== 'undefined')
        dotController.animator.blobHandler(data.blobs, min, max);
    };

    ws.onclose = function() {
      console.log('Connection is closed...');
    };
}

function onWindowResize() {
    ww = window.innerWidth;
    wh = window.innerHeight;

    camera.aspect = ww / wh;
    camera.updateProjectionMatrix();

    renderer.setSize(ww, wh);

    screenBox.topLeft = screenToWorld(0, 0);
    screenBox.bottomRight = screenToWorld(ww, wh);
    screenBox.w = screenBox.bottomRight.x - screenBox.topLeft.x;
    screenBox.h = screenBox.bottomRight.z - screenBox.topLeft.z;
    console.log(screenBox);
    console.log(ww/wh);
}

function onMouseMove(e) {
    e.preventDefault();

    // what are these magic numbers?
    // they only work when ww/wh is 9.12
    mouseX = e.clientX/ww * screenBox.w + 1000;
    mouseY = e.clientY/wh * screenBox.h + 1200;

    // var mousePos = screenToWorld(e.clientX, e.clientY);
    // mouseX = mousePos.x;
    // mouseY = mousePos.z;

    //console.log(mouseX, mouseY);
}

var clickCounter = 0;
function onClick(e) {
    if (clickCounter % 5 == 0)
        dotController.setAnimator(this.holeAnimator);
    else if (clickCounter % 5 == 1)
        dotController.setAnimator(this.modelAnimator);
    else if (clickCounter % 5 == 2)
        dotController.setAnimator(this.sphereAnimator);
    else if (clickCounter % 5 == 3)
        dotController.setAnimator(this.waveAnimator);
    else
        dotController.setAnimator(this.blobAnimator);
    clickCounter++;
}

function animate(time) {
    requestAnimationFrame(animate);

    dotController.update();

    TWEEN.update(time);

    if (typeof(controls) !== 'undefined')
        controls.update();

    stats.update();

    renderer.render(scene, camera);
}

function screenToWorld(x, y) {
    vector.set((x / ww) * 2 - 1, - (y / wh ) * 2 + 1);
    raycaster.setFromCamera(vector, camera);
    intersects = raycaster.intersectObject(dotController.groundPlane);
    if (intersects.length > 0) {
        return intersects[0].point;
    } else {
        return null;
    }
}

function drawBlobs(data, min, max) {
    // remove old lines
    for (var h = 0; h < lines.length; h++) {
        scene.remove(lines[h]);
    }
    lines = [];

    for (var i = 0; i < data.blobs.length; i++) {
        var blobPoints = data.blobs[i];
        var geometry = new THREE.Geometry();
        for (var j = 0; j < blobPoints.length; j++) {
            var rangeSize = screenBox.w * max - screenBox.w * min;
            var rangeMin = screenBox.w * min;

            var x = blobPoints[j].x * rangeSize/bw + rangeMin - screenBox.w/2;
            var z = blobPoints[j].y * screenBox.h/bh - screenBox.h/2;

            geometry.vertices.push(new THREE.Vector3(x, 0, z));
        }

        // draw contour
        lines.push(new THREE.Line(geometry, lineMaterial));
        scene.add(lines[i]);
    }
}
