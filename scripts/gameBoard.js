//!---------------------------------------------------- DOM Variables -------------------------------------------------------------
const gameGrid = document.getElementsByClassName("gameGridBox");
const horizontalBtn = document.getElementById("horizontalBtn");
const inputClearBtn = document.getElementById("inputClearBtn");
const inputField = document.getElementById("inputField");
let p1Score = document.getElementById("p1Score");
let p2Score = document.getElementById("p2Score");
let playerOneScoreName = document.getElementById("p1Name");
const playerTiles = document.getElementsByClassName("playerTiles");
let playerTwoScoreName = document.getElementById("p2Name");
const submitBtn = document.getElementById("submitBtn");
let tradeInLettersButton = document.getElementById("tradeInLetters");
const verticalBtn = document.getElementById("verticalBtn");

//!----------------------------------------------------- Global Arrays -------------------------------------------------------------

const dictionary = localStorage.dictionary.split(",");
let letterBag = [];
let playableLetters = [];
const tempCoordinates = [];
let wordInPlayArray = [];
let originalPlayedTiles = [];
let wordToTestArray = [];

//!---------------------------------------------------- Global Objects ------------------------------------------------------------

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
  //stars are doubleWord
};

//!-------------------------------------------------- Global Values ------------------------------------------------------------

let activeBox = 112; // Gameboard Starting Position
let scrabblePlayerOneName;
let scrabblePlayerTwoName;
let activePlayer;
let skippedDirection;

let direction = "horizontal";
// let direction = "vertical";

gameGrid[activeBox].style.opacity = ".5";

function searchDictionary(wordToFind) {
  if (dictionary.find((word) => word === wordToFind)) {
    return true;
  } else {
    return false;
  }
}

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
  // fill the playableLetters array with random letters from the letterBag
  while (letterBag.length > 0 && playableLetters.length < 7) {
    let randomLetterIndex = Math.floor(Math.random() * letterBag.length);
    playableLetters.push(letterBag[randomLetterIndex]);
    letterBag.splice(randomLetterIndex, 1);
  }
  // console.log("playableLetters: ",playableLetters)
}

function tradeInLetters() {
  letterBag.push(...playableLetters);
  playableLetters = ["t", "e", "s", "t", "e", "a", "t"];
  // playableLetters = []
  pullLettersFromLetterBag();
  putLettersInTheGameGridBoxes();
}

