var gridGap = 100, gridW = 200, gridH = 200;

var container, stats;
var camera, scene, renderer, controls;
var particles, uniforms;

var textureLoader = new THREE.TextureLoader();

var dotController;
var waveAnimator, sphereAnimator, mouseAnimator;

var mouseX = 0, mouseY = 0;

var ww = window.innerWidth;
var wh = window.innerHeight;

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
    camera.up = new THREE.Vector3(0, 1, 0);
    camera.lookAt(scene.position);

    waveAnimator = new WaveAnimator();
    sphereAnimator = new SphereAnimator();
    mouseAnimator = new MouseAnimator();

    dotController = new DotController(scene, gridW, gridH, gridGap, this.mouseAnimator);
    dotController.setup();

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(ww, wh);
    container.appendChild(renderer.domElement);

    stats = new Stats();
    stats.showPanel(0);
    document.body.appendChild(stats.dom);

    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('click', onClick, false);
}

function onWindowResize() {
    ww = window.innerWidth;
    wh = window.innerHeight;

    camera.aspect = ww / wh;
    camera.updateProjectionMatrix();

    renderer.setSize(ww, wh);
}

function onMouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    // vector.set((e.clientX / ww) * 2 - 1, - (e.clientY / wh ) * 2 + 1);
    // raycaster.setFromCamera(vector,camera);

    // // check for intersects with cubes in grid
    // intersects = raycaster.intersectObjects(elements.children);
    // if (intersects.length > 0) {
    //     var cube = intersects[0].object;
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


