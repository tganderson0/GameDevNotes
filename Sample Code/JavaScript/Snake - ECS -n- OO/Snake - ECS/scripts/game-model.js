function GameModel() {
    'use strict';
    const GRID_SIZE = 50;
    const OBSTACLE_COUNT = 15;
    const MOVE_INTERVAL = 150;

    let entities = {};  // key is 'id', value is an Entity

    // --------------------------------------------------------------
    //
    // Defining the game border as entities that have position, collision,
    // and visual components.
    //
    // --------------------------------------------------------------
    function initializeBorder() {
        let border = {};

        function createBorderEntity(x, y) {
            let border = Entity.createEntity();
            border.addComponent(MyGame.components.Appearance({ fill: { r: 255, g: 0, b: 0 }, stroke: 'rgb(0, 0, 0)' }));
            border.addComponent(MyGame.components.Position({ segments: [{ x: x, y: y }] }));
            border.addComponent(MyGame.components.Collision());

            return border;
        }

        for (let position = 0; position < GRID_SIZE; position++) {
            // Left border
            let left = createBorderEntity(0, position);
            border[left.id] = left;
            // Right border
            let right = createBorderEntity(GRID_SIZE - 1, position);
            border[right.id] = right;
            // Top border
            let top = createBorderEntity(position, 0);
            border[top.id] = top;
            // bottom border
            let bottom = createBorderEntity(position, GRID_SIZE - 1);
            border[bottom.id] = bottom;
        }

        return border;
    }

    // --------------------------------------------------------------
    //
    // Defining each of the obstacles as entities that have position,
    // collision, and visual components.
    //
    // --------------------------------------------------------------
    function initializeObstacles() {
        let obstacles = {};

        function createObstacleEntity(x, y) {
            let obstacle = Entity.createEntity();
            obstacle.addComponent(MyGame.components.Appearance({ fill: {r: 0, g: 255, b: 0 }, stroke: 'rgb(0, 0, 0)' }));
            obstacle.addComponent(MyGame.components.Position({ segments: [{ x: x, y: y }] }));
            obstacle.addComponent(MyGame.components.Collision());

            return obstacle;
        }

        let remaining = OBSTACLE_COUNT;
        while (remaining > 0) {
            let x = Random.nextRange(1, GRID_SIZE - 1);
            let y = Random.nextRange(1, GRID_SIZE - 1);
            let proposed = createObstacleEntity(x, y);
            if (!MyGame.systems.collision.collidesWithAny(proposed, obstacles)) {
                obstacles[proposed.id] = proposed;
                remaining--;
            }
        }

        return obstacles;
    }

    // --------------------------------------------------------------
    //
    // Defining the food as an entity that has position, collision, 
    // and visual components.
    //
    // --------------------------------------------------------------
    function createFood() {
        let food = null;

        function createFoodEntity(x, y) {
            let food = Entity.createEntity();
            food.addComponent(MyGame.components.Appearance({ fill: {r: 255, g: 128, b: 0 }, stroke: 'rgb(0, 0, 0)' }));
            food.addComponent(MyGame.components.Position({ segments: [{ x: x, y: y }] }));
            food.addComponent(MyGame.components.Collision());
            food.addComponent(MyGame.components.Food());

            return food;
        }

        let done = false;
        while (!done) {
            let x = Random.nextRange(1, GRID_SIZE - 1);
            let y = Random.nextRange(1, GRID_SIZE - 1);
            //
            // Create a proposed food entity at this location and see if it collides with anything
            let proposed = createFoodEntity(x, y);
            if (!MyGame.systems.collision.collidesWithAny(proposed, entities)) {
                food = proposed;
                done = true;
            }
        }

        return food;
    }

    // --------------------------------------------------------------
    //
    // Defining the snake as an entity that has position, direction,
    // collision, visual, and input components.
    //
    // --------------------------------------------------------------
    function initializeSnake() {
        let snake = null;

        function createSnakeEntity(x, y) {
            let snake = Entity.createEntity();
            snake.addComponent(MyGame.components.Appearance({ fill: { r: 255, g: 255, b: 255 }, stroke: 'rgb(0, 0, 0)' }));
            snake.addComponent(MyGame.components.Position({ segments: [{ x: x, y: y }] }));
            snake.addComponent(MyGame.components.Collision());
            snake.addComponent(MyGame.components.Movable({ facing: MyGame.constants.Direction.Stopped, moveInterval: MOVE_INTERVAL }));
            let inputSpecification = { keys: {
                'ArrowLeft': MyGame.constants.Direction.Left,
                'ArrowRight': MyGame.constants.Direction.Right,
                'ArrowUp': MyGame.constants.Direction.Up,
                'ArrowDown': MyGame.constants.Direction.Down
            }};
            snake.addComponent(MyGame.components.KeyboardControlled(inputSpecification));

            return snake;
        }

        let done = false;
        while (!done) {
            let x = Random.nextRange(1, GRID_SIZE - 1);
            let y = Random.nextRange(1, GRID_SIZE - 1);
            //
            // Create a proposed snake entity at this location and see if it collides with anything
            let proposed = createSnakeEntity(x, y);
            if (!MyGame.systems.collision.collidesWithAny(proposed, entities)) {
                snake = proposed;
                done = true;
            }
        }

        return snake;
    }

    // --------------------------------------------------------------
    //
    // Interface that allows systems to report events back to the overall
    // game model for processing.
    //
    // --------------------------------------------------------------
    function reportEvent(info) {
        switch (info.type) {
            case 'consume-food':
                delete entities[info.entity.id];
                let food = createFood();
                entities[food.id] = food;
                break;
            case 'hit-something':
                break;
        }
    }

    // --------------------------------------------------------------
    //
    // Helper method used to merge the properites of the 'source' object
    // into the 'dest' object.
    //
    // --------------------------------------------------------------
    function mergeObjects(dest, source) {
        for (let key in source) {
            dest[key] = source[key];
        }
    }

    // --------------------------------------------------------------
    //
    // One time initialization to get the game model prepared for playing.
    //
    // --------------------------------------------------------------
    function initialize() {
        console.log('initializing borders...');
        mergeObjects(entities, initializeBorder());

        console.log('initializing obstacles...');
        mergeObjects(entities, initializeObstacles());

        console.log('initialzing snake starting position...');
        let snake = initializeSnake();
        entities[snake.id] = snake;

        console.log('initialzing first food location...');
        let food = createFood();
        entities[food.id] = food;
    }

    // --------------------------------------------------------------
    //
    // Public interface exposed to the game loop that tells the game
    // model to perform an update.
    //
    // --------------------------------------------------------------
    function update(elapsedTime) {
        MyGame.systems.keyboardInput.update(elapsedTime, entities);
        MyGame.systems.movement.update(elapsedTime, entities);
        MyGame.systems.collision.update(elapsedTime, entities, reportEvent);
        MyGame.systems.render.update(elapsedTime, entities);
    }

    initialize();

    let api = {
        update: update
    };

    return api;
}
