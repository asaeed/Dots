
/* this version requires changing main app from CanvasRenderer to WebGLRenderer */

const wavesAnimator = {
    update: (controller) => {
        var c = controller;
        var i = 0;
        for (var ix = 0; ix < c.grid.w; ix++) {
            for (var iy = 0; iy < c.grid.h; iy++) {
                var dot = c.geometry.vertices[i++];
                dot.y = (Math.sin((ix + count) * 0.3) * 50) + (Math.sin((iy + count) * 0.5) * 50);
                //dot.scale.x = dot.scale.y = (Math.sin((ix + count) * 0.3) + 1) * 4 + (Math.sin((iy + count) * 0.5) + 1) * 4;
            }
        }
        count += 0.1;
        c.geometry.verticesNeedUpdate = true;
        c.geometry.colorsNeedUpdate = true;
    }
}

const mouseAnimator = {
    update: (controller) => {
        var c = controller;
        var gridX = (mouseX * c.grid.w)/ww;
        var gridY = (mouseY * c.grid.h)/wh;
        //console.log('dot to raise: ' + gridX + ', ' + gridY);

        var i = 0;
        for (var ix = 0; ix < c.grid.w; ix++) {
            for (var iy = 0; iy < c.grid.h; iy++) {
                var dot = c.dots[i++];
                var scaleX = (12 - Math.abs(ix - gridX)) * 2;
                var scaleY = (12 - Math.abs(iy - gridY)) * 2;

                //if (i == 20) console.log('scale: ' + scaleX + ', ' + scaleY);
                if (scaleX < 1 || scaleY < 1) {
                    dot.scale.x = 1;
                    dot.scale.y = 1;
                } else {
                    dot.scale.x = dot.scale.y = (scaleX + scaleY)/2;
                    //dot.scale.y = scaleY;                
                }
            }
        }

    }
}

class DotController {
    constructor(scene, gridW, gridH, gridGap, animator) {
        this.scene = scene
        this.grid = { w: gridW, h: gridH, gap: gridGap}
        this.animator = animator;
    }

    setup() {
        var sprite = textureLoader.load('img/disc.png');
        var material = new THREE.PointsMaterial({ color: 0xffffff, size: 10, map: sprite });
        this.geometry = new THREE.Geometry();

        var i = 0;
        for ( var ix = 0; ix < this.grid.w; ix++ ) {
            for ( var iy = 0; iy < this.grid.h; iy++ ) {
                var dot = {};
                dot.position = {};
                dot.position.x = ix * this.grid.gap - ((this.grid.w * this.grid.gap) / 2);
                dot.position.z = iy * this.grid.gap - ((this.grid.h * this.grid.gap) / 2);               

                var vec = new THREE.Vector3(dot.position.x, 0, dot.position.z); 
                this.geometry.vertices.push(vec);
            }
        }

        console.log(this.geometry);

        var points = new THREE.Points(this.geometry, material);
        scene.add(points);
    }

    update() {
        this.animator.update(this);
    }
}
