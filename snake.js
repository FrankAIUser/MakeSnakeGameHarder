const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const snakeSize = 10;
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
let snake = [{ x: canvasWidth / 2, y: canvasHeight / 2 }];
let snakeLength = 1;
let direction = 'RIGHT';
let newDirection = 'RIGHT';
let food = { x: getRandomPosition(canvasWidth), y: getRandomPosition(canvasHeight) };
let score = 0;
let speed = 100;
let reverseControls = false;
let gameRunning = true;
let timerStarted = false;
let startTime = 0;
let timeLimit = 10;
let extraTime = 5;

document.addEventListener('keydown', (e) => {
    console.log('Key Pressed: ', e.key); // Debugging
    if (e.key === 'ArrowUp' && direction !== 'DOWN') newDirection = 'UP';
    if (e.key === 'ArrowDown' && direction !== 'UP') newDirection = 'DOWN';
    if (e.key === 'ArrowLeft' && direction !== 'RIGHT') newDirection = 'LEFT';
    if (e.key === 'ArrowRight' && direction !== 'LEFT') newDirection = 'RIGHT';
    if (!timerStarted) {
        startTime = Date.now();
        timerStarted = true;
    }
});

function gameLoop() {
    if (!gameRunning) return;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    // Update direction
    if (newDirection !== direction) {
        direction = newDirection;
        if (snakeLength % 5 === 0 && snakeLength !== 1) {
            reverseControls = !reverseControls;
            displayMessage("Next bean will reverse controls");
        }
    }

    // Move snake
    let head = { ...snake[0] };
    if (direction === 'UP') head.y -= snakeSize;
    if (direction === 'DOWN') head.y += snakeSize;
    if (direction === 'LEFT') head.x -= snakeSize;
    if (direction === 'RIGHT') head.x += snakeSize;

    // Wall wrapping
    if (head.x >= canvasWidth) head.x = 0;
    if (head.x < 0) head.x = canvasWidth - snakeSize;
    if (head.y >= canvasHeight) head.y = 0;
    if (head.y < 0) head.y = canvasHeight - snakeSize;

    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        food = { x: getRandomPosition(canvasWidth), y: getRandomPosition(canvasHeight) };
        snakeLength++;
        score++;
        if (score % 5 === 0) speed = Math.max(speed - 20, 50); // Increase speed
    } else {
        snake.pop();
    }

    // Check collision
    if (snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)) {
        gameRunning = false;
        displayMessage("Game Over! Score: " + score);
        return;
    }

    // Draw snake
    ctx.fillStyle = 'black';
    snake.forEach(segment => ctx.fillRect(segment.x, segment.y, snakeSize, snakeSize));
    
    // Draw food
    ctx.fillStyle = 'green';
    ctx.fillRect(food.x, food.y, snakeSize, snakeSize);

    // Draw score and timer
    let elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    let remainingTime = timeLimit + (Math.floor(score / 5) * extraTime) - elapsedTime;
    if (remainingTime <= 0) {
        gameRunning = false;
        displayMessage("Time's up! Score: " + score);
        return;
    }
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText("Score: " + score, 10, 20);
    ctx.fillText("Time Left: " + remainingTime + "s", 10, 40);

    setTimeout(gameLoop, speed);
}

function displayMessage(message) {
    document.getElementById('message').textContent = message;
    setTimeout(() => document.getElementById('message').textContent = '', 2000);
}

function getRandomPosition(max) {
    return Math.floor(Math.random() * (max / snakeSize)) * snakeSize;
}

gameLoop();
