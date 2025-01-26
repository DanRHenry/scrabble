//!-------------------------------------------------- Global Variables ------------------------------------------------------------
//? Replaced on Desktop Put all letters into an array, letterBag
// let letterBag = [
//     "A", "A", "A", "A", "A", "A", "A", "A", "A", "B", "B", "C", "C", "D", "D", "D", "D", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "F", "F", "G", "G", "G", "H", "H", "I", "I", "I", "I", "I", "I", "I", "I", "I", "J", "K", "L", "L", "L", "L", "M", "M", "N", "N", "N", "N", "N", "N", "O", "O", "O", "O", "O", "O", "O", "O", "P", "P", "Q", "R", "R", "R", "R", "R", "R", "S", "S", "S", "S", "T", "T", "T", "T", "T", "T", "U", "U", "U", "U", "V", "V", "W", "W", "X", "Y", "Y", "Z", "*", "*"
// ];
let letterBag = [];
let playableLetters = [];
let activeBox = 112; // Gameboard Starting Position
let activeWord; // The value of either vertical or horizontal word input
let gameBoardWord;
const acceptableWord = "ABCDE";
//!---------------------------------------------------- DOM Variables -------------------------------------------------------------
const playerTiles = document.getElementsByClassName("playerTiles");
let tradeInLettersButton = document.getElementById("tradeInLetters");
const inputField = document.getElementById("inputField");
const submitBtn = document.getElementById("submitBtn");
const inputClearBtn = document.getElementById("inputClearBtn");
// const reorientBtn = document.getElementById("reorientBtn");
const horizontalBtn = document.getElementById("horizontalBtn");
const verticalBtn = document.getElementById("verticalBtn");
const gameGrid = document.getElementsByClassName("gameGridBox");

const tempCoordinates = [];
let wordInPlayArray = [];
let wordToTestArray = [];

const directions = {
  vertical: 15,
  horizontal: 1,
};

let adjacentDirections = {
  up: -15,
  down: 15,
  left: -1,
  right: 1,
};

const squareTypes = {
  standardSquare: 1,
  doubleWord: 1,
  star: 1,
  tripleWord: 1,
  doubleLetter: 2,
  tripleLetter: 3,
};

//stars are doubleWord
// const existingSquares = [];
let verticalInput = document.getElementById("verticalInput");
let verticalSubmitBTN = document.getElementById("verticalSubmitButton");
let horizontalInput = document.getElementById("horizontalInput");
let horizontalSubmitBTN = document.getElementById("horizontalSubmitButton");
let gameGridBox = document.getElementsByClassName("gameGridBox");
let playerOneScoreName = document.getElementById("p1Name");
let playerTwoScoreName = document.getElementById("p2Name");
let p1Score = document.getElementById("p1Score");
let p2Score = document.getElementById("p2Score");
let direction = "horizontal";
// let direction = "vertical";

//! ----------------------------------------------------- Functions ---------------------------------------------------------------

// Put all letters into an array, letterbag
function fillLetterBag() {
  letterBag = [];
  for (let i = 0; i < 1; i++) {
    letterBag.push("J");
    letterBag.push("K");
    letterBag.push("Q");
    letterBag.push("X");
    letterBag.push("Z");
  }

  for (let i = 0; i < 2; i++) {
    letterBag.push("B");
    letterBag.push("C");
    letterBag.push("F");
    letterBag.push("H");
    letterBag.push("M");
    letterBag.push("P");
    letterBag.push("V");
    letterBag.push("W");
    letterBag.push("Y");
    letterBag.push("*");
  }

  for (let i = 0; i < 3; i++) {
    letterBag.push("G");
  }

  for (let i = 0; i < 4; i++) {
    letterBag.push("D");
    letterBag.push("L");
    letterBag.push("S");
    letterBag.push("U");
  }
  for (let i = 0; i < 6; i++) {
    letterBag.push("N");
    letterBag.push("R");
    letterBag.push("T");
  }
  for (let i = 0; i < 8; i++) {
    letterBag.push("O");
  }

  for (let i = 0; i < 9; i++) {
    letterBag.push("A");
    letterBag.push("I");
  }

  for (let i = 0; i < 12; i++) {
    letterBag.push("E");
  }
}

