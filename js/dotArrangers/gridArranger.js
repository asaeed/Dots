
const gridArranger = {
    getGeometry: (controller) => {
        var c = controller;
        var numDots = c.grid.w * c.grid.h;
        var positions = new Float32Array(numDots * 3);
        var colors = new Float32Array(numDots * 3);
        var sizes = new Float32Array(numDots);

        var i = 0;
        for ( var ix = 0; ix < c.grid.w; ix++ ) {
            for ( var iy = 0; iy < c.grid.h; iy++ ) {
                var posX = ix * c.grid.gap - ((c.grid.w * c.grid.gap) / 2);
                var posZ = iy * c.grid.gap - ((c.grid.h * c.grid.gap) / 2);               

                var vec = new THREE.Vector3(posX, 0, posZ); 
                vec.toArray(positions, i * 3);

                var color = new THREE.Color(0xffffff);
                color.toArray( colors, i * 3 );

                sizes[i] = c.dotSize;

                i++;
            }
        }

        var geometry = new THREE.BufferGeometry();
        geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.addAttribute( 'customColor', new THREE.BufferAttribute( colors, 3 ) );
        geometry.addAttribute('size', new THREE.BufferAttribute(sizes, 1));
        return geometry;
    }
}