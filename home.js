import Parvus from "./player";

function startGame() {
    let startDiv = document.getElementById("start");
    letCanvas = document.getElementById("canvas");
    let gameOver = document.getElementById("game-over");
    startDiv.style.display = "none";
    gameCanvas.style.display = "block";
    gameOver.style.display = "none";
    start();
}

function gameOver() {
    let startDiv = document.getElementById("start");
    letCanvas = document.getElementById("canvas");
    let gameOver = document.getElementById("game-over");
    startDiv.style.display = "none";
    gameCanvas.style.display = "none";
    gameOver.style.display = "block";
    
    Parvus.reset();

    clearInterval(loop);
}

export default startGame;
export default gameOver;

// es fehlt die Game Over Function 