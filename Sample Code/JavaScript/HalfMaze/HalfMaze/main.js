let inputBuffer = {};
let canvas = null;
let context = null;

const COORD_SIZE = 1000;

let imgFloor = new Image();
imgFloor.isReady = false;
imgFloor.onload = function() {
    this.isReady = true;
};
imgFloor.src = 'floor.png';

let maze = [];
for (let row = 0; row < 3; row++) {
    maze.push([]);
    for (let col = 0; col < 3; col++) {
        maze[row].push({
            x: col, y: row, edges: {
                n: null,
                s: null,
                w: null,
                e: null
            }
        });
    }
}

maze[0][0].edges.s = maze[1][0];

maze[0][1].edges.s = maze[1][1];
maze[0][1].edges.e = maze[0][2];

maze[0][2].edges.w = maze[0][1];
maze[0][2].edges.s = maze[1][2];

maze[1][0].edges.n = maze[0][0];
maze[1][0].edges.e = maze[1][1];
maze[1][0].edges.s = maze[2][0];

maze[1][1].edges.n = maze[0][1];
maze[1][1].edges.s = maze[2][1];
maze[1][1].edges.w = maze[1][0];

maze[1][2].edges.n = maze[0][2];

maze[2][0].edges.n = maze[1][0];

maze[2][1].edges.n = maze[1][1];
maze[2][1].edges.e = maze[2][2];

maze[2][2].edges.w = maze[2][1];

function drawCell(cell) {

    if (imgFloor.isReady) {
        context.drawImage(imgFloor,
        cell.x * (COORD_SIZE / 3), cell.y * (COORD_SIZE / 3),
        COORD_SIZE / 3 + 0.5, COORD_SIZE / 3 + 0.5);
    }

    if (cell.edges.n === null) {
        context.moveTo(cell.x * (COORD_SIZE / 3), cell.y * (COORD_SIZE / 3));
        context.lineTo((cell.x + 1) * (COORD_SIZE / 3), cell.y * (COORD_SIZE / 3));
    }

    if (cell.edges.s === null) {
        context.moveTo(cell.x * (COORD_SIZE / 3), (cell.y + 1) * (COORD_SIZE / 3));
        context.lineTo((cell.x + 1) * (COORD_SIZE / 3), (cell.y + 1) * (COORD_SIZE / 3));
    }

    if (cell.edges.e === null) {
        context.moveTo((cell.x + 1) * (COORD_SIZE / 3), cell.y * (COORD_SIZE / 3));
        context.lineTo((cell.x + 1) * (COORD_SIZE / 3), (cell.y + 1) * (COORD_SIZE / 3));
    }

    if (cell.edges.w === null) {
        context.moveTo(cell.x * (COORD_SIZE / 3), cell.y * (COORD_SIZE / 3));
        context.lineTo(cell.x * (COORD_SIZE / 3), (cell.y + 1) * (COORD_SIZE / 3));
    }
}

function renderCharacter(character) {
    if (character.image.isReady) {
        context.drawImage(character.image,
        character.location.x * (COORD_SIZE / 3), character.location.y * (COORD_SIZE / 3));
    }
}

function moveCharacter(key, character) {
    if (key === 'ArrowDown') {
        if (character.location.edges.s) {
            character.location = character.location.edges.s;
        }
    }
    if (key == 'ArrowUp') {
        if (character.location.edges.n) {
            character.location = character.location.edges.n;
        }
    }
    if (key == 'ArrowRight') {
        if (character.location.edges.e) {
            character.location = character.location.edges.e;
        }
    }
    if (key == 'ArrowLeft') {
        if (character.location.edges.w) {
            character.location = character.location.edges.w;
        }
    }
}

function renderMaze() {
    // Render the cells first
    context.beginPath();
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            drawCell(maze[row][col]);
        }
    }
    context.strokeStyle = 'rgb(255, 255, 255)';
    context.lineWidth = 6;
    context.stroke();

    // Draw a black border around the whole maze
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(COORD_SIZE - 1, 0);
    context.lineTo(COORD_SIZE - 1, COORD_SIZE - 1);
    context.lineTo(0, COORD_SIZE - 1);
    context.closePath();
    context.strokeStyle = 'rgb(0, 0, 0)';
    context.stroke();
}

//
// Immediately invoked anonymous function
//
let myCharacter = function(imageSource, location) {
    let image = new Image();
    image.isReady = false;
    image.onload = function() {
        this.isReady = true;
    };
    image.src = imageSource;
    return {
        location: location,
        image: image
    };
}('character.png', maze[0][0]);

function render() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    renderMaze();
    renderCharacter(myCharacter);
}

function processInput() {
    for (input in inputBuffer) {
        moveCharacter(inputBuffer[input], myCharacter);
    }
    inputBuffer = {};
}

function gameLoop() {
    processInput();
    render();

    requestAnimationFrame(gameLoop);

}

function initialize() {
    canvas = document.getElementById('canvas-main');
    context = canvas.getContext('2d');

    window.addEventListener('keydown', function(event) {
        inputBuffer[event.key] = event.key;
    });

    requestAnimationFrame(gameLoop);
}
