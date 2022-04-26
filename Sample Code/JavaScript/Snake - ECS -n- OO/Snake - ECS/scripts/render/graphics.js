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
    // Place a 'clear' function on the Canvas prototype, this makes it a part
    // of the canvas, rather than making a function that calls and does it.
    //
    //------------------------------------------------------------------
    CanvasRenderingContext2D.prototype.clear = function() {
        this.save();
        this.setTransform(1, 0, 0, 1, 0, 0);
        this.clearRect(0, 0, canvas.width, canvas.height);
        this.restore();
    };

    //------------------------------------------------------------------
    //
    // Public function that allows the client code to clear the canvas.
    //
    //------------------------------------------------------------------
    that.clear = function() {
        context.clear();
    };

    //------------------------------------------------------------------
    //
    // Simple pass-through to save the canvas context.
    //
    //------------------------------------------------------------------
    that.saveContext = function() {
        context.save();
    }

    //------------------------------------------------------------------
    //
    // Simple pass-through the restore the canvas context.
    //
    //------------------------------------------------------------------
    that.restoreContext = function() {
        context.restore();
    }

    //------------------------------------------------------------------
    //
    // Rotate the canvas to prepare it for rendering of a rotated object.
    //
    //------------------------------------------------------------------
    that.rotateCanvas = function(center, rotation) {
        context.translate(center.x * canvas.width, center.y * canvas.width);
        context.rotate(rotation);
        context.translate(-center.x * canvas.width, -center.y * canvas.width);
    }

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

    //------------------------------------------------------------------
    //
    // Draw a circle into the local canvas coordinate system.
    //
    //------------------------------------------------------------------
    that.drawCircle = function(center, radius, color) {
        context.beginPath();
        context.arc(center.x * canvas.width, center.y * canvas.width, 2 * radius * canvas.width, 2 * Math.PI, false);
        context.closePath();
        context.fillStyle = color;
        context.fill();
    }

    Object.defineProperty(that, 'width', {
        get: () => canvas.width
    });
    Object.defineProperty(that, 'height', {
        get: () => canvas.height
    });

    return that;
}());
