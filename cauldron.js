import GameObject from "./GameObject.js";

class Cauldron extends GameObject {
  constructor(context, x, y, width, height, CONFIG) {
    super(context, x, y, width, height, CONFIG);
  }

  // loads the cauldron-picture
  init() {
    this.image = new Image();
    this.image.src = "./pictures/Cauldron.png";
  }

  render() {
    this.context.translate(this.x, this.y);
    this.context.drawImage(
      this.image,
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );
    this.context.resetTransform();
  }
  // adjusted bounding box for the cauldron
  getBoundingBox() {
    return {
      x: this.x - this.width / 2 + 40,
      y: this.y - this.height / 2 + 100,
      w: this.width - 80,
      h: this.height - 100,
    };
  }
}

export default Cauldron;
