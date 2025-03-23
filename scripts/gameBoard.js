//!---------------------------------------------------- DOM Variables -------------------------------------------------------------
const gameGrid = document.getElementsByClassName("gameGridBox");
const horizontalBtn = document.getElementById("horizontalBtn");
const inputCancelBtn = document.getElementById("inputCancelBtn");
const inputField = document.getElementById("inputField");
let p1Score = document.getElementById("p1Score");
let p2Score = document.getElementById("p2Score");
let playerOneScoreName = document.getElementById("p1Name");
const playerTiles = document.getElementsByClassName("playerTiles");
let playerTwoScoreName = document.getElementById("p2Name");
const submitBtn = document.getElementById("submitBtn");
let tradeInLettersButton = document.getElementById("tradeInLetters");
const verticalBtn = document.getElementById("verticalBtn");
const activePlayerDisplay = document.getElementById("activePlayerDisplay");

//!----------------------------------------------------- Global Arrays -------------------------------------------------------------

const dictionary = localStorage.dictionary.split(",");
let letterBag = [];
let playableLetters = [];
const tempCoordinates = [];
let wordInPlayArray = [];
let originalPlayedTiles = [];
let wordToTestArray = [];

//!---------------------------------------------------- Global Objects ------------------------------------------------------------

const letterPoints = {
  a: 1,
  b: 3,
  c: 3,
  d: 2,
  e: 1,
  f: 4,
  g: 2,
  h: 4,
  i: 1,
  j: 8,
  k: 5,
  l: 1,
  m: 3,
  n: 1,
  o: 1,
  p: 3,
  q: 10,
  r: 1,
  s: 1,
  t: 1,
  u: 1,
  v: 4,
  w: 4,
  x: 8,
  y: 4,
  z: 10,
  "*": 0,
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
  //stars are doubleWord
};

let playerOneObject = {
  name: "",
  score: 0,
  tiles: [],
};

let playerTwoObject = {
  name: "",
  score: 0,
  tiles: [],
};

//!-------------------------------------------------- Global Values ------------------------------------------------------------

let activeBox = 112; // Gameboard Starting Position
let startingBox = activeBox;
let scrabblePlayerOneName;
let scrabblePlayerTwoName;
let activePlayer = Math.floor(Math.random() * 2);

let skippedDirection;

let direction = "horizontal";
// let direction = "vertical";

gameGrid[activeBox].style.opacity = ".5";

function updateScoreboard() {
  p1Score.textContent = playerOneObject.score;
  p2Score.textContent = playerTwoObject.score;
}

updateScoreboard();

function switchPlayers() {
  if (activePlayer === 0) {
    activePlayer = 1;
    activePlayerDisplay.textContent = `${playerTwoPossessiveName} turn`;
  } else if (activePlayer === 1) {
    activePlayer = 0;
    activePlayerDisplay.textContent = `${playerOnePossessiveName} turn`;
  }
  pullLettersFromLetterBag();
  putLettersInTheGameGridBoxes();
}

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
    setDirectionalBtnStyling();
  } else if (direction === "vertical") {
    direction = "horizontal";
    setDirectionalBtnStyling();
  }
}

function moveActiveBoxLeft() {
  if (activeBox % 15 > 0) {
    gameGrid[activeBox].style.opacity = "";
    activeBox--;
    startingBox = activeBox;
    gameGrid[activeBox].style.opacity = ".5";
  }
}

function moveActiveBoxRight() {
  if (activeBox % 15 < 14) {
    gameGrid[activeBox].style.opacity = "";
    activeBox++;
    startingBox = activeBox;
    gameGrid[activeBox].style.opacity = ".5";
  }
}

function moveActiveBoxDown() {
  if (activeBox + 15 <= gameGrid.length - 1) {
    gameGrid[activeBox].style.opacity = "";
    activeBox += 15;
    startingBox = activeBox;
    gameGrid[activeBox].style.opacity = ".5";
  }
}

function moveActiveBoxUp() {
  if (activeBox - 15 >= 0) {
    gameGrid[activeBox].style.opacity = "";
    activeBox -= 15;
    startingBox = activeBox;
    gameGrid[activeBox].style.opacity = ".5";
  }
}
//! ----------------------------------------------------- Functions ---------------------------------------------------------------

