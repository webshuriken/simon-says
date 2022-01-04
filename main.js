/**
 * @description Simon says class
 * @param {DOM object} scoreboard - The DOM element to write the game score to
 */
class SimonGame {
  constructor(scoreboard = false) {
    // board settings
    this.simonAwake = false,
    this.sequence = [];
    this.playerMove = 0;
    this.playerLives = 2;
    this.playerTurn = false;
    this.round = 0;
    this.modal = {};
    // optional extra in case you want to display score on browser.
    this.scoreboard = scoreboard;
    // prep the game board
    this.boardBtns = document.querySelectorAll('.websi-board-btns');
    this.boardBtnsClass = this.boardBtns[0].className;
    // Add listeners
    this.boardBtns.forEach(btn => {
      btn.addEventListener('click', this.checkPlayerMove.bind(this));
    });
    // game modal
    this.modal.wrapper = document.querySelector('.websi-board-modal');
    this.modal.className = this.modal.wrapper.getAttribute('class');
    this.modal.msg = document.querySelector('.websi-board-modal__msg');
    // games tones
    this.tones = [
      new Audio('tones/simon-says_tone-red.mp3'),
      new Audio('tones/simon-says_tone-green.mp3'),
      new Audio('tones/simon-says_tone-blue.mp3'),
      new Audio('tones/simon-says_tone-yellow.mp3')
    ];
    this.tones.forEach(tone => tone.volume = 0.2);
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
    // only after showing sequence allow player to take turn
    this.playerTurn = true;
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
        this.playTone(this.sequence[index]);
      }, 200);
      setTimeout(() => {
        this.boardBtns[this.sequence[index]].className = this.boardBtnsClass;
        setTimeout(() => {
          // resolve promise on light off
          resolve(true);
        }, 200);
      }, 400);
    });
  }
  /**
   * @description Plays the press button tone
   */
  playTone(n) {
    this.tones[n].play();
  }
  /**
   * @description Checks every time a player presses a colour
   */
  checkPlayerMove(elem) {
    // only check move on players turn
    if (!this.playerTurn) return;
    // map color name to integer value
    const color = elem.srcElement.dataset.websiBtn;
    const move = (color === 'red')
                  ? 0
                  : color === 'green'
                    ? 1
                    : color === 'blue'
                      ? 2 : 3;
    // play the tone to accompany button press
    this.playTone(move);
    // check player move against generated sequence
    if (this.sequence[this.playerMove] !== move) {
      this.playerLives--;
      // player gets 1 more go if they mess up
      if (this.playerLives > 0) {
        console.log(`Like spidy says: everybody gets one.`);
        // player repeating so go back one move
        this.playerTurn = false;
        this.playerMove = 0;
        setTimeout(() => {
          this.playSequence();
        }, 600);
      }else{
        this.endingModal(true);
        this.resetGame();
      }
    }else{
      // increment player move on every click
      this.playerMove++;
      // start new round if player guessed all moves
      if (this.playerMove === this.sequence.length) {
        this.playerTurn = false;
        setTimeout(() => {
          this.playRound();
        }, 600);
      }
    }
  }
  /**
   * @description Reveals modal with score at end of game
   * @param {boolean} display - whether to display(true) or hide modal
   */
  endingModal(display) {
    if (display) {
      this.modal.msg.textContent = this.round - 1;
      this.modal.wrapper.className += ' active';
    }else{
      this.modal.wrapper.className = this.modal.className;
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
    this.scoreboard.textContent = 0;
    this.simonAwake = false;
  }
  /**
   * @description Does a game round
   */
  playRound() {
    if (this.round === 0) {
      this.simonAwake = true;
      this.endingModal(false);
    }
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
  // get element to display game score and pass it to new game instance
  const scoreboard = document.querySelector('.websi-dashboard-score');
  // create new game
  const simonSays = new SimonGame(scoreboard);
  // Add dashboard btns listeners
  dashboardBtn.addEventListener('click', elem => {
    simonSays.resetGame();
    simonSays.playRound();
  });
}

// activate game dashboard
letsPlay();
