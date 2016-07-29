
/* 
    this version requires changing main app from CanvasRenderer to WebGLRenderer 
    using point cloud allows for thousands of particles instead of hundreds
    using ShaderMaterial + BufferGeometry is not simple to use, but allows control of position, rotation, scale, and color
    see dotController-points-no-scale and dotController-sprites for other options
*/

class DotController {
    constructor(scene, gridW, gridH, gridGap, animator) {
        this.scene = scene;
        this.dotSize = 10;
        this.grid = { w: gridW, h: gridH, gap: gridGap };
        this.numDots = this.grid.w * this.grid.h;
        this.animator = animator;

        this.hasTransitionBegun = false;
        this.hasTransitionEnded = false;
        this.transitionTime = 8; // in seconds
        this.transitionSteps = 60 * this.transitionTime;
        this.stepCounter = 0;
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

        this.geometry = this.getInitialGeometry(this);
        this.points = new THREE.Points(this.geometry, material);
        scene.add(this.points);
    }

    update() {
        if (!this.hasTransitionBegun) {
            this.setupTransition();
        } else if (!this.hasTransitionEnded) {
            this.updateTransition();
        } else {
            this.animator.update(this);
        }
    }

    setAnimator(animator) {
        this.animator = animator;

        // also reset transition variables
        this.hasTransitionBegun = false;
        this.hasTransitionEnded = false;
        this.stepCounter = 0;
    }

    setupTransition() {
        console.log('in setupTransition');
        this.animator.setup(this);

        var positions = this.geometry.attributes.position.array;
        var sizes = this.geometry.attributes.size.array;

        var targetPositions = this.animator.initialPositions;
        var targetSizes = this.animator.initialSizes;

        this.positionSteps = [];
        this.sizeSteps = [];
        for (var a = 0; a < targetPositions.length; a++) {
            // setup position increments
            var currentPosition = new THREE.Vector3(positions[a*3], positions[a*3+1], positions[a*3+2]);
            var scalar = 1/this.transitionSteps;
            this.positionSteps.push(targetPositions[a].clone().sub(currentPosition).multiplyScalar(scalar));
        
            // setup size increments
            this.sizeSteps.push((targetSizes[a] - sizes[a]) / this.transitionSteps)
        }

        this.hasTransitionBegun = true;
    }

    updateTransition() {
        console.log('in updateTransition');
        var c = this;
        var att = c.geometry.attributes;

        var positions = att.position.array;
        var colors = att.customColor.array;
        var sizes = att.size.array;

        for (var i = 0, l = this.positionSteps.length; i < l; i++) {
            positions[i*3] += this.positionSteps[i].x;
            positions[i*3 + 1] += this.positionSteps[i].y;
            positions[i*3 + 2] += this.positionSteps[i].z;

            var color = new THREE.Color(0xffffff);
            color.toArray(colors, i * 3);

            sizes[i] += this.sizeSteps[i];
        }

        att.position.needsUpdate = true;
        att.customColor.needsUpdate = true;
        att.size.needsUpdate = true;

        this.stepCounter++;
        if (this.stepCounter >= this.transitionSteps) {
            this.hasTransitionEnded = true;
        }
    }

    getInitialGeometry() {
        var positions = new Float32Array(this.numDots * 3);
        var colors = new Float32Array(this.numDots * 3);
        var sizes = new Float32Array(this.numDots);

        var i = 0;
        for ( var ix = 0; ix < this.grid.w; ix++ ) {
            for ( var iy = 0; iy < this.grid.h; iy++ ) {
                var posX = Math.random() * this.grid.w * this.grid.gap - ((this.grid.w * this.grid.gap) / 2);
                var posY = 2000;
                var posZ = Math.random() * this.grid.h * this.grid.gap - ((this.grid.h * this.grid.gap) / 2);               

                var vec = new THREE.Vector3(posX, posY, posZ); 
                vec.toArray(positions, i * 3);

                var color = new THREE.Color(0xffffff);
                color.toArray( colors, i * 3 );

                sizes[i] = this.dotSize;

                i++;
            }
        }

        var geometry = new THREE.BufferGeometry();
        geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.addAttribute( 'customColor', new THREE.BufferAttribute( colors, 3 ) );
        geometry.addAttribute('size', new THREE.BufferAttribute(sizes, 1));
        return geometry;
    }
}
