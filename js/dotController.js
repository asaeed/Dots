
/* 
    this version requires changing main app from CanvasRenderer to WebGLRenderer 
    using point cloud allows for thousands of particles instead of hundreds
    using ShaderMaterial + BufferGeometry is not simple to use, but allows control of position, rotation, scale, and color
    see dotController-points-no-scale and dotController-sprites for other options
*/

class DotController {
    constructor(scene, gridW, gridH, gridGap, arranger, animator) {
        this.scene = scene;
        this.dotSize = 10;
        this.grid = { w: gridW, h: gridH, gap: gridGap };
        this.arranger = arranger;
        this.animator = animator;
    }

    setup() {
        var sprite = textureLoader.load('img/disc.png');
        //var material = new THREE.PointsMaterial({ color: 0xffffff, size: 10, map: sprite });
        var material = new THREE.ShaderMaterial({
            uniforms: {
                color:   { value: new THREE.Color(0xffffff) },
                texture: { value: sprite }
            },
            vertexShader: document.getElementById('vertexshader').textContent,
            fragmentShader: document.getElementById('fragmentshader').textContent,

            alphaTest: 0.1,
        });

        this.geometry = this.arranger.getGeometry(this);

        this.points = new THREE.Points(this.geometry, material);
        scene.add(this.points);

        console.log(this.points);
    }

    update() {
        this.animator.update(this);
    }
}
