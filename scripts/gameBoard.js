// import { dictionary } from "../Dictionary/dictionary";

const dictionary = localStorage.dictionary.split(",");

function searchDictionary(wordToFind) {
  if (dictionary.find((word) => word === wordToFind)) {
    return true;
  } else {
    return false;
  }
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
const gameGrid = document.getElementsByClassName("gameGridBox");
const horizontalBtn = document.getElementById("horizontalBtn");
const verticalBtn = document.getElementById("verticalBtn");

gameGrid[activeBox].style.opacity = ".5";

const tempCoordinates = [];
let wordInPlayArray = [];
let wordToTestArray = [];

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

let playerOneScoreName = document.getElementById("p1Name");
let playerTwoScoreName = document.getElementById("p2Name");
let p1Score = document.getElementById("p1Score");
let p2Score = document.getElementById("p2Score");
let direction = "horizontal";

// let direction = "vertical";

function setDirectionalBtnStyling() {
  if (direction === "horizontal") {
    horizontalBtn.style.backgroundColor = "gray";
    horizontalBtn.style.color = "white";
    verticalBtn.style.backgroundColor = "white";
    verticalBtn.style.color = "initial";
  }
  if (direction === "vertical") {
    horizontalBtn.style.backgroundColor = "white";
    horizontalBtn.style.color = "initial";
    verticalBtn.style.backgroundColor = "gray";
    verticalBtn.style.color = "white";
  }
}

setDirectionalBtnStyling();

function switchDirections() {
  if (direction === "horizontal") {
    direction = "vertical";
  } else {
    direction = "horizontal";
  }
  setDirectionalBtnStyling();
}

function moveActiveBoxLeft() {
  if (activeBox % 15 > 0) {
    gameGrid[activeBox].style.opacity = "";
    activeBox--;
    gameGrid[activeBox].style.opacity = ".5";
  }
}

function moveActiveBoxRight() {
  if (activeBox % 15 < 14) {
    gameGrid[activeBox].style.opacity = "";
    activeBox++;
    gameGrid[activeBox].style.opacity = ".5";
  }
}

function moveActiveBoxDown() {
  if (activeBox + 15 <= gameGrid.length - 1) {
    gameGrid[activeBox].style.opacity = "";
    activeBox += 15;
    gameGrid[activeBox].style.opacity = ".5";
  }
}

function moveActiveBoxUp() {
  if (activeBox - 15 >= 0) {
    gameGrid[activeBox].style.opacity = "";
    activeBox -= 15;
    gameGrid[activeBox].style.opacity = ".5";
  }
}
//! ----------------------------------------------------- Functions ---------------------------------------------------------------

// Put all letters into an array, letterbag
function fillLetterBag() {
  letterBag = [];
  for (let i = 0; i < 1; i++) {
    letterBag.push("j");
    letterBag.push("k");
    letterBag.push("1");
    letterBag.push("x");
    letterBag.push("z");
  }

  for (let i = 0; i < 2; i++) {
    letterBag.push("b");
    letterBag.push("c");
    letterBag.push("f");
    letterBag.push("h");
    letterBag.push("m");
    letterBag.push("p");
    letterBag.push("v");
    letterBag.push("w");
    letterBag.push("y");
    letterBag.push("*");
  }

  for (let i = 0; i < 3; i++) {
    letterBag.push("g");
  }

  for (let i = 0; i < 4; i++) {
    letterBag.push("d");
    letterBag.push("l");
    letterBag.push("s");
    letterBag.push("u");
  }
  for (let i = 0; i < 6; i++) {
    letterBag.push("n");
    letterBag.push("r");
    letterBag.push("t");
  }
  for (let i = 0; i < 8; i++) {
    letterBag.push("o");
  }

  for (let i = 0; i < 9; i++) {
    letterBag.push("a");
    letterBag.push("i");
  }

  for (let i = 0; i < 12; i++) {
    letterBag.push("e");
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
  // playableLetters = []
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

//!---------------------------------------------- Event Listeners ----------------------------------------------------

horizontalBtn.addEventListener("click", () => {
  direction = "horizontal";
  setDirectionalBtnStyling();
});

verticalBtn.addEventListener("click", () => {
  direction = "vertical";
  setDirectionalBtnStyling();
});

tradeInLettersButton.addEventListener("click", tradeInLetters);

for (let i = 0; i < playerTiles.length; i++) {
  wordInPlayArray = [];
  playerTiles[i].addEventListener("click", () => clickedTile(i));
}

function clickedTile(i) {
  function skipFullBoxes(activeBox) {
    let activeBoxLocation =
      document.getElementsByClassName("gameGridBox")[activeBox];
    const nextBox = activeBox + adjacentDirections[direction];
    if (activeBox % 15 < nextBox % 15 || activeBox % 15 === nextBox % 15) {
      if (!activeBoxLocation) {
        console.log("undefined square");
      } else if (activeBoxLocation.textContent.length > 0) {
        if (!wordInPlayArray.includes(activeBox)) {
          // } else {
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

submitBtn.addEventListener("click", clickedSubmitBtn);

function clickedSubmitBtn() {
  checkAdjacentBoxes(wordInPlayArray);
  wordInPlayArray = [];
}

document.addEventListener("keydown", function (event) {
  let key = event.key || event.keyCode;
  // console.log("key: ",key)
  const tiles = [];
  for (let i = 0; i < playerTiles.length; i++) {
    tiles.push(playerTiles[i].textContent);
  }
  if (tiles.includes(key.toLowerCase())) {
    clickedTile(tiles.indexOf(key.toLowerCase()));
  }
  if (key === "Enter") {
    clickedSubmitBtn();
  }
  if (key === " ") {
    // console.log("space");
    switchDirections();
  }

  if (key === "ArrowLeft") {
    moveActiveBoxLeft();
  }

  if (key === "ArrowRight") {
    moveActiveBoxRight();
  }

  if (key === "ArrowUp") {
    moveActiveBoxUp();
  }

  if (key === "ArrowDown") {
    moveActiveBoxDown();
  }
});

// called when the submit button is clicked
// accepts an argument of the array of the word that was placed
// this array will not yet contain any existing letters

function checkAdjacentBoxes(wordInPlayArray) {
  console.log("wordInPlayArray: ", wordInPlayArray);

  //convert the array of letters played into a temp string
  let temp = "";

  for (let letterIndex of wordInPlayArray) {
    temp += gameGrid[letterIndex].textContent;
  }

  //
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
    const upwardPosition = wordInPlayArray[i] + adjacentDirections.up;
    const downwardPosition = wordInPlayArray[i] + adjacentDirections.down;
    const rightwardPosition = wordInPlayArray[i] + adjacentDirections.right;
    const leftwardPosition = wordInPlayArray[i] + adjacentDirections.left;

    checkPositionForText(
      "up", // wordInPlayArray[i] direction
      upwardPosition, // the next position upward
      wordInPlayArray[i], // the current Position number indexed from the wordInPlayArray
      positionInfo // the object that contains arrays for the directions that will be pushed to
    );

    checkPositionForText(
      "down",
      downwardPosition,
      wordInPlayArray[i],
      positionInfo
    );

    checkPositionForText(
      "left",
      leftwardPosition,
      wordInPlayArray[i],
      positionInfo
    );

    checkPositionForText(
      "right",
      rightwardPosition,
      wordInPlayArray[i],
      positionInfo
    );

    // push the information discovered at each index of the wordInPlayArray into the wordsInPlay array
    wordsInPlay.push(positionInfo);
    //!----------------------------------------------
    // The complete array of the wordinplay and all adjacent words is complete.
    //!----------------------------------------------
    // create vertical and horizontal words, concatinated as necessary

    createVerticalAndHorizontalWords(wordsInPlay);
  }

  // Determine Direction
  // Look through the wordsInPlay array to determine the direction of the word played.

  console.log("wordsInPlay before determineDirection... ", wordsInPlay);
  determineDirection(wordsInPlay);
}

// function determineDirection(wordsInPlay) {
//   console.log("wordsInPlay: ",wordsInPlay)
// }

//!-----------------------------------------------------------------------------
let count = 0;
//todo fix bug in this function (looping when there is only one letter played, or when it adds onto an existing group of letters)
function determineDirection(wordsInPlay) {
  count++;
  console.log("determining Direction ", count);
  console.log(wordsInPlay);
  console.log("wordsInPlay length: ", wordsInPlay.length);

  if (wordsInPlay.length === 1) {
    console.log(wordsInPlay);
    if (
      wordsInPlay[0].horizontal.length > 0 &&
      !wordsInPlay[0].vertical.length > 0
    ) {
      console.log("horizontal word");
    } else if (
      wordsInPlay[0].vertical.length > 0 &&
      !wordsInPlay[0].horizontal.length > 0
    ) {
      console.log("vertical word");
    } else {
      console.log("direction still not determined");
    }
    console.log("wordsInPlay length: ", wordsInPlay.length);
    return;
  }

  // Dealing with single letter additions
  if (wordInPlayArray.length === 1) {
    let wordsObject = wordsInPlay[0];
    console.log("wordsObject: ", wordsObject);

    const keys = Object.keys(wordsObject);
    const values = Object.values(wordsObject);

    for (let i = 0; i < values.length; i++) {
      if (values[i].length > 1) {
        for (let j = 0; j < values[i].length; j++) {
          if (values[i][j] === wordInPlayArray[0]) {
            if (keys[i] === "left" || keys[i] === "right") {
              console.log(values[i]);
              console.log("horizontal");
            } else if (keys[i] === "up" || keys[i] === "down") {
              console.log(values[i]);
              console.log("vertical");
            }
          }
        }
      }
    }
  }

  // console.log("wordsInPlay: ",wordsInPlay)
  // let verticalStringsArray = [];
  // let horizontalStringsArray = [];

  // for (let i = 0; i < wordsInPlay.length; i++) {
  //   let verticalWord = "";
  //   let horizontalWord = "";

  //   for (let j = 0; j < wordsInPlay[i].vertical.length; j++) {
  //     verticalWord += gameGrid[wordsInPlay[i].vertical[j]].textContent;
  //   }

  //   for (let j = 0; j < wordsInPlay[i].horizontal.length; j++) {
  //     horizontalWord += gameGrid[wordsInPlay[i].horizontal[j]].textContent;
  //   }
  //   verticalStringsArray[i] = verticalWord;
  //   horizontalStringsArray[i] = horizontalWord;
  // }

  function checkForHorizontalOrVerticalWord() {
    if (wordInPlayArray[1] - wordInPlayArray[0] === 1) {
      console.log("horizontal Direction");
      return "horizontal Direction";
      //for each location, check
    } else if (wordInPlayArray[1] - wordInPlayArray[0] === 15) {
      console.log("vertical Direction");
      return "vertical Direction";
    } else {
      console.log("undetermined Direction");
      return "undetermined Direction";
    }
  }

  wordsInPlay.map((position) => {
    // console.log("mapping wordsInPlay...", position)
    if (checkForHorizontalOrVerticalWord() === "horizontal Direction") {
      console.log(checkHorizontalDirectionWords(position));
      checkHorizontalDirectionWords();
    } else if (checkForHorizontalOrVerticalWord() === "vertical Direction") {
      console.log(checkVerticalDirectionWords(position));
      checkVerticalDirectionWords();
    } // console.log(checkForHorizontalOrVerticalWord())
    else if (checkForHorizontalOrVerticalWord() === "undetermined Direction") {
      // console.log("undetermined Direction...");
      // console.log("wordInPlayArray: ", wordInPlayArray);
      investigateUndeterminedDirectionWords(position);
    }
  });

  function checkHorizontalDirectionWords(currentLocation) {
    // let positionInfo = {
    //   up: [wordInPlayArray[0]],
    //   down: [wordInPlayArray[0]],
    //   left: [wordInPlayArray[0]],
    //   right: [wordInPlayArray[0]],
    //   vertical: [],
    //   horizontal: [],
    // };

    // console.log("wordInPlayArray: ", wordInPlayArray);
    // for (let i = 0; i < wordInPlayArray.length; i++) {
    // let currentLocation = wordInPlayArray[i];

    // let upwardPosition = wordInPlayArray[i] + adjacentDirections.up;

    let tempUp = "";
    let tempDown = "";
    let tempHorizontal = "";

    // checkPositionForText(
    //   "up", // wordInPlayArray[i] direction
    //   upwardPosition, // the next position upward
    //   wordInPlayArray[i], // the current Position number indexed from the wordInPlayArray
    //   positionInfo // the object that will be pushed to
    // );

    console.log("location: ", currentLocation);

    currentLocation?.up?.map(
      (letter) => (tempUp += gameGrid[letter].textContent)
    );
    currentLocation?.down?.map(
      (letter) => (tempDown += gameGrid[letter].textContent)
    );
    currentLocation?.horizontal?.map(
      (letter) => (tempHorizontal += gameGrid[letter].textContent)
    );

    console.log(tempUp, tempDown, tempHorizontal);

    if (tempUp.length > 1) {
      console.log("checking Up: ", tempUp);
      console.log(searchDictionary(tempUp));
      if (!searchDictionary(tempUp)) {
        return false;
      }
    }
    if (tempDown.length > 1) {
      console.log("checking Down: ", tempDown);
      console.log(searchDictionary(tempDown));
      if (!searchDictionary(tempDown)) {
        return false;
      }
    }
    if (tempHorizontal.length > 1) {
      console.log("checking Horizontal: ", tempHorizontal);
      console.log(searchDictionary(tempHorizontal));
      if (!searchDictionary(tempHorizontal)) {
        return false;
      }
    }
    return true;
    // }
  }

  function checkVerticalDirectionWords(currentLocation) {
    // for (let i = 0; i < location.length; i++) {
    let tempLeft = "";
    let tempRight = "";
    let tempVertical = "";

    console.log("location: ", currentLocation);
    //todo fix location variable
    currentLocation?.left?.map(
      (letter) => (tempLeft += gameGrid[letter].textContent)
    );

    currentLocation?.right?.map(
      (letter) => (tempRight += gameGrid[letter].textContent)
    );

    currentLocation?.vertical?.map(
      (letter) => (tempVertical += gameGrid[letter].textContent)
    );

    if (tempLeft.length > 1) {
      console.log("checking Left: ", tempLeft);
      console.log(searchDictionary(tempLeft));
      if (!searchDictionary(tempLeft)) {
        return false;
      }
    }
    if (tempRight.length > 1) {
      console.log("checking Right: ", tempRight);
      console.log(searchDictionary(tempRight));
      if (!searchDictionary(tempRight)) {
        return false;
      }
    }
    if (tempVertical.length > 1) {
      console.log("checking Vertical: ", tempVertical);
      console.log(searchDictionary(tempVertical));
      if (!searchDictionary(tempVertical)) {
        return false;
      }
    }
    console.log("tempLeft: ", tempLeft);
    console.log("tempRight: ", tempRight);
    console.log("tempVertical: ", tempVertical);
    return true;
    // }
  }
  console.log("done determining direction");
  wordsInPlay = [];
}

//!------------------------------------------------------------------------------

// start at the currentPosition, move in the direction with position as the first spot to check in the direction, and the resulting locations discovered get pushed into positionInfo
function checkPositionForText(
  direction,
  position,
  currentPosition,
  positionInfo
) {
  if (direction === "up") {
    if (position + adjacentDirections.up >= 0) {
      checkForText(direction, position, positionInfo);
    }
  } else if (direction === "down") {
    if (position < gameGrid.length) {
      checkForText(direction, position, positionInfo);
    }
  } else if (direction === "left") {
    if (
      currentPosition > 0 &&
      currentPosition % 15 !== 0 &&
      position % 15 < currentPosition % 15
    ) {
      checkForText(direction, position, positionInfo);
    }
  } else if (direction === "right") {
    if (position < gameGrid.length && currentPosition % 15 < position % 15) {
      checkForText(direction, position, positionInfo);
    }
  }

  function checkForText(direction, position, positionInfo) {
    // console.log("positionInfo: ",positionInfo)
    if (
      gameGrid[position] &&
      gameGrid[position].textContent &&
      !positionInfo[direction].includes(position)
    ) {
      positionInfo[direction].push(position); // fill position object directional array with number of filled square

      checkForText(
        direction,
        position + adjacentDirections[direction],
        positionInfo
      );
      return gameGrid[position].textContent;
    } else {
      return "";
    }
  }
}

function investigateUndeterminedDirectionWords(position) {
  console.log("position: ", position);
  let wordsInPlay = [];

  if (wordInPlayArray.length > 1) {
    console.log("undetermined direction wordInPlayArray: ", wordInPlayArray);
  } else {
    let i = 0;
    let positionInfo = {
      up: [wordInPlayArray[i]],
      down: [wordInPlayArray[i]],
      left: [wordInPlayArray[i]],
      right: [wordInPlayArray[i]],
      vertical: [],
      horizontal: [],
    };

    // Define adjacent positions relative to the current position
    const upwardPosition = wordInPlayArray[i] + adjacentDirections.up;
    const downwardPosition = wordInPlayArray[i] + adjacentDirections.down;
    const rightwardPosition = wordInPlayArray[i] + adjacentDirections.right;
    const leftwardPosition = wordInPlayArray[i] + adjacentDirections.left;

    checkPositionForText(
      "up", // wordInPlayArray[i] direction
      upwardPosition, // the next position upward
      wordInPlayArray[i], // the current Position number indexed from the wordInPlayArray
      positionInfo // the object that contains arrays for the directions that will be pushed to
    );

    checkPositionForText(
      "down",
      downwardPosition,
      wordInPlayArray[i],
      positionInfo
    );

    checkPositionForText(
      "left",
      leftwardPosition,
      wordInPlayArray[i],
      positionInfo
    );

    checkPositionForText(
      "right",
      rightwardPosition,
      wordInPlayArray[i],
      positionInfo
    );
    console.log("positionInfo after undecided: ", positionInfo);
    console.log("wordsInPlay before: ", wordsInPlay);
    wordsInPlay.push(positionInfo);
    console.log("wordsInPlay after: ", wordsInPlay);
  }
  createVerticalAndHorizontalWords(wordsInPlay);
  console.log("wordsInPlay: ", wordsInPlay);

  //! causing loop when uncommented and only one letter is placed
  determineDirection(wordsInPlay);
}

let counter = 0;
function createVerticalAndHorizontalWords(wordsInPlay) {
  counter++;
  console.log("counter: ", counter);
  console.log("wordsInPlay: ", wordsInPlay);

  for (let i = 0; i < wordsInPlay.length; i++) {
    if (wordsInPlay[i].horizontal === undefined) {
      wordsInPlay[i].horizontal = [];
    }
    if (wordsInPlay[i].vertical === undefined) {
      wordsInPlay[i].vertical = [];
    }

    //! This might break something...
    // if (wordsInPlay[i].right.length > 1 && wordsInPlay[i].left.length > 1) {
    if (wordsInPlay[i].right.length > 1 || wordsInPlay[i].left.length > 1) {
      // console.log(wordsInPlay[i].right)
      wordsInPlay[i].horizontal = new Set([
        ...wordsInPlay[i].right,
        ...wordsInPlay[i].left,
      ]);
    }

    //! This might break something...

    // if (wordsInPlay[i].up.length > 1 && wordsInPlay[i].down.length > 1) {
    if (wordsInPlay[i].up.length > 1 || wordsInPlay[i].down.length > 1) {
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
    console.log("wordsInPlay: ", wordsInPlay);
  }
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
