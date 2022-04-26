'use strict';

// ------------------------------------------------------------------
//
// This is the input handler used to capture keyboard inputs and let
// game objects do something with them.
//
// ------------------------------------------------------------------
MyGame.input = (function() {
    'use strict';

    function Keyboard() {
        let that = {
            keys : {}
        };
        
        function keyPress(e) {
            that.keys[e.key] = e.timeStamp;
        }
        
        function keyRelease(e) {
            delete that.keys[e.key];
        }
        
        window.addEventListener('keydown', keyPress);
        window.addEventListener('keyup', keyRelease);
        
        return that;
    }
    
    return {
        Keyboard : Keyboard
    };
}());