function fillLetterBag() {
  letterBag = [];
  for (let i = 0; i < 1; i++) {
    letterBag.push("j");
    letterBag.push("k");
    letterBag.push("q");
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
  randomizeLetterBag(letterBag);
}

function randomizeLetterBag(letterBag) {
  for (let index = letterBag.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [letterBag[index], letterBag[randomIndex]] = [
      letterBag[randomIndex],
      letterBag[index],
    ];
  }
}

let playerOnePossessiveName;
let playerTwoPossessiveName;
function getNamesAndScoreboardInfo() {
  if (localStorage.scrabblePlayerOneName != "") {
    if (
      localStorage.scrabblePlayerOneName[
        localStorage.scrabblePlayerOneName.length - 1
      ] == "s"
    ) {
      playerOnePossessiveName = `${localStorage.scrabblePlayerOneName}'`;

      playerOneScoreName.innerText = `${localStorage.scrabblePlayerOneName}' Score:`;
      scrabblePlayerOneName = `${localStorage.scrabblePlayerOneName}'`;
    } else {
      playerOnePossessiveName = `${localStorage.scrabblePlayerOneName}'s`;

      playerOneScoreName.innerText = `${localStorage.scrabblePlayerOneName}'s Score:`;
      scrabblePlayerOneName = `${localStorage.scrabblePlayerOneName}'s`;
    }
  } else {
    playerOnePossessiveName = "Player 1's";
    playerOneScoreName.innerText = "Player 1's Score";
    scrabblePlayerOneName = "Player 1's";
  }

  if (localStorage.scrabblePlayerTwoName != "") {
    if (
      localStorage.scrabblePlayerTwoName[
        localStorage.scrabblePlayerTwoName.length - 1
      ] == "s"
    ) {
      playerTwoPossessiveName = `${localStorage.scrabblePlayerTwoName}'`;
      playerTwoScoreName.innerText = `${localStorage.scrabblePlayerTwoName}' Score:`;
      scrabblePlayerTwoName = `${localStorage.scrabblePlayerTwoName}'`;
    } else {
      playerTwoPossessiveName = `${localStorage.scrabblePlayerTwoName}'s`;
      playerTwoScoreName.innerText = `${localStorage.scrabblePlayerTwoName}'s Score:`;
      scrabblePlayerTwoName = `${localStorage.scrabblePlayerTwoName}'s`;
    }
  } else {
    playerTwoPossessiveName = "Player 2's";
    playerTwoScoreName.innerText = "Player 2's Score:";
    scrabblePlayerTwoName = "Player 2's";
  }
}

function pullLettersFromLetterBag() {
  if (letterBag.length === 0) {
    const endgameBtn = document.createElement("button");
    endgameBtn.id = "endgameBtn";
    endgameBtn.innerText = "End Game?";
    endgameBtn.addEventListener("click", () => {
      if (
        parseInt(document.getElementById("p1Score").textContent) >
        parseInt(document.getElementById("p2Score").textContent)
      ) {
        document.getElementById("activePlayerDisplay").textContent = `${
          document.getElementById("p1Name").textContent
        } is ahead. Subtract letters to see who wins.`;
      } else {
        document.getElementById("activePlayerDisplay").textContent = `${
          document.getElementById("p2Name").textContent
        } is ahead. Subtract letters to see who wins.`;
      }
    });
    if (!document.getElementById("endgameBtn")) {
      submitBtn.after(endgameBtn);
    }
  }
  // console.log("activePlayer: ",activePlayer)
  // playerOneObject.tiles = ["t", "e", "s", "*", "c", "a", "t"];
  // playerTwoObject.tiles = ["d", "e", "s", "*", "c", "a", "t"];

  randomizeLetterBag(letterBag);
  while (playerOneObject.tiles.length < 7 && letterBag.length > 0) {
    if (letterBag.length > 0) {
      let randomLetterIndex = Math.floor(Math.random() * letterBag.length);
      playerOneObject.tiles.push(letterBag[randomLetterIndex]);

      letterBag.splice(randomLetterIndex, 1);
    }
  }
  randomizeLetterBag(letterBag);
  while (playerTwoObject.tiles.length < 7 && letterBag.length > 0) {
    if (letterBag.length > 0) {
      let randomLetterIndex = Math.floor(Math.random() * letterBag.length);
      playerTwoObject.tiles.push(letterBag[randomLetterIndex]);

      letterBag.splice(randomLetterIndex, 1);
    }
  }
  if (activePlayer === 0) {
    playableLetters = playerOneObject.tiles;
  } else if (activePlayer === 1) {
    playableLetters = playerTwoObject.tiles;
  }
}

function tradeInLetters() {
  letterBag.push(...playableLetters);
  if (activePlayer === 0) {
    playerOneObject.tiles = [];
  }
  if (activePlayer === 1) {
    playerTwoObject.tiles = [];
  }
  pullLettersFromLetterBag();
  putLettersInTheGameGridBoxes();
  switchPlayers();
}

function putLettersInTheGameGridBoxes() {
  const limit = playableLetters.length;
  for (let i = 0; i < limit; i++) {
    const letter = document.getElementsByClassName("letter")[i];
    const letterPoint = document.getElementsByClassName("letterPoints")[i];

    letter.innerText = playableLetters[i];
    letterPoint.innerText = letterPoints[playableLetters[i]];
  }
}

//!---------------------------------------------- Event Listeners ----------------------------------------------------

function gameGridBoxAddEventListeners() {
  for (let i = 0; i < gameGrid.length; i++) {
    gameGrid[i].addEventListener(
      "click",
      () => {
        activeBox = i;
        startingBox = activeBox;
        for (let space of gameGrid) {
          space.style.opacity = "";
        }
        gameGrid[activeBox].style.opacity = ".5";
      },
      false
    );
  }
}

horizontalBtn.addEventListener("mousedown", () => {
  direction = "horizontal";
  setDirectionalBtnStyling();
});

verticalBtn.addEventListener("mousedown", () => {
  direction = "vertical";
  setDirectionalBtnStyling();
});

tradeInLettersButton.addEventListener("click", tradeInLetters);

function addPlayerTileEventListeners() {
  for (let i = 0; i < playerTiles.length; i++) {
    wordInPlayArray = [];

    playerTiles[i].addEventListener("click", handlePlayerTileClick);

    function handlePlayerTileClick() {
      let textContent =
        document.getElementsByClassName("letter")[i].textContent;
      console.log(textContent);
      if (textContent.length === 1) {
        lookForBoxesToSkip(i, textContent);
        originalPlayedTiles.push(activeBox);
        playableLetters.splice(playableLetters.indexOf(textContent), 1);

        document.getElementsByClassName("letter")[i].textContent = "";
        document.getElementsByClassName("letterPoints")[i].textContent = "";
      }
    }
  }
}

addPlayerTileEventListeners();
//todo add a drag event listener to move letters from one tile location to another

function lookForBoxesToSkip(index, letter) {
  if (letter === "*") {
    //todo add logic to save the wildcard property
    letter = prompt("Pick a Letter")[0].toLowerCase();
  }
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
        skippedDirection = "vertical";
      } else if (nextBox - activeBox === 1) {
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
    if (activeBoxLocation.textContent.length < 1) {
      activeBoxLocation.textContent = letter;
      wordInPlayArray.push(activeBox);
    }
  }
}

