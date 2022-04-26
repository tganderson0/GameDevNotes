let previousTimeStamp = performance.now();

function processInput(elapsedTime) {
    gameModel.processInput(elapsedTime);
}

function update(elapsedTime) {
    gameModel.update(elapsedTime);
}

function render() {
    gameModel.render();
}

function gameLoop(time) {
    let elapsedTime = time - previousTimeStamp;
    previousTimeStamp = time;

    processInput(elapsedTime);
    update(elapsedTime);
    render();

    requestAnimationFrame(gameLoop);
}

console.log('game initializing...');
gameModel.initialize();

requestAnimationFrame(gameLoop); 