function putLettersInTheGameGridBoxes() {
  // place letters from the playableLetters array into the game page
  const limit = playableLetters.length;
  for (let i = 0; i < limit; i++) {
    //todo change the IDs for letter tiles on the gameboard to something more descriptive
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
        // console.log("gridLocation: ", i);
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
  playerTiles[i].addEventListener("click", () => {
    originalPlayedTiles.push(activeBox);
    console.log("originalPlayedTiles: ", originalPlayedTiles);
    lookForBoxesToSkip(i, playerTiles[i].textContent);
  });
}

function lookForBoxesToSkip(index, letter) {
  // console.log("direction: ", direction);
  // console.log("activeBox: ", activeBox);
  let activeBoxLocation =
    document.getElementsByClassName("gameGridBox")[activeBox];
  const nextBox = activeBox + adjacentDirections[direction];
  if (activeBox % 15 < nextBox % 15 || activeBox % 15 === nextBox % 15) {
    if (!activeBoxLocation) {
      console.log("undefined square");
    } else if (activeBoxLocation.textContent.length > 0) {
      if (!wordInPlayArray.includes(activeBox)) {
        wordInPlayArray.push(activeBox);
      }
      if (nextBox - activeBox === 15) {
        // console.log("vertical")
        skippedDirection = "vertical";
      } else if (nextBox - activeBox === 1) {
        // console.log("horizontal")
        skippedDirection = "horizontal";
      }

      activeBox = nextBox;
      lookForBoxesToSkip(index, letter);
    } else {
      activeBoxLocation.textContent = letter;
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
      activeBoxLocation.textContent = playerTiles[index].textContent;
      wordInPlayArray.push(activeBox);
    }
  }
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
  originalPlayedTiles = new Set([...originalPlayedTiles]);
  console.log("direction", skippedDirection);
  console.log("originalPlayedTiles: ", originalPlayedTiles);

  checkDictionaryForWordsInPlay(
    createWordsInPlay(wordInPlayArray, originalPlayedTiles)
  );

  wordInPlayArray = [];
  originalPlayedTiles = [];
  pullLettersFromLetterBag();
  putLettersInTheGameGridBoxes();
}

document.addEventListener("keydown", function (event) {
  let key = event.key || event.keyCode;
  // console.log("key: ",key)
  let tiles = [];
  for (let i = 0; i < playerTiles.length; i++) {
    tiles.push(playerTiles[i].textContent);
  }
  if (tiles.includes(key.toLowerCase())) {
    // console.log(key.toLocaleLowerCase());
    // console.log(tiles)
    lookForBoxesToSkip(tiles.indexOf(key.toLowerCase()), key);
    originalPlayedTiles.push(activeBox);
    // console.log("originalPlayedTiles: ", originalPlayedTiles);

    playerTiles[tiles.indexOf(key)].textContent = "";
    tiles = [];
    playableLetters.splice(playableLetters.indexOf(key.toLocaleLowerCase()), 1);
    for (let i = 0; i < playerTiles.length; i++) {
      tiles.push(playerTiles[i].textContent);
    }
    // console.log(tiles);
    // console.log("playableLetters: ", playableLetters);
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

function createWordsInPlay(wordInPlayArray, originalPlayedTiles) {
  let playedWord = "";

  if (skippedDirection === "horizontal") {
    if (
      (wordInPlayArray[0] - (1 % 15) >= 0 &&
        !gameGrid[wordInPlayArray[0] - 1].textContent.length > 0) ||
      (wordInPlayArray[wordInPlayArray.length - 1] + (1 % 15) < 15 &&
        !gameGrid[wordInPlayArray[wordInPlayArray.length - 1 + 1]].textContent
          .length > 0)
    ) {
      if (
        !gameGrid[wordInPlayArray[0] - 1].textContent.length > 0 ||
        !gameGrid[wordInPlayArray[wordInPlayArray.length - 1] + 1].textContent
          .length > 0
      ) {
        for (let index of wordInPlayArray) {
          playedWord += gameGrid[index].textContent;
        }
      }
    }
  }

  if (skippedDirection === "vertical") {
    if (
      (wordInPlayArray[0] % 15 >= 0 &&
        !gameGrid[wordInPlayArray[0] - 1].textContent.length > 0) ||
      (wordInPlayArray[wordInPlayArray.length - 1] % 15 < 15 &&
        !gameGrid[wordInPlayArray[wordInPlayArray.length - 1 + 1]].textContent
          .length > 0)
    ) {
      if (
        !gameGrid[wordInPlayArray[0] - 1].textContent.length > 0 ||
        !gameGrid[wordInPlayArray[wordInPlayArray.length - 1] + 1].textContent
          .length > 0
      ) {
        for (let index of wordInPlayArray) {
          playedWord += gameGrid[index].textContent;
        }
      }
    }
  }

  // if (searchDictionary(playedWord) == false) {
  //   console.log(playedWord, "was not found in the dictionary.");
  //   return searchDictionary(playedWord);
  // }
  // This function takes in the array of the played word (tiles originally placed, and existing letters from the board)

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

  return wordsInPlay;
}
let counter = 0;
function checkDictionaryForWordsInPlay(wordsInPlay) {
  const otArray = Array.from(originalPlayedTiles)

  console.log("wordsInPlay: ", wordsInPlay);
  console.log(typeof skippedDirection, skippedDirection);

  console.log(skippedDirection);
  if (skippedDirection !== undefined) {
    console.log("vertical & horizontal check section");
    for (let node of wordsInPlay) {
      counter ++
      console.log(counter)
      if (skippedDirection === "horizontal") {
        let horiz = ""
        for (let letter of node.horizontal) {

            horiz+= gameGrid[letter].textContent

        }
        console.log("horizontal word: ",horiz)
        if (!searchDictionary(horiz)) {
          console.log(`horizontal word, ${horiz}, was not found`)
          return false
        } 

        if (node.vertical.length > 0) {
          let temp = ""
          for (let letter of otArray) {
            if (node.vertical.includes(letter)) {
              for (let letter of node.vertical) {
                temp += gameGrid[letter].textContent
              }
          }
        }
          console.log(temp)
          if (temp.length > 0) {
          if (!searchDictionary(temp)) {
            console.log(`vertical word, ${temp} was not found`)
            return false;
          }
          if (searchDictionary(temp)) {
            console.log(`vertical word, ${temp} was found!`)
          }
        }
        }
      }
      else if (skippedDirection === "vertical") {

        let vert = ""
        for (let letter of node.vertical) {

            vert+= gameGrid[letter].textContent

        }
        console.log("verticalWord: ",vert)
        if (!searchDictionary(vert)) {
          console.log(`vertical word, ${vert}, was not found`)
          return false
        } 

        if (node.horizontal.length > 0) {
          let temp = ""
          for (let letter of otArray) {
            if (node.horizontal.includes(letter)) {
              for (let letter of node.horizontal) {
                temp += gameGrid[letter].textContent
              }
          }
        }
          console.log(temp)
          if (temp.length > 0) {
          if (!searchDictionary(temp)) {
            console.log(`horizontal word, ${temp} was not found`)
            return false;
          }
          if (searchDictionary(temp)) {
            console.log(`horizontal word, ${temp} was found!`)
          }
        }
        }
      }
    }
  }
  if (skippedDirection === undefined) {
    console.log("undefined section");
    for (let node of wordsInPlay) {
      if (!checkWords(node, "horizontal") || !checkWords(node, "vertical")) {
        console.log(node, "not found");
        return false;
      }
    }
  }

  function checkWords(node, direction) {
    let temp = "";

    for (let letter of node[direction]) {
      temp += gameGrid[letter].textContent;
    }

    if (temp && searchDictionary(temp) === false) {
      console.log(`no ${direction} word, ${temp} found`);
      console.log();
      return false;
    } else if (temp && searchDictionary(temp) === true) {
      console.log(`${direction} word, ${temp} was found in the dictionary`);
    }
  }

  wordsInPlay = [];
  return true;
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

  // checkDictionaryForWordsInPlay(wordsInPlay);
  console.log(checkDictionaryForWordsInPlay(wordsInPlay));
}

// let counter = 0;
function createVerticalAndHorizontalWords(wordsInPlay) {
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
    // console.log("wordsInPlay: ", wordsInPlay);
  }
}

getNamesAndScoreboardInfo();
fillLetterBag();
// pullLettersFromLetterBag();
// putLettersInTheGameGridBoxes()
tradeInLetters();
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
