import Player from "./player.js";
import Ingredient from "./Ingredient.js";
import RandomDispatcher from "./RandomDispatcher.js";
import { randomNumberBetween } from "./RandomDispatcher.js";
import Cauldron from "./cauldron.js";
import Scroll from "./scroll.js";

// variables
let lastTickTimestamp = 0;
export let parvus;
let gameObjects = [];
let context;
let CONFIG = { width: 1100, height: 600 };
let collectible = [];
export let cauldron;
export let pocket = [];
let fullPocket = [];
export let scroll;
export let gameRuns = { status: true };
export let gameOverScreen = document.querySelector("#game-over");
export let winScreen = document.querySelector("#win");

export let backgroundMusic = new Audio("./World Of Illusion.mp3");
export let winSound = new Audio("./Lively Meadow Victory Fanfare.mp3");
export let looseSound = new Audio("./You lose.mp3");
backgroundMusic.loop = true;
let inventoryImage;

// Initialize the game

const init = async function () {
  let canvas = document.getElementById("canvas");
  context = canvas.getContext("2d");

  //Font of the recipe
  const dawningOfTheNewDay = new FontFace(
    "DawningOfTheNewDay",
    "url(./DawningofaNewDay-Regular.ttf)"
  );
  await dawningOfTheNewDay.load();
  document.fonts.add(dawningOfTheNewDay);

  // set width/height attributes on the canvas
  canvas.setAttribute("width", CONFIG.width);
  canvas.setAttribute("height", CONFIG.height);

  // loads the inventory-picture
  inventoryImage = new Image();
  inventoryImage.src = "./pictures/inventory.png";

  // instanciates the player
  parvus = new Player(context, 0, 300, 400, 100, CONFIG);
  gameObjects.push(parvus);

  // instanciates the cauldron
  cauldron = new Cauldron(
    context,
    CONFIG.width / 2,
    CONFIG.height / 2,
    120,
    180,
    CONFIG
  );
  gameObjects.push(cauldron);
  parvus.cauldron = cauldron;

  // instanciates the scroll
  scroll = new Scroll(context, CONFIG.width - 300, 0, 300, 350, CONFIG);

  // spawns the ingredients randomly every 1-6 seconds
  let randomDispatcher = new RandomDispatcher(
    function () {
      let spawn = true;
      let ingredient;

      while (spawn) {
        let randomX = randomNumberBetween(60, CONFIG.width - 60);
        let randomY = randomNumberBetween(170, CONFIG.height - 60);

        ingredient = new Ingredient(context, randomX, randomY, 50, 50, CONFIG);

        spawn = checkCollisionBetween(ingredient, parvus);
      }

      ingredient.onRemove(() => {
        // remove ingredient from arrays
        removeCollectible(ingredient);
      });

      // add to arrays
      gameObjects.push(ingredient);
      collectible.push(ingredient);
    },
    { min: 1000, max: 6000 }
  );

  // starts the background music
  backgroundMusic.play();

  // kick off first iteration of render()
  lastTickTimestamp = performance.now();
  requestAnimationFrame(gameLoop);
};

const gameLoop = () => {
  // calculates the time that has passed since the last render
  let timePassedSinceLastRender = performance.now() - lastTickTimestamp;
  if (gameRuns.status) {
    update(timePassedSinceLastRender);
    render();

    lastTickTimestamp = performance.now();

    // call next iteration
    requestAnimationFrame(gameLoop);
  }
};

const update = (timePassedSinceLastRender) => {
  gameObjects.forEach(function (gameObject) {
    gameObject.update(timePassedSinceLastRender);
  });

  // collect all colliding gameobjects
  let removeItems = [];
  if (pocket.length < 9) {
    collectible.forEach((ingredient) => {
      if (checkCollisionBetween(parvus, ingredient) && ingredient.z === 0) {
        removeItems.push(ingredient);
        pocket.push(ingredient.type);
        fullPocket.push(ingredient);
        console.log(pocket);
      }
    });
  }

  // remove colliding collectibles
  removeItems.forEach((ingredient) => {
    collectible.splice(collectible.indexOf(ingredient), 1);
    gameObjects.splice(gameObjects.indexOf(ingredient), 1);
  });
};

// draws the inventory if 'i' is pressed
function renderInventory() {
  if (parvus.currentKeys["KeyI"]) {
    context.drawImage(
      inventoryImage,
      CONFIG.width / 2 - inventoryImage.width / 2,
      -25
    );
    for (let i = 0; i < fullPocket.length; i++) {
      let col = i % 3;
      let row = Math.floor(i / 3);
      context.drawImage(
        fullPocket[i].image,
        CONFIG.width / 2 - inventoryImage.width / 2 + 110 + col * 160,
        90 + row * 160,
        fullPocket[i].width,
        fullPocket[i].height
      );
    }
  }
}
// calls all render functions
const render = () => {
  // clear the stage
  context.clearRect(0, 0, CONFIG.width, CONFIG.height);

  // sort orders my object from smallest y-position to the biggest y-position, that's how I achieved the 3d effect around the cauldron.
  let orderedGameObjects = gameObjects.sort((a, b) => {
    return a.getBoundingBox().y - b.getBoundingBox().y;
  });

  orderedGameObjects.forEach((gameObject) => {
    gameObject.render();
  });
  scroll.render();
  renderInventory();
};

// remove a collectible
const removeCollectible = (c) => {
  collectible.splice(collectible.indexOf(c), 1);
  gameObjects.splice(gameObjects.indexOf(c), 1);
};

// Wait for the windows 'load' event before initializing.
window.addEventListener("load", () => {
  let startBox = document.querySelector("#start");
  startBox.style.display = "block";
  let startButton = document.querySelector("#start-btn");
  startButton.addEventListener("click", () => {
    init();
    startBox.style.display = "none";
  });
});

export let checkCollisionBetween = (gameObjectA, gameObjectB) => {
  let bbA = gameObjectA.getBoundingBox();
  let bbB = gameObjectB.getBoundingBox();

  if (
    bbA.x < bbB.x + bbB.w &&
    bbA.x + bbA.w > bbB.x &&
    bbA.y < bbB.y + bbB.h &&
    bbA.y + bbA.h > bbB.y
  ) {
    // collision happened
    return true;
  } else return false;
};