// Check Local Storage and Populate Scoreboard and Names
function getNamesAndScoreboardInfo() {
  // Get player names from local storage and input them to the scoreboard names
  if (localStorage.scrabblePlayerOneName != "") {
    if (
      localStorage.scrabblePlayerOneName[
        localStorage.scrabblePlayerOneName.length - 1
      ] == "s"
    ) {
      playerOneScoreName.innerText = `${localStorage.scrabblePlayerOneName}' Score:`;
      playerOnesName = `${localStorage.scrabblePlayerOneName}'`;
    } else {
      playerOneScoreName.innerText = `${localStorage.scrabblePlayerOneName}'s Score:`;
      playerOnesName = `${localStorage.scrabblePlayerOneName}'s`;
    }
  } else {
    playerOneScoreName.innerText = "Player 1's Score";
    playerOnesName = "Player 1's";
  }

  if (localStorage.scrabblePlayerTwoName != "") {
    if (
      localStorage.scrabblePlayerTwoName[
        localStorage.scrabblePlayerTwoName.length - 1
      ] == "s"
    ) {
      playerTwoScoreName.innerText = `${localStorage.scrabblePlayerTwoName}' Score:`;
      playerTwosName = `${localStorage.scrabblePlayerTwoName}'`;
    } else {
      playerTwoScoreName.innerText = `${localStorage.scrabblePlayerTwoName}'s Score:`;
      playerTwosName = `${localStorage.scrabblePlayerTwoName}'s`;
    }
  } else {
    playerTwoScoreName.innerText = "Player 2's Score";
    playerTwosName = "Player 2's";
  }

  activePlayer = playerOnesName;
}

// Populate Playable Letter Array with randomLetter from letterBag and remove letters used from the letterBag
function pullLettersFromLetterBag() {
  while (letterBag.length > 0 && playableLetters.length < 7) {
    let randomLetterIndex = Math.floor(Math.random() * letterBag.length);
    playableLetters.push(letterBag[randomLetterIndex]);
    letterBag.splice(randomLetterIndex, 1);
  }
  for (let i = 0; i <= 6; i++) {
    let id = document.getElementById(i);
    let letterToReplace = id.innerText;
    id.innerText = id.innerText.replace(letterToReplace, playableLetters[i]);
  }
}

function tradeInLetters() {
  letterBag.push(...playableLetters);
  playableLetters = ["t", "e", "s", "t", "c", "a", "t"];
  pullLettersFromLetterBag();
}

function putLettersInTheGameGridBoxes() {
  while (playableLetters.length < 7) {
    let randomLetterNumber = Math.floor(Math.random() * letterBag.length);
    playableLetters.push(letterBag[randomLetterNumber]);
    letterBag.splice(randomLetterNumber, 1);
  }
  for (let i = 0; i <= 6; i++) {
    let id = document.getElementById(i);
    let letterToReplace = id.innerText;
    id.innerText = id.innerText.replace(letterToReplace, playableLetters[i]);
  }
}

/* 
  Submitting words
  For this section, create an array of objects.
  Each object should contain the orientation and the word found

  1 - start at the active tile position
  2 - check all letters from that spot moving forward
  3 - at each location, take note of adjacent letters
  4 - if there is a letter, check back and forth until the word has finished
  5 - at each spot, check for adjacent letters. If there are any, repeat check for adjacent letters
  6 - for each found word, check that the word is real from the dictionary
  7 - if there is a word that doesn't work, cancel the entire operation
  8 - if each word is real, iterate through each word, calculating for each tile value
  */

function submitVerticalAnswer() {
  checkVerticalWord();
}

function submitHorizontalAnswer() {}

function gameGridBoxAddEventListeners() {
  for (let i = 0; i < gameGridBox.length; i++) {
    // Grabbing the index from the given box on the gameboard
    gameGridBox[i].addEventListener(
      "click",
      () => {
        // console.log(
        //   gameGridBox[i].classList[1] + ":",
        //   squareTypes[gameGridBox[i].classList[1]]
        // );

        activeBox = i;
        console.log("ActiveBoxisNow", gameGridBox[i].id);
        if (!gameGridBox[i].style.opacity) {
          for (let i = 0; i < gameGridBox.length; i++) {
            gameGridBox[i].style.opacity = "";
          }
          gameGridBox[i].style.opacity = ".5";
        } else {
          gameGridBox[i].style.opacity = "";
        }
      },
      false
    );
  }
}

