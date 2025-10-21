import GameObject from "./GameObject.js";

const gravity = 0.1;

class Ingredient extends GameObject {
  constructor(context, x, y, width, height, CONFIG, collect) {
    super(context, x, y, width, height, CONFIG);
    this.age = 0;
    this.creationTime = performance.now();
    this.maxAge = 7;
    this.z = 600;
    this.dz = 0;
  }

  init() {
    this.image = new Image();
    this.image.src = "./pictures/lavender.png";
    this.shadowImage = new Image();
    this.shadowImage.src = "./pictures/Shadow.png";

    // object with the different ingredients
    this.collect = {
      Lavandula: {
        src: "./pictures/lavender.png",
        image: null,
        frameSize: {
          width: 300,
          height: 300,
        },
      },
      "Amanita muscaria": {
        src: "./pictures/Mushroom.png",
        image: null,
        frameSize: {
          width: 200,
          height: 300,
        },
      },
      Sunstone: {
        src: "./pictures/Crystal.png",
        image: null,
        frameSize: {
          width: 270,
          height: 370,
        },
      },
      Mandrake: {
        src: "./pictures/Mandrake.png",
        image: null,
        frameSize: {
          width: 500,
          height: 550,
        },
      },
      "Phoenix dawn": {
        src: "./pictures/phoenix-feather.png",
        image: null,
        frameSize: {
          width: 400,
          height: 400,
        },
      },
      "Beauté mortelle": {
        src: "./pictures/poison.png",
        image: null,
        frameSize: {
          width: 222,
          height: 379,
        },
      },
      Sage: {
        src: "./pictures/sage.png",
        image: null,
        frameSize: {
          width: 200,
          height: 200,
        },
      },
      "Egg of a serpent": {
        src: "./pictures/serpent.png",
        image: null,
        frameSize: {
          width: 329,
          height: 430,
        },
      },
      "Horn of a unicorn": {
        src: "./pictures/unicorn-horn.jpg",
        image: null,
        frameSize: {
          width: 350,
          height: 350,
        },
      },
    };

    //randomly takes one of the possible items
    let collectArray = Object.values(this.collect);
    let randomIndex = Math.floor(Math.random() * collectArray.length);

    this.width = collectArray[randomIndex].frameSize.width / 5;
    this.height = collectArray[randomIndex].frameSize.height / 5;

    this.image = new Image();
    this.image.src = collectArray[randomIndex].src;
    this.type = Object.keys(this.collect)[randomIndex];
  }

  update(timePassedSinceLastRender) {
    // controls how 'old' the object is and removes it if it's older than maxAge
    this.age += timePassedSinceLastRender / 1000;
    if (this.age >= this.maxAge && typeof this.removeCallback === "function") {
      this.removeCallback();
    }
    // changes the z-position of the object - this is my physics-implementation, where the items drop down
    this.dz += timePassedSinceLastRender * gravity;
    this.z = Math.max(0, this.z - (timePassedSinceLastRender / 1000) * this.dz);
  }
  render() {
    super.render();
    this.context.save();
    this.context.translate(this.x, this.y);
    // draws the shadow on the spot where the item will drop
    this.context.drawImage(
      this.shadowImage,
      -this.width / 2 - 20,
      -20,
      this.width + 40,
      371 / 5
    );

    //changes the y-render-position depending on the z-position
    this.context.translate(0, -this.z);
    this.context.drawImage(
      this.image,
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );

    this.context.restore();
    this.context.resetTransform();
  }

  onRemove(removeCallback) {
    this.removeCallback = removeCallback;
  }
}

export default Ingredient;
