// =======================
// API CONFIGURATION
// =======================

// API key for the Historical Figures API (to be filled in)
const API_KEY = "";

// Base URL for the historical figures API
const NINJA_ENDPOINT = "https://api.api-ninjas.com/v1/historicalfigures";


// =======================
// GAME CATEGORIES AND DATA
// =======================

// Categories of historical figures, each with a label and some example names
const CATEGORIES = {
  scientists: {
    label: "Scientists",
    seeds: [
      "Albert Einstein",
      "Marie Curie",
      "Galileo Galilei",
      "Nikola Tesla"
    ]
  },
  revolutionaries: {
    label: "Revolutionaries",
    seeds: [
      "George Washington",
      "Simon Bolivar",
      "Che Guevara"
    ]
  },
  philosophers: {
    label: "Philosophers",
    seeds: [
      "Karl Marx",
      "Immanuel Kant",
      "Friedrich Nietzsche"
    ]
  }
};


// =======================
// GAME STATE VARIABLES
// =======================

// Current category key (scientists / revolutionaries / philosophers)
let currentCategoryKey = "scientists";

// Object with data about the current figure
let currentFigure = null;

// The word to guess (name cleaned and uppercased)
let currentWord = "";

// Array that represents what is shown (e.g. ["_", "_", "A"])
let displayWord = [];

// Number of wrong guesses
let errors = 0;

// Max allowed errors before losing
const maxErrors = 7;

// Letters that have been guessed already
let usedLetters = [];

// Whether a game is currently active
let gameActive = false;

// Player score (wins)
let score = 0;


// =======================
// DOM ELEMENT REFERENCES
// =======================

// Main game and UI elements
const wordDiv = document.getElementById("word");
const errorsHtml = document.getElementById("errors");
const usedLettersHtml = document.getElementById("used-letters");
const messageDiv = document.getElementById("message");
const restartBtn = document.getElementById("restart-btn");
const scoreHtml = document.getElementById("score");

const winSound = document.getElementById("win-sound");
const loseSound = document.getElementById("lose-sound");

const categorySelect = document.getElementById("category-select");
const figureInfoCard = document.getElementById("figure-info-card");
const figureImage = document.getElementById("figure-image");
const figureInfoText = document.getElementById("figure-info-text");
const hangmanContainer = document.getElementById("hangman");

// Hangman body parts
const hangmanRope = document.getElementById("hangman-rope");
const hangmanHead = document.getElementById("hangman-head");
const hangmanBody = document.getElementById("hangman-body");
const hangmanArmLeft = document.getElementById("hangman-arm-left");
const hangmanArmRight = document.getElementById("hangman-arm-right");
const hangmanLegLeft = document.getElementById("hangman-leg-left");
const hangmanLegRight = document.getElementById("hangman-leg-right");

// Extra decorative elements (depending on category)
const hangmanTool = document.getElementById("hangman-tool");
const hangmanCloud = document.getElementById("hangman-cloud");
const hangmanBeaker = document.getElementById("hangman-beaker");

// Ordered list of hangman parts to reveal on errors
const hangmanParts = [
  hangmanRope,
  hangmanHead,
  hangmanBody,
  hangmanArmLeft,
  hangmanArmRight,
  hangmanLegLeft,
  hangmanLegRight
];


// =======================
// APPLY CATEGORY STYLING
// =======================

// Change CSS class on the container based on current category
function applyCategoryStyles() {
  hangmanContainer.classList.remove(
    "cat-scientists",
    "cat-revolutionaries",
    "cat-philosophers"
  );
  hangmanContainer.classList.add("cat-" + currentCategoryKey);
}


// =======================
// FETCH FIGURE BY NAME FROM API
// =======================