//! Work on this section...
function checkVerticalWord() {
  /*
  initial placement of letters
  1 - Check orientation 
  2 - start at the active tile position
  3 - iterate through the inputfield.textContent
  4 - check that the current square is empty
  5 - if it is empty, add the current letter
  6 - if it is full, skip over the square and move onto the next one
  */

  let gameBoardPosition = activeBox; // added to maintain the original activeBox location while placing letters
  if (activeBox + activeWord.length * 15 < 224) {
    let tempWord = "";
    for (let i = 0; i < activeWord.length; i++) {
      if (
        activeWord[i] != gameBoardPosition ||
        activeWord[i] != "*" ||
        gameGridBox.value != undefined
      )
        return false;
      else {
        tempWord += activeWord[i];
        gameBoardPosition + 15;
      }
    }
    console.log(tempWord);
  }
}

//!---------------------------------------------- Event Listeners ----------------------------------------------------

tradeInLettersButton.addEventListener("click", tradeInLetters);

verticalBtn.addEventListener("click", () => {
  verticalBtn.textContent = "active";
  horizontalBtn.textContent = "Horizontal";
  direction = "vertical";
});

horizontalBtn.addEventListener("click", () => {
  horizontalBtn.textContent = "active";
  verticalBtn.textContent = "Vertical";
  direction = "horizontal";
});

for (let i = 0; i < playerTiles.length; i++) {
  playerTiles[i].addEventListener("click", () => {
    // inputField.textContent += playerTiles[i].textContent;

    function skipFullBoxes(activeBox) {
      let activeBoxLocation =
        document.getElementsByClassName("gameGridBox")[activeBox];

      if (!activeBoxLocation) {
        console.log("undefined square");
      } else if (activeBoxLocation.textContent.length > 0) {
        let activeLocationGridIndex;
        for (let i = 0; i < gameGrid.length; i++) {
          if (activeBoxLocation.id === gameGrid[i].id) {
            activeLocationGridIndex = i;
          }
        }
        if (!wordInPlayArray.includes(activeLocationGridIndex)) {
          wordInPlayArray.push(activeLocationGridIndex);
          console.log(wordInPlayArray);
        }

        activeBox += directions[direction];
        skipFullBoxes(activeBox);
      } else {
        activeBoxLocation.textContent = playerTiles[i].textContent;
        for (let i = 0; i < gameGrid.length; i++) {
          if (gameGrid[i].id === activeBoxLocation.id) {
            wordInPlayArray.push(i);
            for (let i = 0; i < wordInPlayArray.length; i++) {}
          }
        }
      }
    }
    skipFullBoxes(activeBox);
  });
}

inputClearBtn.addEventListener("click", () => {
  wordInPlayArray = [];
  let inputArray = inputField.textContent.split("");

  for (let i = 0; i < playerTiles.length; i++) {
    if (playerTiles[i].textContent === "") {
      playerTiles[i].textContent = inputArray[0];
      inputArray.shift();
    }
  }
  inputField.textContent = null;
  for (let i = 0; i < tempCoordinates.length; i++) {
    document.getElementById(tempCoordinates[i]).style = "";
    document.getElementById(tempCoordinates[i]).textContent = "";
  }
  tempCoordinates.length = 0;
  console.log("tempCoordinates: ", tempCoordinates);
});

submitBtn.addEventListener("click", () => {
  const wordsInPlay = checkAdjacentBoxes(wordInPlayArray, direction);

  let words = Object.values(wordsInPlay);

  for (let word of words) {
    // if (word.length > 1) {
    let wordInPlay = "";
    word.map((space) => {
      wordInPlay +=
        document.getElementsByClassName("gameGridBox")[space].textContent;
    });
    // }
  }
  wordInPlayArray = [];
});

