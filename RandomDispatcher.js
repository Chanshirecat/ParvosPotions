// all of this lets my ingredients spawn
class RandomDispatcher {
  constructor(callback, options = { min: 30000, max: 40000 }) {
    if (typeof callback !== "function")
      throw Error("Callback must be a function.");

    this.callback = callback;
    this.options = options;

    // kick off first iteration
    this.loop();
  }

  loop() {
    let wait = randomNumberBetween(this.options.min, this.options.max);

    window.setTimeout(() => {
      // run the callback
      this.callback();
      // call next loop
      this.loop();
    }, wait);
  }
}

let randomNumberBetween = (minRandomNumber, maxRandomNumber) => {
  return Math.floor(
    Math.random() * (maxRandomNumber - minRandomNumber + 1) + minRandomNumber
  );
};

export default RandomDispatcher;

export { randomNumberBetween };
