
class SphereAnimator {
    constructor() {
    }

    setup(controller) {
        console.log('in SphereAnimator.setup()');
        var c = controller;
        var radius = 400, segments = c.grid.w, rings = c.grid.h;
        var sphere = new THREE.SphereGeometry(radius, segments, rings);
        //var vertices = sphere.vertices;
        var vertices = THREE.GeometryUtils.randomPointsInGeometry(sphere, c.numDots);
        
        this.initialPositions = vertices;

        this.initialSizes = [];
        for (var i = 0; i < vertices.length; i++) {
            this.initialSizes.push(c.dotSize);
        }
    }

    update(controller) {
        //console.log('in SphereAnimator.update()');
        var c = controller;
        var att = c.geometry.attributes;

        c.points.rotateX(0.002);
        c.points.rotateZ(0.001);
    }
}
