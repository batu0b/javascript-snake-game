const canvas = document.getElementById("canvas");

const ctx = canvas.getContext("2d");

let initialState = {
  cols: 30,
  rows: 20,
  score: 0,
  tail: [],
  static: 20,
  snakeX: 0,
  snakeY: 0,
  foodX: null,
  foodY: null,
  velX: 0,
  velY: 0,
  gameOver: false,
};

canvas.width = initialState.cols * initialState.static;
canvas.height = initialState.rows * initialState.static;

class Square {
  constructor(x, y, w, h, color) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.color = color;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }
}

class Text {
  constructor(text, x, y, textAlign, fontSize) {
    this.x = x;
    this.text = text;
    this.textAlign = textAlign;
    this.y = y;
    this.fontSize = fontSize;
  }
  draw() {
    ctx.fillStyle = "red";
    ctx.font = `${this.fontSize}px Roboto Mono`;
    ctx.textAlign = this.textAlign;
    ctx.fillText(this.text, this.x, this.y);
  }
}

const hightScore = localStorage.getItem("hightScore");

addEventListener("keydown", ({ key }) => {
  switch (key) {
    case "ArrowUp":
      initialState.velX = 0;
      initialState.velY = -1;
      break;
    case "ArrowDown":
      initialState.velX = 0;
      initialState.velY = 1;
      break;
    case "ArrowLeft":
      initialState.velX = -1;
      initialState.velY = 0;
      break;
    case "ArrowRight":
      initialState.velX = 1;
      initialState.velY = 0;
      break;
    default:
      break;
  }
  document.getElementById("score").innerText = initialState.score;
});

const generateFood = () => {
  initialState.foodX =
    Math.floor(Math.random() * initialState.cols) * initialState.static;
  initialState.foodY =
    Math.floor(Math.random() * initialState.rows) * initialState.static;
};

generateFood();

const gameOver = () => {
  initialState.score = 0;
  initialState.tail = [];
  initialState.static = 0;
  initialState.snakeX = 0;
  initialState.snakeY = 0;
  initialState.velX = 0;
  initialState.velY = 0;
  initialState.gameOver = true;
};

const loop = () => {
  setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    new Square(0, 0, canvas.width, canvas.height, "black").draw();
    new Square(
      initialState.snakeX,
      initialState.snakeY,
      initialState.static,
      initialState.static,
      "green"
    ).draw();
    new Square(
      initialState.foodX,
      initialState.foodY,
      initialState.static,
      initialState.static,
      "blue"
    ).draw();

    initialState.snakeX += initialState.velX * initialState.static;
    initialState.snakeY += initialState.velY * initialState.static;

    //
    if (
      initialState.snakeX == initialState.foodX &&
      initialState.snakeY == initialState.foodY
    ) {
      initialState.tail.push([initialState.foodX, initialState.foodY]);
      initialState.score += 1;
      if (
        hightScore !== null &&
        initialState.score > localStorage.getItem("hightScore")
      ) {
        localStorage.setItem("hightScore", `${initialState.score}`);
      } else if (hightScore === null) {
        localStorage.setItem("hightScore", `${initialState.score}`);
      }

      generateFood();
    }

    for (let i = initialState.tail.length - 1; i >= 1; i--) {
      initialState.tail[i] = initialState.tail[i - 1];
    }
    if (initialState.tail.length) {
      initialState.tail[0] = [initialState.snakeX, initialState.snakeY];
    }

    for (let i = 0; i < initialState.tail.length; i++) {
      new Square(
        initialState.tail[i][0],
        initialState.tail[i][1],
        initialState.static,
        initialState.static,
        "green"
      ).draw();
    }
    //

    if (
      initialState.snakeX < 0 ||
      initialState.snakeX > initialState.cols * initialState.static ||
      initialState.snakeY < 0 ||
      initialState.snakeY > initialState.rows * initialState.static
    ) {
      gameOver();
    }

    if (initialState.gameOver) {
      addEventListener("keypress", ({ key }) => {
        if (key === " ") {
          initialState.gameOver = false;
          initialState.static = 20;
        }
      });
      new Text(
        "Game Over",
        canvas.width / 2,
        canvas.height / 2,
        "center",
        50
      ).draw();
      new Text(
        "Press Space To Start Again",
        canvas.width / 2,
        canvas.height / 2 + 70,
        "center",
        30
      ).draw();
      new Text(
        `Hight Score: ${localStorage.getItem("hightScore")}`,
        canvas.width / 2,
        canvas.height / 2 + 125,
        "center",
        30
      ).draw();
    }
  }, 1000 / 10);
};

loop();
