
const sphereArranger = {
    getGeometry: (controller) => {
        var c = controller;

        var radius = 400, segments = 20, rings = 16;
        c.sphere = new THREE.SphereGeometry(radius, segments, rings);

        var numDots = c.grid.w * c.grid.h;
        var positions = new Float32Array(numDots * 3);
        var colors = new Float32Array(numDots * 3);
        var sizes = new Float32Array(numDots);

        var vertices = c.sphere.vertices;
        for ( var i = 0, l = vertices.length; i < l; i ++ ) {
			var vertex = vertices[i];
			vertex.toArray( positions, i * 3 );

			var color = new THREE.Color(0xffffff);
			color.toArray( colors, i * 3 );

			sizes[i] = 10;
		}

        var geometry = new THREE.BufferGeometry();
        geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.addAttribute( 'customColor', new THREE.BufferAttribute( colors, 3 ) );
        geometry.addAttribute('size', new THREE.BufferAttribute(sizes, 1));
        return geometry;
    }
}