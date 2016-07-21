var gridGap = 100, gridW = 20, gridH = 20;

var container, stats;
var camera, scene, renderer, controls;

var dotController;

var count = 0;
var mouseX = 0, mouseY = 0;

var ww = window.innerWidth;
var wh = window.innerHeight;

init();
animate();

function init() {
    container = document.createElement( 'div' );
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

    dotController = new DotController(scene, gridW, gridH, gridGap, wavesAnimator)
    dotController.setup();

    renderer = new THREE.CanvasRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(ww, wh);
    container.appendChild(renderer.domElement);

    stats = new Stats();
    stats.showPanel(0);
    document.body.appendChild(stats.dom);

    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('mousemove', onMouseMove, false);
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

function animate() {
    requestAnimationFrame(animate);

    dotController.update();

    if (typeof(controls) !== 'undefined') 
        controls.update();

    stats.update();

    renderer.render(scene, camera);
}


