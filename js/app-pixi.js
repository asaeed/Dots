
var renderer, stage, graphics;

var gridW = 20;
var gridH = 20;

var cellSize = 100;
var dotSize = 5;
var dotOffset = cellSize/2 - dotSize/2;

var dots = [];

init();
animate();

function init() {
    renderer = PIXI.autoDetectRenderer(800, 600, { backgroundColor: 0x000000, antialias: true });
    document.body.appendChild(renderer.view);

    stage = new PIXI.Container();
    graphics = new PIXI.Graphics();

    setupGrid();
}

function animate() {
    requestAnimationFrame(animate);

    updateGrid();

    renderer.render(stage);
}



function setupGrid() {
    for (var x = 0; x < gridW; x++) {
        for (var y = 0; y < gridH; y++) {
            var dot = new PIXI.Circle(x*cellSize + dotOffset, y*cellSize + dotOffset, dotSize);
            dots.push(dot);
            console.log(dot);
        }
    }
}

function updateGrid() {

    for (var i = 0; i < dots.length; i++) {
        graphics.beginFill(0xe74c3c);

        //graphics.drawShape(dots[i]);
        graphics.drawCircle(dots[i].x, dots[i].y, dots[i].radius);

        graphics.endFill();
    }

}

// setInterval(function() {
//     for (var i = 0; i < dots.length; i++) {
//         dots[i].animate({r: 50}, 500, mina.bounce, onShrink);
//     }
//     setTimeout(function() {
//         for (var i = 0; i < dots.length; i++) {
//             dots[i].animate({r: dotSize}, 500, mina.bounce);
//         }
//     }, 500);
//
// }, 2000);


function onShrink() {
    console.log(this);
    console.log("shrunk");
}
