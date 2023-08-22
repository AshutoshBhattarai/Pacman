export default class Pacman {
    constructor(xAxis, yAxis, tileSize, velocity, mapTile) {
        this.xAxis = xAxis;
        this.yAxis = yAxis;
        this.tileSize = tileSize;
        this.velocity = velocity;
        this.mapTile = mapTile;

        this.currentDirection = null;
        this.nextDirection = null;

        this.defAnimateTime = 10;
        this.animateTime = null;

        this.pcmanRotation = this.Rotation.right;

        this.gameStarted = false;

        document.addEventListener("keydown", this.#changeDirection);
        this.#loadPacman();
    }

    Rotation = {
        right: 0,
        left: 2,
        down: 1,
        up: 3

    }
    moves = {
        up: 0, down: 1, left: 2, right: 3
    }


    draw(ctx, stop) {
        if (!stop) {
            this.#move();
            this.#animate();
        }

        this.mapTile.eatFood(this.xAxis, this.yAxis);
        const size = this.tileSize / 2;
        ctx.save();
        ctx.translate(this.xAxis + size, this.yAxis + size);
        ctx.rotate((this.pcmanRotation * 90 * Math.PI) / 180);
        ctx.drawImage(this.pacmanImages[this.pacmanImageIndex],
            -size,
            -size,
            this.tileSize,
            this.tileSize)
        ctx.restore();
    }

    #changeDirection = (e) => {
        //up
        if (e.keyCode == 38) {
            if (this.currentDirection == this.moves.down)
                this.currentDirection = this.moves.up
            this.nextDirection = this.moves.up
            this.gameStarted = true;
        }
        //down
        if (e.keyCode == 40) {
            if (this.currentDirection == this.moves.up)
                this.currentDirection = this.moves.down
            this.nextDirection = this.moves.down
            this.gameStarted = true;
        }
        //left
        if (e.keyCode == 37) {
            if (this.currentDirection == this.moves.right)
                this.currentDirection = this.moves.left
            this.nextDirection = this.moves.left
            this.gameStarted = true;

        }
        //right
        if (e.keyCode == 39) {
            if (this.currentDirection == this.moves.left)
                this.currentDirection = this.moves.right
            this.nextDirection = this.moves.right
            this.gameStarted = true;
        }
    }

    #loadPacman() {
        const pacman0 = new Image();
        const pacman1 = new Image();
        const pacman2 = new Image();

        pacman0.src = './Images/pac0.png'
        pacman1.src = './Images/pac1.png'
        pacman2.src = './Images/pac2.png'
        this.pacmanImages = [pacman0, pacman1, pacman2, pacman1];
        this.pacmanImageIndex = 0;

    }

    #move() {
        if (this.currentDirection !== this.nextDirection) {
            if (Number.isInteger(this.xAxis / this.tileSize) &&
                Number.isInteger(this.yAxis / this.tileSize)) {
                if (!this.mapTile.wallCollision(this.xAxis, this.yAxis, this.nextDirection)) {
                    this.currentDirection = this.nextDirection
                }

            }
        }

        if (this.mapTile.wallCollision(this.xAxis, this.yAxis, this.currentDirection)) {
            this.animateTime = null
            this.pacmanImageIndex = 1
            return;
        }

        else if (this.currentDirection != null && this.animateTime == null) {
            this.animateTime = this.defAnimateTime;
        }

        switch (this.currentDirection) {
            case this.moves.up:
                this.yAxis -= this.velocity
                this.pcmanRotation = this.Rotation.up
                break;
            case this.moves.down:
                this.yAxis += this.velocity
                this.pcmanRotation = this.Rotation.down
                break;
            case this.moves.left:
                this.xAxis -= this.velocity
                this.pcmanRotation = this.Rotation.left
                break;
            case this.moves.right:
                this.xAxis += this.velocity
                this.pcmanRotation = this.Rotation.right
                break;
        }
    }

    #animate() {
        if (this.animateTime == null) {
            return
        }
        this.animateTime--;
        if (this.animateTime == 0) {
            this.animateTime = this.defAnimateTime;
            this.pacmanImageIndex++;
            if (this.pacmanImageIndex == this.pacmanImages.length) {
                this.pacmanImageIndex = 0
            }

        }

    }
}