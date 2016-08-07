
class ModelAnimator {
    constructor(model) {
        this.model = model;
    }

    setup(controller) {
        console.log('in ModelAnimator.setup()');
        var c = controller;
        var radius = 500, segments = c.grid.w, rings = c.grid.h;
        var sphere = new THREE.SphereGeometry(radius, segments, rings);
        //var vertices = sphere.vertices;
        //var vertices = THREE.GeometryUtils.randomPointsInGeometry(sphere, c.numDots);
        var frogGeometry = new THREE.Geometry().fromBufferGeometry(stlFrog.geometry);
        var vertices = THREE.GeometryUtils.randomPointsInGeometry(frogGeometry, c.numDots);
        
        for (var a = 0; a < vertices.length; a++) {
            vertices[a] = vertices[a].multiplyScalar(-10);
        }

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
