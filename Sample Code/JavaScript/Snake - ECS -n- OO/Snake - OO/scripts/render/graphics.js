// ------------------------------------------------------------------
//
// This is the graphics rendering code for the game.
//
// ------------------------------------------------------------------
MyGame.graphics = (function() {
    'use strict';

    let that = {};
    let canvas = document.getElementById('canvas-main');
    let context = canvas.getContext('2d')

    //------------------------------------------------------------------
    //
    // Public function that allows the client code to clear the canvas.
    //
    //------------------------------------------------------------------
    that.clear = function() {
        context.clearRect(0, 0, canvas.width, canvas.height);
    };

    //------------------------------------------------------------------
    //
    // Draw a square (with an optional border) into the local canvas coordinate system.
    //
    //------------------------------------------------------------------
    that.drawSquare = function(corner, size, fill, stroke) {
        context.fillStyle = fill;
        context.fillRect(corner.x, corner.y, size, size);

        if (stroke) {
            context.strokeStyle = stroke;
            context.strokeRect(corner.x, corner.y, size, size);
        }
    }

    //------------------------------------------------------------------
    //
    // Draw a rectangle (with an optional border) into the local canvas coordinate system.
    //
    //------------------------------------------------------------------
    that.drawRectangle = function(corner, width, height, fill, stroke) {
        context.fillStyle = fill;
        context.fillRect(corner.x, corner.y, width, height);

        if (stroke) {
            context.strokeStyle = stroke;
            context.strokeRect(corner.x, corner.y, width, height);
        }
    }

    Object.defineProperty(that, 'width', {
        get: () => canvas.width
    });
    Object.defineProperty(that, 'height', {
        get: () => canvas.height
    });

    return that;
}());
