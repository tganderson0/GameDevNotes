//------------------------------------------------------------------
//
// This function provides the "game" code.
//
//------------------------------------------------------------------
MyGame.main = (function(objects, graphics, input) {
    'use strict';

    let lastTimeStamp = performance.now();
    let myMouse = input.Mouse();
    let tower = objects.Tower( {
            baseSprite : 'images/turret-base.gif',
            weaponSprite : 'images/turret-1-1.png',
            center : { x: 100, y : 100 },
            target : { x: 200, y : 100 },
            rotateRate : 6 * 3.14159 / 1000 // radians per second
        });

    //------------------------------------------------------------------
    //
    // Process the registered input handlers here.
    //
    //------------------------------------------------------------------
    function processInput(elapsedTime) {
        myMouse.update(elapsedTime);
    }

    //------------------------------------------------------------------
    //
    // Update the state of the "model" based upon time.
    //
    //------------------------------------------------------------------
    function update(elapsedTime) {
        tower.update(elapsedTime);
    }

    //------------------------------------------------------------------
    //
    // Render the state of the "model", which is just our texture in this case.
    //
    //------------------------------------------------------------------
    function render() {
        graphics.clear();
        tower.render();
    }

    //------------------------------------------------------------------
    //
    // This is the Game Loop function!
    //
    //------------------------------------------------------------------
    function gameLoop(time) {
        let elapsedTime = time - lastTimeStamp;
        lastTimeStamp = time;

        processInput(elapsedTime);
        update(elapsedTime);
        render();

        requestAnimationFrame(gameLoop);
    }

    console.log('game initializing...');

    //
    // Whenever the mouse is clicked, set this as the target point
    // for the tower.
    myMouse.registerCommand('mousedown', function(e, elapsedTime) {
        tower.setTarget(e.clientX, e.clientY);
    });

    //
    // Get the game loop started
    requestAnimationFrame(gameLoop);

}(MyGame.objects, MyGame.graphics, MyGame.input));
