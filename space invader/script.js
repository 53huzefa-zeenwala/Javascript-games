class Laser {
  constructor(game) {
    this.game = game;
    this.x = 0;
    this.y = 0;
    this.height =this.game.height - 50
  }
  render(context) {
    this.x =
      this.game.player.x + this.game.player.width * 0.5 - this.width * 0.5;

    this.game.player.energy -= this.damage;

    context.save();
    context.fillStyle = "gold";
    context.fillRect(this.x, this.y, this.width, this.height);
    context.fillStyle = "white";
    context.fillRect(
      this.x + this.width * 0.2,
      this.y,
      this.width * 0.6,
      this.height
    );
    context.restore();

    if (this.game.spriteUpdate) {
      this.game.waves.forEach((wave) => {
        wave.enemies.forEach((enemy) => {
          if (this.game.checkCollision(enemy, this)) {
            enemy.hit(this.damage);
          }
        });
      });
      this.game.bossArray.forEach((boss) => {
        if (this.game.checkCollision(boss, this) && boss.y >= 0) {
          boss.hit(this.damage);
        }
      });
    }
  }
}

class SmallLaser extends Laser {
  constructor(game) {
    super(game);
    this.width = 5;
    this.damage = 0.3;
  }
  render(context) {
    super.render(context);
  }
}

class BigLaser extends Laser {
  constructor(game) {
    super(game);
    this.width = 15;
    this.damage = 0.7;
  }
  render(context) {
    super.render(context);
  }
}

