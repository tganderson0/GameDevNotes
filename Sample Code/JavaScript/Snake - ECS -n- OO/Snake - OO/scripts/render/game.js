// --------------------------------------------------------------
//
// Renders the full game state.
//
// --------------------------------------------------------------
MyGame.render.Game = function(model, graphics) {
    'use strict';

    // --------------------------------------------------------------
    //
    // Draw each of the obstacles.
    //
    // --------------------------------------------------------------
    function drawObstacles(obstacles) {
        for (let obstacle = 0; obstacle < obstacles.length; obstacle++) {
            let pos = {
                x: obstacles[obstacle].x * MyGame.constants.CELL_SIZE,
                y: obstacles[obstacle].y * MyGame.constants.CELL_SIZE
            };
            graphics.drawSquare(pos, MyGame.constants.CELL_SIZE, 'rgb(0, 255, 0)', 'rgb(0, 0, 0)');
        }
    }

    //
    // Render the background
    graphics.drawSquare({ x: 0, y: 0 }, graphics.width, 'rgb(0, 0, 255)');

    //
    // Render the border
    graphics.drawRectangle({ x: 0, y: 0 }, graphics.width, MyGame.constants.CELL_SIZE, 'rgb(255, 0, 0)');
    graphics.drawRectangle({ x: 0, y: graphics.height - MyGame.constants.CELL_SIZE }, graphics.width, MyGame.constants.CELL_SIZE, 'rgb(255, 0, 0)');
    graphics.drawRectangle({ x: 0, y: 0 }, MyGame.constants.CELL_SIZE, graphics.height, 'rgb(255, 0, 0)');
    graphics.drawRectangle({ x: graphics.width - MyGame.constants.CELL_SIZE, y: 0 }, MyGame.constants.CELL_SIZE, graphics.height, 'rgb(255, 0, 0)');
    //
    // Render the obstacles
    drawObstacles(model.obstacles);

    //
    // Render the food
    graphics.drawSquare({ x: model.food.x * MyGame.constants.CELL_SIZE, y: model.food.y * MyGame.constants.CELL_SIZE }, MyGame.constants.CELL_SIZE, 'rgb(255, 128, 0)', 'rgb(0, 0, 0)');

    //
    // Render the snake
    MyGame.render.Snake(model.snake, MyGame.constants.CELL_SIZE, graphics);
};
