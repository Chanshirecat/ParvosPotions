import GameObject from "./GameObject.js";
import { parvus } from "./game.js";

class Scroll extends GameObject {
  constructor(context, x, y, width, height, CONFIG) {
    super(context, x, y, width, height, CONFIG);
    this.context = context;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.recipe = [];
    this.generateRecipe();
    this.init();
  }

  init() {
    this.image = new Image();
    this.image.src = "./pictures/scroll.png";
  }

  // generates a random recipe with 7 ingredients
  generateRecipe() {
    const ingredientNames = [
      "Lavandula",
      "Mandrake",
      "Sage",
      "Horn of a unicorn",
      "Egg of a serpent",
      "Sunstone",
      "Amanita muscaria",
      "Phoenix dawn",
      "Beauté mortelle",
    ];
    let numberOfIngredients = 7;

    for (let i = 0; i < numberOfIngredients; i++) {
      this.recipe.push(
        ingredientNames[Math.floor(Math.random() * ingredientNames.length)]
      );
    }
  }
  //draws the recipe
  render() {
    super.render();
    this.context.save();
    let translateX = this.x;
    //when Parvus is right, the scroll appears left, when Parvus is left, the scroll appears right
    if (parvus.x + parvus.width >= this.x - 20) {
      translateX = 10;
    }

    this.context.translate(translateX, this.y);
    this.context.drawImage(this.image, 0, 0, this.width, this.height);
    this.context.restore();
    this.context.font = "24px DawningOfTheNewDay";
    let recipeHeader = "Nana's Novel Nitrate";
    // center the header
    this.context.fillText(
      recipeHeader,
      translateX +
        this.width / 2 -
        this.context.measureText(recipeHeader).width / 2,
      this.y + 76
    );
    let counter = 0;
    this.context.font = "23px DawningOfTheNewDay";
    this.recipe.forEach((ingredient) => {
      this.context.fillText(
        ingredient,
        translateX + this.width / 2 - 80,
        104 + counter * 26
      );
      counter++;
    });
  }
}

export default Scroll;
