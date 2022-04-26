// --------------------------------------------------------------
//
// This function knows how to render any position component, rendering
// all of the segments it contains.
//
// --------------------------------------------------------------
MyGame.render.segmented = function (graphics, appearance, position) {
    'use strict';
    const CELL_SIZE = 20;

    // A little wasteful to create the lambda for every call to this function, but
    // there isn't a general math or utilities place (in my code) to put this.  Could
    // be added to the JavaScript Math prototype somewhere at initialization.
    let lerp = (a, b, f) => { return a + f * (b - a); };

    let r = appearance.fill.r;
    let g = appearance.fill.g;
    let b = appearance.fill.b;
    for (let segment = 0; segment < position.segments.length; segment++) {
        //
        // Perform a little slow gradient fade to blue for each additional segment.
        let fraction = Math.min(segment / 30, 1.0);
        let color = 'rgb(' + lerp(r, 0, fraction) + ', ' + lerp(g, 0, fraction) + ', ' + lerp(b, 255, fraction) + ')';
        graphics.drawSquare({
            x: position.segments[segment].x * CELL_SIZE,
            y: position.segments[segment].y * CELL_SIZE
        },
            CELL_SIZE,
            color,
            appearance.stroke
        );
    }
};
