window.addEventListener("load", () => {
  const canvas = document.getElementById("canvas1");

  const context = canvas.getContext("2d");

  const CANVAS_WIDTH = (canvas.width = 500);
  const CANVAS_HEIGHT = (canvas.height = 800);

  class Game {
    constructor(context, width, height) {
      this.context = context;
      this.width = width;
      this.height = height;
      this.enemies = [];
      this.enemyInterval = 1000;
      this.enemyTimer = 0;
      this.enemyTypes = ["worm", "ghost", "spider"];
      this.#addNewEnemy();
    }
    update(deltaTime) {
      this.enemies = this.enemies.filter((obj) => !obj.markForDeletion);
      if (this.enemyTimer > this.enemyInterval) {
        this.#addNewEnemy();
        this.enemyTimer = 0;
      } else this.enemyTimer += deltaTime;
      this.enemies.forEach((obj) => {
        obj.update(deltaTime);
      });
      this.draw();
    }
    draw() {
      this.enemies.forEach((obj) => {
        obj.draw(this.context);
      });
    }
    #addNewEnemy() {
      const randomEnemy =
        this.enemyTypes[Math.floor(Math.random() * this.enemyTypes.length)];
      if (randomEnemy === "worm") this.enemies.push(new Worm(this));
      else if (randomEnemy === "ghost") this.enemies.push(new Ghost(this));
      else if (randomEnemy === "spider") this.enemies.push(new Spider(this));
      this.enemies.sort(function (a, b) {
        return a.y - b.y;
      });
      console.log(this.enemies)
    }
  }

  class Enemy {
    constructor(game) {
      this.game = game;
      this.markForDeletion = false;
      this.frameX = 0
      this.maxFrame = 5
      this.frameInterval = 100
      this.frameTimer = 0
    }
    update(deltaTime) {
      this.x -= this.vx * deltaTime;
      
      if (this.x < 0 - this.width) this.markForDeletion = true;
      if (this.frameTimer > this.frameInterval) {
        if (this.frameX < this.maxFrame) this.frameX++
        else this.frameX = 0
        this.frameTimer = 0
      } else this.frameTimer += deltaTime
    }
    draw(context) {
      // context.fillRect(this.x, this.y, this.width, this.height)
      context.drawImage(
        this.image,
        this.frameX * this.spriteWidth,
        0,
        this.spriteWidth,
        this.spriteHeight,
        this.x,
        this.y,
        this.width,
        this.height
      );
    }
  }

  class Worm extends Enemy {
    constructor(game) {
      super(game);
      this.image = worm;
      this.spriteWidth = 229;
      this.spriteHeight = 171;
      this.width = this.spriteWidth * 0.5;
      this.height = this.spriteHeight * 0.5;
      this.x = this.game.width;
      this.y = this.game.height - this.height;
      this.vx = Math.random() * 0.1 + 0.05;
    }
  }

  class Ghost extends Enemy {
    constructor(game) {
      super(game);
      this.image = ghost;
      this.spriteWidth = 261;
      this.spriteHeight = 209;
      this.width = this.spriteWidth * 0.5;
      this.height = this.spriteHeight * 0.5;
      this.x = this.game.width;
      this.y = Math.random() * (this.game.height * 0.6);
      this.vx = Math.random() * 0.3 + 0.1;
      this.angle = 0
      this.curve = Math.random() * 3
    }
    update(deltaTime) {
      super.update(deltaTime)
      this.y += Math.sin(this.angle) * this.curve
      this.angle += 0.04
    }
    draw(context) {
      context.save();
      context.globalAlpha = 0.6;
      super.draw(context);
      context.restore();
    }
  }

  class Spider extends Enemy {
    constructor(game) {
      super(game);
      this.image = spider;
      this.spriteWidth = 310;
      this.spriteHeight = 175;
      this.width = this.spriteWidth * 0.5;
      this.height = this.spriteHeight * 0.5;
      this.x = Math.random() * (this.game.width - this.width);
      this.y = 0 - this.height;
      this.vx = 0;
      this.vy =  Math.random() * 0.1 + 0.1
      this.maxLength = Math.random() * (this.game.height * 0.85)
    }

    update(deltaTime) {
      super.update(deltaTime)
      if (this.y < 0 - (this.height + 10)) this.markForDeletion = true;
      this.y += this.vy * deltaTime
      if (this.y > this.maxLength) this.vy *= -1
    }
    draw(context) {
      context.beginPath()
      context.moveTo(this.x + this.width * 0.5, 0)
      context.lineTo(this.x + this.width * 0.5, this.y + 10)
      context.stroke()
      super.draw(context)

    }
  }

  const game = new Game(context, CANVAS_WIDTH, CANVAS_HEIGHT);

  let lastTime = 1;
  function animate(timestamp) {
    context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    game.update(deltaTime);
    requestAnimationFrame(animate);
  }

  animate(0); 
});
