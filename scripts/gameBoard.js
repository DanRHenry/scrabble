// import { dictionary } from "../Dictionary/dictionary";

const dictionary = localStorage.dictionary.split(",");

function searchDictionary(wordToFind) {
  return dictionary.find((word) => word === wordToFind);
}

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
let scrabblePlayerOneName;
let scrabblePlayerTwoName;
let activePlayer;

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

gameGrid[activeBox].style.opacity = ".5";

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
  horizontal: 1,
  vertical: 15,
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
// let gameGridBox = document.getElementsByClassName("gameGridBox");
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
      scrabblePlayerOneName = `${localStorage.scrabblePlayerOneName}'`;
    } else {
      playerOneScoreName.innerText = `${localStorage.scrabblePlayerOneName}'s Score:`;
      scrabblePlayerOneName = `${localStorage.scrabblePlayerOneName}'s`;
    }
  } else {
    playerOneScoreName.innerText = "Player 1's Score";
    scrabblePlayerOneName = "Player 1's";
  }

  if (localStorage.scrabblePlayerTwoName != "") {
    if (
      localStorage.scrabblePlayerTwoName[
        localStorage.scrabblePlayerTwoName.length - 1
      ] == "s"
    ) {
      playerTwoScoreName.innerText = `${localStorage.scrabblePlayerTwoName}' Score:`;
      scrabblePlayerTwoName = `${localStorage.scrabblePlayerTwoName}'`;
    } else {
      playerTwoScoreName.innerText = `${localStorage.scrabblePlayerTwoName}'s Score:`;
      scrabblePlayerTwoName = `${localStorage.scrabblePlayerTwoName}'s`;
    }
  } else {
    playerTwoScoreName.innerText = "Player 2's Score";
    scrabblePlayerTwoName = "Player 2's";
  }

  activePlayer = scrabblePlayerOneName;
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

