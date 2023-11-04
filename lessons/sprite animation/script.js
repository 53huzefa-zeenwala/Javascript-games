const canvas = document.getElementById("canvas1");

const context = canvas.getContext("2d");

const CANVAS_WIDTH = (canvas.width = 600);
const CANVAS_HEIGHT = (canvas.height = 600);

const playerImage = new Image();

playerImage.src = "images/shadow_dog.png";

const spriteWidth = 575;
const spriteHeight = 523;

let gameFrame = 0;
let playerState = "idle";
window.addEventListener("keypress", (e) => {
  switch (e.key) {
    case "i":
      playerState = "idle";
      break;
    case "j":
      playerState = "jump";
      break;
    case "f":
      playerState = "fall";
      break;
    case "r":
      playerState = "run";
      break;
    case "d":
      playerState = "dizzy";
      break;
    case "s":
      playerState = "sit";
      break;
    case "o":
      playerState = "roll";
      break;
    case "b":
      playerState = "bite";
      break;
    case "k":
      playerState = "ko";
      break;
    case "h":
      playerState = "getHit";
      break;
    default:
      playerState = "idle";
      break;
  }
});

const staggerFrames = 10;
const spriteAnimation = [];

const animationStates = [
  {
    name: "idle",
    frames: 7,
  },
  {
    name: "jump",
    frames: 7,
  },
  {
    name: "fall",
    frames: 7,
  },
  {
    name: "run",
    frames: 9,
  },
  {
    name: "dizzy",
    frames: 11,
  },
  {
    name: "sit",
    frames: 5,
  },
  {
    name: "roll",
    frames: 7,
  },
  {
    name: "bite",
    frames: 7,
  },
  {
    name: "ko",
    frames: 12,
  },
  {
    name: "getHit",
    frames: 4,
  },
];

animationStates.forEach((state, i) => {
  let frames = {
    loc: [],
  };
  for (let j = 0; j < state.frames; j++) {
    let positionX = j * spriteWidth;
    let positionY = i * spriteHeight;
    frames.loc.push({ x: positionX, y: positionY });
  }
  spriteAnimation[state.name] = frames;
});

function animate() {
  context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  let position =
    Math.floor(gameFrame / staggerFrames) %
    spriteAnimation[playerState].loc.length;
  let frameX = spriteWidth * position;
  let frameY = spriteAnimation[playerState].loc[position].y;
  context.drawImage(
    playerImage,
    frameX,
    frameY,
    spriteWidth,
    spriteHeight,
    0,
    0,
    spriteWidth,
    spriteHeight
  );

  gameFrame++;
  requestAnimationFrame(animate);
}

animate();
