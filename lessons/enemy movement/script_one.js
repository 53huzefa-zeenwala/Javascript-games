// @type (HTMLCanvasElement)

const canvas = document.getElementById("canvas1");

const context = canvas.getContext("2d");

const CANVAS_WIDTH = (canvas.width = 500);
const CANVAS_HEIGHT = (canvas.height = 1000);

let enemyArray = []
const numberOfEnemy = 10

let gameFrame = 0

class Enemy {
  constructor() {
    this.image = new Image()
    this.image.src = "images/enemy1.png"
    this.speed =  Math.random() * 4 - 2
    this.spriteWidth = 293
    this.spriteHeight = 155
    this.width = this.spriteWidth / 2.5;
    this.height = this.spriteHeight / 2.5;
    this.x = Math.random() * (CANVAS_WIDTH - this.width);
    this.y = Math.random() * (CANVAS_HEIGHT - this.height);
    this.frame = 4
    this.flapSpeed = Math.floor(Math.random() * 3 + 1)
  }
  update() {
    this.x += Math.random() * 5 - 2.5;
    this.y += Math.random() * 5 - 2.5;

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
