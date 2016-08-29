
class BlobAnimator {
    constructor() {
        this.cameraPosition = { x: 0, y: 1000, z: 0 };
        this.cameraRotation = { x: -Math.PI/2, y: 0, z: 0 };
    }

    setup(controller) {
        var c = this.controller = controller;
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
                //var posY = (Math.sin((ix) * 0.3) * 50) + (Math.sin((iy) * 0.5) * 50);
                var posY = 0;

                var vec = new THREE.Vector3(posX, posY, posZ);
                vec.toArray(positions, i * 3);
                vertices.push(vec);

                var color = new THREE.Color(0xffffff);
                color.toArray( colors, i * 3 );

                sizes[i] = c.dotSize;

                i++;
            }
        }
        this.initialPositions = vertices;
        this.initialSizes = sizes;
    }

    update(controller) {

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
                var y = Math.floor(iy/gridGap) + gridH/2 + 1;
                var k = x * gridH - y;

                var isInBlob = false;
                for (var m = 0; m < projectedBlobs.length; m++) {
                    if (isPointInPolygon([ix, iy], projectedBlobs[m]))
                        isInBlob = true;
                }

                if (isInBlob) {
                    att.size.array[k] = c.dotSize * 3;
                } else {
                    att.size.array[k] = c.dotSize;
                }
            }
        }

        // quick & messy scan - get dots within that bounding box
        // for (var ix = minX; ix < maxX; ix += gridGap) {
        //     for (var iy = minY; iy < maxY; iy += gridGap) {
        //         // not sure why the minor adjustment is needed
        //         var x = Math.floor(ix/gridGap) + gridW/2 + 2;
        //         var y = Math.floor(iy/gridGap) + gridH/2 + 1;
        //         var k = x * gridH - y;
        //         if (isPointInPolygon([ix, iy], projectedBlob)) {
        //             att.size.array[k] = c.dotSize * 2;
        //         } else {
        //             att.size.array[k] = c.dotSize;
        //         }
        //     }
        // }

        att.size.needsUpdate = true;
        att.position.needsUpdate = true;
    }
}
