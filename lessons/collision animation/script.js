const canvas = document.getElementById("canvas1");

const context = canvas.getContext("2d");

const CANVAS_WIDTH = (canvas.width = 500);
const CANVAS_HEIGHT = (canvas.height = 700);

const explosions = []
let canvasPosition = canvas.getBoundingClientRect()

class Explosion {
    constructor (x, y) {
        this.spriteWidth = 200;
        this.spriteHeight = 179
        this.width = this.spriteWidth * 0.7
        this.height = this.spriteHeight * 0.7
        this.x = x
        this.y = y
        this.image = new Image()
        this.image.src = "images/boom.png"
        this.frame = 0
        this.timer = 0
        this.angle = Math.random() * 6.2
        this.sound = new Audio()
        this.sound.src = 'sound/Ice attack 2.wav'
    }
    update() {
        this.frame === 0 && this.sound.play()
        this.timer++
        this.timer % 10 === 0 && this.frame++
        this.draw()
    }
    draw() {
        context.save()
        context.translate(this.x, this.y)
        context.rotate(this.angle)
        context.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, 0 - this.width * 0.5, 0 - this.height * 0.5, this.width, this.height)
        context.restore()
    }
}

window.addEventListener("click", (e)=> {
    createAnimation(e)
})

function createAnimation(e) {
    let positionX = e.x - canvasPosition.left
    let positionY = e.y - canvasPosition.top
    explosions.push(new Explosion(positionX, positionY)) 
}

function animate() {
    context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    for (let i = 0; i < explosions.length; i++) {
        explosions[i].update()
        explosions[i].frame > 5 && explosions.splice(i, 1)        
    }
    requestAnimationFrame(animate)
}

animate()