function checkAdjacentBoxes(wordInPlayArray, direction) {
  // start with an array of all the tiles that have just been placed, wordInPlayArray

  // for each index, check perpendicular directions for existing letters and add them to directions arrays, upwardWord, downwardWord, etc...

  // when there are no more existing letters, check each direction (upwardWord, downwardWord, etc...) and concatenate
  // check the concatenated array against a dictionary of accepted words.

  console.log("wordInPlayArray: ", wordInPlayArray);

  console.log("directions: ", directions);
  // console.log("direction: ",direction)

  let startingLocation = wordInPlayArray[0];
  console.log("startingLocation: ", startingLocation);
  const gameGridBox = document.getElementsByClassName("gameGridBox");

  console.log("checking previous vertical letter: ");
  if (gameGridBox[startingLocation - directions.vertical].textContent > 0) {
    console.log(gameGridBox[startingLocation - directions.vertical]);
  }

  console.log("checking next vertical letter: ");
  if (gameGridBox[startingLocation + directions.vertical].textContent > 0) {
    console.log(
      gameGridBox[startingLocation + directions.vertical].textContent
    );
  }

  let leftLetterSquare = gameGridBox[startingLocation - directions.horizontal];

  let leftCheckLetters = [];
  if (leftLetterSquare.textContent.length > 0) {
    console.log(
      "checking left: ",
      checkLeftDirection(startingLocation, leftCheckLetters)
    );
  }
  // console.log("checking previous horizontal letter: ", )
  // console.log("left horizontal letter: ",)
  // console.log(directions.horizontal)

  if (gameGridBox[startingLocation - directions.horizontal].textContent > 0) {
    console.log(
      gameGridBox[startingLocation - directions.horizontal].textContent
    );
  }

  console.log("checking previous horizontal letter: ");
  if (gameGridBox[startingLocation + directions.horizontal].textContent > 0) {
    console.log(
      gameGridBox[startingLocation + directions.horizontal].textContent
    );
  }

  let wordInPlay = "";
  wordInPlayArray.map((letter) => {
    wordInPlay +=
      document.getElementsByClassName("gameGridBox")[letter].textContent;
  });
  console.log("wordInPlay: ", wordInPlay);
  let up = [];
  let down = [];
  let left = [];
  let right = [];

  for (let i = 0; i < wordInPlayArray.length; i++) {
    if (direction === "horizontal") {
      let upwardWord = [];
      let downwardWord = [];

      upwardWord.unshift(wordInPlayArray[i]);
      downwardWord.push(wordInPlayArray[i]);

      up = checkUpDirection(wordInPlayArray[i], upwardWord);

      down = checkDownDirection(wordInPlayArray[i], downwardWord);

      if (up.length > 1) {
        console.log("up: ", up);
        for (let i = 0; i < up.length; i++) {
          console.log(gameGrid[up[i]]);
        }
      }

      if (down.length > 1) {
        console.log("down: ", down);
        for (let i = 0; i < down.length; i++) {
          console.log(gameGrid[down[i]].textContent);
        }
      }
    } else if (direction === "vertical") {
      let leftwardWord = [];
      let rightwardWord = [];

      // leftwardWord.unshift(wordInPlayArray[i]);
      rightwardWord.push(wordInPlayArray[i]);

      left = checkLeftDirection(wordInPlayArray[i], leftwardWord, wordInPlay[i]);

      right = checkRightDirection(wordInPlayArray[i], rightwardWord);

      if (left.length > 1) {
        console.log("left: ", left);
        for (let i = 0; i < left.length; i++) {
          console.log(gameGrid[left[i]]);
        }
      }

      if (right.length > 1) {
        console.log("right: ", right);
        for (let i = 0; i < right.length; i++) {
          console.log(gameGrid[right[i]]);
        }
      }
    }
  }

  return {
    up: up,
    down: down,
    left: left,
    right: right,
  };
}

const checkLeftDirection = function (position, leftwardWord, startingPosition) {
  if (leftwardWord.length === 0) {
    leftwardWord.push(position)
  }
  const leftwardPosition = position + adjacentDirections.left;

  if (position === 0) {
    return console.log(
      "starting square...",
      position,
      ": ",
      gameGrid[position].textContent
    );
  } else if (
    leftwardPosition % 15 < position % 15 &&
    gameGrid[leftwardPosition].textContent.length > 0
  ) {
    const next = gameGrid[leftwardPosition];
    
    if (next.textContent.length > 0) {
      leftwardWord.unshift(leftwardPosition);
      checkLeftDirection(leftwardPosition, leftwardWord);
    } 
  }
  return leftwardWord;
};

