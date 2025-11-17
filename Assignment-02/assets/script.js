const words = ["SCRIPT", "VARIABLE", "FUNCTION", "OBJECT", "METHOD"];

let currentWord = "";
let displayWord = [];
let errors = 0;
const maxErrors = 7;
let usedLetters = [];
let gameActive = false;
let score = 0;


// DOM (HTML Elements)

const wordDiv = document.getElementById("word");
const errorsHtml = document.getElementById("errors");
const usedLettersHtml = document.getElementById("used-letters");
const messageDiv = document.getElementById("message");
const restartBtn = document.getElementById("restart-btn");
const scoreHtml = document.getElementById("score");


const winSound = document.getElementById("win-sound");
const loseSound = document.getElementById("lose-sound");

const colorSelectContainer = document.getElementById("color-select-container");
const colorToggle = document.getElementById("color-toggle");


// Hangman parts
const hangmanRope = document.getElementById("hangman-rope");
const hangmanHead = document.getElementById("hangman-head");
const hangmanBody = document.getElementById("hangman-body");
const hangmanArmLeft = document.getElementById("hangman-arm-left");
const hangmanArmRight = document.getElementById("hangman-arm-right");
const hangmanLegLeft = document.getElementById("hangman-leg-left");
const hangmanLegRight = document.getElementById("hangman-leg-right");

const hangmanParts = [
  hangmanRope,
  hangmanHead,
  hangmanBody,
  hangmanArmLeft,
  hangmanArmRight,
  hangmanLegLeft,
  hangmanLegRight
];

// Color 
let chosenColor = "#ffd54f"; 

const colorOptions = document.querySelectorAll(".color-option");

function applyHangmanColor() {
  hangmanParts.forEach(function (part) {
    part.style.background = chosenColor;
  });
}


colorOptions.forEach(function (option) {
  option.addEventListener("click", function () {
    chosenColor = this.dataset.color;

    colorOptions.forEach(function (o) {
      o.classList.remove("selected");
    });
    this.classList.add("selected");

    applyHangmanColor();


    colorSelectContainer.style.display = "none";

    colorToggle.style.display = "block";
    colorToggle.style.background = chosenColor;
  });
});
colorToggle.addEventListener("click", function () {
  colorSelectContainer.style.display = "block";
  colorToggle.style.display = "none";
});


// ----- FUNCTIONS -----

function startGame() {
  currentWord = words[Math.floor(Math.random() * words.length)];
  displayWord = Array(currentWord.length).fill("_");
  hangmanParts.forEach(p => p.style.background = chosenColor);

  errors = 0;
  usedLetters = [];
  gameActive = true;

  updateWordDisplay();
  errorsHtml.textContent = "Errors: " + errors + "/" + maxErrors;
  usedLettersHtml.textContent = "Used letters: ";
  messageDiv.textContent = "";
  restartBtn.style.display = "none";
  scoreHtml.textContent = "Score: " + score;


for (let i = 0; i < hangmanParts.length; i++) {
  hangmanParts[i].style.visibility = "hidden";
}
applyHangmanColor();
}


// FUNCTION 01 — WordDisplay

function updateWordDisplay() {
  wordDiv.textContent = displayWord.join(" ");
}

// FUNCTION 02 — handleLetter
function handleGuess(letter) {
  if (!gameActive) return;
  if (!/^[A-Z]$/.test(letter)) {
    return;
  }

  letter = letter.toUpperCase();
  if (usedLetters.includes(letter)) {
    return;
  }

  usedLetters.push(letter);
  usedLettersHtml.textContent = usedLetters.join(" - ");

  if (currentWord.includes(letter)) {
    for (let i = 0; i < currentWord.length; i++) {
      if (currentWord[i] === letter) {
        displayWord[i] = letter;
      }
    }

    updateWordDisplay();

    if (!displayWord.includes("_")) {
      gameActive = false;
      score++;
      scoreHtml.textContent = "Score: " + score;
      messageDiv.textContent = "You win!";
      restartBtn.style.display = "inline-block";
      winSound.currentTime = 0;
      winSound.play();
    }
  } else {
    errors++;
    errorsHtml.textContent = "Errors: " + errors + "/" + maxErrors;

    if (errors <= maxErrors) {
      hangmanParts[errors - 1].style.visibility = "visible";
    }

    if (errors === maxErrors) {
      gameActive = false;
      messageDiv.textContent = "You lose! The word was: " + currentWord;
      restartBtn.style.display = "inline-block";
      loseSound.currentTime = 0;
      loseSound.play();
    }
  }
}


// ----- EVENT LISTENERS -----

document.addEventListener("keydown", function (event) {
  const key = event.key.toUpperCase();
  handleGuess(key);
});
restartBtn.addEventListener("click", function () {  startGame();
});

// ----- START INITIAL GAME -----
startGame();