
const spinAnimator = {
    update: (controller) => {
        var c = controller;
        var att = c.geometry.attributes;

        //console.log(c.sphere);

        c.points.rotateX(0.002);
        c.points.rotateZ(0.001);

        // var i = 0;
        // for (var ix = 0; ix < c.grid.w; ix++) {
        //     for (var iy = 0; iy < c.grid.h; iy++) {
        //         //var dotSize = att.size.array[i];

        //         var vertex = c.sphere.vertices[i];

        //         //vertex.toArray(att.position.array, i*3);

        //         // att.position.array[i*3] = vertex.x;
        //         // att.position.array[i*3 + 1] = vertex.y;
        //         // att.position.array[i*3 + 2] = vertex.z;

        //         i++;
        //     }
        // }
        // att.position.needsUpdate = true;
    }
}