const canvas = document.getElementById("canvas1");

/**  @type {CanvasRenderingContext2D} */

const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth - 100;
canvas.height = window.innerHeight - 100;
ctx.strokeStyle = "white";
ctx.fillStyle = "gray";

class Box {
  constructor(game, x, y) {
    this.game = game;
    this.xPosition = x;
    this.yPosition = y;
    this.size =
      (this.game.width - this.game.sideMargin * 2) / this.game.boxesVertically >
      75
        ? 75
        : (this.game.width - this.game.sideMargin * 2) /
          this.game.boxesVertically;
    this.x = this.xPosition * this.size + this.game.sideMargin;
    this.y = this.yPosition * this.size + this.game.topMargin;
  }
  draw() {
    ctx.strokeRect(this.x, this.y, this.size, this.size);
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }
}

class Ball {
  constructor(game) {
    this.game = game;
    this.size = 10;
    this.x = this.game.width * 0.5;
    this.y = this.game.height - this.size - this.game.sliderHeight;
    this.speed = 4;
    this.yDirection = -(Math.random() * this.speed + 1) * 0;
    this.xDirection = -(Math.random() * this.speed + 1) *0;
  }
  update() {
    // check for border collision
    // horizontally
    if (this.x > this.game.width - this.size || this.x <= 0 + this.size)
      this.xDirection = -this.xDirection;

    // vertically
    if (this.y <= 0 + this.size) this.yDirection = -this.yDirection;

    this.x += this.xDirection;
    this.y += this.yDirection;
  }
  draw() {
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fillStyle = "green";
    ctx.fill();
    ctx.restore();
  }
}

class Slider {
  constructor(game) {
    this.game = game;
    this.width = this.game.sliderWidth;
    this.height = this.game.sliderHeight;
    this.x = this.game.width * 0.5 - this.width * 0.5;
    this.y = this.game.height - this.height;
  }
  draw() {
    if (this.x <= 0) this.x = 0
    if (this.x >= this.game.width - this.width) this.x = this.game.width - this.width
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.height = this.canvas.height;
    this.width = this.canvas.width;
    this.boxesHorizontally = Math.round(this.height / 40);
    this.boxesVertically = Math.round(this.width / 25);
    this.sideMargin = this.width / 8;
    this.topMargin = 50;
    this.boxes = [];
    this.sliderWidth = (this.width + this.height) / 12;
    this.sliderHeight = 5;
    this.ball = new Ball(this);
    this.slider = new Slider(this);
    this.touchThreshold = 10;
    this.touchX;
    this.init();
    window.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") this.slider.x -= 15;
      if (e.key === "ArrowRight") this.slider.x += 15;
    });

    window.addEventListener("touchstart", (e) => {
      this.touchX = e.changedTouches[0].pageX;
      console.log(e.changedTouches[0].pageX, "start");
    });
    window.addEventListener("touchmove", (e) => {
      const swipeDistance = e.changedTouches[0].pageX - this.touchX;
      if (swipeDistance < -this.touchThreshold) this.slider.x -= 5;
      if (swipeDistance > -this.touchThreshold) this.slider.x += 5;
    });

    window.addEventListener('wheel', e => {
      if (e.deltaY < 0) this.slider.x += 15;
      if (e.deltaY > 0) this.slider.x -= 15;
    })
  }
  init() {
    for (let y = 0; y < this.boxesHorizontally; y++) {
      for (let x = 0; x < this.boxesVertically; x++) {
        this.boxes.push(new Box(this, x, y));
      }
    }
  }
  checkCollision(ball) {
    let isCollied = false;
    for (let box of this.boxes) {
      let tempX = ball.x;
      let tempY = ball.y;
      let tempBallPosition;
      // which edge is closest?
      if (ball.x < box.x) {
        tempX = box.x;
        tempBallPosition = "left";
      } // test left edge
      else if (ball.x > box.x + box.size) {
        tempX = box.x + box.size;
        tempBallPosition = "right";
      } // right edge

      if (ball.y < box.y) {
        tempY = box.y;
        tempBallPosition = "top";
      } // top edge
      else if (ball.y > box.y + box.size) {
        tempY = box.y + box.size;
        tempBallPosition = "bottom";
      } // bottom edge

      // get distance from closest edges
      let distX = ball.x - tempX;
      let distY = ball.y - tempY;
      let distance = Math.sqrt(distX * distX + distY * distY);

      if (distance <= ball.size) {
        this.boxes = this.boxes.filter(
          (item) =>
            item.xPosition !== box.xPosition || item.yPosition !== box.yPosition
        );
        isCollied = tempBallPosition;
        break;
      } else isCollied = false;
    }
    return isCollied;
  }
  sliderCollision() {
    var distX = Math.abs(this.ball.x - this.slider.x - this.slider.width / 2);
    var distY = Math.abs(this.ball.y - this.slider.y - this.slider.height / 2);

    if (distX > this.slider.width / 2 + this.ball.size) {
      return false;
    }
    if (distY > this.slider.height / 2 + this.ball.size) {
      return false;
    }

    if (distX <= this.slider.width / 2) {
      return true;
    }
    if (distY <= this.slider.height / 2) {
      return true;
    }

    var dx = distX - this.slider.width / 2;
    var dy = distY - this.slider.height / 2;
    return dx * dx + dy * dy <= this.ball.size * this.ball.size;
  }
  update() {
    const isCollied = this.checkCollision(this.ball);
    if (isCollied) {
      if (isCollied === "right" || isCollied === "left")
        this.ball.xDirection = -this.ball.xDirection;
      else if (isCollied === "top" || isCollied === "bottom")
        this.ball.yDirection = -this.ball.yDirection;
    }
    // console.log(this.sliderCollision())
    if (this.sliderCollision()) {
      let relativeIntersectX =
      this.slider.x + this.sliderWidth * 0.5 - this.ball.x;
      let normalizedRelativeIntersectX =
        relativeIntersectX / (this.sliderWidth / 2);
        let MAXBOUNCEANGLE = 75 * (Math.PI / 180);

      let bounceAngle = normalizedRelativeIntersectX * MAXBOUNCEANGLE;

      this.ball.yDirection = this.ball.speed * -Math.cos(bounceAngle);
      this.ball.xDirection = this.ball.speed * -Math.sin(bounceAngle);
    }
    console.log(this.ball)
    this.ball.update();
    console.log(this.ball)
  }
  draw() {
    this.boxes.forEach((box) => box.draw());
    this.ball.draw();
    this.slider.draw();
  }
}

const game = new Game(canvas);

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  game.draw();
  game.update();
  requestAnimationFrame(animate);
}

animate();
console.log(game);