const checkRightDirection = function (position, rightwardWord) {
  const rightwardPosition = position + adjacentDirections.right;

  if (position === gameGrid.length - 1) {
    return console.log(
      "ending square...",
      position,
      ": ",
      gameGrid[position].textContent
    );
  } else if (
    rightwardPosition % 15 > position % 15 &&
    gameGrid[rightwardPosition] < gameGrid.length - 1 &&
    gameGrid[rightwardPosition].textContent.length > 0
  ) {
    rightwardWord.push(rightwardPosition);
    checkRightDirection(rightwardPosition, rightwardWord);
  }
  return rightwardWord;
};

const checkUpDirection = function (position, upwardWord) {
  const upwardPosition = position + adjacentDirections.up;
  if (gameGrid[upwardPosition]?.textContent.length > 0) {
    // console.log("upwardPosition: ", gameGrid[upwardPosition]?.textContent);
  }

  if (position - 15 < 0) {
    return console.log(
      "top row...",
      position,
      ": ",
      gameGrid[position]?.textContent
    );
  } else if (
    upwardPosition >= 0 &&
    gameGrid[upwardPosition].textContent.length > 0
  ) {
    upwardWord.unshift(upwardPosition);
    checkUpDirection(upwardPosition, upwardWord);
  }
  return upwardWord;
};

const checkDownDirection = function (position, downwardWord) {
  const downwardPosition = position + adjacentDirections.down;

  if (gameGrid[downwardPosition]?.textContent.length > 0) {
    // console.log("downwardPosition: ", gameGrid[downwardPosition]?.textContent);
  }

  if (position + 15 > gameGrid.length) {
    return console.log(
      "bottom row...",
      position,
      ": ",
      gameGrid[position]?.textContent
    );
  } else if (
    downwardPosition >= 0 &&
    gameGrid[downwardPosition].textContent.length > 0
  ) {
    downwardWord.push(downwardPosition);
    checkDownDirection(downwardPosition, downwardWord);
  }
  return downwardWord;
};

getNamesAndScoreboardInfo();
fillLetterBag();
pullLettersFromLetterBag();
tradeInLetters();
putLettersInTheGameGridBoxes();
gameGridBoxAddEventListeners();

//! When using getElementsByClassName, what is returned is an array that needs to be indexed through to access the given location.

// TODO: Upon clicking on a box, add the id value to the current location, and change the styling of the square to a different color or border.
// TODO: Reference that currentlocation upon submission of vertical or horizontal answers as the starting point of the word to be played
// TODO: Check word's letters against playable tiles (accounting for the wildcards)
// TODO: Check the submission word's length, and look for letters in the direction of the clicked button to compare with word letters
// TODO: Add the letters to each of the gameboard squares
// TODO: Check that the word to be added doesn't go out of the range of the gameboard.
// TODO: Reference a dictionary to assign score points based on letters used. (create this first)
// TODO: Update the player's total score
// TODO:

// Work on this later
// Get words from word-game-dictionary
/* 
let url = "https://www.programmableweb.com/api/word-game-dictionary"

function fetch(url) {
    let response = await fetch(url);
    let results = await response.json();
    let data = results.data[1];
    console.log(data);
}



/*     <!-- Put these into JS later - see menu assignment
A - 1 point <br>
B - 3 points <br>
C - 3 points <br>
D - 2 points <br> 
E - 1 point <br> 
F - 4 points <br>
G - 2 points <br>
H - 4 points <br>
I - 1 point <br>
J - 8 points <br>
K - 5 points <br>
L - 1 point <br>
M - 3 points <br>
N - 1 point <br>
O - 1 point <br>
P - 3 points <br>
Q - 10 points <br>
R - 1 point <br>
S - 1 point <br>
T - 1 point <br>
U - 1 point <br>
V - 4 points <br>
W - 4 points <br>
X - 8 points <br>
Y - 4 points <br>
Z - 10 points <br>
    --> */
