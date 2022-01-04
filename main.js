/**
 * @description Simon says class
 * @param {DOM object} scoreboard - The DOM element to write the game score to
 */
class SimonGame {
  constructor(scoreboard = false) {
    // board settings
    this.active = false,
    this.sequence = [];
    this.playerMove = 0;
    this.playerLives = 2;
    this.round = 0;
    // optional extra in case you want to display score on browser.
    this.scoreboard = scoreboard;
    // prep the game board
    this.boardBtns = document.querySelectorAll('.websi-board-btns');
    this.boardBtnsClass = this.boardBtns[0].className;
    // Add listeners
    this.boardBtns.forEach(btn => {
      btn.addEventListener('click', this.checkPlayerMove.bind(this));
    });

  }
  /**
   * @description Generates random number between 0 and 4
   */
  colorSequence() {
    // add random number to sequence.
    this.sequence.push(Math.floor(Math.random() * 4));
  }
  /**
   * @description Loops through the array 'sequence' awaiting for promises to resolve
   */
  async playSequence() {
    const len = this.sequence.length;
    for (let i=0; i < len; i++) {
      // wait for each light to turn on and off
      await this.lightUp(i);
    }
  }
  /**
   * @description Update the class name on buttons to create blinking effect
   * @returns {Promise} it resolves after a settimeout
   */
  lightUp(index) {
    return new Promise(resolve => {
      // delay initial lit to create blink effect when same colour appears consecutively
      setTimeout(() => {
        this.boardBtns[this.sequence[index]].className += ' active';
      }, 200);
      setTimeout(() => {
        this.boardBtns[this.sequence[index]].className = this.boardBtnsClass;
        // resolve promise on light off
        resolve(true);
      }, 400);
    });
  }
  /**
   * @description Checks every time a player presses a colour
   */
  checkPlayerMove(elem) {
    // map color name to integer value
    const color = elem.srcElement.dataset.websiBtn;
    const move = (color === 'red')
                  ? 0
                  : color === 'green'
                    ? 1
                    : color === 'blue'
                      ? 2 : 3;
    // check player move against generated sequence
    if (this.sequence[this.playerMove] !== move) {
      this.playerLives--;
      // player gets 1 more go if they mess up
      if (this.playerLives > 0) {
        console.log(`Like spidy says: everybody gets one.`);
        // player repeating so go back one move
        this.playerMove = 0;
        this.playSequence();
      }else{
        // TODO: CLEAR THE GAME DATA AND REVEAL LOOSE MODAL
        this.resetGame();
      }
    }else{
      // increment player move on every click
      this.playerMove++;
      // start new round if player guessed all moves
      if (this.playerMove === this.sequence.length) {
        this.playRound();
      }
    }
  }
  /**
   * @description Updates the score on the DOM element
   */
  updateScore() {
    this.scoreboard.textContent = this.round;
  }
  /**
   * @description Clear all the game data ready for fresh start
   */
  resetGame(userRequest = false) {
    this.playerMove = 0;
    this.playerLives = 2;
    this.sequence = [];
    this.round = 0;
    this.active = false;
    this.scoreboard.textContent = 0;
  }
  /**
   * @description Does a game round
   */
  playRound() {
    this.round++;
    // reset the player move on every round start
    this.playerMove = 0;
    // update scoreboard if its available
    if (this.scoreboard !== false) this.updateScore();
    // add number to sequence
    this.colorSequence();
    // show sequence to player
    this.playSequence();
  }
}

/**
 * @description Uses SimonGame class to play the game
 */
function letsPlay() {;
  // dashboard
  const dashboardBtn = document.querySelector('.websi-dashboard-btns');
  const scoreboard = document.querySelector('.websi-dashboard-score');
  // create new game
  const simonSays = new SimonGame(scoreboard);
  // Add dashboard btns listeners
  dashboardBtn.addEventListener('click', elem => {
    simonSays.resetGame();
    simonSays.playRound();
  });
}

letsPlay();

/**
onclick="document.getElementById('horseNoise').play();">PRESS</button>

<audio id="horseNoise" preload="auto">
  <source src="horse.ogg" type="audio/ogg">
  <source src="horse.mp3" type="audio/mpeg">
  Your browser does not support the audio element.
</audio>

*/
