
const barker = (state) => ({
    bark: () => console.log('Woof, I am ' + state.name)
})

const wavesAnimator = {
    update: (controller) => {
        var c = controller;
        var i = 0;
        for ( var ix = 0; ix < c.grid.w; ix++ ) {
            for ( var iy = 0; iy < c.grid.h; iy++ ) {
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
        //console.log('mouse position: ' + mouseX + ', ' + mouseY);
        
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
