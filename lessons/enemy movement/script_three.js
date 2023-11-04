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
    this.image.src = "images/enemy3.png"
    this.speed =  Math.random() * 4 + 1
    this.spriteWidth = 218
    this.spriteHeight = 177
    this.width = this.spriteWidth / 2.5;
    this.height = this.spriteHeight / 2.5;
    this.x = Math.random() * (CANVAS_WIDTH - this.width);
    this.y = Math.random() * (CANVAS_HEIGHT - this.height);
    this.frame = 4
    this.flapSpeed = Math.floor(Math.random() * 3 + 1)
    // this.angle = Math.random() * 2
    this.angle = Math.random() * 500
    this.angleSpeed = Math.random() * 0.75 + 0.5
    this.curve = Math.random() * 200 + 50
  }
  update() {
    this.x = (CANVAS_WIDTH/ 2 - this.curve) * Math.sin(this.angle * Math.PI/360) + (CANVAS_WIDTH / 2 - this.width/2);
    this.y = (CANVAS_HEIGHT/ 2 - this.curve) * Math.cos(this.angle * Math.PI/180) + (CANVAS_HEIGHT / 2 - this.height/2);
    // this.y += this.curve * Math.sin(this.angle);
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
