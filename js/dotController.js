
/* 
    this version requires changing main app from CanvasRenderer to WebGLRenderer 
    using point cloud allows for thousands of particles instead of hundreds
    using ShaderMaterial + BufferGeometry is not simple to use, but allows control of position, rotation, scale, and color
    see dotController-points-no-scale and dotController-sprites for other options
*/

const wavesAnimator = {
    update: (controller) => {
        var c = controller;
        var attributes = c.geometry.attributes;
        var i = 0;
        for (var ix = 0; ix < c.grid.w; ix++) {
            for (var iy = 0; iy < c.grid.h; iy++) {
                //var dotY = attributes.position.array[i*3+1];
                var dotY = (Math.sin((ix + count) * 0.3) * 50) + (Math.sin((iy + count) * 0.5) * 50);
                attributes.position.array[i*3+1] = dotY;

                var dotSize = (Math.sin((ix + count) * 0.3) + 1) * 8 + (Math.sin((iy + count) * 0.5) + 1) * 4;
                attributes.size.array[i] = dotSize;
                i++;
            }
        }
        count += 0.1;
        attributes.position.needsUpdate = true;
        attributes.size.needsUpdate = true;
    }
}

const mouseAnimator = {
    update: (controller) => {
        var c = controller;
        var att = c.geometry.attributes;

        var i = 0;
        for (var ix = 0; ix < c.grid.w; ix++) {
            for (var iy = 0; iy < c.grid.h; iy++) {
                //var dotSize = att.size.array[i];

                var distX = Math.abs(ix*c.grid.gap - mouseX*2);
                var distY = Math.abs(iy*c.grid.gap - mouseY*2);
                var distance = Math.sqrt(distX * distX + distY * distY);
                var dotSize = (40 - distance/8) * 4;

                if (dotSize < c.dotSize) {
                    att.size.array[i] = c.dotSize;
                } else {
                    att.size.array[i] = dotSize;              
                }

                i++;
            }
        }
        att.size.needsUpdate = true;
    }
}

class DotController {
    constructor(scene, gridW, gridH, gridGap, animator) {
        this.scene = scene;
        this.dotSize = 100;
        this.grid = { w: gridW, h: gridH, gap: gridGap };
        this.animator = animator;
    }

    setup() {
        var sprite = textureLoader.load('img/disc.png');
        //var material = new THREE.PointsMaterial({ color: 0xffffff, size: 10, map: sprite });
        var material = new THREE.ShaderMaterial( {
            uniforms: {
                color:   { value: new THREE.Color(0xffffff) },
                texture: { value: sprite }
            },
            vertexShader: document.getElementById( 'vertexshader' ).textContent,
            fragmentShader: document.getElementById( 'fragmentshader' ).textContent,

            alphaTest: 0.1,
        } );

        var numDots = this.grid.w * this.grid.h;
        var positions = new Float32Array(numDots * 3);
        var colors = new Float32Array(numDots * 3);
        var sizes = new Float32Array(numDots);
        var i = 0;
        for ( var ix = 0; ix < this.grid.w; ix++ ) {
            for ( var iy = 0; iy < this.grid.h; iy++ ) {
                var posX = ix * this.grid.gap - ((this.grid.w * this.grid.gap) / 2);
                var posZ = iy * this.grid.gap - ((this.grid.h * this.grid.gap) / 2);               

                var vec = new THREE.Vector3(posX, 0, posZ); 
                vec.toArray(positions, i * 3);

                var color = new THREE.Color(0xffffff);
                color.toArray( colors, i * 3 );

                sizes[i] = this.dotSize;

                i++;
            }
        }

        this.geometry = new THREE.BufferGeometry();
        this.geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
        this.geometry.addAttribute( 'customColor', new THREE.BufferAttribute( colors, 3 ) );
        this.geometry.addAttribute('size', new THREE.BufferAttribute(sizes, 1));
        console.log(this.geometry);

        var points = new THREE.Points(this.geometry, material);
        scene.add(points);
    }

    update() {
        this.animator.update(this);
    }
}
