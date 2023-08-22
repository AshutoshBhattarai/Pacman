import Ghost from "./Ghosts.js";
import Pacman from "./Pacman.js";


export default class MapTile {
    constructor(tileSize) {
        this.tileSize = tileSize;
        this.food = new Image()
        this.food.src = './Images/food.png'
        this.wall = new Image()
        this.wall.src = './Images/wall.png'

        this.powerDot = this.power
        this.defPowerAnimTimer = 30;
        this.powerAnimTimer = this.defPowerAnimTimer
    }
    moves = new Pacman().moves
    //Displays the map tile
    // 1 is wall
    // 0 is food
    // 2 id pacman
    // 3 is blank
    // 4 is ghost
    map = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
        [1, 0, 1, 4, 1, 1, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0, 1, 4, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1],
        [1, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],


    ]
    draw(ctx) {
        //i is row and j is column
        for (let i = 0; i < this.map.length; i++) {
            for (let j = 0; j < this.map[i].length; j++) {
                let tile = this.map[i][j];
                if (tile === 1) {
                    this.#drawWall(ctx, j, i, this.tileSize)
                }
                else if (tile === 0) {
                    this.#drawDot(ctx, j, i, this.tileSize)
                }
                else if (tile === 5) {
                    this.#drawPower(ctx, j, i, this.tileSize)
                }

                else {
                    this.#drawBlank(ctx, j, i, this.tileSize)
                }


            }
        }
    }

    #drawDot(ctx, col, row, size) {
        ctx.drawImage(this.food, col * this.tileSize, row * this.tileSize, size, size);
    }

    #drawWall(ctx, col, row, size) {
        ctx.drawImage(this.wall, col * this.tileSize, row * this.tileSize, size, size);
    }
    #drawBlank(ctx, col, row, size) {
        ctx.fillStyle = "black";
        ctx.fillRect(col * this.tileSize, row * this.tileSize, size, size);
    }
    #drawPower(ctx, col, row, size) {
        this.powerAnimTimer--;
        if (this.powerAnimTimer === 0) {
            this.powerAnimTimer = this.defPowerAnimTimer;
            if (this.powerDot == this.power) {
                this.powerDot = this.food;
            } else {
                this.powerDot = this.power;
            }
        }
        ctx.drawImage(this.powerDot, col * size, row * size, size, size);
    }

    getPacman(velocity) {
        //i is row and j is column
        for (let i = 0; i < this.map.length; i++) {
            for (let j = 0; j < this.map[i].length; j++) {
                let tile = this.map[i][j];
                if (tile === 2) {
                    this.map[i][j] = 0;
                    return new Pacman(j * this.tileSize,
                        i * this.tileSize,
                        this.tileSize,
                        velocity,
                        this);
                }
            }
        }
    }
    getGhosts(velocity) {
        const ghosts = []
        for (let i = 0; i < this.map.length; i++) {
            for (let j = 0; j < this.map[i].length; j++) {
                let tile = this.map[i][j];
                if (tile === 4) {
                    this.map[i][j] = 0;
                    ghosts.push(new Ghost(j * this.tileSize,
                        i * this.tileSize,
                        this.tileSize,
                        velocity,
                        this))

                }
            }
        }
        return ghosts;
    }

    setCanvasSize(canvas) {
        canvas.width = this.map[0].length * this.tileSize;
        canvas.height = this.map.length * this.tileSize;
    }
    wallCollision(xAxis, yAxis, nextDirection) {
        if (Number.isInteger(xAxis / this.tileSize) && Number.isInteger(yAxis / this.tileSize)) {

            let col = 0;
            let row = 0;
            let nextCol = 0;
            let nextRow = 0;

            switch (nextDirection) {
                case this.moves.right:
                    nextCol = xAxis + this.tileSize
                    col = nextCol / this.tileSize
                    row = yAxis / this.tileSize
                    break;
                case this.moves.left:
                    nextCol = xAxis - this.tileSize
                    col = nextCol / this.tileSize
                    row = yAxis / this.tileSize
                    break;
                case this.moves.up:
                    nextRow = yAxis - this.tileSize
                    row = nextRow / this.tileSize
                    col = xAxis / this.tileSize
                    break;
                case this.moves.down:
                    nextRow = yAxis + this.tileSize
                    row = nextRow / this.tileSize
                    col = xAxis / this.tileSize
                    break;
            }
            const tile = this.map[row][col];
            if (tile == 1) {
                return true;
            }
            return false;
        }
    }
    eatFood(xAxis, yAxis) {
        const row = yAxis / this.tileSize;
        const column = xAxis / this.tileSize;
        if (Number.isInteger(row) && Number.isInteger(column)) {
            if (this.map[row][column] === 0) {
                this.map[row][column] = 3;
                return true;
            }
        }
        return false;
    }
    didWin() {
        let count = 0;
        for (let i = 0; i < this.map.length; i++) {
            for (let j = 0; j < this.map[i].length; j++) {
                if (this.map[i][j] == 0) {
                    count++;
                }
            }
        }
        if (count == 0)
            return true
        return false;

    }
}