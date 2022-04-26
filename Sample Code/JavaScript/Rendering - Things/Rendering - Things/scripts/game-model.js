let gameModel = (function () {
    let that = {};

    let myKeyboard = Input.Keyboard();

    let myTexture = {
        imageSrc: 'images/USU-Logo.png',
        center: { x: 150, y: 150 },
        width: 200,
        height: 200,
        rotation: 0,
        moveRate: 500 / 1000, // pixels per second in ms,
        rotateRate: Math.PI / 1000
    };

    let myText = Graphics.Text({
        text: 'Hi Mom!',
        font: '64px arial',
        fill: 'rgb(150, 0, 0)',
        stroke: 'rgb(255, 0, 0)',
        pos: { x: 450, y: 100 },
        rotation: 0
    });

    myTexture.ready = false;
    myTexture.image = new Image();
    myTexture.image.onload = function () {
        myTexture.ready = true;
    };
    myTexture.image.src = myTexture.imageSrc;

    function rotateRight(elapsedTime) {
        myTexture.rotation += myTexture.rotateRate * elapsedTime;
    }
    function rotateLeft(elapsedTime) {
        myTexture.rotation -= myTexture.rotateRate * elapsedTime;
    }
    function moveLeft(elapsedTime) {
        myTexture.center.x -= myTexture.moveRate * elapsedTime;
    }
    function moveRight(elapsedTime) {
        myTexture.center.x += myTexture.moveRate * elapsedTime;
    }
    function moveUp(elapsedTime) {
        myTexture.center.y -= myTexture.moveRate * elapsedTime;
    }
    function moveDown(elapsedTime) {
        myTexture.center.y += myTexture.moveRate * elapsedTime;
    }

    that.initialize = function () {
        myKeyboard.registerCommand('a', moveLeft);
        myKeyboard.registerCommand('d', moveRight);
        myKeyboard.registerCommand('w', moveUp);
        myKeyboard.registerCommand('s', moveDown);

        myKeyboard.registerCommand('j', moveLeft);
        myKeyboard.registerCommand('l', moveRight);
        myKeyboard.registerCommand('i', moveUp);
        myKeyboard.registerCommand('k', moveDown);
    };

    that.processInput = function (elapsedTime) {
        myKeyboard.update(elapsedTime);
    };

    that.update = function (elapsedTime) {
        myTexture.rotation += Math.PI / 200;
        myText.updateRotation(0.01);
    };

    that.render = function (elapsedTime) {
        Graphics.clear();

        // Hesitant really call this functional, but its closer to that than OO
        Graphics.renderTexture(myTexture);

        // OO approach
        myText.draw();

        //renderShapes();
    };

    return that;
}());
