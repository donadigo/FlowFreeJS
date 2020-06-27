class Pipe {
    constructor(vectors, color) {
        this.vectors = vectors;
        this.color = color;
    }

    draw(grid) {
        for (let i = 0; i < this.vectors.length; i++) {
            let start = this.vectors[i];

            fillWithColor(this.color, (r, g, b) => {
                fill(r, g, b, 50);
                stroke(r, g, b);
            });

            strokeWeight(2);
            rect(start.x * grid.cellWidth, start.y * grid.cellHeight, grid.cellWidth, grid.cellHeight);

            if (i < this.vectors.length - 1) {
                let end = this.vectors[i + 1];

                fillWithColor(this.color, (r, g, b) => stroke(r, g, b));
                strokeWeight(12);
                line(start.x * grid.cellWidth + grid.cellWidth / 2,
                    start.y * grid.cellHeight + grid.cellHeight / 2,
                    end.x * grid.cellWidth + grid.cellWidth / 2,
                    end.y * grid.cellHeight + grid.cellHeight / 2);
                noStroke();
            }
        }
    }

    isEmpty() {
        return this.vectors.length <= 1;
    }

    addVector(vector) {
        this.vectors.push(vector);
    }

    hasAt(vector) {
        if (this.vectors.find(vec => vec.x == vector.x && vec.y == vector.y)) {
            return true;
        }

        return false;
    }

    static isDiagonal(start, end) {
        return start.x != end.x && start.y != end.y;
    }

    isValid(grid) {
        if (this.isEmpty()) {
            return false;
        }

        for (let i = 0; i < this.vectors.length - 1; i++) {
            let start = this.vectors[i];
            let end = this.vectors[i + 1];

            if (Pipe.isDiagonal(start, end)) {
                return false;
            }
        }

        return this.connectsCircles(grid);
    }

    containsValidColor(grid, endVector) {
        if (this.isEmpty()) {
            return false;
        }

        let cells = this.vectors.slice();
        cells.push(endVector);
        if (this.vectors[this.vectors.length - 1] != this.color) {
            for (let i = 1; i < this.vectors.length; i++) {
                let vector = this.vectors[i];
                if (grid.board[vector.y][vector.x] == this.color) {
                    return true;
                }
            }
        }

        return this.vectors[this.vectors.length - 1] == EMPTY;
    }

    containsInvalidColors(grid, endVector) {
        let cells = this.vectors.slice();
        cells.push(endVector);
        for (let i = 0; i < cells.length; i++) {
            let cell = cells[i];
            if (grid.board[cell.y][cell.x] != EMPTY &&
                grid.board[cell.y][cell.x] != this.color) {
                return true;
            }
        }

        return false;
    }

    connectsCircles(grid) {
        if (this.isEmpty()) {
            return false;
        }

        let start = this.vectors[0];
        let end = this.vectors[this.vectors.length - 1];

        let startColor = grid.board[start.y][start.x];
        let endColor = grid.board[end.y][end.x];

        return this.color == startColor && this.color == endColor;
    }
}