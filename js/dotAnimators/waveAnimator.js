
class WaveAnimator {
    constructor() {
        this.cameraPosition = { x: 0, y: 160, z: 600 };
        this.cameraRotation = { x: -Math.PI/12, y: 0, z: 0 };

        this.amplitude = 20;
    }

    setup(controller) {
        var c = controller;
        this.timer = 0;

        var positions = new Float32Array(c.numDots * 3);
        var colors = new Float32Array(c.numDots * 3);
        var sizes = new Float32Array(c.numDots);

        var vertices = [];
        var i = 0;
        for ( var ix = 0; ix < c.grid.w; ix++ ) {
            for ( var iy = 0; iy < c.grid.h; iy++ ) {
                var posX = ix * c.grid.gap - ((c.grid.w * c.grid.gap) / 2);
                var posZ = iy * c.grid.gap - ((c.grid.h * c.grid.gap) / 2);
                var posY = (Math.sin((ix) * 0.3) * this.amplitude) + (Math.sin((iy) * 0.5) * this.amplitude);

                var vec = new THREE.Vector3(posX, posY, posZ);
                vec.toArray(positions, i * 3);
                vertices.push(vec);

                var color = new THREE.Color(0xffffff);
                color.toArray( colors, i * 3 );

                sizes[i] = (Math.sin((ix) * 0.3) + 1) * 6 + (Math.sin((iy) * 0.5) + 1) * 6;

                i++;
            }
        }
        this.initialPositions = vertices;
        this.initialSizes = sizes;
    }

    update(controller) {
        var c = controller;
        var attributes = c.geometry.attributes;
        var i = 0;
        for (var ix = 0; ix < c.grid.w; ix++) {
            for (var iy = 0; iy < c.grid.h; iy++) {
                //var dotY = attributes.position.array[i*3+1];
                var dotY = (Math.sin((ix + this.timer) * 0.3) * this.amplitude) + (Math.sin((iy + this.timer) * 0.5) * this.amplitude);
                attributes.position.array[i*3+1] = dotY;

                var dotSize = (Math.sin((ix + this.timer) * 0.3) + 1) * 6 + (Math.sin((iy + this.timer) * 0.5) + 1) * 6;
                attributes.size.array[i] = dotSize;
                i++;
            }
        }

        attributes.position.needsUpdate = true;
        attributes.size.needsUpdate = true;

        this.timer += 0.1;
    }
}
