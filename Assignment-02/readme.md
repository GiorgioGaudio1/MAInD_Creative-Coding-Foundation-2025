#Assignment 02

## Brief

Choose a “mini-game” to rebuild with HTML, CSS and JavaScript. The requirements are:

- The webpage should be responsive
- Choose an avatar at the beginning of the game
- Keep track of the score of the player
- Use the keyboard to control the game (indicate what are the controls in the page). You can also use buttons (mouse), but also keyboard.
- Use some multimedia files (audio, video, …)
- Implement an “automatic restart” in the game (that is not done via the refresh of the page)

![First screenshoot](DOC/Hangman_1.png) 

![Second screenshoot](DOC/Hangman_2(youwin).png)

## Project description
Hangman is a minimalist browser game where you guess a hidden programming word by typing letters on the keyboard. Each wrong guess reveals a new part of a colored hangman. Sounds, score tracking and a color picker make quick, replayable rounds.

graph TD
  A[Page load] --> B[startGame()]
  B --> C[Init word, errors, usedLetters, score]
  C --> D[Pick random word & build displayWord]
  D --> E[Hide hangman parts & applyHangmanColor()]
  E --> F[Render word, stats, UI]

  A --> G[User chooses color]
  G --> H[Set chosenColor & applyHangmanColor()]
  H --> E

  A --> I[Keydown letter]
  I --> J[handleGuess(letter)]
  J --> K{Valid A–Z<br/>and not used?}
  K -->|No| F

  K -->|Yes & in word| L[Reveal matching letters<br/>updateWordDisplay()]
  L --> M{Word complete?}
  M -->|Yes| N[Win state<br/>score++<br/>play win sound<br/>show restart]
  M -->|No| F

  K -->|Yes & not in word| O[errors++<br/>update errors label<br/>reveal next hangman part]
  O --> P{errors == maxErrors?}
  P -->|Yes| Q[Lose state<br/>show word<br/>play lose sound<br/>show restart]
  P -->|No| F

  R[Restart button click] --> B

![Diagram](DOC/Block_diagram.svg)

## Function list


### applyHangmanColor()

Arguments: none
What it does: Applies the selected color to all hangman body parts by iterating over hangmanParts.
Returns: void

### startGame()

Arguments: none
What it does: Initializes a new game: selects a random word, resets errors and used letters, updates the UI, hides all hangman parts, and applies the selected color.
Returns: void

### updateWordDisplay()

Arguments: none
What it does: Updates the visible word by joining the displayWord array and writing it into the DOM.
Returns: void

### handleGuess(letter)

Arguments:
letter (string)
What it does: Validates the letter, updates the list of used letters, reveals correct letters or increases errors, updates the UI, and handles win/lose states including sounds.
Returns: void

### Keyboard Event Listener

document.addEventListener("keydown", ...)
Arguments: event (KeyboardEvent)
What it does: Captures the pressed key, converts it, and passes it to handleGuess().
Returns: void

### Restart Button Listener

restartBtn.addEventListener("click", ...)
Arguments: none
What it does: Starts a new game by calling startGame().
Returns: void

### Color Option Listeners

colorOptions.forEach(option => option.addEventListener("click", ...))
Arguments: none
What it does: Updates chosenColor, refreshes the color selector UI, and calls applyHangmanColor().
Returns: void

### Color Toggle Listener

colorToggle.addEventListener("click", ...)
Arguments: none
What it does: Opens the color selection panel and hides the toggle.
Returns: void

## Licence
2025 (c) Giorgio Gaudio. All rights reserved. License: None