// Get data about a specific historical figure from the API, then start the game
function fetchFigureByName(name) {
  let url = NINJA_ENDPOINT + "?name=" + encodeURIComponent(name);

  fetch(url, {
    headers: { "X-Api-Key": API_KEY }
  })
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      let figureData = (data && data.length > 0) ? data[0] : {};

      currentFigure = {
        // Word used in the game: uppercase, letters only
        word: name.toUpperCase().replace(/[^A-Z]/g, ""),
        // Original name (for display)
        originalName: name,
        // Extra info from the API (if available)
        title: figureData.title || "",
        info: figureData.info || {}
      };

      startGameWithFigure();
    })
    .catch(function() {
      // If API fails, we still use the name but without extra info
      currentFigure = {
        word: name.toUpperCase().replace(/[^A-Z]/g, ""),
        originalName: name,
        title: "",
        info: {}
      };
      startGameWithFigure();
    });
}


// =======================
// FETCH RANDOM FIGURE FROM CATEGORY
// =======================

// Pick a random name from current category and fetch its data
function fetchRandomFigureForCategory() {
  let seeds = CATEGORIES[currentCategoryKey].seeds;
  let randomIndex = Math.floor(Math.random() * seeds.length);
  let randomName = seeds[randomIndex];
  fetchFigureByName(randomName);
}


// =======================
// LOAD FIGURE IMAGE FROM WIKIPEDIA
// =======================

// Load an image of the figure from Wikipedia's summary API
function loadFigureImageFromWikipedia(name) {
  let url =
    "https://en.wikipedia.org/api/rest_v1/page/summary/" +
    encodeURIComponent(name);

  fetch(url)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      if (data.thumbnail && data.thumbnail.source) {
        figureImage.src = data.thumbnail.source;
        figureImage.style.display = "block";
      } else {
        figureImage.style.display = "none";
      }
    });
}


// =======================
// UPDATE WORD DISPLAY
// =======================

// Show the current guessed word (underscores + revealed letters)
function updateWordDisplay() {
  wordDiv.textContent = displayWord.join(" ");
}


// =======================
// SHOW FIGURE INFO AFTER WIN
// =======================

// After winning, hide the game and show an info card about the figure
function showFigureInfo() {
  hangmanContainer.style.display = "none";
  figureInfoCard.style.display = "block";

  let info = currentFigure.info;

  // Build readable strings for occupation and "known for"
  let occupations = "";
  if (info.occupation) {
    occupations = Array.isArray(info.occupation)
      ? info.occupation.join(", ")
      : info.occupation;
  } else if (info.profession) {
    occupations = Array.isArray(info.profession)
      ? info.profession.join(", ")
      : info.profession;
  }

  let knownFor = "";
  if (info.known_for) {
    knownFor = Array.isArray(info.known_for)
      ? info.known_for.join(", ")
      : info.known_for;
  }

  // Build HTML for the info card
  let htmlContent =
    "<h2 class='figure-name'>" + currentFigure.originalName + "</h2>";

  if (currentFigure.title) {
    htmlContent +=
      "<p class='figure-title'><strong>" +
      currentFigure.title +
      "</strong></p>";
  }
  if (info.born) {
    htmlContent += "<p><strong>Born:</strong> " + info.born + "</p>";
  }
  if (info.died) {
    htmlContent += "<p><strong>Died:</strong> " + info.died + "</p>";
  }
  if (occupations) {
    htmlContent +=
      "<p><strong>Occupation:</strong> " + occupations + "</p>";
  }
  if (knownFor) {
    htmlContent +=
      "<p><strong>Known for:</strong> " + knownFor + "</p>";
  }
  if (info.nationality) {
    htmlContent +=
      "<p><strong>Nationality:</strong> " + info.nationality + "</p>";
  }

  figureInfoText.innerHTML = htmlContent;

  // Load image for the figure
  loadFigureImageFromWikipedia(currentFigure.originalName);
}


// =======================
// START GAME WITH FIGURE DATA
// =======================

