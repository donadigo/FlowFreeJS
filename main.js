let grid;
let currentPipe;

let currentLevel = 0;

const GRID_X_OFFSET = 1;
const GRID_Y_OFFSET = 50;

const EMPTY = 0;
const RED = 1;
const GREEN = 2;
const BLUE = 3;
const YELLOW = 4;
const ORANGE = 5;
const PINK = 6;
const CYAN = 7;

function fillWithColor(color, cb) {
    if (color == RED) {
        cb(237, 30, 0);
    } else if (color == GREEN) {
        cb(16, 232, 27);
    } else if (color == BLUE) {
        cb(24, 48, 226);
    } else if (color == YELLOW) {
        cb(237, 216, 30);
    } else if (color == ORANGE) {
        cb(224, 95, 20);
    } else if (color == PINK) {
        cb(223, 30, 237);
    } else if (color == CYAN) {
        cb(37, 247, 240);
    } else {
        cb(0, 0, 0);
    }
}

function mousePressed() {
    if (mouseX > width || mouseY > height || mouseX < GRID_X_OFFSET || mouseY < GRID_Y_OFFSET) {
        return;
    }

    let vector = grid.translateToGrid(mouseX - GRID_X_OFFSET, mouseY - GRID_Y_OFFSET);
    if (!grid.hasCircleAt(vector)) {
        return;
    }

    let color = grid.board[vector.y][vector.x];
    currentPipe = new Pipe([vector], color);
}

function mouseReleased() {
    if (!currentPipe.isValid(grid)) {
        grid.removePipeByColor(currentPipe.color);
        currentPipe = new Pipe([], EMPTY);
        return;
    }

    grid.addPipe(currentPipe);
    currentPipe = new Pipe([], EMPTY);

    if (grid.isSolved()) {
        if (currentLevel + 1 < levels.length) {
            currentLevel++;
            buildGrid();
        } else {
            alert("You won!");
        }
    }
}

function mouseDragged() {
    if (!mouseIsPressed) {
        return;
    }

    let newVector = grid.translateToGrid(mouseX - GRID_X_OFFSET, mouseY - GRID_Y_OFFSET);
    if (newVector.x > grid.cols - 1 || newVector.y > grid.rows - 1 ||
        newVector.x < 0 || newVector.y < 0) {
        return;
    }

    if (currentPipe.containsInvalidColors(grid, newVector) ||
        currentPipe.containsValidColor(grid, newVector)) {
        return;
    }

    let last = currentPipe.vectors[currentPipe.vectors.length - 1];

    let taken = [];
    if (Math.abs(newVector.x - last.x) > 1) {
        let start = newVector;
        let end = last;
        if (start.x > end.x) {
            let t = start;
            start = end;
            end = t;
        }

        for (let j = start.x; j <= end.x; j++) {
            taken.push(createVector(j, start.y));
        }

    } else if (Math.abs(newVector.y - last.y) > 1) {
        let start = newVector;
        let end = last;
        if (start.y > end.y) {
            let t = start;
            start = end;
            end = t;
        }

        for (let j = start.y; j <= end.y; j++) {
            taken.push(createVector(start.x, j));
        }
    } else {
        taken.push(newVector);
    }

    if (currentPipe.vectors.length > 1) {
        let pre = currentPipe.vectors[currentPipe.vectors.length - 2];
        if (newVector.x == pre.x && newVector.y == pre.y) {
            currentPipe.vectors.pop();
            return;
        }
    }

    let pipes = grid.pipes.slice();
    pipes.push(currentPipe);
    for (let i = 0; i < taken.length; i++) {
        let vec = taken[i];
        for (let j = 0; j < pipes.length; j++) {
            let pipe = pipes[j];
            if (pipe.hasAt(vec)) {
                return;
            }
        }
    }

    if (Pipe.isDiagonal(last, newVector)) {
        return;
    }

    currentPipe.addVector(newVector);
}

function buildGrid() {
    let level = levels[currentLevel];
    let size = level.length;
    grid = new Grid(size, size, level);
    currentPipe = new Pipe([], EMPTY);
}

function setup() {
    let canvas = createCanvas(452, 501);
    buildGrid();
}

function draw() {
    background(0);
    textSize(24);
    fill(255, 255, 255);
    noStroke();
    text(`Level ${currentLevel + 1} / ${levels.length}`, 0, 30);
    translate(GRID_X_OFFSET, GRID_Y_OFFSET);
    grid.draw();
    currentPipe.draw(grid);
}