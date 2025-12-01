// API CONFIGURATION
const API_KEY = "";
const NINJA_ENDPOINT = "https://api.api-ninjas.com/v1/historicalfigures";

// GAME CATEGORIES AND DATA
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

// GAME STATE VARIABLES
let currentCategoryKey = "scientists";
let currentFigure = null;
let currentWord = "";
let displayWord = [];
let errors = 0;
const maxErrors = 7;
let usedLetters = [];
let gameActive = false;
let score = 0;

// DOM ELEMENT REFERENCES
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

// Hangman drawing parts
const hangmanRope = document.getElementById("hangman-rope");
const hangmanHead = document.getElementById("hangman-head");
const hangmanBody = document.getElementById("hangman-body");
const hangmanArmLeft = document.getElementById("hangman-arm-left");
const hangmanArmRight = document.getElementById("hangman-arm-right");
const hangmanLegLeft = document.getElementById("hangman-leg-left");
const hangmanLegRight = document.getElementById("hangman-leg-right");

// Altri elementi
const hangmanTool = document.getElementById("hangman-tool");
const hangmanCloud = document.getElementById("hangman-cloud");
const hangmanBeaker = document.getElementById("hangman-beaker");

const hangmanParts = [
  hangmanRope,
  hangmanHead,
  hangmanBody,
  hangmanArmLeft,
  hangmanArmRight,
  hangmanLegLeft,
  hangmanLegRight
];

// APPLY CATEGORY STYLING
function applyCategoryStyles() {
  hangmanContainer.classList.remove(
    "cat-scientists",
    "cat-revolutionaries",
    "cat-philosophers"
  );
  hangmanContainer.classList.add("cat-" + currentCategoryKey);
}

// FETCH FIGURE BY NAME FROM API
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
        word: name.toUpperCase().replace(/[^A-Z]/g, ""),
        originalName: name,
        title: figureData.title || "",
        info: figureData.info || {}
      };

      startGameWithFigure();
    })
    .catch(function() {
      currentFigure = {
        word: name.toUpperCase().replace(/[^A-Z]/g, ""),
        originalName: name,
        title: "",
        info: {}
      };
      startGameWithFigure();
    });
}

// FETCH RANDOM FIGURE FROM CATEGORY
function fetchRandomFigureForCategory() {
  let seeds = CATEGORIES[currentCategoryKey].seeds;
  let randomIndex = Math.floor(Math.random() * seeds.length);
  let randomName = seeds[randomIndex];
  fetchFigureByName(randomName);
}

// LOAD FIGURE IMAGE FROM WIKIPEDIA
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

// UPDATE WORD DISPLAY
function updateWordDisplay() {
  wordDiv.textContent = displayWord.join(" ");
}

// SHOW FIGURE INFO AFTER WIN
function showFigureInfo() {
  hangmanContainer.style.display = "none";
  figureInfoCard.style.display = "block";

  let info = currentFigure.info;

  let occupations = "";
  if (info.occupation) {
    if (Array.isArray(info.occupation)) {
      occupations = info.occupation.join(", ");
    } else {
      occupations = info.occupation;
    }
  } else if (info.profession) {
    if (Array.isArray(info.profession)) {
      occupations = info.profession.join(", ");
    } else {
      occupations = info.profession;
    }
  }

  let knownFor = "";
  if (info.known_for) {
    if (Array.isArray(info.known_for)) {
      knownFor = info.known_for.join(", ");
    } else {
      knownFor = info.known_for;
    }
  }

  let htmlContent =
    "<h2 class='figure-name'>" + currentFigure.originalName + "</h2>";

  if (currentFigure.title) {
    htmlContent =
      htmlContent +
      "<p class='figure-title'><strong>" +
      currentFigure.title +
      "</strong></p>";
  }
  if (info.born) {
    htmlContent =
      htmlContent + "<p><strong>Born:</strong> " + info.born + "</p>";
  }
  if (info.died) {
    htmlContent =
      htmlContent + "<p><strong>Died:</strong> " + info.died + "</p>";
  }
  if (occupations) {
    htmlContent =
      htmlContent +
      "<p><strong>Occupation:</strong> " +
      occupations +
      "</p>";
  }
  if (knownFor) {
    htmlContent =
      htmlContent +
      "<p><strong>Known for:</strong> " +
      knownFor +
      "</p>";
  }
  if (info.nationality) {
    htmlContent =
      htmlContent +
      "<p><strong>Nationality:</strong> " +
      info.nationality +
      "</p>";
  }

  figureInfoText.innerHTML = htmlContent;
  loadFigureImageFromWikipedia(currentFigure.originalName);
}

// START GAME WITH FIGURE DATA
function startGameWithFigure() {
  currentWord = currentFigure.word;
  displayWord = [];

  let i = 0;
  while (i < currentWord.length) {
    displayWord.push("_");
    i = i + 1;
  }

  errors = 0;
  usedLetters = [];
  gameActive = true;

  updateWordDisplay();
  errorsHtml.textContent = "Errors: " + errors + "/" + maxErrors;
  usedLettersHtml.textContent = "Used letters: ";
  messageDiv.textContent = "";
  restartBtn.style.display = "none";
  scoreHtml.textContent = "Score: " + score;

  let j = 0;
  while (j < hangmanParts.length) {
    hangmanParts[j].style.visibility = "hidden";
    j = j + 1;
  }

  hangmanTool.style.display = "none";
  hangmanCloud.style.display = "none";
  hangmanBeaker.style.display = "none";

  applyCategoryStyles();
}

// START NEW GAME
function startGame() {
  gameActive = false;
  messageDiv.textContent = "Loading character...";
  figureInfoCard.style.display = "none";
  hangmanContainer.style.display = "block";
  fetchRandomFigureForCategory();
}

// HANDLE LETTER GUESS
function handleGuess(letter) {
  if (!gameActive) {
    return;
  }

  letter = letter.toUpperCase();

  // Accept only letters A-Z
  if (!/^[A-Z]$/.test(letter)) return;

  if (usedLetters.includes(letter)) return;

  usedLetters.push(letter);
  usedLettersHtml.textContent =
    "Used letters: " + usedLetters.join(" - ");

  if (currentWord.indexOf(letter) !== -1) {
    let i = 0;
    while (i < currentWord.length) {
      if (currentWord[i] === letter) {
        displayWord[i] = letter;
      }
      i = i + 1;
    }

    updateWordDisplay();

    let hasUnderscore = displayWord.indexOf("_") !== -1;
    if (!hasUnderscore) {
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
    errors = errors + 1;
    errorsHtml.textContent = "Errors: " + errors + "/" + maxErrors;

    if (errors <= maxErrors) {
      hangmanParts[errors - 1].style.visibility = "visible";
    }

    if (errors === 3) {
      if (currentCategoryKey === "revolutionaries") {
        hangmanTool.style.display = "block";
      } else if (currentCategoryKey === "philosophers") {
        hangmanCloud.style.display = "block";
      } else if (currentCategoryKey === "scientists") {
        hangmanBeaker.style.display = "block";
      }
    }

    if (errors === maxErrors) {
      gameActive = false;

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

// KEYBOARD EVENT LISTENER
document.addEventListener("keydown", function(event) {
  let key = event.key.toUpperCase();
  handleGuess(key);
});

// RESTART BUTTON LISTENER
restartBtn.addEventListener("click", function() {
  startGame();
});

// CATEGORY SELECT LISTENER
categorySelect.addEventListener("change", function() {
  currentCategoryKey = categorySelect.value;
  startGame();
});

// INITIALIZE GAME
startGame();
