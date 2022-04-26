//------------------------------------------------------------------
//
// Creates a snake model based upon the passed in specification.
//
//------------------------------------------------------------------
MyGame.objects.Snake = function(spec) {
    let segments = [];
    let segmentsToAdd = 0;
    let snakeFacing = MyGame.constants.Direction.Stopped;
    let elapsedInterval = 0;

    //
    // The 'spec.start' is the initial position for the snake { x: , y: }
    segments.push(spec.start);

    function turnUp() {
        if (snakeFacing != MyGame.constants.Direction.Down) {
            snakeFacing = MyGame.constants.Direction.Up;
        }
    };

    function turnDown() {
        if (snakeFacing != MyGame.constants.Direction.Up) {
            snakeFacing = MyGame.constants.Direction.Down;
        }
    };

    function turnLeft() {
        if (snakeFacing != MyGame.constants.Direction.Right) {
            snakeFacing = MyGame.constants.Direction.Left;
        }
    };

    function turnRight() {
        if (snakeFacing != MyGame.constants.Direction.Left) {
            snakeFacing = MyGame.constants.Direction.Right;
        }
    };

    // --------------------------------------------------------------
    //
    // Check to see if the two objects have collided with each other.
    //
    // --------------------------------------------------------------
    function checkCollision(x, y) {
        if (spec.grid[y][x] !== null && spec.grid[y][x] === MyGame.constants.CellTypes.Food) {
            spec.reportEvent({
                type: 'consume-food'
            });
            segmentsToAdd += 3;
        }
        else if (spec.grid[y][x] !== null && spec.grid[y][x] !== MyGame.constants.CellTypes.Food) {
            spec.reportEvent({
                type: 'hit-something'
            });
            console.log('bad news...', spec.grid[y][x]);
            snakeFacing = MyGame.constants.Direction.Stopped;
            return true;
        }

        return false;
    }

    // --------------------------------------------------------------
    //
    // Based on the proposed position increment, attempt to move the snake.
    //
    // --------------------------------------------------------------
    function moveSnake(xIncrement, yIncrement) {
        let front = segments[0];
        //
        // Remove the tail, but only if there aren't any segments left to add from
        // eating the food.
        if (segmentsToAdd === 0 && segments.length > 0) {
            let segment = segments[segments.length - 1];
            spec.grid[segment.y][segment.x] = null;
            segments.length = segments.length - 1;
        } else {
            segmentsToAdd--;
        }

        let newFront = { x: front.x + xIncrement, y: front.y + yIncrement };
        if (!checkCollision(newFront.x, newFront.y)) {
            segments.unshift(newFront);
            spec.grid[newFront.y][newFront.x] = MyGame.constants.CellTypes.segments;
        }
    }

        // --------------------------------------------------------------
    //
    // Update the state of the game simulation.  This is primarily
    // updating the position of the snake.
    //
    // --------------------------------------------------------------
    function update(elapsedTime) {
        if (snakeFacing != null) {
            elapsedInterval += elapsedTime;
            if (elapsedInterval >= MyGame.constants.MOVE_INTERVAL) {
                elapsedInterval -= MyGame.constants.MOVE_INTERVAL;
                switch (snakeFacing) {
                    case MyGame.constants.Direction.Up:
                        moveSnake(0, -1);
                        break;
                    case MyGame.constants.Direction.Down:
                        moveSnake(0, 1);
                        break;
                    case MyGame.constants.Direction.Left:
                        moveSnake(-1, 0);
                        break;
                    case MyGame.constants.Direction.Right:
                        moveSnake(1, 0);
                        break;
                }
            }
        }
    };

    let api = {
        update: update,
        get segments() { return segments; },
        turnUp: turnUp,
        turnDown: turnDown,
        turnLeft: turnLeft,
        turnRight: turnRight
    };

    return api;
};
