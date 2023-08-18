const gameContainer = document.getElementById("game-container");
const snakeHead = document.getElementById("snake-head");
const snakeBody = document.getElementById("snake-part");
let food;
let snakeX = 0;
let snakeY = 0;
let foodX;
let foodY;
let direction = "right";
const gridSize = 20;
const speed = 100;

function createFood() {
    foodX = Math.floor(Math.random() * gridSize) * 20;
    foodY = Math.floor(Math.random() * gridSize) * 20;
    food = document.createElement("div");
    food.className = "food";
    food.style.left = foodX + "px";
    food.style.top = foodY + "px";
    gameContainer.appendChild(food);
}

function moveSnake() {
    let newSnakeX = snakeX;
    let newSnakeY = snakeY;

    switch (direction) {
        case "up":
            newSnakeY -= 20;
            break;
        case "down":
            newSnakeY += 20;
            break;
        case "left":
            newSnakeX -= 20;
            break;
        case "right":
            newSnakeX += 20;
            break;
    }

    if (newSnakeX >= 0 && newSnakeX < gridSize * 20 &&
        newSnakeY >= 0 && newSnakeY < gridSize * 20) {
        snakeX = newSnakeX;
        snakeY = newSnakeY;
        snakeHead.style.left = snakeX + "px";
        snakeHead.style.top = snakeY + "px";

       

        if (snakeX === foodX && snakeY === foodY) {
            gameContainer.removeChild(food);
            createFood();

            const newSnakeBody = document.createElement("div");
            newSnakeBody.className = "snake-body";
            newSnakeBody.style.left = snakeX + "px";
            newSnakeBody.style.top = snakeY + "px";
            snakeBody.appendChild(newSnakeBody);
        }

        const snakeBodyParts = snakeBody.children;
        for (let i = snakeBodyParts.length - 1; i >= 0; i--) {
            const snakeBodyPart = snakeBodyParts[i];
            if (i === 0) {
                snakeBodyPart.style.left = snakeX + "px";
                snakeBodyPart.style.top = snakeY + "px";
            } else {
                const prevSnakeBodyPart = snakeBodyParts[i - 1];
                snakeBodyPart.style.left = prevSnakeBodyPart.style.left;
                snakeBodyPart.style.top = prevSnakeBodyPart.style.top;
            }
        }
    }
}

function changeDirection(event) {
    const key = event.key;
    switch (key) {
        case "ArrowUp":
            direction = "up";
            break;
        case "ArrowDown":
            direction = "down";
            break;
        case "ArrowLeft":
            direction = "left";
            break;
        case "ArrowRight":
            direction = "right";
            break;
    }
}

document.addEventListener("keydown", changeDirection);

createFood();
setInterval(moveSnake, speed);
