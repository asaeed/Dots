
class SphereAnimator {
    constructor() {
        this.cameraPosition = { x: 0, y: 1000, z: 0 };
        //this.cameraRotation = { x: -Math.PI/2, y: 0, z: 0 };
    }

    setup(controller) {
        console.log('in SphereAnimator.setup()');
        var c = controller;
        var radius = 500, segments = c.grid.w, rings = c.grid.h;
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

        c.points.rotateX(0.001);
        c.points.rotateZ(0.002);
        //camera.rotateX(0.001);
    }
}
