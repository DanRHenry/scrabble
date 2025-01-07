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

//!---------------------------------------------------- DOM Variables -------------------------------------------------------------
const playerTiles = document.getElementsByClassName("playerTiles");
let tradeInLettersButton = document.getElementById("tradeInLetters");
const inputField = document.getElementById("inputField");
const submitBtn = document.getElementById("submitBtn");
const inputClearBtn = document.getElementById("inputClearBtn");
// const reorientBtn = document.getElementById("reorientBtn");
const horizontalBtn = document.getElementById("horizontalBtn");
const verticalBtn = document.getElementById("verticalBtn");
const tempCoordinates = [];
let wordInPlayArray = [];

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
horizontalBtn.style.backgroundColor = "lightgray";
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

  //   p1Score.textContent = player1Score;
  //   p2Score.textContent = player2Score;
  activePlayer = playerOnesName;
}

// Populate Playable Letter Array with randomLetter from letterBag and remove letters used from the letterBag
function pullLettersFromLetterBag() {
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

function tradeInLetters() {
  tradeInLettersButton.addEventListener("click", returnLettersToLetterbag);
  function returnLettersToLetterbag() {
    letterBag.push(...playableLetters);
    playableLetters = [];
    pullLettersFromLetterBag();
  }
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
        // console.log("ActiveBoxisNow", activeBox);
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

horizontalBtn.addEventListener("click", () => {
  direction = "horizontal";
  horizontalBtn.style.backgroundColor = "lightgray";
  verticalBtn.style.backgroundColor = "";
});

verticalBtn.addEventListener("click", () => {
  direction = "vertical";
  horizontalBtn.style.backgroundColor = "";
  verticalBtn.style.backgroundColor = "lightgray";
});

for (let i = 0; i < playerTiles.length; i++) {
  playerTiles[i].addEventListener("click", () => {
    inputField.textContent += playerTiles[i].textContent;

    const directions = {
      vertical: 15,
      horizontal: 1,
    };
    let offsetForExistingLetters = 0;

    for (
      let inputFieldIndex = 0;
      inputFieldIndex <
      inputField.textContent.length + offsetForExistingLetters;
      inputFieldIndex++
    ) {
      let activeBoxLocation =
        document.getElementsByClassName("gameGridBox")[
          activeBox +
            inputFieldIndex * directions[direction] +
            offsetForExistingLetters * directions[direction]
        ];
      if (direction === "vertical" && activeBoxLocation === undefined) {
        const temp = inputField.textContent.slice([
          inputField.textContent.length - 1,
        ]);
        playerTiles[i].textContent = temp;

        inputField.textContent = inputField.textContent.slice(0, -1);

        break;
      } else if (
        direction === "horizontal" &&
        +(
          activeBoxLocation.id[activeBoxLocation.id.length - 1] == 0 &&
          activeBoxLocation.id[activeBoxLocation.id.length - 2] == 0 &&
          tempCoordinates.length > 0
        )
      ) {
        const temp = inputField.textContent.slice([
          inputField.textContent.length - 1,
        ]);

        playerTiles[i].innerText = temp;

        inputField.textContent = inputField.textContent.slice(0, -1);

        break;
      }

      if (
        inputFieldIndex ===
        tempCoordinates.length - offsetForExistingLetters
      ) {
        if (activeBoxLocation.textContent.length > 0) {
          offsetForExistingLetters++;
          wordInPlayArray.push(activeBoxLocation.id);

          activeBoxLocation =
            document.getElementsByClassName("gameGridBox")[
              activeBox +
                inputFieldIndex * directions[direction] +
                offsetForExistingLetters * directions[direction]
            ];
          wordInPlayArray.push(activeBoxLocation.id);

          activeBoxLocation.textContent =
            inputField.textContent[inputFieldIndex];
          tempCoordinates.push(activeBoxLocation.id);
        } else {
          activeBoxLocation.textContent =
            inputField.textContent[inputFieldIndex];

          tempCoordinates.push(activeBoxLocation.id);
          wordInPlayArray.push(activeBoxLocation.id);
        }
      }
      playerTiles[i].textContent = "";
    }
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
  // console.log(inputField.textContent);
  if (direction === "horizontal") {
    console.log(direction);
  } else if (direction === "vertical") {
    console.log(direction);
  }

  let wordInPlay = "";
  for (let i = 0; i < wordInPlayArray.length; i++) {
    const locationToAdd = document.getElementById(wordInPlayArray[i]);

    console.log(locationToAdd);
    wordInPlay += locationToAdd.textContent;
  }
  console.log(wordInPlay);
});

verticalSubmitBTN.addEventListener("click", submitVerticalAnswer);
// horizontalSubmitBTN.addEventListener("click", submitHorizontalAnswer);

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
