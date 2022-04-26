// ------------------------------------------------------------------
//
//
//
// ------------------------------------------------------------------
MyGame.input = (function() {
    'use strict';
    
    function Keyboard() {
        let that = {
                keys : {},
                handlers : []
            };
        
        function keyPress(e) {
            that.keys[e.key] = e.timeStamp;
        }
        
        function keyRelease(e) {
            delete that.keys[e.key];
        }
        
        // ------------------------------------------------------------------
        //
        // Allows the client code to register a keyboard handler
        //
        // ------------------------------------------------------------------
        that.registerCommand = function(key, handler) {
            that.handlers.push({ key : key, handler : handler });
        };
        
        // ------------------------------------------------------------------
        //
        // Allows the client to invoke all the handlers for the registered key/handlers.
        //
        // ------------------------------------------------------------------
        that.update = function(elapsedTime) {
            let key = 0;

            for (key = 0; key < that.handlers.length; key++) {
                if (typeof that.keys[that.handlers[key].key] !== 'undefined') {
                    that.handlers[key].handler(elapsedTime);
                }
            }
        };
        
        //
        // These are used to keep track of which keys are currently pressed
        window.addEventListener('keydown', keyPress);
        window.addEventListener('keyup', keyRelease);
        
        return that;
    }
    
    return {
        Keyboard : Keyboard
    };
}());
