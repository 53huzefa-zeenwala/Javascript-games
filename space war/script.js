const canvas = document.querySelector("canvas");

const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function shakeCanvas(duration, magnitude) {
  let start = Date.now();
  let end = start + duration;
  function shake() {
    let randomX = Math.random() * magnitude - magnitude / 2;
    let randomY = Math.random() * magnitude - magnitude / 2;
    canvas.style.transform = `translate(${randomX}px, ${randomY}px)`;

    let current = Date.now();

    if (current < end) {
      requestAnimationFrame(shake);
    } else {
      canvas.style.transform = "none";
    }
  }
  shake();
}

class Player {
  constructor(game) {
    this.game = game;
    this.image = document.getElementById("player");
    this.scale = 0.15;
    this.width = 450 * this.scale;
    this.height = 225 * this.scale;
    this.x = this.game.width / 2 - this.width / 2;
    this.y = this.game.height - this.height - 20;
    this.speedX = 0;
    this.rotation = 0;
  }
  draw() {
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    ctx.rotate(this.rotation);
    ctx.translate(-this.x - this.width / 2, -this.y - this.height / 2);
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    ctx.restore();
  }
  update() {
    if (
      this.game.keys.indexOf("ArrowRight") > -1 &&
      this.x < this.game.width - this.width
    ) {
      this.speedX = 5;
      this.rotation = 0.15;
    } else if (this.game.keys.indexOf("ArrowLeft") > -1 && this.x > 0) {
      this.speedX = -5;
      this.rotation = -0.15;
    } else {
      this.speedX = 0;
      this.rotation = 0;
    }
    this.x += this.speedX;
  }
}

class Projectile {
  constructor(x, y, color, height = 15, speed = 8) {
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = 5;
    this.color = color;
    this.speedY = speed;
    this.markForDeletion = false;
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x - this.width / 2, this.y, this.width, this.height);
  }
  update() {
    this.y -= this.speedY;
  }
}

class Particles {
  constructor(x, y, radius, color, speedX, speedY, fades = true) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.speedX = speedX;
    this.speedY = speedY;
    this.color = color;
    this.opacity = 1;
    this.fades = fades;
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.fades) this.opacity -= (Math.random() * 0.25) / 10;
  }
}

class AstroidParticle extends Particles {
  constructor(x, y, speedX, speedY) {
    super(x, y, Math.random() * 50 + 50, "", speedX, speedY, false);
    this.image = document.getElementById("fire");
    this.angle = 0;
    this.va = Math.random() * 0.2 + 0.1;
  }
  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.drawImage(
      this.image,
      -this.radius * 0.5,
      -this.radius * 0.5,
      this.radius,
      this.radius
    );
    ctx.restore();
  }
  update() {
    this.x -= this.speedX;
    this.y -= this.speedY;
    this.radius *= 0.95;
    this.angle += this.va;
    this.x += Math.sin(this.angle * 10);
  }
}

class Astroid {
  constructor(playerX, playerY, y) {
    this.y = y;
    this.x = -10;
    this.image = document.getElementById("asteroid");
    this.travelTime = Math.random() * 100 + 100;
    this.speedX = playerX / this.travelTime;
    this.speedY = playerY / this.travelTime;
    this.width = 50;
    this.height = 50;
    this.astroidParticles = [];
    this.angle = 0;
    this.va = Math.random() * 0.05 + 0.01;
  }
  draw() {
    this.astroidParticles.map((asteroid) => {
      asteroid.draw();
    });
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.drawImage(
      this.image,
      -this.width * 0.5,
      -this.width * 0.5,
      this.width,
      this.height
    );
    ctx.restore();
  }
  update() {
    this.astroidParticles.unshift(
      new AstroidParticle(this.x + 10, this.y, this.speedX, this.speedY)
    );
    this.y += this.speedY;
    this.x += this.speedX;
    this.angle += this.va;
    this.astroidParticles.map((asteroid, p) => {
      asteroid.update();
      if (asteroid.radius < 0.5) this.astroidParticles.splice(p, 1);
    });
  }
}

