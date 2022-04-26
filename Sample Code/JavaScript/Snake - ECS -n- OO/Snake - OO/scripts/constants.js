MyGame.constants.GRID_SIZE = 50;
MyGame.constants.OBSTACLE_COUNT = 15;
MyGame.constants.CELL_SIZE = 20;
MyGame.constants.MOVE_INTERVAL = 150;

MyGame.constants.CellTypes = Object.freeze({
    Border: Symbol("border"),
    Obstacle: Symbol("obstacle"),
    Food: Symbol("food"),
    Snake: Symbol("snake")
});

MyGame.constants.Direction = Object.freeze({
    Stopped: Symbol("stopped"),
    Up: Symbol("up"),
    Down: Symbol("down"),
    Left: Symbol("left"),
    Right: Symbol("right")
});
