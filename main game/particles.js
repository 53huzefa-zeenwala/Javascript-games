class Particles {
    constructor(game) {
        this.game = game
        this.markForDeletion = false
    }
     update(){
        this.x -= this.speedX + this.game.speed
        this.y -= this.speedY
        this.size *=  0.95
        if (this.size < 0.5) this.markForDeletion  = true
     }
} 

export class Dust extends Particles {
    constructor(game, x, y) {
        super(game)
        this.size = Math.random() * 10 + 10
        this.x = x
        this.y = y
        this.speedX = Math.random()
        this.speedY = Math.random()
        this.color = 'black'
    }
    draw(ctx) {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()
    }
}
export class Splash extends Particles {
    constructor(game, x, y) {
        super(game)
        this.size = Math.random() * 100 + 100
        this.x = x - this.size * 0.4
        this.y = y - this.size * 0.5
        this.speedX  = Math.random() * 10 - 8
        this.speedY  = Math.random() * 4 + 1
        this.gravity = 0
        this.image = fire
    } 
    update() {
        super.update()
        this.gravity += 0.1
        this.y += this.gravity
    }
    draw(ctx) {
        ctx.drawImage(this.image,this.x,this.y, this.size, this.size)
    }
}
export class Fire extends Particles {
    constructor(game, x, y) {
        super(game)
        this.image = fire
        this.size = Math.random() * 50 + 50
        this.x  = x
        this.y = y
        this.speedX  = 1
        this.speedY = 1
        this.angle = 0
        this.va = Math.random() * 0.2 + 0.1
    }
    update() {
        super.update()
        this.angle += this.va
        this.x += Math.sin(this.angle * 10)
    }
    draw(ctx) {
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.angle)
        ctx.drawImage(this.image, -this.size *  0.5, -this.size *  0.5, this.size, this.size)
        ctx.restore()
    }
}