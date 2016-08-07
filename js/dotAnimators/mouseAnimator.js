
class MouseAnimator {
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
        var c = controller;
        var att = c.geometry.attributes;

        var i = 0;
        for (var ix = 0; ix < c.grid.w; ix++) {
            for (var iy = 0; iy < c.grid.h; iy++) {
                //var dotSize = att.size.array[i];

                // project mouseX and mouseY to where screen is
                //var mx = adjustMouseX + mouseX;
                //var my = adjustMouseY + mouseY;

                var distX = Math.abs(ix*c.grid.gap - mouseX);
                var distY = Math.abs(iy*c.grid.gap - mouseY);
                var distance = Math.sqrt(distX * distX + distY * distY);
                var dotSize = (50 - distance/8) * 2;

                if (dotSize < c.dotSize) {
                    att.size.array[i] = c.dotSize;
                    att.position.array[i*3+1] = 0;
                } else {
                    att.size.array[i] = dotSize/2;  
                    att.position.array[i*3+1] = dotSize;            
                }

                i++;
            }
        }
        att.size.needsUpdate = true;
        att.position.needsUpdate = true;
    }
}