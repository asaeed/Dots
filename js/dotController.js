
/* 
    this version requires changing main app from CanvasRenderer to WebGLRenderer 
    using point cloud allows for thousands of particles instead of hundreds
    using ShaderMaterial + BufferGeometry is not simple to use, but allows control of position, rotation, scale, and color
    see dotController-points-no-scale and dotController-sprites for other options
*/

class DotController {
    constructor(scene, gridW, gridH, gridGap, animator) {
        this.scene = scene;
        this.grid = { w: gridW, h: gridH, gap: gridGap };
        this.gridSize = { w: this.grid.w * this.grid.gap, h: this.grid.h * this.grid.gap };
        this.dotSize = 10;
        this.numDots = this.grid.w * this.grid.h;
        this.animator = animator;

        this.hasTransitionBegun = false;
        this.hasTransitionEnded = false;
        this.transitionTime = 4; // in seconds
        this.transitionTimeCam = 7;
        this.transitionSteps = 60 * this.transitionTime;
        this.stepCounter = 0;

    }

    setup() {
        // setup ground plane
        this.groundPlane = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(this.gridSize.w, this.gridSize.h), 
            new THREE.MeshBasicMaterial({ color: 0x248f24, alphaTest: 0, visible: false })
        );
        this.groundPlane.rotateX(Math.PI/2 * 3);
        scene.add(this.groundPlane);

        var sprite = textureLoader.load('img/dot.png');
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

        // this is for raycasting
        //this.mesh = new THREE.Mesh(this.geometry, material);
    }

    update() {
        if (!this.hasTransitionBegun) {
            if (typeof(controls) !== 'undefined') controls.enabled = false;
            this.setupTransition();
        } else if (!this.hasTransitionEnded) {
            this.updateTransition();
        } else {
            if (typeof(controls) !== 'undefined') controls.enabled = true;
            this.animator.update(this);
        }
    }

    setAnimator(animator) {
        this.animator = animator;

        // reset rotation of pount cloud
        this.points.rotation.x = 0;
        this.points.rotation.y = 0;
        this.points.rotation.z = 0;

        // also reset transition variables
        this.hasTransitionBegun = false;
        this.hasTransitionEnded = false;
        this.stepCounter = 0;
    }

    setupTransition() {
        this.animator.setup(this);

        // setup starting and target positions to animate to
        var positions = this.geometry.attributes.position.array;
        var sizes = this.geometry.attributes.size.array;

        this.targetPositions = this.animator.initialPositions;
        this.targetSizes = this.animator.initialSizes;

        this.startingPositions = positions.slice(0);
        this.startingSizes = sizes.slice(0);

        this.hasTransitionBegun = true;

        // also animate camera position + rotation
        var camPosition = this.animator.cameraPosition;
        if (typeof camPosition !== 'undefined') {
            var tweenPosition = new TWEEN.Tween(camera.position)
                .to({ x: camPosition.x, y: camPosition.y, z: camPosition.z }, this.transitionTimeCam * 1000)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onUpdate(function() {
                    // always look at the center of scene
                    // with this, rotation may not be needed
                    // actually better to use rotation for smooth transitions
                    camera.lookAt(scene.position);
                })
                .onComplete(function() {
                    console.log('camera moved');
                    console.log(camera.rotation);
                })
                .start();
        }

        var camRotation = this.animator.cameraRotation;
        if (typeof camRotation !== 'undefined') {
            var endRot = new THREE.Euler(camRotation.x, camRotation.y, camRotation.z, 'XYZ');
            var tweenRotation = new TWEEN.Tween(camera.rotation)
                .to({ x: endRot.x, y: endRot.y, z: endRot.z }, this.transitionTimeCam * 1000)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onUpdate(function() {
                })
                .onComplete(function() {
                    console.log('camera rotated');
                })
                .start();
        }
    }

    updateTransition() {
        //console.log('in updateTransition');
        var c = this;
        var att = c.geometry.attributes;

        var positions = att.position.array;
        var colors = att.customColor.array;
        var sizes = att.size.array;

        var p = this.stepCounter/this.transitionSteps * this.transitionTime;

        for (var i = 0, l = this.targetPositions.length; i < l; i++) {
            positions[i*3 + 0] = Easing.easeOutCubic(null, this.stepCounter, this.startingPositions[i*3 + 0], this.targetPositions[i].x - this.startingPositions[i*3 + 0], this.transitionSteps);
            positions[i*3 + 1] = Easing.easeOutCubic(null, this.stepCounter, this.startingPositions[i*3 + 1], this.targetPositions[i].y - this.startingPositions[i*3 + 1], this.transitionSteps);
            positions[i*3 + 2] = Easing.easeOutCubic(null, this.stepCounter, this.startingPositions[i*3 + 2], this.targetPositions[i].z - this.startingPositions[i*3 + 2], this.transitionSteps);

            var color = new THREE.Color(0xffffff);
            color.toArray(colors, i * 3);

            sizes[i] = Easing.easeOutCubic(null, this.stepCounter, this.startingSizes[i], this.targetSizes[i] - this.startingSizes[i], this.transitionSteps);
        }

        att.position.needsUpdate = true;
        att.customColor.needsUpdate = true;
        att.size.needsUpdate = true;

        this.stepCounter++;
        if (this.stepCounter > this.transitionSteps) {
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
                var posX = Math.random() * this.gridSize.w - (this.gridSize.w / 2);
                var posY = 0;
                var posZ = Math.random() * this.gridSize.h - (this.gridSize.h / 2);               

                var vec = new THREE.Vector3(posX, posY, posZ); 
                vec.toArray(positions, i * 3);

                var color = new THREE.Color(0xffffff);
                color.toArray(colors, i * 3);

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
