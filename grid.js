const CSIZE = 45;
class Grid {
    constructor(rows, cols, board) {
        this.rows = rows;
        this.cols = cols;
        this.width = CSIZE * 10;
        this.height = CSIZE * 10;
        this.cellWidth = Math.floor(this.width / this.rows);
        this.cellHeight = Math.floor(this.height / this.cols);
        this.board = board;
        this.pipes = [];
    }

    hasPipes() {
        return this.pipes.length > 0;
    }

    hasCircleAt(vector) {
        return this.board[vector.y][vector.x] != EMPTY;
    }

    drawCircles() {
        noStroke();
        for (let row = 0; row < this.board.length; row++) {
            for (let col = 0; col < this.board[row].length; col++) {
                let color = this.board[row][col];
                if (color == EMPTY) {
                    continue;
                }

                fillWithColor(color, (r, g, b) => {
                    fill(r, g, b);
                });

                ellipse(col * this.cellWidth + this.cellWidth / 2,
                    row * this.cellHeight + this.cellHeight / 2,
                    CSIZE, CSIZE);
            }
        }
    }

    drawPipes() {
        this.pipes.forEach(pipe => pipe.draw(this));
    }

    draw() {
        strokeWeight(2);
        stroke(255, 255, 255, 100);
        noFill();
        rect(0, 0, this.width, this.height);

        for (let i = 1; i < this.cols; i++) {
            let offset = this.cellWidth * i;
            line(offset, 0, offset, this.height);
        }

        for (let i = 1; i < this.cols; i++) {
            let offset = this.cellHeight * i;
            line(0, offset, this.width, offset);
        }

        this.drawCircles();
        this.drawPipes();
    }

    addPipe(pipe) {
        this.pipes.push(pipe);
    }

    removePipeByColor(color) {
        let i = 0;
        while (i < this.pipes.length) {
            let pipe = this.pipes[i];
            if (pipe.color == color) {
                this.pipes.splice(i, 1);
            }

            i++;
        }
    }

    translateToGrid(x, y) {
        let t = createVector(Math.floor(x / this.cellWidth), Math.floor(y / this.cellHeight));
        return t;
    }

    isSolved() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if (this.board[row][col] != EMPTY) {
                    continue;
                }

                let vec = createVector(col, row);
                let containsPipe = false;
                for (let i = 0; i < this.pipes.length; i++) {
                    if (this.pipes[i].hasAt(vec)) {
                        containsPipe = true;
                        break;
                    }
                }

                if (!containsPipe) {
                    return false;
                }
            }
        }

        let allColors = new Set();
        for (let row = 0; row < this.board.length; row++) {
            for (let col = 0; col < this.board[row].length; col++) {
                let color = this.board[row][col];
                if (color == EMPTY) {
                    continue;
                }

                allColors.add(color);
            }
        }

        for (let i = 0; i < this.pipes.length; i++) {
            let pipe = this.pipes[i];
            let end = pipe.vectors[pipe.vectors.length - 1];
            if (this.board[end.y][end.x] != EMPTY) {
                allColors.delete(pipe.color);
            }
        }

        return allColors.size == 0;
    }
}