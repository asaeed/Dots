
const barker = (state) => ({
    bark: () => console.log('Woof, I am ' + state.name)
})

const wavesAnimator = {
    update: (controller) => {
        var c = controller;
        var i = 0;
        for (var ix = 0; ix < c.grid.w; ix++) {
            for (var iy = 0; iy < c.grid.h; iy++) {
                var dot = c.dots[i++];
                dot.position.y = (Math.sin((ix + count) * 0.3) * 50) + (Math.sin((iy + count) * 0.5) * 50);
                dot.scale.x = dot.scale.y = (Math.sin((ix + count) * 0.3) + 1) * 4 + (Math.sin((iy + count) * 0.5) + 1) * 4;
            }
        }
        count += 0.1;
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
        this.dots = new Array();
        this.animator = animator;
    }

    setup() {
        var material = new THREE.SpriteCanvasMaterial( {
            color: 0xffffff,
            program: function (context) {
                context.beginPath();
                context.arc(0, 0, 0.5, 0, Math.PI * 2, true);
                context.fill();
            }
        });

        var i = 0;
        for ( var ix = 0; ix < this.grid.w; ix++ ) {
            for ( var iy = 0; iy < this.grid.h; iy++ ) {
                var dot = this.dots[i++] = new THREE.Sprite(material);
                dot.position.x = ix * this.grid.gap - ((this.grid.w * this.grid.gap) / 2);
                dot.position.z = iy * this.grid.gap - ((this.grid.h * this.grid.gap) / 2);
                scene.add(dot);
            }
        }
    }

    update() {
        this.animator.update(this);
    }
}
