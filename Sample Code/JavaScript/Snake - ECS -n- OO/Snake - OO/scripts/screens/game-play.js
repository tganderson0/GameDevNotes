MyGame.screens['game-play'] = (function(manager, renderer, graphics, input) {
    'use strict';
    
    let myKeyboard = input.Keyboard();
    let cancelNextRequest = false;
    let lastTimeStamp;
    let model = null;

    //------------------------------------------------------------------
    //
    // One time initialization
    //
    //------------------------------------------------------------------
    function initialize() {
        console.log('game initializing...');

        //
        // Register the ESC key to exit the gameplay.
        myKeyboard.registerCommand('Escape', function() {
            //
            // Stop the game loop by canceling the request for the next animation frame
            cancelNextRequest = true;
            //
            // Then, return to the main menu
            manager.showScreen('main-menu');
        });
    }

    function processInput(elapsedTime) {
        myKeyboard.update(elapsedTime);
    }

    //------------------------------------------------------------------
    //
    // This is the game loop update function!
    //
    //------------------------------------------------------------------
    function update(elapsedTime) {
        model.update(elapsedTime);
    }

    //------------------------------------------------------------------
    //
    // This is the game loop Render function!
    //
    //------------------------------------------------------------------
    function render() {
        graphics.clear();

        renderer.Game(model, graphics);
    }
    
    //------------------------------------------------------------------
    //
    // This is the Game Loop function!
    //
    //------------------------------------------------------------------
    function gameLoop(time) {

        processInput(time - lastTimeStamp);
        update(time - lastTimeStamp);
        lastTimeStamp = time;

        render();

        if (!cancelNextRequest) {
            requestAnimationFrame(gameLoop);
        }
    }

    function run() {
        model = GameModel();
        //
        // Create the keyboard input handler and register the keyboard commands
        myKeyboard.registerCommand('ArrowUp', model.turnUp);
        myKeyboard.registerCommand('ArrowDown', model.turnDown);
        myKeyboard.registerCommand('ArrowLeft', model.turnLeft);
        myKeyboard.registerCommand('ArrowRight', model.turnRight);

        lastTimeStamp = performance.now();
        //
        // Start the animation loop
        cancelNextRequest = false;
        requestAnimationFrame(gameLoop);
    }

    return {
        initialize : initialize,
        run : run
    };
}(MyGame.manager, MyGame.render, MyGame.graphics, MyGame.input));
