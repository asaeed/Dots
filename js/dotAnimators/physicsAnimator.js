
const physicsAnimator = {
    update: (controller) => {
        var c = controller;
        var attributes = c.geometry.attributes;
        var i = 0;
        for (var ix = 0; ix < c.grid.w; ix++) {
            for (var iy = 0; iy < c.grid.h; iy++) {
                //var dotY = attributes.position.array[i*3+1];
                var dotY = (Math.sin((ix + count) * 0.3) * 50) + (Math.sin((iy + count) * 0.5) * 50);
                attributes.position.array[i*3+1] = dotY;

                var dotSize = (Math.sin((ix + count) * 0.3) + 1) * 8 + (Math.sin((iy + count) * 0.5) + 1) * 4;
                attributes.size.array[i] = dotSize;
                i++;
            }
        }
        count += 0.1;
        attributes.position.needsUpdate = true;
        attributes.size.needsUpdate = true;
    }
}