  const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d");
const scoreText = document.querySelector("#scoreText");
const resetBtn = document.querySelector("#resetBtn");
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const boardBackground = "forestgreen";
const paddle1Color = "lightblue";
const paddle2Color = "red";
const paddleBorder = "black";
const ballColor = "yellow";
const ballBorderColor = "black";
const ballRadius = 12.5;
const paddleSpeed = 50;
let intervalID;
let ballSpeed;
let ballX = gameWidth / 2;
let ballY = gameHeight / 2;
let ballXDirection = 0;
let ballYDirection = 0;
let player1Score = 0;
let player2Score = 0;
let paddle1 = {
    width: 25,
    height: 100,
    x: 0,
    y: 0
};
let paddle2 = {
    width: 25,
    height: 100,
    x: gameWidth - 25,
    y: gameHeight - 100
};

  window.addEventListener("keydown", changeDirection);
    resetBtn.addEventListener("click", resetGame);

    gameStart();

    function gameStart() {
        createBall();
        nextTick();
    };

    function nextTick() {
        intervalID = setTimeout(() => {
            clearBoard();
            drawPaddles();
            moveBall();
            drawBall(ballX, ballY);
            checkCollision();
            nextTick();
        }, 10)
    };

    function clearBoard() {
        ctx.fillStyle = boardBackground;
        ctx.fillRect(0, 0, gameWidth, gameHeight);
    };

    function drawPaddles() {
        ctx.strokeStyle = paddleBorder;

        ctx.fillStyle = paddle1Color;
        ctx.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
        ctx.strokeRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);

        ctx.fillStyle = paddle2Color;
        ctx.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
        ctx.strokeRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
    };

    function createBall() {
        ballSpeed = 1;
        if (Math.round(Math.random()) == 1) {
            ballXDirection = 1;
        } else {
            ballXDirection = -1;
        }
        if (Math.round(Math.random()) ==1) {
            ballYDirection = 1;
        } else {
            ballYDirection = -1;
        }
    };

    function drawBall(x, y) {
        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = ballColor;
        ctx.fill();
        ctx.strokeStyle = ballBorderColor;
        ctx.stroke();
        ctx.closePath();
    };

    function moveBall() {
        ballX += ballXDirection * ballSpeed;
        ballY += ballYDirection * ballSpeed;
    };

    function checkCollision() {
        // Check collision with paddles
        if (ballX - ballRadius < paddle1.x + paddle1.width &&
            ballX + ballRadius > paddle1.x &&
            ballY - ballRadius < paddle1.y + paddle1.height &&
            ballY + ballRadius > paddle1.y) {
            ballXDirection = 1;
        }

        if (ballX - ballRadius < paddle2.x + paddle2.width &&
            ballX + ballRadius > paddle2.x &&
            ballY - ballRadius < paddle2.y + paddle2.height &&
            ballY + ballRadius > paddle2.y) {
            ballXDirection = -1;
        }

        // Check collision with walls
        if (ballY - ballRadius < 0 || ballY + ballRadius > gameHeight) {
            ballYDirection = -ballYDirection;
            ballSpeed +=  0.8;
        }

        // Check if ball goes out of bounds
        if (ballX - ballRadius < 0) {
            player2Score++;
            updateScore();
            resetBall();
        }

        if (ballX + ballRadius > gameWidth) {
            player1Score++;
            updateScore();
            resetBall();
        }
    };

    function resetBall() {
        ballX = gameWidth / 2;
        ballY = gameHeight / 2;
        createBall();
    };

    function updateScore() {
        scoreText.textContent = `${player1Score} : ${player2Score}`;
    };

    function changeDirection(event) {
        // Player 1 controls
        if (event.key === "w") {
            if (paddle1.y - paddleSpeed >= 0) {
                paddle1.y -= paddleSpeed;
            }
        } else if (event.key === "s") {
            if (paddle1.y + paddle1.height + paddleSpeed <= gameHeight) {
                paddle1.y += paddleSpeed;
            }
        }

        // Player 2 controls
        if (event.key === "ArrowUp") {
            if (paddle2.y - paddleSpeed >= 0) {
                paddle2.y -= paddleSpeed;
            }
        } else if (event.key === "ArrowDown") {
            if (paddle2.y + paddle2.height + paddleSpeed <= gameHeight) {
                paddle2.y += paddleSpeed;
            }
        }
    };

    function resetGame() {
        clearTimeout(intervalID);
        player1Score = 0;
        player2Score = 0;
        updateScore();
        clearBoard();
        drawPaddles();
        resetBall();
        gameStart();
    };
