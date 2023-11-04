// @type (HTMLCanvasElement)

const canvas = document.getElementById("canvas1");

const context = canvas.getContext("2d");

const CANVAS_WIDTH = (canvas.width = 500);
const CANVAS_HEIGHT = (canvas.height = 1000);

let enemyArray = []
const numberOfEnemy = 50

let gameFrame = 0

class Enemy {
  constructor() {
    this.image = new Image()
    this.image.src = "images/enemy2.png"
    this.speed =  Math.random() * 4 + 1
    this.spriteWidth = 266
    this.spriteHeight = 188
    this.width = this.spriteWidth / 2.5;
    this.height = this.spriteHeight / 2.5;
    this.x = Math.random() * (CANVAS_WIDTH - this.width);
    this.y = Math.random() * (CANVAS_HEIGHT - this.height);
    this.frame = 4
    this.flapSpeed = Math.floor(Math.random() * 3 + 1)
    // this.angle = Math.random() * 2
    this.angle = 0
    this.angleSpeed = Math.random() * 0.2
    this.curve = Math.random() * 7
  }
  update() {
    this.x -= this.speed;
    this.y += this.curve * Math.sin(this.angle);
    this.angle += this.angleSpeed
    if (this.x + this.width < 0) this.x = CANVAS_WIDTH
    if (gameFrame % this.flapSpeed === 0 ) this.frame > 4 ? this.frame = 0 : this.frame++
    this.draw()
  }
  draw() {
    context.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height )
  }
}

for (let i = 0; i < numberOfEnemy; i++) {
  enemyArray.push(new Enemy())
}

function animate() {
  context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  enemyArray.forEach(enemy => enemy.update())

  gameFrame++
  requestAnimationFrame(animate);
}

animate();
