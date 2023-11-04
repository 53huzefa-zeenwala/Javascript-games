import InputHandler from "./input.js";
import Player from "./player.js";
import {drawStatusText} from './utils.js'
window.addEventListener('load', () => {
  const loadingComp = loading
  loadingComp.style.display =  'none'
  const canvas = document.getElementById("canvas1");
  const context = canvas.getContext("2d");
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  const player = new Player(canvas.width, canvas.height)
  
  
  const input = new InputHandler() 
  let lastTime = 0
  function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime
    lastTime = timeStamp
    context.clearRect(0, 0, canvas.width, canvas.height);
    player.draw(context, deltaTime)
    player.update(input.lastKey)
    drawStatusText(context, input, player)
    requestAnimationFrame(animate);
  }
  
  animate(0);
})

