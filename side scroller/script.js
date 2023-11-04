window.addEventListener("load", () => {
  const canvas = document.getElementById("canvas1");

  const context = canvas.getContext("2d");

  const CANVAS_WIDTH = (canvas.width = 1400);
  const CANVAS_HEIGHT = (canvas.height = 720);

  class InputHandler {
    constructor() {
      this.keys = [];
      this.touchY;
      this.touchThreshold = 30;
      window.addEventListener("keydown", (e) => {
        if (
          (e.key === "ArrowDown" ||
            e.key === "ArrowUp" ||
            e.key === "ArrowLeft" ||
            e.key === "ArrowRight") &&
          this.keys.indexOf(e.key) === -1
        )
          this.keys.push(e.key);
      });
      window.addEventListener("keyup", (e) => {
        if (
          e.key === "ArrowDown" ||
          e.key === "ArrowUp" ||
          e.key === "ArrowLeft" ||
          e.key === "ArrowRight"
        )
          this.keys.splice(this.keys.indexOf(e.key), 1);
      });
      window.addEventListener("touchstart", (e) => {
        this.touchY = e.changedTouches[0].pageY;
      });
      window.addEventListener("touchmove", (e) => {
        const swipeDistance = e.changedTouches[0].pageY - this.touchY;
        if (
          swipeDistance < -this.touchThreshold &&
          this.keys.indexOf("swipe up") === -1
        )
          this.keys.push("swipe up");
        if (
          swipeDistance > -this.touchThreshold &&
          this.keys.indexOf("swipe down") === -1
        )
          this.keys.push("swipe down");
      });
      window.addEventListener("touchend", (e) => {
        this.keys.splice(this.keys.indexOf("swipe up"), 1);
        this.keys.splice(this.keys.indexOf("swipe down"), 1);
        console.log(this.keys);
      });
    }
  }

  let gameOver = false;

  class Player {
    constructor(gameWidth, gameHeight) {
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      // this.spriteWidth
      // this.spriteHeight
      this.width = 200;
      this.height = 200;
      this.x = 100;
      this.y = this.gameHeight - this.height;
      this.image = playerImage;
      this.frameX = 0;
      this.frameY = 0;
      this.speed = 0;
      this.vy = 0;
      this.weight = 1;
      this.maxFrame = 8;
      this.fps = 20;
      this.frameTimer = 0;
      this.frameInterval = 1000 / this.fps;
    }
    update(input, deltaTime, enemies) {
      // controls
      if (input.keys.indexOf("ArrowRight") > -1) {
        this.speed = 5;
      } else if (input.keys.indexOf("ArrowLeft") > -1) {
        this.speed = -5;
      } else if ((input.keys.indexOf("ArrowUp") > -1 || input.keys.indexOf("swipe up") > -1) && this.onGround()) {
        this.vy -= 30;
      } else if (input.keys.indexOf("ArrowLeft") > -1) {
        this.speed = -2.5;
      } else this.speed = 0;

      if (this.x < 0) this.x = 0;
      else if (this.x > this.gameWidth - this.width)
        this.x = this.gameWidth - this.width;

      this.x += this.speed;

      this.y += this.vy;
      if (!this.onGround()) {
        this.vy += this.weight;
        this.maxFrame = 6;
        this.frameY = 1;
      } else {
        this.vy = 0;
        this.maxFrame = 8;
        this.frameY = 0;
      }
      if (this.y > this.gameHeight - this.height)
        this.y = this.gameHeight - this.height;

      // sprite animation
      if (this.frameTimer > this.frameInterval) {
        if (this.frameX >= this.maxFrame) this.frameX = 0;
        else this.frameX++;
        this.frameTimer = 0;
      } else this.frameTimer += deltaTime;

      // collision detection
      enemies.forEach((enemy) => {
        const dx = enemy.x + enemy.width / 2 - (this.x + this.width / 2);
        const dy = enemy.y + enemy.height / 2 - (this.y + this.height / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < this.width / 2 + enemy.width / 2) gameOver = true;
      });
    }
    draw(context) {
      context.strokeStyle = "white";
      context.beginPath();
      context.arc(
        this.x + this.width / 2,
        this.y + this.height / 2,
        this.width / 2,
        0,
        Math.PI * 2
      );
      context.stroke();
      // context.fillRect(this.x, this.y, this.width, this.height)
      context.drawImage(
        this.image,
        this.frameX * this.width,
        this.frameY * this.height,
        this.width,
        this.height,
        this.x,
        this.y,
        this.width,
        this.height
      );
    }
    onGround() {
      return this.y >= this.gameHeight - this.height;
    }
  }

  class Background {
    constructor(gameWidth, gameHeight) {
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.image = backgroundImage;
      this.x = 0;
      this.y = 0;
      this.width = 2400;
      this.height = 720;
      this.speed = 8;
    }
    update() {
      this.x -= this.speed;
      if (this.x < 0 - this.width) this.x = 0;
    }
    draw(context) {
      context.drawImage(this.image, this.x, this.y, this.width, this.height);
      context.drawImage(
        this.image,
        this.x + this.width,
        this.y,
        this.width,
        this.height
      );
    }
  }

  let enemies = [];
  let score = 0;

  class Enemy {
    constructor(gameWidth, gameHeight) {
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.width = 160;
      this.height = 119;
      this.image = enemyImage;
      this.x = this.gameWidth;
      this.y = this.gameHeight - this.height;
      this.frame = 0;
      this.speed = 8;
      this.maxFrame = 5;
      this.fps = 20;
      this.frameTimer = 0;
      this.frameInterval = 1000 / this.fps;
      this.markForDeletion = false;
    }
    draw(context) {
      context.strokeStyle = "white";
      // context.strokeRect(this.x, this.y, this.width, this.height)
      context.beginPath();
      context.arc(
        this.x + this.width / 2,
        this.y + this.height / 2,
        this.width / 2,
        0,
        Math.PI * 2
      );
      context.stroke();
      context.drawImage(
        this.image,
        this.frame * this.width,
        0,
        this.width,
        this.height,
        this.x,
        this.y,
        this.width,
        this.height
      );
    }
    update(deltaTime) {
      if (this.frameTimer > this.frameInterval) {
        if (this.frame >= this.maxFrame) this.frame = 0;
        else this.frame++;
        this.frameTimer = 0;
      } else this.frameTimer += deltaTime;
      this.x -= this.speed;
      if (this.x < 0 - this.width) {
        this.markForDeletion = true;
        score++;
      }
    }
  }

  function handleEnemies(deltaTime) {
    if (enemyTimer > enemyInterval + randomEnemyInterval) {
      enemies.push(new Enemy(CANVAS_WIDTH, CANVAS_HEIGHT));
      let randomEnemyInterval = Math.random() * 1000 + 500;
      enemyTimer = 0;
    } else enemyTimer += deltaTime;
    enemies.forEach((obj) => {
      obj.draw(context);
      obj.update(deltaTime);
    });
    enemies = enemies.filter((obj) => !obj.markForDeletion);
  }

  function displayStatusText(context) {
    context.fillStyle = "black";
    context.font = "40px Bangers";
    context.fillText("Score: " + score, 25, 55);
    context.fillStyle = "white";
    context.fillText("Score: " + score, 20, 50);
  }

  const input = new InputHandler();
  const player = new Player(CANVAS_WIDTH, CANVAS_HEIGHT);
  const background = new Background(CANVAS_WIDTH, CANVAS_HEIGHT);

  let lastTime = 0;
  let enemyTimer = 0;
  let enemyInterval = 1000;
  let randomEnemyInterval = Math.random() * 1000 + 500;

  function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    background.draw(context);
    background.update()
    player.update(input, deltaTime, enemies);
    player.draw(context);
    handleEnemies(deltaTime);
    displayStatusText(context);
    if (!gameOver) requestAnimationFrame(animate);
  }

  animate(0);
});