function gameGridBoxAddEventListeners() {
  for (let i = 0; i < gameGrid.length; i++) {
    // Grabbing the index from the given box on the gameboard
    gameGrid[i].addEventListener(
      "click",
      () => {
        activeBox = i;
        console.log("gridLocation: ", i);
        if (!gameGrid[i].style.opacity) {
          for (let i = 0; i < gameGrid.length; i++) {
            gameGrid[i].style.opacity = "";
          }
          gameGrid[i].style.opacity = ".5";
        } else {
          gameGrid[i].style.opacity = "";
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
        gameGrid.value != undefined
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
  wordInPlayArray = [];
  playerTiles[i].addEventListener("click", () => {
    function skipFullBoxes(activeBox) {
      let activeBoxLocation =
        document.getElementsByClassName("gameGridBox")[activeBox];
      const nextBox = activeBox + adjacentDirections[direction];
      if (activeBox % 15 < nextBox % 15 || activeBox % 15 === nextBox % 15) {
        if (!activeBoxLocation) {
          console.log("undefined square");
        } else if (activeBoxLocation.textContent.length > 0) {
          if (wordInPlayArray.includes(activeBox)) {
          } else {
            wordInPlayArray.push(activeBox);
          }
          skipFullBoxes(nextBox);
        } else {
          activeBoxLocation.textContent = playerTiles[i].textContent;
          for (let i = 0; i < gameGrid.length; i++) {
            if (gameGrid[i].id === activeBoxLocation.id) {
              if (wordInPlayArray.includes(i)) {
                console.log(i, "is already here");
              }
              wordInPlayArray.push(i);
            }
          }
        }
      } else if (activeBox % 15 === 14) {
        console.log("hello?");
        console.log(activeBox);
        if (activeBoxLocation.textContent.length < 1) {
          activeBoxLocation.textContent = playerTiles[i].textContent;
          wordInPlayArray.push(activeBox);
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
  checkAdjacentBoxes(wordInPlayArray);
  wordInPlayArray = [];
});

function checkAdjacentBoxes(wordInPlayArray) {
  console.log("wordInPlayArray: ", wordInPlayArray);

  let wordsInPlay = [];

  for (let i = 0; i < wordInPlayArray.length; i++) {
    // Create object for each position to push into the wordsInPlay array
    let positionInfo = {
      up: [wordInPlayArray[i]],
      down: [wordInPlayArray[i]],
      left: [wordInPlayArray[i]],
      right: [wordInPlayArray[i]],
      vertical: [],
      horizontal: [],
    };

    // Define adjacent positions relative to the current position
    const upwardPosition = wordInPlayArray[i] - adjacentDirections.vertical;
    const downwardPosition = wordInPlayArray[i] + adjacentDirections.vertical;
    const rightwardPosition =
      wordInPlayArray[i] + adjacentDirections.horizontal;
    const leftwardPosition = wordInPlayArray[i] - adjacentDirections.horizontal;

    function checkPositionForText(direction, position, currentPosition) {
      if (direction === "up") {
        const upwardPosition = position + adjacentDirections.up;

        if (position + adjacentDirections.up >= 0) {
          checkForText(direction, position);
        }
      } else if (direction === "down") {
        if (position < gameGrid.length) {
          checkForText(direction, position);
        }
      } else if (direction === "left") {
        if (
          currentPosition > 0 &&
          currentPosition % 15 !== 0 &&
          position % 15 < currentPosition % 15
        ) {
          checkForText(direction, position);
        }
      } else if (direction === "right") {
        if (
          position < gameGrid.length &&
          currentPosition % 15 < position % 15
        ) {
          checkForText(direction, position);
        }
      }
      function checkForText(direction, position) {
        if (
          gameGrid[position] &&
          gameGrid[position].textContent &&
          !positionInfo[direction].includes(position)
        ) {
          positionInfo[direction].push(position);

          checkForText(direction, position + adjacentDirections[direction]);
          return gameGrid[position].textContent;
        } else {
          return "";
        }
      }
    }

    checkPositionForText("up", upwardPosition, wordInPlayArray[i]);

    checkPositionForText("down", downwardPosition, wordInPlayArray[i]);

    checkPositionForText("left", leftwardPosition, wordInPlayArray[i]);

    checkPositionForText("right", rightwardPosition, wordInPlayArray[i]);

    wordsInPlay.push(positionInfo);
  }

  for (let i = 0; i < wordsInPlay.length; i++) {
    if (wordsInPlay[i].horizontal === undefined) {
      wordsInPlay[i].horizontal = [];
    }
    if (wordsInPlay[i].vertical === undefined) {
      wordsInPlay[i].vertical = [];
    }

    if (wordsInPlay[i].right.length > 1 && wordsInPlay[i].left.length > 1) {
      wordsInPlay[i].horizontal = new Set([
        ...wordsInPlay[i].right,
        ...wordsInPlay[i].left,
      ]);
    }
    if (wordsInPlay[i].up.length > 1 && wordsInPlay[i].down.length > 1) {
      wordsInPlay[i].vertical = new Set([
        ...wordsInPlay[i].up,
        ...wordsInPlay[i].down,
      ]);
    }
    wordsInPlay[i].up = wordsInPlay[i].up.sort((a, b) => a - b);
    wordsInPlay[i].down = wordsInPlay[i].down.sort((a, b) => a - b);
    wordsInPlay[i].left = wordsInPlay[i].left.sort((a, b) => a - b);
    wordsInPlay[i].right = wordsInPlay[i].right.sort((a, b) => a - b);
    wordsInPlay[i].horizontal = Array.from(wordsInPlay[i].horizontal).sort(
      (a, b) => a - b
    );
    wordsInPlay[i].vertical = Array.from(wordsInPlay[i].vertical).sort(
      (a, b) => a - b
    );
  }

  console.log("wordsInPlay: ", wordsInPlay);

  (function () {
    let verticalStringsArray = [];
    let horizontalStringsArray = [];
    for (let i = 0; i < wordsInPlay.length; i++) {
      let verticalWord = "";
      let horizontalWord = "";
      for (let j = 0; j < wordsInPlay[i].vertical.length; j++) {
        verticalWord += gameGrid[wordsInPlay[i].vertical[j]].textContent;
      }

      for (let j = 0; j < wordsInPlay[i].horizontal.length; j++) {
        horizontalWord += gameGrid[wordsInPlay[i].horizontal[j]].textContent;
      }
      verticalStringsArray[i] = verticalWord;
      horizontalStringsArray[i] = horizontalWord;
    }
    console.log(verticalStringsArray);
    console.log(horizontalStringsArray);

    if (verticalStringsArray.length > 1) {
      if (
        (verticalStringsArray) =>
          verticalStringsArray.every((val) => val === arr[0])
      ) {
        console.log("direction: vertical");
      }
    }

    if (horizontalStringsArray.length > 1) {
      if (
        (horizontalStringsArray) =>
          horizontalStringsArray.every(
            (val) => val === horizontalStringsArray[0]
          )
      ) {
        console.log("direction: vertical");
      }
    }

    // const checkDirection = function (array){
    // if (array.length > 1){
    // array => array.every(val => val === array[0])}
    // }
  })();
}

getNamesAndScoreboardInfo();
fillLetterBag();
pullLettersFromLetterBag();
tradeInLetters();
putLettersInTheGameGridBoxes();
gameGridBoxAddEventListeners();

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
