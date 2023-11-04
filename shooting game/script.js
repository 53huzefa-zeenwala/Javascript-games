const canvas = document.getElementById("canvas1");
const context = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const collisionCanvas = document.getElementById("collision_canvas");
const collisionContext = collisionCanvas.getContext("2d");

collisionCanvas.width = window.innerWidth;
collisionCanvas.height = window.innerHeight;

context.font = "50px Bangers";

let timeToNextRaven = 0;
let ravenInterval = 500;
let lastTime = 0;

let ravens = [];

let score = 0;

class Ravens {
  constructor() {
    this.image = new Image();
    this.image.src = "images/raven.png";
    this.frame = 0;
    this.spriteWidth = 271;
    this.spriteHeight = 194;
    this.sizeModifier = Math.random() * 0.5 + 0.3;
    this.width = this.spriteWidth * this.sizeModifier;
    this.height = this.spriteHeight * this.sizeModifier;
    this.x = canvas.width;
    this.y = Math.random() * (canvas.height - this.height);
    this.directionX = Math.random() * 5 + 3;
    this.directionY = Math.random() * 5 - 2.5;
    this.markForDeletion = false;
    this.timeSinceFlap = 0;
    this.flapInterval = Math.random() * 130 + 80;
    this.randomColors = [
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
    ];
    this.color =
      "rgb(" +
      this.randomColors[0] +
      "," +
      this.randomColors[1] +
      "," +
      this.randomColors[2] +
      ")";
  }
  update(deltaTime) {
    this.x -= this.directionX;
    this.y += this.directionY;
    if (this.y < 0 || this.y > canvas.height - this.height) {
      this.directionY = this.directionY * -1;
    }

    if (this.x < 0 - this.width) this.markForDeletion = true;

    this.timeSinceFlap += deltaTime;

    if (this.timeSinceFlap > this.flapInterval) {
      if (this.frame > 4) this.frame = 0;
      else this.frame++;
      this.timeSinceFlap = 0;
    }
    this.draw();
  }
  draw() {
    collisionContext.fillStyle = this.color;
    collisionContext.fillRect(this.x, this.y, this.width, this.height);
    context.drawImage(
      this.image,
      this.frame * this.spriteWidth,
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

let explosions = [];

class Explosion {
  constructor(x, y, size) {
    this.spriteWidth = 200;
    this.spriteHeight = 179;
    this.size = size;
    this.x = x;
    this.y = y;
    this.image = new Image();
    this.image.src = "images/boom.png";
    this.frame = 0;
    this.angle = Math.random() * 6.2;
    this.sound = new Audio();
    this.sound.src = "sound/Ice attack 2.wav";
    this.timeSinceFrame = 0;
    this.frameInterval = 200;
  }
  update(deltaTime) {
    this.frame === 0 && this.sound.play();
    this.timeSinceFrame += deltaTime;

    if (this.timeSinceFrame > this.frameInterval) {
      this.frame++;
      this.timeSinceFrame = 0;
    }
    this.draw();
  }
  draw() {
    context.save();
    // context.translate(this.x, this.y);
    // context.rotate(this.angle);
    context.drawImage(
      this.image,
      this.frame * this.spriteWidth,
      0,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y,
      this.size,
      this.size
    );
    context.restore();
  }
}

window.addEventListener("click", (e) => {
  // createAnimation(e)
  const pc = collisionContext.getImageData(e.x, e.y, 1, 1).data;
  ravens.forEach((obj) => {
    if (
      obj.randomColors[0] === pc[0] &&
      obj.randomColors[1] === pc[1] &&
      obj.randomColors[2] === pc[2]
    ) {
      obj.markForDeletion = true;
      explosions.push(new Explosion(obj.x, obj.y, obj.width));
      score++;
    }
  });
});

function drawScore() {
  context.fillStyle = "black";
  context.fillText("Score " + score, 50, 75);
  context.fillStyle = "white";
  context.fillText("Score " + score, 55, 80);
}

function animate(timestamp) {
  context.clearRect(0, 0, canvas.width, canvas.height);
  collisionContext.clearRect(0, 0, canvas.width, canvas.height);
  let deltaTime = timestamp - lastTime;
  lastTime = timestamp;
  timeToNextRaven += deltaTime;
  if (timeToNextRaven > ravenInterval) {
    ravens.push(new Ravens());
    timeToNextRaven = 0;
    ravens.sort(function (a, b) {
      return a.width - b.width;
    });
  }
  drawScore();
  [...ravens, ...explosions].forEach((object) => object.update(deltaTime));
  ravens = ravens.filter((object) => !object.markForDeletion);
  explosions = explosions.filter((object) => object.frame !== 5);
  requestAnimationFrame(animate);
}

animate(0);
