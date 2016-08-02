
/*
  Dots
  www.niltoid.com
  asaeed@gmail.com

  TODO:
  - make dots shiny
  - stick dots on 3d frog
  - make blob mirror
  - make blobs into lumps in 3d space
  - tween camera in addition to point-cloud

*/

var gridGap = 100, gridW = 60, gridH = 60;

var container, stats;
var camera, scene, renderer, controls, uniforms;

var intersects;
var elements = new THREE.Object3D();
var raycaster = new THREE.Raycaster();
raycaster.params.Points.threshold = 70;  // radius around each point that will be detected
var vector = new THREE.Vector2();
var textureLoader = new THREE.TextureLoader();

var dotController;
var waveAnimator, sphereAnimator, mouseAnimator;
var screenBox = {};

var ww = window.innerWidth;
var wh = window.innerHeight;

var mouseX = 0, mouseY = 0;

var adjustMouseX = gridGap * gridW/2 - ww/2;
var adjustMouseY = gridGap * gridH/2 - wh/2;

init();
animate();

function init() {
    container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(75, ww/wh, 1, 10000);
    
    controls = new THREE.OrbitControls(camera);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;

    scene = new THREE.Scene();

    camera.position.set(0, 1000, 0);
    //camera.up = new THREE.Vector3(0, 1, 0);
    camera.lookAt(scene.position);

    waveAnimator = new WaveAnimator();
    sphereAnimator = new SphereAnimator();
    mouseAnimator = new MouseAnimator();

    dotController = new DotController(scene, gridW, gridH, gridGap, this.mouseAnimator);
    dotController.setup();

    renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    //renderer.autoClear = false;
    renderer.setClearColor(0x000000, 0.0);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(ww, wh);
    container.appendChild(renderer.domElement);

    stats = new Stats();
    stats.showPanel(0);
    document.body.appendChild(stats.dom);

    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('click', onClick, false);

    onWindowResize();
}

function onWindowResize() {
    ww = window.innerWidth;
    wh = window.innerHeight;

    camera.aspect = ww / wh;
    camera.updateProjectionMatrix();

    renderer.setSize(ww, wh);

    adjustMouseX = gridGap * gridW/2 - ww/2;
    adjustMouseY = gridGap * gridH/2 - wh/2;

    /*
        screenBoxPosX         mousePosX
        ----------      =     ----------
        screenBoxW            ww

    */

    screenBox.topLeft = screenToWorld(0, 0);
    screenBox.bottomRight = screenToWorld(ww, wh);
    console.log(screenBox);
    // if (typeof screenBox.topLeft !== 'undefined') {
    //     adjustMouseX = (screenBox.bottomRight.x - screenBox.topLeft.x) + gridGap * gridW/2 - ww/2;
    //     adjustMouseY = screenBox.topLeft.y + gridGap * gridH/2 - wh/2;
    //     console.log('adjust mouse: ' + adjustMouseX + ', ' + adjustMouseY);
    // }
}

function onMouseMove(e) {
    e.preventDefault();

    mouseX = e.clientX + adjustMouseX;
    mouseY = e.clientY + adjustMouseY;

    //mouseX = e.clientX/ww * (screenBox.bottomRight.x - screenBox.topLeft.x) + screenBox.topLeft.x;
    //mouseY = e.clientY/wh * (screenBox.bottomRight.y - screenBox.topLeft.y) + screenBox.topLeft.y;

    //mouseX = ( event.clientX / window.innerWidth ) * 2 - 1;
    //mouseY = - ( event.clientY / window.innerHeight ) * 2 + 1;
    
    // vector.set((e.clientX / ww) * 2 - 1, - (e.clientY / wh ) * 2 + 1);
    // raycaster.setFromCamera(vector, camera);
    // //dotController.points.geometry.boundingBox = null;
    // intersects = raycaster.intersectObject(dotController.points);
    // if (intersects.length > 0) {
    //     var cube = intersects[0].object;
    //     console.log(intersects);
    // }
}

var clickCounter = 0;
function onClick(e) {
    if (clickCounter % 3 == 0)
        dotController.setAnimator(this.sphereAnimator);
    else if (clickCounter % 3 == 1)
        dotController.setAnimator(this.mouseAnimator);
    else 
        dotController.setAnimator(this.waveAnimator);
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
    intersects = raycaster.intersectObject(dotController.points);
    if (intersects.length > 0) {
        return intersects[0].point;
    } else {
        return null;
    }
}