inputCancelBtn.addEventListener("click", cancelTilePlacement);

function cancelTilePlacement() {
  originalPlayedTiles = Array.from(originalPlayedTiles);

  for (let i = 0; i < originalPlayedTiles.length; i++) {
    playableLetters.push(gameGrid[originalPlayedTiles[i]].textContent);
    gameGrid[originalPlayedTiles[i]].textContent = "";
  }
  wordInPlayArray = [];
  originalPlayedTiles = [];
  putLettersInTheGameGridBoxes();
  activeBox = startingBox;
  skippedDirection = undefined;
  addPlayerTileEventListeners();
}

submitBtn.addEventListener("click", clickedSubmitBtn);

function clickedSubmitBtn() {
  originalPlayedTiles = new Set([...originalPlayedTiles]);

  if (
    checkDictionaryForWordsInPlay(
      createWordsInPlay(wordInPlayArray, originalPlayedTiles)
    )
  ) {
    switchPlayers();
  }

  wordInPlayArray = [];
  originalPlayedTiles = [];
  skippedDirection = undefined;
  pullLettersFromLetterBag();
}

document.addEventListener("keypress", function (event) {
  let playerTiles = document.getElementsByClassName("letter");
  let key = event.key || event.keyCode;
  let tiles = [];
  for (let i = 0; i < playerTiles.length; i++) {
    tiles.push(playerTiles[i].textContent);
  }
  if (tiles.includes(key.toLowerCase())) {
    lookForBoxesToSkip(tiles.indexOf(key.toLowerCase()), key);

    originalPlayedTiles.push(activeBox);
    playerTiles[tiles.indexOf(key)].textContent = "";
    document.getElementsByClassName("letterPoints")[
      tiles.indexOf(key)
    ].textContent = "";
    tiles = [];

    playableLetters.splice(playableLetters.indexOf(key.toLocaleLowerCase()), 1);
    for (let i = 0; i < playerTiles.length; i++) {
      tiles.push(playerTiles[i].textContent);
    }
  }
  if (key === "Enter") {
    clickedSubmitBtn();
  }
  if (key === " ") {
    switchDirections();
    setDirectionalBtnStyling();
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

function createWordsInPlay(wordInPlayArray) {
  if (!gameGrid[112].textContent.length > 0 && !wordInPlayArray.includes(112)) {
    console.log("place word on star");
    cancelTilePlacement();
  }
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
        !gameGrid[wordInPlayArray[0] - 1]?.textContent.length > 0) ||
      (wordInPlayArray[wordInPlayArray.length - 1] % 15 < 15 &&
        !gameGrid[wordInPlayArray[wordInPlayArray.length - 1 + 1]]?.textContent
          .length > 0)
    ) {
      if (
        !gameGrid[wordInPlayArray[0] - 1]?.textContent.length > 0 ||
        !gameGrid[wordInPlayArray[wordInPlayArray.length - 1] + 1]?.textContent
          .length > 0
      ) {
        for (let index of wordInPlayArray) {
          playedWord += gameGrid[index].textContent;
        }
      }
    }
  }

  let temp = "";

  for (let letterIndex of wordInPlayArray) {
    temp += gameGrid[letterIndex].textContent;
  }

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

    wordsInPlay.push(positionInfo);

    createVerticalAndHorizontalWords(wordsInPlay);
  }

  return wordsInPlay;
}
function checkDictionaryForWordsInPlay(wordsInPlay) {
  let runningTotal = 0;
  let collection = [];
  if (originalPlayedTiles.size === 7) {
    runningTotal += 50;
  }
  const otArray = Array.from(originalPlayedTiles);

  let wordsCollection = [];

  let disconnected = true;

  for (let i = 0; i < wordsInPlay.length; i++) {
    let wordsArray = Object.values(wordsInPlay[i]);
    wordsArray.forEach((index) => {
      wordsCollection.push(...index);
    });

    for (let i = 0; i < wordsCollection.length; i++) {
      if (!otArray.includes(wordsCollection[i])) {
        disconnected = false;
      }
    }
  }

  if (!otArray.includes(112) || gameGrid[112].textContent.length === 0) {
    if (disconnected === true) {
      cancelTilePlacement();
    }
  }

  if (skippedDirection !== undefined) {
    for (let node of wordsInPlay) {
      if (skippedDirection === "horizontal") {
        let horiz = "";
        let horizNums = [];

        for (let letter of node.horizontal) {
          horiz += gameGrid[letter].textContent;
          horizNums.push(letter);
        }

        if (!searchDictionary(horiz)) {
          console.log(`horizontal word, ${horiz}, was not found`);
          cancelTilePlacement();
          return false;
        }

        collection.push(horizNums);

        if (node.vertical.length > 0) {
          let temp = "";
          let subVert = [];
          for (let letter of otArray) {
            if (node.vertical.includes(letter)) {
              for (let letter of node.vertical) {
                temp += gameGrid[letter].textContent;
                subVert.push(letter);
              }
            }
          }
          if (temp.length > 0) {
            if (!searchDictionary(temp)) {
              console.log(`vertical word, ${temp} was not found`);
              cancelTilePlacement();
              return false;
            }
            if (searchDictionary(temp)) {
              console.log(`vertical word, ${temp} was found!`);
              console.log("secondary vertical: ", temp);
              console.log("subVert:", subVert);
              collection.push(subVert);
            }
          }
        }
      } else if (skippedDirection === "vertical") {
        let vert = "";
        let vertNums = [];

        for (let letter of node.vertical) {
          vert += gameGrid[letter].textContent;
          vertNums.push(letter);
        }

        if (!searchDictionary(vert)) {
          console.log(`vertical word, ${vert}, was not found`);
          cancelTilePlacement();
          return false;
        }

        collection.push(vertNums);

        if (node.horizontal.length > 0) {
          let temp = "";
          let subHoriz = [];
          for (let letter of otArray) {
            if (node.horizontal.includes(letter)) {
              for (let letter of node.horizontal) {
                temp += gameGrid[letter].textContent;
                subHoriz.push(letter);
              }
            }
          }
          console.log(temp);
          if (temp.length > 0) {
            if (!searchDictionary(temp)) {
              console.log(`horizontal word, ${temp} was not found`);
              cancelTilePlacement();
              return false;
            }
            if (searchDictionary(temp)) {
              console.log(`horizontal word, ${temp} was found!`);
              collection.push(subHoriz);
            }
          }
        }
      }
    }
  }
  if (skippedDirection === undefined) {
    for (let node of wordsInPlay) {
      if (node.horizontal.length > 0 && node.vertical.length > 0) {
        if (!checkWords(node, "horizontal") || !checkWords(node, "vertical")) {
          // console.log(node, "not found");
          cancelTilePlacement();
          return false;
        }
      } else if (node.vertical.length > 0) {
        if (!checkWords(node, "vertical")) {
          // console.log(node, "not found");
          cancelTilePlacement();
          return false;
        }
      } else if (node.horizontal.length > 0) {
        if (!checkWords(node, "horizontal")) {
          // console.log(node, "not found");
          cancelTilePlacement();
          return false;
        }
      }

      collection.push(node["horizontal"]);
      collection.push(node["vertical"]);
    }
  }

  function checkWords(node, direction) {
    let temp = "";

    for (let letter of node[direction]) {
      temp += gameGrid[letter].textContent;
    }

    if (temp && searchDictionary(temp) === false) {
      return false;
    } else if (temp && searchDictionary(temp) === true) {
      return true;
    }
  }

  let tempArr = [];
  for (let i = 0; i < collection.length; i++) {
    for (let j = 0; j < collection[i].length; j++) {
      tempArr.push(collection[i][j]);
    }
  }

  collection = new Set([...tempArr]);
  collection = Array.from(collection);

  let wordMultiplier = 1;
  for (let i = 0; i < collection.length; i++) {
    let multiplier = gameGrid[collection[i]].classList[1];
    if (gameGrid[collection[i]].classList[1] !== "standardSquare") {
      gameGrid[collection[i]].classList.remove(
        gameGrid[collection[i]].classList[1]
      );
      gameGrid[collection[i]].classList.add("standardSquare");
    }
    let letter = gameGrid[collection[i]].textContent;

    if (multiplier === "tripleWord") {
      wordMultiplier = 3;
    } else if (
      (multiplier === "doubleWord" || multiplier === "star") &&
      wordMultiplier < 3
    ) {
      wordMultiplier = 2;
    }

    runningTotal += letterPoints[letter] * squareTypes[multiplier];
  }
  runningTotal *= wordMultiplier;

  if (activePlayer === 0) {
    playerOneObject.score += runningTotal;
  } else if (activePlayer === 1) {
    playerTwoObject.score += runningTotal;
  }

  updatePlayerScores();
  wordsInPlay = [];
  pullLettersFromLetterBag();
  putLettersInTheGameGridBoxes();
  return runningTotal;
}

//!------------------------------------------------------------------------------

function updatePlayerScores() {
  if (activePlayer === 0) {
    p1Score.textContent = playerOneObject.score;
  } else if (activePlayer === 1) {
    p2Score.textContent = playerTwoObject.score;
  }
}

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
    if (
      gameGrid[position] &&
      gameGrid[position].textContent &&
      !positionInfo[direction].includes(position)
    ) {
      positionInfo[direction].push(position);

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

function createVerticalAndHorizontalWords(wordsInPlay) {
  for (let i = 0; i < wordsInPlay.length; i++) {
    if (wordsInPlay[i].horizontal === undefined) {
      wordsInPlay[i].horizontal = [];
    }
    if (wordsInPlay[i].vertical === undefined) {
      wordsInPlay[i].vertical = [];
    }

    if (wordsInPlay[i].right.length > 1 || wordsInPlay[i].left.length > 1) {
      wordsInPlay[i].horizontal = new Set([
        ...wordsInPlay[i].right,
        ...wordsInPlay[i].left,
      ]);
    }

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
  }
}

getNamesAndScoreboardInfo();
fillLetterBag();
tradeInLetters();
gameGridBoxAddEventListeners();
