const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const snake_block = 10;
let snake_speed = 15; // Increased initial speed

let snake = [];
let score = 0;
let beanCount = 0;
let reverseControls = false;

let x1_change = 0;
let y1_change = 0;

let food = {};
let gameLoop;

let timeLimit = 10;
let extraTime = 5;
let startTime;
let timerInterval;

function showWelcomeScreen() {
    document.getElementById('welcome-screen').style.display = 'block';
    document.getElementById('game-container').style.display = 'none';
    document.getElementById('game-over').style.display = 'none';
}

function startGame() {
    document.getElementById('welcome-screen').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
    init();
}

function init() {
    clearInterval(gameLoop);
    clearInterval(timerInterval);
    snake = [];
    score = 0;
    beanCount = 0;
    reverseControls = false;
    x1_change = snake_block;
    y1_change = 0;
    snake_speed = 15; // Reset to initial speed
    timeLimit = 10;
    startTime = Date.now();

    snake[0] = {
        x: Math.floor(canvas.width / 2 / snake_block) * snake_block,
        y: Math.floor(canvas.height / 2 / snake_block) * snake_block
    };

    createFood();
    updateScore();
    updateTimer();

    timerInterval = setInterval(updateTimer, 1000);
    gameLoop = setInterval(game, 1000 / snake_speed);
}

function createFood() {
    food = {
        x: Math.floor(Math.random() * (canvas.width / snake_block)) * snake_block,
        y: Math.floor(Math.random() * (canvas.height / snake_block)) * snake_block
    };
}

function drawSnake() {
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i === 0) ? "green" : "black";
        ctx.fillRect(snake[i].x, snake[i].y, snake_block, snake_block);
        ctx.strokeStyle = "white";
        ctx.strokeRect(snake[i].x, snake[i].y, snake_block, snake_block);
    }
}

function drawFood() {
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, snake_block, snake_block);
}

function updateScore() {
    document.getElementById('score').innerText = `Score: ${score}`;
}

function updateTimer() {
    const currentTime = Date.now();
    const elapsedTime = Math.floor((currentTime - startTime) / 1000);
    const remainingTime = timeLimit + (beanCount * extraTime) - elapsedTime;

    if (remainingTime <= 0) {
        clearInterval(gameLoop);
        clearInterval(timerInterval);
        gameOver(false);
    } else {
        document.getElementById('timer').innerText = `Time Left: ${remainingTime}s`;
    }
}

function checkCollision(head) {
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    return false;
}

function game() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawSnake();
    drawFood();

    let x1 = snake[0].x;
    let y1 = snake[0].y;

    x1 += x1_change;
    y1 += y1_change;

    // Wall wrapping
    if (x1 >= canvas.width) x1 = 0;
    else if (x1 < 0) x1 = canvas.width - snake_block;
    if (y1 >= canvas.height) y1 = 0;
    else if (y1 < 0) y1 = canvas.height - snake_block;

    let newHead = { x: x1, y: y1 };

    if (checkCollision(newHead)) {
        clearInterval(gameLoop);
        clearInterval(timerInterval);
        gameOver(false);
        return;
    }

    snake.unshift(newHead);

    if (x1 === food.x && y1 === food.y) {
        score++;
        beanCount++;
        updateScore();
        createFood();

        if (beanCount % 5 === 0) {
            snake_speed += 0.35;
            clearInterval(gameLoop);
            gameLoop = setInterval(game, 1000 / snake_speed);
            reverseControls = !reverseControls;
        }

        if (score >= 99) {
            clearInterval(gameLoop);
            clearInterval(timerInterval);
            gameOver(true);
            return;
        }

        if ((beanCount + 1) % 5 === 0 && beanCount < 99) {
            document.getElementById('message').innerText = "Next bean will reverse controls!";
        } else {
            document.getElementById('message').innerText = "";
        }
    } else {
        snake.pop();
    }
}

function gameOver(won) {
    const gameOverElement = document.getElementById('game-over');
    const gameOverText = document.getElementById('game-over-text');
    
    gameOverElement.style.display = 'block';
    document.getElementById('game-container').style.display = 'none';
    
    if (won) {
        const totalTime = Math.floor((Date.now() - startTime) / 1000);
        gameOverText.innerText = `Congratulations! You won the game in ${totalTime} seconds.`;
    } else {
        gameOverText.innerText = "Game Over! You lost.";
    }
}

document.addEventListener("keydown", direction);

function direction(event) {
    if (reverseControls) {
        if (event.keyCode === 37 && x1_change <= 0) {
            x1_change = snake_block;
            y1_change = 0;
        } else if (event.keyCode === 38 && y1_change <= 0) {
            x1_change = 0;
            y1_change = snake_block;
        } else if (event.keyCode === 39 && x1_change >= 0) {
            x1_change = -snake_block;
            y1_change = 0;
        } else if (event.keyCode === 40 && y1_change >= 0) {
            x1_change = 0;
            y1_change = -snake_block;
        }
    } else {
        if (event.keyCode === 37 && x1_change <= 0) {
            x1_change = -snake_block;
            y1_change = 0;
        } else if (event.keyCode === 38 && y1_change <= 0) {
            x1_change = 0;
            y1_change = -snake_block;
        } else if (event.keyCode === 39 && x1_change >= 0) {
            x1_change = snake_block;
            y1_change = 0;
        } else if (event.keyCode === 40 && y1_change >= 0) {
            x1_change = 0;
            y1_change = snake_block;
        }
    }
}

document.getElementById('start-button').addEventListener('click', startGame);

document.getElementById('replay-button').addEventListener('click', () => {
    document.getElementById('game-over').style.display = 'none';
    startGame();
});

document.getElementById('quit-button').addEventListener('click', showWelcomeScreen);

showWelcomeScreen(); // Show welcome screen on initial load