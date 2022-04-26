function GameModel() {
    let grid = [];
    let obstacles = [];
    let food = null;
    let snake = null;

    // --------------------------------------------------------------
    //
    // Update the state of the game simulation.  This is primarily
    // updating the position of the snake.
    //
    // --------------------------------------------------------------
    function update(elapsedTime) {
        snake.update(elapsedTime);
    };

    // --------------------------------------------------------------
    //
    // Locate an open position to create a new food item.
    //
    // --------------------------------------------------------------
    function createFood() {
        let food = null;
        while (food == null) {
            let x = Random.nextRange(1, MyGame.constants.GRID_SIZE - 1);
            let y = Random.nextRange(1, MyGame.constants.GRID_SIZE - 1);
            if (grid[y][x] == null) {
                grid[y][x] = MyGame.constants.CellTypes.Food;
                food = { x: x, y: y };
            }
        }

        return food;
    }

    // --------------------------------------------------------------
    //
    // One time initialization when starting a new game.
    //
    // --------------------------------------------------------------
    function initialize() {
        //
        // Initialize the game grid
        for (let row = 0; row < MyGame.constants.GRID_SIZE; row++) {
            grid.push(new Array(MyGame.constants.GRID_SIZE));
            for (let column = 0; column < MyGame.constants.GRID_SIZE; column++) {
                grid[row][column] = null;
            }
        }

        //
        // Define the border cells
        for (let position = 0; position < MyGame.constants.GRID_SIZE; position++) {
            grid[0][position] = MyGame.constants.CellTypes.Border;
            grid[MyGame.constants.GRID_SIZE - 1][position] = MyGame.constants.CellTypes.Border;

            grid[position][0] = MyGame.constants.CellTypes.Border;
            grid[position][MyGame.constants.GRID_SIZE - 1] = MyGame.constants.CellTypes.Border;
        }

        //
        // Place the obstacles
        while (obstacles.length < MyGame.constants.OBSTACLE_COUNT) {
            let x = Random.nextRange(1, MyGame.constants.GRID_SIZE - 1);
            let y = Random.nextRange(1, MyGame.constants.GRID_SIZE - 1);
            if (grid[y][x] == null) {
                grid[y][x] = MyGame.constants.CellTypes.Obstacle;
                obstacles.push({ x: x, y: y });
            }
        }

        //
        // First food position
        food = createFood();

        //
        // Snake starting position
        let done = false;
        while (!done) {
            let x = Random.nextRange(1, MyGame.constants.GRID_SIZE - 1);
            let y = Random.nextRange(1, MyGame.constants.GRID_SIZE - 1);
            if (grid[y][x] == null) {
                grid[y][x] = MyGame.constants.CellTypes.Snake;
                snake = MyGame.objects.Snake({
                    start: { x: x, y: y },
                    grid: grid,
                    reportEvent: reportEvent
                });
                done = true;
            }
        }
    }

    // --------------------------------------------------------------
    //
    // Interface that allows events to be reported back to the game model
    // for processing.
    //
    // --------------------------------------------------------------
    function reportEvent(info) {
        switch (info.type) {
            case 'consume-food':
                grid[food.y][food.x] = null;
                food = createFood();
                break;
            case 'hit-something':
                break;
        }
    }

    initialize();

    let api = {
        update: update,
        get snake()  { return snake; },
        get obstacles() { return obstacles; },
        get food() { return food; },
        turnUp: () => { snake.turnUp(); },
        turnDown: () => { snake.turnDown(); },
        turnLeft: () => { snake.turnLeft(); },
        turnRight: () => { snake.turnRight(); }
    };

    return api;
}