class Invader {
  constructor(x, y) {
    this.width = 35;
    this.height = 40;
    this.image = document.getElementById("invader");
    this.heightModifier = 10;
    this.x = x * this.width;
    this.y = y * this.height + this.heightModifier;
  }
  draw() {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
  update(speedX, speedY) {
    this.x += speedX;
    this.y += speedY;
  }
}

class InvadersGrid {
  constructor() {
    this.x = 0;
    this.invaders = [];
    this.numberOfInvaderVert = Math.round(Math.random() * 5 + 5);
    this.numberOfInvaderHor = Math.round(Math.random() * 2 + 2);
    this.speedX = Math.floor(Math.random() * 4 + 2);
    this.speedY = 0;
    this.createInvaderGrid();
    this.width = this.invaders[0].width * this.numberOfInvaderVert;
  }
  createInvaderGrid() {
    for (let x = 0; x < this.numberOfInvaderVert; x++) {
      for (let y = 0; y < this.numberOfInvaderHor; y++) {
        this.invaders.push(new Invader(x, y));
      }
    }
  }
  draw() {
    this.invaders.map((invader) => {
      invader.draw();
    });
  }
  update() {
    if (this.x + this.width > canvas.width || this.x < 0) {
      this.speedX = -this.speedX;
      this.speedY = 20;
    } else {
      this.speedY = 0;
    }
    this.x += this.speedX;
    this.invaders.map((invader) => {
      invader.update(this.speedX, this.speedY);
    });
  }
}

class Game {
  constructor() {
    this.pauseGame = false;
    this.gameOver = false;
    this.totalLife = 3;
    this.remainLife = this.totalLife;
    this.score = 0;
    this.gameSpeed = 0;
    this.updatedSpeed = 0;
    this.frame = 0;
    this.width = canvas.width;
    this.height = canvas.height;
    this.asteroids = [];
    this.grids = [];
    this.keys = [];
    this.projectiles = [];
    this.particles = [];
    this.player = new Player(this);
    this.invaderGridSpawnInterval = 1500 * (1 - this.gameSpeed);
    this.asteroidSpawnInterval = 2500;
    this.invaderProjectiles = [];
    this.invaderProjectileInterval = 100;
    this.sound = new Audio();
    this.sound.src = "sound/explosion.wav";
    this.createBackgroundParticles();
    window.addEventListener("keydown", (e) => {
      if (
        (e.key === "ArrowLeft" || e.key === "ArrowRight") &&
        this.keys.indexOf(e.key) === -1
      )
        this.keys.push(e.key);
      if (e.key === " " && this.keys.indexOf(" ") === -1 && !this.gameOver) {
        this.keys = [];
        this.keys.push(e.key);
        this.projectiles.push(
          new Projectile(
            this.player.x + this.player.width / 2,
            this.player.y,
            "#ff4d1d"
          )
        );
      }
      if (e.key === "p") this.pauseGame = !this.pauseGame;
    });
    window.addEventListener("keyup", (e) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === " ")
        this.keys.splice(this.keys.indexOf(e.key), 1);
    });
  }
  draw() {
    this.particles.map((particle) => {
      particle.draw();
    });
    this.grids.map((grid) => {
      grid.draw();
    });
    this.projectiles.map((projectile) => {
      projectile.draw();
    });
    if (!this.gameOver) this.player.draw();
    this.invaderProjectiles.map((projectile) => {
      projectile.draw();
    });
    this.asteroids.map((asteroid) => {
      asteroid.draw();
    });
  }

  displayHeart() {
    if (this.remainLife === 0) {
      this.gameOver = true;
      return;
    }
    for (let i = 0; i < this.remainLife; i++) {
      let size = 50;
      ctx.drawImage(
        document.getElementById("heart"),
        this.width - size * (this.totalLife - i),
        10,
        size,
        size
      );
    }
  }

  displayScore() {
    ctx.fillStyle = "white";
    ctx.font = "48px Bangers";
    ctx.fillText(this.score, this.width - 150, 100);
  }

  displayGameOverMessage() {
    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "white";
    ctx.font = "64px Bangers";
    ctx.fillText("Game Over", this.width / 2, this.height / 2);
    ctx.fillText(
      "Your Final Score is " + this.score,
      this.width / 2,
      this.height / 2 + 60
    );
    ctx.restore();
  }

  createAsteroids() {
    for (let i = 0; i < 3; i++) {
      this.asteroids.push(
        new Astroid(
          this.player.x + 150,
          this.player.y,
          (Math.random() * 30 + 40) * i
        )
      );
    }
  }

  createParticle(object, color, speed, numberOfParticles = 15) {
    for (let i = 0; i < numberOfParticles; i++) {
      this.particles.push(
        new Particles(
          object.x + object.width / 2,
          object.y + object.height / 2,
          Math.random() * 4,
          color,
          (Math.random() - 0.5) * speed,
          (Math.random() - 0.5) * speed
        )
      );
    }
  }

  createBackgroundParticles() {
    for (let i = 0; i < 100; i++) {
      this.particles.push(
        new Particles(
          Math.random() * this.width,
          Math.random() * this.height,
          Math.random() * 2,
          "white",
          0,
          0.75,
          false
        )
      );
    }
  }

  checkForCollision() {
    const changeAfterCollision = () => {
      this.createParticle(this.player, "white", 10, 20);
      this.createParticle(this.player, "#ff4d1d", 10, 20);
      this.createParticle(this.player, "#2d0091", 10, 20);
      if ("vibrate" in navigator) {
        // Vibrate the device for 1000 milliseconds (1 second)
        navigator.vibrate(10000);
      }
      this.sound.play();
      shakeCanvas(1000, 10);
      this.remainLife--;
    };
    // invader to player projectile collision
    this.grids.map((grid, g) => {
      grid.invaders.map((invader, j) => {
        this.projectiles.map((projectile, i) => {
          if (
            invader.x + invader.width > projectile.x &&
            invader.x < projectile.x + projectile.width / 2 &&
            invader.y + invader.height - 2 > projectile.y &&
            invader.y < projectile.y
          ) {
            // Rectangles overlap
            grid.invaders.splice(j, 1);
            this.score++;
            if (this.score % 50 === 0) {
              this.gameSpeed += 0.5;
            }
            this.createParticle(invader, "#BAABDE", 2);
            this.projectiles.splice(i, 1);
          }
        });
      });
      if (grid.invaders.length === 0) {
        this.grids.splice(g, 1);
      }
    });
    // player to invader projectile collision
    this.invaderProjectiles.map((projectile, p) => {
      if (
        projectile.y + projectile.height > this.player.y &&
        projectile.x + projectile.width > this.player.x &&
        projectile.x < this.player.x + this.player.width &&
        projectile.y < this.player.y + this.player.height
      ) {
        this.invaderProjectiles.splice(p, 1);
        changeAfterCollision();
      }
    });
    this.asteroids.map((asteroid, a) => {
      if (
        asteroid.y + asteroid.height > this.player.y &&
        asteroid.x + asteroid.width > this.player.x &&
        asteroid.x < this.player.x + this.player.width &&
        asteroid.y < this.player.y + this.player.height
      ) {
        console.log("hit", this.player, asteroid);
        this.asteroids.splice(a, 1);
        changeAfterCollision();
        this.createParticle(this.player, "#f97742", 20, 50);
        this.createParticle(this.player, "#e6e4da", 20, 50);
      }
    });
  }

  update() {
    this.frame++;
    if (!this.gameOver) this.checkForCollision();
    if (
      (this.frame % this.invaderGridSpawnInterval === 0 ||
        this.grids.length === 0) &&
      !this.gameOver
    ) {
      this.grids.push(new InvadersGrid());
    }
    if (this.frame % 100 === 0 && !this.gameOver) {
      this.grids.map((grid) => {
        let randomInvader =
          grid.invaders[Math.floor(Math.random() * grid.invaders.length)];
        this.invaderProjectiles.push(
          new Projectile(
            randomInvader.x,
            randomInvader.y + 40,
            "#ffffff",
            20,
            -5
          )
        );
      });
    }
    if (this.frame % this.asteroidSpawnInterval === 0) this.createAsteroids();
    if (!this.gameOver) this.player.update();
    this.projectiles.map((projectile, i) => {
      if (projectile.y < -projectile.height) this.projectiles.splice(i, 1);
      if (this.gameSpeed !== this.updatedSpeed)
        projectile.speedY += this.gameSpeed;
      projectile.update();
    });
    this.grids.map((grid) => {
      grid.update();
    });
    this.invaderProjectiles.map((projectile, i) => {

      if (this.gameSpeed !== this.updatedSpeed)
        projectile.speedY -= this.gameSpeed;
      projectile.update();
      if (projectile.y > canvas.height) this.invaderProjectiles.splice(i, 1);
    });
    this.particles.map((particle, i) => {
      if (particle.opacity <= 0) {
        this.particles.splice(i, 1);
      }
      if (particle.y > this.height && !particle.fades) {
        particle.x = Math.random() * this.width;
        particle.y = -particle.radius;
      }

      if (!particle.fades && this.gameSpeed !== this.updatedSpeed) {
        particle.speedY += this.gameSpeed;
      }
      particle.update();
    });
    this.draw();
    this.displayHeart();
    if (this.gameOver) this.displayGameOverMessage();
    else this.displayScore();

    this.asteroids.map((asteroid, a) => {
      asteroid.update();
      if (asteroid.y > this.height * 2) {
        this.asteroids.splice(a, 1);
      }
    });

    this.updatedSpeed = this.gameSpeed;
  }
}

const game = new Game();

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  game.update();
  if (!game.pauseGame) requestAnimationFrame(animate);
}

animate();
