let canvas = document.getElementById("snakeCanvas");
let ctx = canvas.getContext("2d");

const UP = 1;
const DOWN = 2;
const LEFT = 3;
const RIGHT = 4;


let snake = [];
function Snake(x, y, snakeIndex) {
    this.x = x;
    this.y = y;
    this.width = 20;
    this.height = 20;
    this.color = "#231123";
    this.position = snakeIndex;
    this.xCoordinates = [];
    this.yCoordinates = [];
    this.draw = function() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };
    this.move = function(direction){
        if (direction == UP){
            this.y = this.y - this.height;   
        }
        if (direction == DOWN){
            this.y = this.y + this.height;   
        }
        if (direction == LEFT){
            this.x = this.x - this.width;  
        }
        if (direction == RIGHT){
            this.x = this.x + this.width;  
        }
    };
    this.updatePositionsList = function(){
        this.xCoordinates.push(this.x);
        this.yCoordinates.push(this.y);
    };
    this.setBodyPosition = function(){
        let referenceSnake = snake[this.position - 1];
        this.x = referenceSnake.xCoordinates[referenceSnake.xCoordinates.length - 2];
        this.y = referenceSnake.yCoordinates[referenceSnake.yCoordinates.length - 2];
    }
    this.setCenterPosition = function(){
        this.xCenter = this.x + this.width/2;
        this.yCenter = this.y + this.height/2;
    }
}

function Apple(xCenter, yCenter) {
    this.x = xCenter;
    this.y = yCenter;
    this.radius = 10;
    this.color = "#D30C7B";
    this.draw = function() {
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        ctx.stroke();
        ctx.fill();
    };   
}

const snakeHead = new Snake(canvas.width / 2, canvas.width / 2, snake.length);
snake.push(snakeHead);

const apple = new Apple(setPossibleApplePositions(30, canvas.width), setPossibleApplePositions(30, canvas.height));
drawCheckerBoard();
setCanvas();

function setCanvas(){
    snakeHead.draw();
    apple.draw();
}

function drawCheckerBoard(){
    for(let y = 0; y <= canvas.height; y += snakeHead.height){
        for(let x = 0; x <= canvas.width; x += snakeHead.width){
            if(y % (snakeHead.height * 2) == 0){
                if(x % (snakeHead.width * 2) == 0){
                    ctx.fillStyle = "#ddd8f7"; 
                }
                else{
                    ctx.fillStyle = "#b8b8ff"; 
                }
            }
            else{
                if(x % (snakeHead.width*2) == 0){
                    ctx.fillStyle = "#b8b8ff"; 
                }
                else{
                    ctx.fillStyle = "#ddd8f7"; 
                }
            }
            ctx.fillRect(x, y, snakeHead.width, snakeHead.height);    
        }
    }
}

function playGame(direction){
    let xWallCollisions = snakeHead.x == 0 || snakeHead.x == canvas.width - snakeHead.width;
    let yWallCollisions = snakeHead.y == 0 || snakeHead.y == canvas.height - snakeHead.height;
    if(!xWallCollisions && !yWallCollisions) {
        drawCheckerBoard();
        snakeHead.move(direction);
        snakeHead.updatePositionsList();
        if(isTouching(snakeHead, apple)){
            generateNewApplePosition();
            addToSnake();
        }  
        apple.draw();
        updateSnake();
    }
    else{
        document.getElementById("replay").style.display = "block"; 
    }
}

function updateSnake(){
    snakeHead.draw();
    snakeHead.setCenterPosition();
    
    for(let i = 1; i<snake.length; i++){
        snake[i].setBodyPosition();
        snake[i].updatePositionsList();
        snake[i].setCenterPosition();
        snake[i].draw();
    }
}

function addToSnake(){
    let snakeAddition = new Snake(0, 0, snake.length);
    snake.push(snakeAddition);
}

function setPossibleApplePositions(firstInt, lastInt){
    const possibleApplePositions = [];
    for(let i = firstInt; i < lastInt - snakeHead.width; i += snakeHead.width){
        possibleApplePositions.push(i);
    }
    let randomInt = parseInt((Math.random() * possibleApplePositions.length), 10);
    let chosenPosition = possibleApplePositions[randomInt];
    return chosenPosition;
}

function generateNewApplePosition(){
    apple.x = setPossibleApplePositions(snakeHead.width + (snakeHead.width / 2), canvas.width);
    apple.y = setPossibleApplePositions(snakeHead.height + (snakeHead.height / 2), canvas.height);
}

function isTouching(Snake, Apple){
    let distance = Math.sqrt((Math.pow(Snake.xCenter - Apple.x, 2)) + (Math.pow(Snake.yCenter - Apple.y, 2)));
    let touching = Apple.radius + Snake.width/2 - 1 ;
    if (distance <= touching){
        return true;
    }
    else{
        return false;
    }
}

let interval = setInterval(null, null);
let currentDirection = null;

document.addEventListener("keydown", function(event) {
    if (event.key == "ArrowLeft") {
        event.preventDefault();
        if(currentDirection != RIGHT){
            clearInterval(interval);
            interval = setInterval(playGame, 110, LEFT);
            currentDirection = LEFT;
        }
    } 
    if (event.key == "ArrowRight") {
        event.preventDefault();
        if(currentDirection != LEFT){
            clearInterval(interval);
            interval = setInterval(playGame, 110, RIGHT);
            currentDirection = RIGHT;
        }
    }    
    if (event.key == "ArrowUp") {
        event.preventDefault();
        if(currentDirection != DOWN){
            clearInterval(interval);
            interval = setInterval(playGame, 110, UP);
            currentDirection = UP;
        }
    }    
    if (event.key == "ArrowDown") {
        event.preventDefault();
        if(currentDirection != UP){
            clearInterval(interval);
            interval = setInterval(playGame, 110, DOWN);
            currentDirection = DOWN;
        }
    }
});