export default class InputHandler {
    constructor() {
        this.lastKey = ""
        window.addEventListener('keydown', e => {
            switch (e.key) {
                case 'ArrowLeft':
                    this.lastKey = 'Press Left'
                    break;
                case 'ArrowRight':
                    this.lastKey = 'Press Right'
                    break;
                case 'ArrowUp':
                    this.lastKey = 'Press Up'
                    break;
                case 'ArrowDown':
                    this.lastKey = 'Press Down'
                    break;
            
                default:
                    break;
            }
        })
        window.addEventListener('keyup', e => {
            switch (e.key) {
                case 'ArrowLeft':
                    this.lastKey = 'Release Left'
                    break;
                case 'ArrowRight':
                    this.lastKey = 'Release Right'
                    break;
                case 'ArrowUp':
                    this.lastKey = 'Release Up'
                    break;
                case 'ArrowDown':
                    this.lastKey = 'Release Down'
                    break;
            
                default:
                    break;
            }
        })
    }
} 