import MapTile from "./MapTile.js";

const tileSize = 32;
const velocity = 2;
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const mapTile = new MapTile(tileSize);
const pacman = mapTile.getPacman(velocity);
const ghost = mapTile.getGhosts(velocity);
let gameOver = false;
let isWinner = false;
function gameLoop() {
    mapTile.draw(ctx)
    showGameOver();
    pacman.draw(ctx,stop())
    ghost.forEach(e => {
        e.draw(ctx, stop())
    });
    isGameOver();
    didWin()

}

function isGameOver() {
    gameOver = ghost.some(e => e.pacmanCollision(pacman))
    return gameOver;
}

function showGameOver() {
    if(isWinner)
    {
        alert("You won!");
        location.reload()
    }
        
    else if(gameOver){
        alert("You lost! Try Again");
        location.reload()
    }
        
}
function didWin() {
    isWinner = mapTile.didWin()
}

stop = () => {
    return !pacman.gameStarted || gameOver || isWinner
}
mapTile.setCanvasSize(canvas)
setInterval(gameLoop, 1000 / 75);