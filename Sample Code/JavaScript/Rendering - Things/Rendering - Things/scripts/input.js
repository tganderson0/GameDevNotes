let Input = (function () {
    function Keyboard() {
        let that = {
        };

        let keys = {};
        let handlers = {};

        function keyPress(e) {
            keys[e.key] = true;
        }
        function keyRelease(e) {
            delete keys[e.key];
        }
        window.addEventListener('keydown', keyPress);
        window.addEventListener('keyup', keyRelease);

        that.registerCommand = function (key, handler) {
            handlers[key] = handler;
        };

        that.update = function (elapsedTime) {
            for (let key in keys) {
                if (keys.hasOwnProperty(key)) {
                    if (handlers[key]) {
                        handlers[key](elapsedTime);
                    }
                }
            }
        };

        return that;
    }
    return {
        Keyboard: Keyboard
    };
}());