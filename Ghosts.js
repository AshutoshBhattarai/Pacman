export default class Ghost {
    constructor(xAxis, yAxis, tileSize, velocity, mapTile) {
        this.xAxis = xAxis;
        this.yAxis = yAxis;
        this.tileSize = tileSize;
        this.velocity = velocity;
        this.mapTile = mapTile;

        this.normalGhost = new Image();
        this.normalGhost.src = './Images/ghost.png'
        this.moveTo = Math.floor(Math.random() * 4)
        this.defChangeDirectionTimer = this.#random()

        this.directionTimer = this.defChangeDirectionTimer


    }
    moves = {
        up: 0, down: 1, left: 2, right: 3
    }

    draw(ctx, stop) {
        if (!stop) {
            this.#move()
            this.#changeDirection()
        }
        ctx.drawImage(this.normalGhost, this.xAxis, this.yAxis, this.tileSize, this.tileSize)
    }
    #random = () => (Math.floor(Math.random() * (41)) + 10)

    #move() {
        if (!this.mapTile.wallCollision(this.xAxis, this.yAxis, this.moveTo)) {
            switch (this.moveTo) {
                case this.moves.up:
                    this.yAxis -= this.velocity
                    break;
                case this.moves.down:
                    this.yAxis += this.velocity
                    break;
                case this.moves.left:
                    this.xAxis -= this.velocity
                    break;
                case this.moves.right:
                    this.xAxis += this.velocity
                    break;
            }
        }
    }

    #changeDirection() {
        this.directionTimer--;
        let newDirection = null;
        if (this.directionTimer == 0) {
            this.directionTimer = this.defChangeDirectionTimer;
            newDirection = Math.floor(
                Math.random() * 4
            );
            if (newDirection != null && this.moveTo != newDirection) {
                if (
                    Number.isInteger(this.xAxis / this.tileSize) &&
                    Number.isInteger(this.yAxis / this.tileSize)
                ) {
                    if (
                        !this.mapTile.wallCollision(
                            this.xAxis,
                            this.yAxis,
                            newDirection
                        )
                    ) {
                        this.moveTo = newDirection;
                    }
                }
            }
        }
    }

    pacmanCollision(pacman) {
        const size = this.tileSize / 2;
        if (
            this.xAxis < pacman.xAxis + size &&
            this.xAxis + size > pacman.xAxis &&
            this.yAxis < pacman.yAxis + size &&
            this.yAxis + size > pacman.yAxis
        ) {
            return true;
        } else {
            return false;
        }
    }
}