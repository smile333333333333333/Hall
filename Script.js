const startScreen = document.getElementById("startScreen");
const gameOverScreen = document.getElementById("gameOverScreen");

const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");

const gameArea = document.getElementById("gameArea");
const player = document.getElementById("player");

const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("highScore");

const finalScoreDisplay = document.getElementById("finalScore");
const finalHighScoreDisplay = document.getElementById("finalHighScore");

const secretReward = document.getElementById("secretReward");

let score = 0;
let highScore = Number(localStorage.getItem("hallwayHighScore")) || 0;

let gameRunning = false;
let playerX = 50;

let obstacles = [];
let obstacleTimer;
let scoreTimer;

highScoreDisplay.textContent = highScore;


// START GAME
startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", startGame);

function startGame() {
    startScreen.classList.add("hidden");
    gameOverScreen.classList.add("hidden");

    score = 0;
    playerX = 50;

    scoreDisplay.textContent = score;
    highScoreDisplay.textContent = highScore;

    player.style.left = playerX + "%";

    // Remove old obstacles
    obstacles.forEach(obstacle => obstacle.remove());
    obstacles = [];

    gameRunning = true;

    obstacleTimer = setInterval(createObstacle, 900);

    scoreTimer = setInterval(() => {
        if (!gameRunning) return;

        score++;
        scoreDisplay.textContent = score;

        if (score > highScore) {
            highScore = score;
            localStorage.setItem(
                "hallwayHighScore",
                highScore
            );

            highScoreDisplay.textContent = highScore;
        }
    }, 1000);

    requestAnimationFrame(gameLoop);
}


// KEYBOARD CONTROLS
document.addEventListener("keydown", event => {
    if (!gameRunning) return;

    if (event.key === "ArrowLeft") {
        movePlayer(-6);
    }

    if (event.key === "ArrowRight") {
        movePlayer(6);
    }
});


// MOBILE SWIPE
let touchStartX = 0;

gameArea.addEventListener("touchstart", event => {
    touchStartX = event.touches[0].clientX;
});

gameArea.addEventListener("touchend", event => {
    if (!gameRunning) return;

    let touchEndX = event.changedTouches[0].clientX;
    let difference = touchEndX - touchStartX;

    if (Math.abs(difference) > 30) {
        if (difference < 0) {
            movePlayer(-8);
        } else {
            movePlayer(8);
        }
    }
});


// MOVE PLAYER
function movePlayer(amount) {
    playerX += amount;

    if (playerX < 5) {
        playerX = 5;
    }

    if (playerX > 95) {
        playerX = 95;
    }

    player.style.left = playerX + "%";
}


// CREATE OBSTACLE
function createObstacle() {
    if (!gameRunning) return;

    const obstacle = document.createElement("div");

    obstacle.classList.add("obstacle");

    obstacle.style.left =
        Math.random() * 90 + "%";

    obstacle.style.top = "-70px";

    gameArea.appendChild(obstacle);

    obstacles.push({
        element: obstacle,
        y: -70,
        speed: 4
    });
}


// GAME LOOP
function gameLoop() {
    if (!gameRunning) return;

    obstacles.forEach((obstacle, index) => {

        obstacle.y += obstacle.speed;

        obstacle.element.style.top =
            obstacle.y + "px";

        // Collision detection
        if (checkCollision(player, obstacle.element)) {
            endGame();
        }

        // Remove obstacles that leave screen
        if (obstacle.y > gameArea.clientHeight + 100) {
            obstacle.element.remove();
            obstacles.splice(index, 1);
        }
    });

    requestAnimationFrame(gameLoop);
}


// COLLISION
function checkCollision(a, b) {
    const rect1 = a.getBoundingClientRect();
    const rect2 = b.getBoundingClientRect();

    return !(
        rect1.right < rect2.left ||
        rect1.left > rect2.right ||
        rect1.bottom < rect2.top ||
        rect1.top > rect2.bottom
    );
}


// GAME OVER
function endGame() {
    if (!gameRunning) return;

    gameRunning = false;

    clearInterval(obstacleTimer);
    clearInterval(scoreTimer);

    finalScoreDisplay.textContent = score;
    finalHighScoreDisplay.textContent = highScore;

    /*
        SECRET ARCHIVE REWARD

        The player must reach a HIGH SCORE
        of 30 or higher.

        Once unlocked, the code remains
        unlocked even after closing the game.
    */

    if (highScore >= 30) {
        secretReward.classList.remove("hidden");
    } else {
        secretReward.classList.add("hidden");
    }

    gameOverScreen.classList.remove("hidden");
}
