new (class {
  constructor() {
    this.msgElem = document.getElementById('msg');
    this.randomNum = this.getRandomNumber();

    window.SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    this.recognition = new window.webkitSpeechRecognition();

    this.addEventListeners();
    this.startSpeechRecognition();
  }

  addEventListeners() {
    this.recognition.addEventListener('result', e => this.onSpeak(e));
    this.recognition.addEventListener('end', () => this.recognition.start());
    document.body.addEventListener('click', e => this.onBodyClick(e));
  }

  startSpeechRecognition() {
    this.recognition.start();
  }

  getRandomNumber() {
    return Math.floor(Math.random() * 100) + 1;
  }

  onBodyClick(e) {
    if (e.target.id != 'play-again') return;

    window.location.reload();
  }

  onSpeak(e) {
    let message = e.results[0][0].transcript;

    this.writeMessage(message);
    this.checkNumber(message);
  }

  writeMessage(message) {
    this.msgElem.innerHTML = `
      <div>You said: </div>
      <span class="box">${message}</span>
    `;
  }

  checkNumber(message) {
    let number = Number.parseInt(message);

    switch (true) {
      case Number.isNaN(number):
        this.msgElem.innerHTML += '<div>That is not a valid number</div>';
        break;

      case number < 1 || number > 100:
        this.msgElem.innerHTML += '<div>Number must be between 1 and 100</div>';
        break;

      case number === this.randomNum:
        document.body.innerHTML = `
          <h2>Congrats! You have guessed the number! <br><br>
          It was ${number}</h2>
          <button class="play-again" id="play-again">Play Again</button>
        `;
        break;

      case number > this.randomNum:
        this.msgElem.innerHTML += '<div>GO LOWER</div>';
        break;

      case number < this.randomNum:
        this.msgElem.innerHTML += '<div>GO HIGHER</div>';
    }
  }
})();