class Player {
  constructor(game) {
    this.game = game;
    this.width = 140;
    this.height = 120;
    this.x = this.game.width * 0.5 - this.width * 0.5;
    this.y = this.game.height - this.height;
    this.speed = 5;
    this.live = 3;
    this.image = document.getElementById("player");
    this.jets_image = document.getElementById("player_jets");
    this.frameX = 0;
    this.jetFrame = 1;
    this.rotation = 0;
    this.maxLives = 10;
    this.smallLaser = new SmallLaser(this.game);
    this.bigLaser = new BigLaser(this.game);
    this.energy = 10;
    this.maxEnergy = 100;
    this.cooldown = false;
  }
  draw(context) {
    // context.fillRect(this.x, this.y, this.width, this.height);
    if (this.game.keys.indexOf("1") > -1) {
      this.frameX = 1;
    } else if (this.game.keys.indexOf("2") > -1 && (this.game.player.energy > 1 && !this.game.player.cooldown)) {
      this.frameX = 2;
      this.smallLaser.render(context);
  } else if (this.game.keys.indexOf("3") > -1 && (this.game.player.energy > 1 && !this.game.player.cooldown)) {
      this.frameX = 3;
      this.bigLaser.render(context);
    } else {
      this.frameX = 0;
    }
    context.drawImage(
      this.jets_image,
      this.jetFrame * this.width,
      0,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
    context.save();
    context.translate(this.x + this.width / 2, this.y + this.height / 2);
    context.rotate(this.rotation);
    context.translate(-this.x - this.width / 2, -this.y - this.height / 2);
    context.drawImage(
      this.image,
      this.frameX * this.width,
      0,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
    context.restore();
  }
  update() {
    if (this.game.spriteUpdate && this.energy < this.maxEnergy) {
      this.energy += 0.5;
    }
    if (this.energy < 1) this.cooldown = true;
    else if (this.energy > this.maxEnergy * 0.2) this.cooldown = false;
    
    if (this.game.keys.indexOf("ArrowLeft") > -1) {
      this.x -= this.speed;
      this.jetFrame = 0;
      this.rotation = -this.game.rotateAngle;
    } else if (this.game.keys.indexOf("ArrowRight") > -1) {
      this.x += this.speed;
      this.jetFrame = 2;
    } else {
      this.rotation = this.game.rotateAngle;
      this.jetFrame = 1;
      this.rotation = 0;
    }

    if (this.x < -this.width * 0.5) this.x = 0;

    if (this.x > this.game.width - this.width * 0.5)
      this.x = this.game.width - this.width;
  }
  shoot() {
    const projectile = this.game.getProjectile();

    if (projectile)
      projectile.start(this.x + this.width * 0.5, this.y, this.rotation);
  }
  restart() {
    this.x = this.game.width * 0.5 - this.width * 0.5;
    this.y = this.game.height - this.height;
    this.live = 3;
  }
}

class Projectile {
  constructor() {
    this.width = 3;
    this.height = 30;
    this.x = 0;
    this.y = 0;
    this.speed = 10;
    this.free = true;
    this.rotation = 0;
  }
  draw(context) {
    if (!this.free) {
      context.save();
      context.fillStyle = "gold";
      context.fillRect(this.x, this.y, this.width, this.height);
      context.restore();
    }
  }
  update() {
    if (!this.free) {
      this.y -= this.speed;
      if (this.y < -this.height) this.reset();
    }
  }
  start(x, y, angle) {
    this.free = false;
    this.x = x - this.width * 0.5;
    this.y = y;
    this.rotation = angle;
  }
  reset() {
    this.free = true;
  }
}

class Enemy {
  constructor(game, positionX, positionY) {
    this.game = game;
    this.width = this.game.enemySize;
    this.height = this.game.enemySize;
    this.x = 0;
    this.y = 0;
    this.positionX = positionX;
    this.positionY = positionY;
    this.markedForDeletion = false;
  }
  draw(context) {
    // context.strokeRect(this.x, this.y, this.width, this.height);
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
  update(x, y) {
    this.x = x + this.positionX;
    this.y = y + this.positionY;

    this.game.projectilePool.forEach((projectile) => {
      if (
        !projectile.free &&
        this.game.checkCollision(this, projectile) &&
        this.lives > 0
      ) {
        this.hit(1);
        projectile.reset();
      }
    });
    if (this.lives < 1) {
      if (this.game.spriteUpdate) this.frameX++;
      if (this.frameX > this.maxFrame) {
        this.markedForDeletion = true;
        if (!this.game.gameOver) this.game.score += this.maxLives;
      }
    }

    if (this.game.checkCollision(this, this.game.player) && this.lives > 0) {
      this.lives = 0;
      this.game.player.live--;
      if (this.game.player.live < 1) this.game.gameOver = true;
    }

    if (this.y + this.height > this.game.height) {
      this.game.gameOver = true;
      this.markedForDeletion = true;
    }
  }
  hit(damage) {
    this.lives -= damage;
  }
}
class BeetleMorph extends Enemy {
  constructor(game, positionX, positionY) {
    super(game, positionX, positionY);
    this.image = document.getElementById("beetlemorph");
    this.frameX = 0;
    this.maxFrame = 2;
    this.frameY = Math.floor(Math.random() * 4);
    this.lives = 1;
    this.maxLives = this.lives;
  }
}

class RhinoMorph extends Enemy {
  constructor(game, positionX, positionY) {
    super(game, positionX, positionY);
    this.image = document.getElementById("rhinomorph");
    this.frameX = 0;
    this.maxFrame = 5;
    this.frameY = Math.floor(Math.random() * 4);
    this.lives = 4;
    this.maxLives = this.lives;
  }
  hit(damage) {
    this.lives -= damage;
    this.frameX = this.maxLives - Math.floor(this.lives);
  }
}

class Boss {
  constructor(game, lives) {
    this.game = game;
    this.width = 200;
    this.height = 200;
    this.x = this.game.width * 0.5 - this.width * 0.5;
    this.y = -this.height;
    this.speedX = Math.random() < 0.5 ? -1 : 1;
    this.speedY = 0;
    this.lives = lives;
    this.maxLives = this.lives;
    this.markedForDeletion = false;
    this.image = document.getElementById("boss");
    this.frameX = 0;
    this.frameY = Math.floor(Math.random() * 4);
    this.maxFrame = 11;
  }
  draw(context) {
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
    if (this.lives > 1) {
      context.save();
      context.textAlign = "center";
      context.shadowOffsetX = 3;
      context.shadowOffsetY = 3;
      context.shadowColor = "black";
      context.fillText(
        Math.floor(this.lives),
        this.x + this.width * 0.5,
        this.y + 100
      );
      context.restore();
    }
  }
  update() {
    this.speedY = 0;
    if (this.game.spriteUpdate && this.lives > 1) this.frameX = 0;
    if (this.y < 0) this.y += 4;
    if (
      this.x < 0 ||
      (this.x > this.game.width - this.width && this.lives > 1)
    ) {
      this.speedX *= -1;
      this.speedY = this.height * 0.5;
    }
    this.x += this.speedX;
    this.y += this.speedY;

    this.game.projectilePool.forEach((projectile) => {
      if (
        !projectile.free &&
        this.game.checkCollision(this, projectile) &&
        this.lives > 1 &&
        this.y >= 0
      ) {
        this.hit(1);
        projectile.reset();
      }
    });

    if (this.game.checkCollision(this, this.game.player) && this.lives > 1) {
      this.lives = 0;
      this.game.gameOver = true;
    }

    if (this.lives < 1 && this.game.spriteUpdate) {
      this.frameX++;
      if (this.frameX > this.maxFrame) {
        this.markedForDeletion = true;
        this.game.score += this.maxLives;
        this.game.bossLives += 5;
        if (!this.game.gameOver) this.game.newWave();
      }
    }

    if (this.y + this.height > this.game.height) this.game.gameOver = true;
  }
  hit(damage) {
    this.lives -= damage;
    if (this.lives > 1) this.frameX = 1;
  }
}

class Wave {
  constructor(game) {
    this.game = game;
    this.width = this.game.columns * this.game.enemySize;
    this.height = this.game.rows * this.game.enemySize;
    this.x = this.game.width * 0.5 - this.width * 0.5;
    this.y = -this.height;
    this.speedX = Math.random() < 0.5 ? -1 : 1;
    this.speedY = 0;
    this.enemies = [];
    this.nextWaveTrigger = false;
    this.markedForDeletion = false;
    this.create();
  }
  render(context) {
    if (this.y < 0) this.y += 5;
    this.speedY = 0;
    this.x += this.speedX;

    if (this.x < 0 || this.x > this.game.width - this.width) {
      this.speedX *= -1;
      this.speedY = this.game.enemySize;
    }
    this.y += this.speedY;
    this.enemies.forEach((enemy) => {
      enemy.draw(context);
      enemy.update(this.x, this.y);
    });
    this.enemies = this.enemies.filter((enemy) => !enemy.markedForDeletion);
    if (this.enemies.length <= 0) this.markedForDeletion = true;
  }
  create() {
    for (let y = 0; y < this.game.rows; y++) {
      for (let x = 0; x < this.game.columns; x++) {
        let enemyX = x * this.game.enemySize;
        let enemyY = y * this.game.enemySize;
        if (Math.random() < 0.3) {
          this.enemies.push(new RhinoMorph(this.game, enemyX, enemyY));
        } else {
          this.enemies.push(new BeetleMorph(this.game, enemyX, enemyY));
        }
      }
    }
  }
}

class Particles {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.opacity = 1;
  }
  draw(context) {
    context.save();
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    context.fillStyle = this.color;
    context.fill();
    context.closePath();
    context.restore();
  }
  update(particleSpeed) {
    this.y += particleSpeed;
  }
}

class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.height = this.canvas.height;
    this.width = this.canvas.width;
    this.gameOver = false;
    this.rotateAngle = 0.15;
    this.player = new Player(this);
    this.keys = [];
    this.projectilePool = [];
    this.numberOfProjectile = 5;
    this.fired = false;
    this.createProjectile();
    this.columns = 2;
    this.rows = 2;
    this.enemySize = 80;
    this.score = 0;
    this.waveCount = 1;

    this.spriteUpdate = false;
    this.spriteTimer = 0;
    this.spriteInterval = 80;
    this.particles = [];
    this.particleSpeed = 2;
    this.waves = [];
    this.bossLives = 10;
    this.bossArray = [];
    this.restart();
    // this.waves.push(new Wave(this));
    this.createBackgroundParticles();
    window.addEventListener("keydown", (e) => {
      if (this.keys.indexOf(e.key) === -1) this.keys.push(e.key);
      if (e.key === "1" && !this.fired) this.player.shoot();
      this.fired = true;
      if (e.key === "r") this.restart();
    });
    window.addEventListener("keyup", (e) => {
      this.fired = false;
      const index = this.keys.indexOf(e.key);
      if (index > -1) this.keys.splice(index, 1);
    });
  }
  render(context, deltaTime) {
    if (this.spriteTimer > this.spriteInterval) {
      this.spriteUpdate = true;
      this.spriteTimer = 0;
    } else {
      this.spriteUpdate = false;
      this.spriteTimer += deltaTime;
    }
    this.particles.map((particle, i) => {
      if (particle.y > this.height) {
        particle.x = Math.random() * this.width;
        particle.y = -particle.radius;
      }
      particle.update(this.particleSpeed);
      particle.draw(context);
    });
    this.drawStatusText(context);
    this.projectilePool.forEach((projectile) => {
      projectile.update();
      projectile.draw(context);
    });
    this.bossArray.forEach((boss) => {
      boss.draw(context);
      boss.update();
    });
    this.bossArray = this.bossArray.filter(
      (object) => !object.markedForDeletion
    );
    this.player.draw(context);
    this.player.update();

    this.waves.forEach((wave) => {
      wave.render(context, deltaTime);
      if (wave.enemies.length < 1 && !wave.nextWaveTrigger && !this.gameOver) {
        this.newWave();
        this.particleSpeed += 0.5;
        wave.nextWaveTrigger = true;
      }
    });
  }
  createProjectile() {
    for (let i = 0; i < this.numberOfProjectile; i++) {
      this.projectilePool.push(new Projectile());
    }
  }
  getProjectile() {
    for (let i = 0; i < this.numberOfProjectile; i++) {
      if (this.projectilePool[i].free) return this.projectilePool[i];
    }
  }
  // collision detection between rectangle
  checkCollision(a, b) {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }
  drawStatusText(context) {
    context.save();
    context.fillText("Score: " + this.score, 20, 40);
    context.fillText("Wave: " + this.waveCount, 20, 80);
    for (let i = 0; i < this.player.live; i++) {
      context.fillText("❤", 30 * (i + 1), 120);
    }
    for (let j = 0; j < this.player.maxEnergy; j++) {
      context.fillRect(20 + 2 * j, 135, 2, 15);
    }
    for (let j = 0; j < this.player.energy; j++) {
      context.save();
      context.fillStyle = this.player.cooldown ? "red" : "gold";
      context.fillRect(20 + 2 * j, 135, 2, 15);
      context.restore();
    }
    if (this.gameOver) {
      context.textAlign = "center";
      context.font = "100px impact";
      context.fillText("Game Over", this.width * 0.5, this.height * 0.5);
      context.font = "20px impact";
      context.fillText(
        "Press R to restart.",
        this.width * 0.5,
        this.height * 0.5 + 40
      );
    }
    context.restore();
  }
  newWave() {
    this.waveCount++;
    if (this.player.maxLives > this.player.live) this.player.live++;
    if (this.waveCount % 3 === 0) {
      this.bossArray.push(new Boss(this, this.bossLives));
    } else {
      if (
        Math.random() < 0.5 &&
        this.columns * this.enemySize < this.width * 0.8
      )
        this.columns++;
      else if (this.rows * this.enemySize < this.width * 0.6) this.rows++;
      this.waves.push(new Wave(this));
    }

    this.waves = this.waves.filter((object) => !object.markedForDeletion);
  }
  restart() {
    this.player.restart();
    this.columns = 2;
    this.rows = 2;
    this.score = 0;
    this.waveCount = 1;
    this.waves = [];
    this.bossArray = [];
    this.waves.push(new Wave(this));
    this.bossLives = 10;
    this.gameOver = false;
    this.particleSpeed = 2;
  }
  createBackgroundParticles() {
    for (let i = 0; i < 100; i++) {
      this.particles.push(
        new Particles(
          Math.random() * this.width,
          Math.random() * this.height,
          Math.random() * 2,
          "white"
        )
      );
    }
  }
}

window.addEventListener("load", () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;

  ctx.fillStyle = "white";
  ctx.font = "30px impact";

  const game = new Game(canvas);
  let lastTime = 0;

  function animate(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    game.render(ctx, deltaTime);
    requestAnimationFrame(animate);
  }
  animate(0);
});
