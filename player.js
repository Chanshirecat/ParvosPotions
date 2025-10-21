import GameObject from "./GameObject.js";
import { checkCollisionBetween, cauldron, pocket, scroll, gameOverScreen, gameRuns, winScreen, backgroundMusic, looseSound, winSound} from "./game.js";

class Player extends GameObject {
  constructor(context, x, y, width, height, CONFIG) {
    super(context, x, y, width, height, CONFIG);
    this.context = context;
    this.x = x;
    this.y = y;
    this.dx = 20;
    this.dy = 30;
    this.lastDirectionX = 1;
    this.width = 120;
    this.height = 200;
    this.currentKeys = {};
    this.velocity = 0.25;
    this.init();
  }

  //bounding box of Parvus
  getBoundingBox() {
    let bb = {
      x: this.x - this.width/2 +20,
      y: this.y + 35,
      w: this.width -40,
      h: this.height -140,
    }
    return bb;
  }

  // loads picture and sprites of Parvus
  init() {
    this.image = new Image();
    this.image.src = "./pictures/Parvus-thick.png";

    this.sprites = {
      run: {
        src: "./pictures/Parvus-Sprite.png",
        frames: 5,
        fps: 4,
        image: null,
        frameSize: {
          width: 391,
          height: 458,
        },
      },
    };

    Object.values(this.sprites).forEach((sprite) => {
      sprite.image = new Image();
      sprite.image.src = sprite.src;
    });

    // navigation
    document.addEventListener("keydown", (event) => {
      event.preventDefault();
      this.currentKeys[event.code] = true;
    });

    document.addEventListener("keyup", (event) => {
      this.currentKeys[event.code] = false;
    });

    this.state = "run";
  }

  //checks if the recipe is true or false - if true you win, if false you loose
  checkRecipe(){
    if(!(pocket.length === 0)) {
      let orderedPocket = pocket.sort();
      let orderedRecipe = scroll.recipe.sort();
      backgroundMusic.pause();
      if(JSON.stringify(orderedRecipe) === JSON.stringify(orderedPocket)) {
        console.log("WIN");
        winSound.play();
        gameRuns.status = false;
        winScreen.style.display = "block";
      } else {
        console.log("BOOM");
        looseSound.play();
        gameRuns.status = false;
        gameOverScreen.style.display = "block";
      }
    }
  }

  update(timePassedSinceLastRender) {
    let oldx = this.x;
    let oldy = this.y;

    //left and right movement
    if (this.currentKeys["ArrowRight"]) {
      this.dx = 1;
    } else if (this.currentKeys["ArrowLeft"]) {
      this.dx = -1;
    } else {
      this.dx = 0;
    }

    // check recipe if 'Space' is pressed and near enough to cauldron
    if(this.currentKeys["Space"]) {
      let bb = this.getBoundingBox();
      if(Math.abs(cauldron.x - (bb.x + bb.w/2)) < 100 && Math.abs(cauldron.y+cauldron.height/2 - (bb.y + bb.h)) < 100) {
        this.checkRecipe();
      }

    }
    // up and down movement
    if (this.currentKeys["ArrowDown"]) this.dy = 1;
    else if (this.currentKeys["ArrowUp"]) this.dy = -1;
    else this.dy = 0;

    if (this.dx !== 0) this.lastDirectionX = this.dx;

    if (this.dy != 0 && this.dx != 0) {
      this.dx /= Math.hypot(this.dx, this.dy);
      this.dy /= Math.hypot(this.dx, this.dy);
    }
    this.x += timePassedSinceLastRender * this.dx * this.velocity;
    this.y += timePassedSinceLastRender * this.dy * this.velocity;


    let bb = this.getBoundingBox();
    // check for right boundary
    if (bb.x + bb.w > this.CONFIG.width-10)
      this.x = this.CONFIG.width - bb.w/2-10;
    // check for left boundary
    if (bb.x < 10) this.x = 10 + bb.w /2;
    // check for bottom boundary
    if (bb.y + bb.h > this.CONFIG.height - 10)
      this.y = this.CONFIG.height - this.height/2 + 2 - 10;
    // check for top boundary
    if (this.getBoundingBox().y - this.getBoundingBox().h / 2 < 130) this.y = oldy;

    // stops Parvus when trying to run into Cauldron
    if (checkCollisionBetween(this, this.cauldron)) {
      this.x = oldx;
      this.y = oldy;
    }
  }

  render() {
    this.context.save();
    this.context.translate(this.x, this.y);

    // flipping the character
    this.context.scale(this.lastDirectionX, 1);
    let coords = this.getImageSpriteCoordinates(this.sprites[this.state]);
    this.context.drawImage(
      this.sprites[this.state].image,
      coords.sourceX,
      coords.sourceY,
      coords.sourceWidth,
      coords.sourceHeight,
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );
    this.context.restore();
    this.context.resetTransform();
  }
  // selects frame depending on time passed since gamestart
  getImageSpriteCoordinates(sprite) {
    let frameX = Math.floor(
      ((performance.now() / 1000) * sprite.fps) % sprite.frames
    );

    let coords = {
      sourceX: frameX * sprite.frameSize.width,
      sourceY: 0,
      sourceWidth: sprite.frameSize.width,
      sourceHeight: sprite.frameSize.height,
    };

    return coords;
  }
}

export default Player;
