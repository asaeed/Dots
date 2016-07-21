var gridGap = 100, gridW = 100, gridH = 40;

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
    // camera.position.z = 0;
    // camera.position.x = ww/2;
    // camera.position.y = wh/2;
    
    // controls = new THREE.OrbitControls(camera);
    // controls.enableDamping = true;
    // controls.dampingFactor = 0.25;
    // controls.enableZoom = true;

    scene = new THREE.Scene();

    camera.position.set(ww/2, 1000, wh/2);
    camera.up = new THREE.Vector3(0, 1, 0);
    camera.lookAt(scene.position);

    dotController = new DotController(scene, gridW, gridH, gridGap)
    dotController.setup();

    renderer = new THREE.CanvasRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(ww, wh);
    container.appendChild(renderer.domElement);

    renderer.render(scene, camera);

    stats = new Stats();
    stats.showPanel(0);
    document.body.appendChild(stats.dom);

    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    ww = window.innerWidth;
    wh = window.innerHeight;

    camera.aspect = ww / wh;
    camera.updateProjectionMatrix();

    renderer.setSize(ww, wh);
}

function animate() {
    requestAnimationFrame(animate);

    dotController.update();

    if (typeof(controls) !== 'undefined') 
        controls.update();

    stats.update();

    renderer.render(scene, camera);
}


