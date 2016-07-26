
const mouseAnimator = {
    update: (controller) => {
        var c = controller;
        var att = c.geometry.attributes;

        var i = 0;
        for (var ix = 0; ix < c.grid.w; ix++) {
            for (var iy = 0; iy < c.grid.h; iy++) {
                //var dotSize = att.size.array[i];

                var distX = Math.abs(ix*c.grid.gap - mouseX*2);
                var distY = Math.abs(iy*c.grid.gap - mouseY*2);
                var distance = Math.sqrt(distX * distX + distY * distY);
                var dotSize = (50 - distance/8) * 4;

                if (dotSize < c.dotSize) {
                    att.size.array[i] = c.dotSize;
                } else {
                    att.size.array[i] = dotSize;              
                }

                i++;
            }
        }
        att.size.needsUpdate = true;
    }
}