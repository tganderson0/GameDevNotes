// ------------------------------------------------------------------
//
// This is the graphics rendering code for the game.
//
// ------------------------------------------------------------------
MyGame.graphics = (function() {
    'use strict';

    let canvas = document.getElementById('canvas-main');
    let context = canvas.getContext('2d');

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
    function clear() {
        context.clear();
    }

    //------------------------------------------------------------------
    //
    // Simple sprite, one image in the texture.
    //
    //------------------------------------------------------------------
    function Sprite(spec) {
        let that = {};
        let image = new Image();

        //
        // Load the image, set the ready flag once it is loaded so that
        // rendering can begin.
        image.onload = function() {
            //
            // Our clever trick, replace the draw function once the image is loaded...no if statements!
            that.draw = function() {
                context.save();

                context.translate(spec.center.x, spec.center.y);
                context.rotate(spec.rotation);
                context.translate(-spec.center.x, -spec.center.y);

                //
                // Pick the selected sprite from the sprite sheet to render
                context.drawImage(
                    image,
                    spec.center.x - image.width / 2,
                    spec.center.y - image.height / 2,
                    image.width, image.height);

                context.restore();
            };
            //
            // Once the image is loaded, we can compute the height and width based upon
            // what we know of the image and the number of sprites in the sheet.
            spec.height = image.height;
            spec.width = image.width / spec.spriteCount;
        };
        image.src = spec.sprite;

        that.rotateRight = function(angle) {
            spec.rotation += angle;
        };

        that.rotateLeft = function(angle) {
            spec.rotation -= angle;
        }

        //------------------------------------------------------------------
        //
        // Render the correct sprint from the sprite sheet
        //
        //------------------------------------------------------------------
        that.draw = function() {
            //
            // Starts out empty, but gets replaced once the image is loaded!
        };

        //
        // The other side of that hack job
        that.drawArc = function(angle) {
            context.fillStyle = 'rgba(255, 0, 0, 0.5)';
            context.beginPath();
            context.moveTo(spec.center.x, spec.center.y);
            context.arc(spec.center.x, spec.center.y, 100, spec.rotation - angle / 2, spec.rotation + angle / 2);
            context.lineTo(spec.center.x, spec.center.y);
            context.fill();
        }

        return that;
    }

    return {
        clear : clear,
        Sprite : Sprite
    };
}());
