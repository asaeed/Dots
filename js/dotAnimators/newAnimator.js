
class NewAnimator {
    constructor() {
        this.cameraPosition = { x: 0, y: 600, z: 660 };
        this.cameraRotation = { x: -Math.PI/4, y: 0, z: 0 };

        this.maxDist = 200;
        this.maxSteps = 80;
    }

    setup(controller) {
        var c = this.controller = controller;
        this.timer = 0;

        //var positions = new Float32Array(c.numDots * 3);
        var positions = [];
        var colors = new Float32Array(c.numDots * 3);
        var sizes = new Float32Array(c.numDots);
        var velocities = [];

        this.deltas = [];
        this.steps = [];

        var i = 0;
        for ( var ix = 0; ix < c.grid.w; ix++ ) {
            for ( var iy = 0; iy < c.grid.h; iy++ ) {
                var posX = ix * c.grid.gap - ((c.grid.w * c.grid.gap) / 2);
                var posZ = iy * c.grid.gap - ((c.grid.h * c.grid.gap) / 2);
                //var posY = (Math.sin((ix) * 0.3) * 50) + (Math.sin((iy) * 0.5) * 50);
                var posY = 0;

                var vecP = new THREE.Vector3(posX, posY, posZ);
                //vecP.toArray(positions, i * 3);
                positions.push(vecP);

                var color = new THREE.Color(0xffffff);
                color.toArray( colors, i * 3 );

                sizes[i] = c.dotSize;
                var r = Math.random() * 2;
                velocities.push(new THREE.Vector3(Math.cos(r * Math.PI) * 3, 0, Math.sin(r * Math.PI) * 3));

                this.deltas.push(new THREE.Vector3(Math.cos(r * Math.PI) * this.maxDist, 0, Math.sin(r * Math.PI) * this.maxDist));
                this.steps.push(0);

                i++;
            }
        }
        this.initialPositions = positions;
        this.initialSizes = sizes;
        this.initialVelocities = velocities;
    }

    update(controller) {
        var c = controller;
        var att = c.geometry.attributes;

        var i = 0;
        for (var ix = 0; ix < c.grid.w; ix++) {
            for (var iy = 0; iy < c.grid.h; iy++) {
                if (att.size.array[i] == c.dotSize * 1.1) {

                    if (this.steps[i] < this.maxSteps) {
                        att.position.array[i*3+0] = Easing.easeOutCubic(null, this.steps[i], this.initialPositions[i].x, this.deltas[i].x, this.maxSteps);
                        att.position.array[i*3+1] = Easing.easeOutCubic(null, this.steps[i], this.initialPositions[i].y, this.deltas[i].y, this.maxSteps);
                        att.position.array[i*3+2] = Easing.easeOutCubic(null, this.steps[i], this.initialPositions[i].z, this.deltas[i].z, this.maxSteps);
                        this.steps[i]++;
                    }

                    // if (Math.abs(att.position.array[i*3+0] - this.initialPositions[i].x) < this.maxDist) 
                    //     att.position.array[i*3+0] += att.velocity.array[i*3+0];
                    //att.position.array[i*3+1] += att.velocity.array[i*3+1];
                    // if (Math.abs(att.position.array[i*3+2] - this.initialPositions[i].z) < this.maxDist)
                    //     att.position.array[i*3+2] += att.velocity.array[i*3+2];
                } else {
                    if (att.position.array[i*3+0] != this.initialPositions[i].x) 
                        att.position.array[i*3+0] -= att.velocity.array[i*3+0];  
                    if (att.position.array[i*3+1] != this.initialPositions[i].y) 
                       att.position.array[i*3+1] -= att.velocity.array[i*3+1];
                    if (att.position.array[i*3+2] != this.initialPositions[i].z) 
                        att.position.array[i*3+2] -= att.velocity.array[i*3+2];
                }
                i++;
            }
        }
        att.position.needsUpdate = true;

        this.timer += 0.1;
    }

    blobHandler(blobs, min, max) {
        var c = this.controller;
        var att = c.geometry.attributes;

        var rangeSize = screenBox.w * max - screenBox.w * min;
        var rangeMin = screenBox.w * min;
        //console.log(rangeSize, rangeMin);

        // now effect the ones that fall on blobs
        // first get projected blob data
        var projectedBlobs = []
        for (var i = 0; i < blobs.length; i++) {
            var blobPoints = blobs[i];
            var minX = null, maxX = null, minY = null, maxY = null;
            var projectedBlob = [];
            for (var j = 0; j < blobPoints.length; j++) {
                var x = blobPoints[j].x * rangeSize/bw + rangeMin - screenBox.w/2;
                var z = -blobPoints[j].y * screenBox.h/bh + screenBox.h/2;
                projectedBlob.push([x, z]);

                // keep track of the bounding box
                if (minX == null || x < minX)
                    minX = x;
                if (maxX == null || x > maxX)
                    maxX = x;
                if (minY == null || z < minY)
                    minY = z;
                if (maxY == null || z > maxY)
                    maxY = z;
            }
            projectedBlobs.push(projectedBlob);
        }

        //console.log(minX, maxX, minY, maxY);
        //console.log(rangeMin - screenBox.w/2, rangeMin + rangeSize - screenBox.w/2, -screenBox.h/2, screenBox.h/2);

        // exhaustive scan - go through all the dots in this 1/4 region
        for (var ix = rangeMin - screenBox.w/2; ix < rangeMin + rangeSize - screenBox.w/2; ix += gridGap) {
            for (var iy = -screenBox.h/2; iy < screenBox.h/2; iy += gridGap) {
                // not sure why the minor adjustment is needed
                var x = Math.floor(ix/gridGap) + gridW/2 + 2;
                var y = Math.floor(iy/gridGap) + gridH/2 + 0;
                var k = x * gridH - y;

                var isInBlob = false;
                for (var m = 0; m < projectedBlobs.length; m++) {
                    if (isPointInPolygon([ix, iy], projectedBlobs[m]))
                        isInBlob = true;
                }

                if (isInBlob) {
                    att.size.array[k] = c.dotSize * 1.1;
                } else {
                    att.size.array[k] = c.dotSize;
                }
            }
        }

        att.size.needsUpdate = true;
        //att.position.needsUpdate = true;
    }
}
