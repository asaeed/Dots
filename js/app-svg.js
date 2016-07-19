var s = Snap("#svg");

var gridW = 20;
var gridH = 20;

var cellSize = 100;
var dotSize = 5;
var dotOffset = cellSize/2 - dotSize/2;

var dots = []

for (var x = 0; x < gridW; x++) {
    for (var y = 0; y < gridH; y++) {
        var dot = s.circle(x*cellSize + dotOffset, y*cellSize + dotOffset, dotSize);
        dot.attr({
            fill: "#abcdef",
            stroke: "#333333",
            strokeWidth: 0
        });

        dots.push(dot);
    }
}

setInterval(function() {
    for (var i = 0; i < dots.length; i++) {
        dots[i].animate({r: 50}, 500, mina.bounce, onShrink);
    }
    setTimeout(function() {
        for (var i = 0; i < dots.length; i++) {
            dots[i].animate({r: dotSize}, 500, mina.bounce);
        }
    }, 500);

}, 2000);


function onShrink() {
    console.log(this);
    console.log("shrunk");
}