// Reset state and start a new round for the current figure
function startGameWithFigure() {
  currentWord = currentFigure.word;
  displayWord = [];

  // Fill displayWord with underscores
  let i = 0;
  while (i < currentWord.length) {
    displayWord.push("_");
    i = i + 1;
  }

  errors = 0;
  usedLetters = [];
  gameActive = true;

  // Reset UI elements
  updateWordDisplay();
  errorsHtml.textContent = "Errors: " + errors + "/" + maxErrors;
  usedLettersHtml.textContent = "Used letters: ";
  messageDiv.textContent = "";
  restartBtn.style.display = "none";
  scoreHtml.textContent = "Score: " + score;

  // Hide all hangman parts
  let j = 0;
  while (j < hangmanParts.length) {
    hangmanParts[j].style.visibility = "hidden";
    j = j + 1;
  }

  // Hide category extras
  hangmanTool.style.display = "none";
  hangmanCloud.style.display = "none";
  hangmanBeaker.style.display = "none";

  // Apply category-specific style
  applyCategoryStyles();
}


// =======================
// START NEW GAME
// =======================

// Start loading a new random figure and reset the UI
function startGame() {
  gameActive = false;
  messageDiv.textContent = "Loading character...";
  figureInfoCard.style.display = "none";
  hangmanContainer.style.display = "block";
  fetchRandomFigureForCategory();
}


// =======================
// HANDLE LETTER GUESS
// =======================

// Process a guessed letter: update word, errors, and win/lose state
function handleGuess(letter) {
  if (!gameActive) {
    return;
  }

  letter = letter.toUpperCase();

  // Only accept A–Z
  if (!/^[A-Z]$/.test(letter)) return;

  // Ignore if letter was already used
  if (usedLetters.includes(letter)) return;

  usedLetters.push(letter);
  usedLettersHtml.textContent =
    "Used letters: " + usedLetters.join(" - ");

  // If the letter is in the word
  if (currentWord.indexOf(letter) !== -1) {
    let i = 0;
    while (i < currentWord.length) {
      if (currentWord[i] === letter) {
        displayWord[i] = letter;
      }
      i = i + 1;
    }

    updateWordDisplay();

    // Check if there are still underscores
    let hasUnderscore = displayWord.indexOf("_") !== -1;
    if (!hasUnderscore) {
      // Player wins
      gameActive = false;
      score = score + 1;
      scoreHtml.textContent = "Score: " + score;
      messageDiv.textContent = "You win!";
      restartBtn.style.display = "inline-block";
      winSound.currentTime = 0;
      winSound.play();
      showFigureInfo();
    }
  } else {
    // Wrong guess
    errors = errors + 1;
    errorsHtml.textContent = "Errors: " + errors + "/" + maxErrors;

    // Show next hangman part
    if (errors <= maxErrors) {
      hangmanParts[errors - 1].style.visibility = "visible";
    }

    // On third error, show category-specific prop
    if (errors === 4) {
      if (currentCategoryKey === "revolutionaries") {
        hangmanTool.style.display = "block";
      } else if (currentCategoryKey === "philosophers") {
        hangmanCloud.style.display = "block";
      } else if (currentCategoryKey === "scientists") {
        hangmanBeaker.style.display = "block";
      }
    }

    // If max errors reached, player loses
    if (errors === maxErrors) {
      gameActive = false;

      // Show first and last name as solution
      let nameParts = currentFigure.originalName.split(" ");
      let firstName = nameParts[0];
      let lastName = nameParts[nameParts.length - 1];
      let fullName = firstName + " " + lastName;

      messageDiv.textContent =
        "You lose! The word was: " + fullName;

      wordDiv.textContent = firstName + " " + lastName;

      restartBtn.style.display = "inline-block";
      loseSound.currentTime = 0;
      loseSound.play();
    }
  }
}


// =======================
// KEYBOARD EVENT LISTENER
// =======================

// Every key press is treated as a guess
document.addEventListener("keydown", function(event) {
  let key = event.key.toUpperCase();
  handleGuess(key);
});


// =======================
// RESTART BUTTON LISTENER
// =======================

// Start a new game when restart is clicked
restartBtn.addEventListener("click", function() {
  startGame();
});


// =======================
// CATEGORY SELECT LISTENER
// =======================

// Change category and start a new game when user selects another category
categorySelect.addEventListener("change", function() {
  currentCategoryKey = categorySelect.value;
  startGame();
});


// =======================
// INITIALIZE GAME
// =======================

// Start first game on page load
startGame();
