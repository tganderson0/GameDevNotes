// --------------------------------------------------------------
//
// Renders a snake
//
// --------------------------------------------------------------
MyGame.render.Snake = function(model, cellSize, graphics) {
    'use strict';

    // A little wasteful to create the lambda for every call to this function, but
    // there isn't a general math or utilities place (in my code) to put this.  Could
    // be added to the JavaScript Math prototype somewhere at initialization.
    let lerp = (a, b, f) => { return a + f * (b - a); };

    // Draw the snake, using a gradient pattern over the length of
    // the snake.
    let r = 255;
    let g = 255;
    let b = 255;
    for (let segment = 0; segment < model.segments.length; segment++) {
        let pos = {
            x: model.segments[segment].x * cellSize,
            y: model.segments[segment].y * cellSize
        };
        let fraction = Math.min(segment / 30, 1.0);
        let color = 'rgb(' + lerp(r, 0, fraction) + ', ' + lerp(g, 0, fraction) + ', ' + lerp(b, 255, fraction) + ')';
        graphics.drawSquare(pos, cellSize, color, 'rgb(0, 0, 0)');
    }
};
