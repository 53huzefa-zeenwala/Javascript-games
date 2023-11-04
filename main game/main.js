import { UI } from "./UI.js";
import { Background } from "./background.js";
import { ClimbingEnemy, FlyingEnemy, GroundEnemy } from "./enemies.js";
import { InputHandler } from "./input.js";
import { Player } from "./player.js";

window.addEventListener("load", () => {
  const canvas = document.getElementById("canvas1");

  /**  @type {CanvasRenderingContext2D} */
  const ctx = canvas.getContext("2d");

  canvas.width = 500;
  canvas.height = 500;

  class Game {
    constructor(width, height) {
      this.score = 0;
      this.time = 0;
      this.maxTime = 30000;
      this.gameOver = false;
      this.width = width;
      this.height = height;
      this.groundMargin = 80;
      this.speed = 0;
      this.maxSpeed = 3;
      this.enemies = [];
      this.collisions = [];
      this.particles = [];
      this.maxParticles = 50;
      this.enemyInterval = 1000;
      this.enemyTimer = 0;
      this.fontColor = "black";
      this.debug = false;
      this.addNewEnemy();
      this.background = new Background(this);
      this.player = new Player(this);
      this.input = new InputHandler(this);
      this.UI = new UI(this);
      this.player.currentState = this.player.states[0];
      this.player.currentState.enter();
    }
    update(deltaTime) {
      this.time += deltaTime;

      if (this.time >= this.maxTime) this.gameOver = true;

      this.player.checkCollision();

      this.background.update();
      this.player.update(this.input.keys, deltaTime);

      // this.enemies = this.enemies.filter((obj) => !obj.markForDeletion);

      if (this.enemyTimer > this.enemyInterval) {
        this.addNewEnemy();
        this.enemyTimer = 0;
      } else this.enemyTimer += deltaTime;

      this.enemies.forEach((enemy, i) => {
        enemy.update(deltaTime);
        if (enemy.markForDeletion) this.enemies.splice(i, 1);
      });

      this.particles.forEach((particle, i) => {
        particle.update();
        if (particle.markForDeletion) this.particles.splice(i, 1);
      });

      if (this.particles.length > this.maxParticles) {
        this.particles.length = this.maxParticles;
      }

      this.collisions.forEach((collision, i) => {
        collision.update(deltaTime);
        if (collision.markForDeletion) this.collisions.splice(i, 1);
      });
    }
    draw(ctx) {
      this.background.draw(ctx);

      this.player.draw(ctx);

      this.enemies.forEach((obj) => {
        obj.draw(ctx);
      });

      this.UI.draw(ctx);

      this.particles.forEach((particle) => {
        particle.draw(ctx);
      });

      this.collisions.forEach((collision) => {
        collision.draw(ctx);
      });
    }
    addNewEnemy() {
      this.enemies.push(new FlyingEnemy(this));

      if (this.speed > 0 && Math.random() < 0.5) {
        this.enemies.push(new GroundEnemy(this));
      } else if (this.speed > 0) this.enemies.push(new ClimbingEnemy(this));

      this.enemies.sort(function (a, b) {
        return a.y - b.y;
      });

      console.log(this.enemies);
    }
  }

  const game = new Game(canvas.width, canvas.height);
  let lastTime = 0;
  function animate(timeStamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    game.update(deltaTime);
    game.draw(ctx);
    if (!game.gameOver) requestAnimationFrame(animate);
  }
  animate(0);
});
