let MyGame = {};

// ------------------------------------------------------------------
// 
// This is the game object.  Everything about the game is located in 
// this object.
//
// ------------------------------------------------------------------
MyGame.graphics = (function() {
    'use strict';

    let canvas = document.getElementById('canvas-main');
    let context = canvas.getContext('2d');

    //------------------------------------------------------------------
    //
    // Public function that allows the client code to clear the canvas.
    //
    //------------------------------------------------------------------
    function clear() {
        context.save();
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.restore();
    }

    //------------------------------------------------------------------
    //
    // This is used to create a text function that can be used by client
    // code for rendering.
    //
    //------------------------------------------------------------------
    function Text(spec) {
        let that = {};
        
        that.updateRotation = function(angle) {
            spec.rotation += angle;
        };

        //------------------------------------------------------------------
        //
        // This returns the height of the specified font, in pixels.
        //
        //------------------------------------------------------------------
        function measureTextHeight(spec) {
            context.save();

            context.font = spec.font;
            let height = context.measureText('m').width;

            context.restore();

            return height;
        }

        //------------------------------------------------------------------
        //
        // This returns the width of the specified font, in pixels.
        //
        //------------------------------------------------------------------
        function measureTextWidth(spec) {
            context.save();

            context.font = spec.font;
            let width = context.measureText(spec.text).width;

            context.restore();
            
            return width;
        }

        that.draw = function() {
            context.save();

            context.font = spec.font;
            context.fillStyle = spec.fill;
            context.strokeStyle = spec.stroke;
            context.textBaseline = 'top';

            context.translate(spec.pos.x + that.width / 2, spec.pos.y + that.height / 2);
            context.rotate(spec.rotation);
            context.translate(-(spec.pos.x + that.width / 2), -(spec.pos.y + that.height / 2));

            context.fillText(spec.text, spec.pos.x, spec.pos.y);
            context.strokeText(spec.text, spec.pos.x, spec.pos.y);

            context.restore();
        };

        //
        // Compute and expose some public properties for this text.
        that.height = measureTextHeight(spec);
        that.width = measureTextWidth(spec);
        that.pos = spec.pos;

        return that;
    }

    return {
        clear : clear,
        Text : Text
    };
}());

//------------------------------------------------------------------
//
// This function performs the one-time game initialization.
//
//------------------------------------------------------------------
MyGame.initialize = (function initialize(graphics) {
    'use strict';

    let myText = graphics.Text({
        text : 'Hi Mom!',
        font : '64px arial',
        fill : 'rgba(150, 0, 0, 1)',
        stroke : 'rgba(255, 0, 0, 1)',
        pos : {x : 100, y : 100},
        rotation : 0
    });

    let myText2 = graphics.Text({
        text : 'Hi Dad!',
        font : '64px arial',
        fill : 'rgba(150, 0, 0, 1)',
        stroke : 'rgba(255, 0, 0, 1)',
        pos : {x : 100, y : (myText.pos.y + myText.height)},
        rotation : 0
    });

    //------------------------------------------------------------------
    //
    // This is the Game Loop function!
    //
    //------------------------------------------------------------------
    function gameLoop(time) {

        graphics.clear();
        myText.draw();
        myText2.draw();
        myText.updateRotation(0.01);

        requestAnimationFrame(gameLoop);
    };

    return function() {
        console.log('game initializing...');
        requestAnimationFrame(gameLoop);
    };
}(MyGame.graphics));
