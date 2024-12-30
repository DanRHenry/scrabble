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
let tradeInLettersButton = document.getElementById("tradeInLetters");
let verticalInput = document.getElementById("verticalInput");
let verticalSubmitBTN = document.getElementById("verticalSubmitButton");
let horizontalInput = document.getElementById("horizontalInput");
let horizontalSubmitBTN = document.getElementById("horizontalSubmitButton");
let gameGridBox = document.getElementsByClassName("gameGridBox");
let playerOneScoreName = document.getElementById("p1Name");
let playerTwoScoreName = document.getElementById("p2Name");
let p1Score = document.getElementById("p1Score");
let p2Score = document.getElementById("p2Score");

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
        localStorage.scrabblePlayerOneName[localStorage.scrabblePlayerOneName.length - 1] == "s"
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
        localStorage.scrabblePlayerTwoName[localStorage.scrabblePlayerTwoName.length - 1] == "s"
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
function pullLettersFromLetterBag(){
    while (playableLetters.length < 7) {
        let randomLetterNumber = Math.floor(Math.random() *letterBag.length);
        playableLetters.push(letterBag[randomLetterNumber]);
        letterBag.splice(randomLetterNumber, 1); 
    }
    for (let i=0; i<=6; i++) {
        let id = document.getElementById(i);
        let letterToReplace = id.innerText
        id.innerText = id.innerText.replace (letterToReplace, playableLetters[i]);
    }
}

function tradeInLetters() {
    tradeInLettersButton.addEventListener("click", returnLettersToLetterbag)
    function returnLettersToLetterbag() {
        letterBag.push(...playableLetters)
        playableLetters = []
        pullLettersFromLetterBag();
    }
}

function putLettersInTheGameGridBoxes(){
    while (playableLetters.length < 7) {
        let randomLetterNumber = Math.floor(Math.random() *letterBag.length);
        playableLetters.push(letterBag[randomLetterNumber]);
        letterBag.splice(randomLetterNumber, 1); 
    }
    for (let i=0; i<=6; i++) {
        let id = document.getElementById(i);
        let letterToReplace = id.innerText
        id.innerText = id.innerText.replace (letterToReplace, playableLetters[i]);
    }
}

function submitVerticalAnswer() {
    activeBox
    // console.log (verticalInput.value);
    activeWord = verticalInput.value;
    checkVerticalWord()
}

function submitHorizontalAnswer() {
    console.log (horizontalInput.value);
    activeWord = verticalInput.value;
}

function gameGridBoxAddEventListeners () {
    for (let i = 0; i < gameGridBox.length; i++) { // Grabbing the index from the given box on the gameboard
        gameGridBox[i].addEventListener('click', () => {
            // console.log(`placing letter in position: ${i}`)
            activeBox = i;
            console.log("ActiveBoxisNow", activeBox);
        }, false);
    }
}

//! Work on this section...
function checkVerticalWord() {
    let gameBoardPosition = activeBox; // added to maintain the original activeBox location while placing letters
    if (activeBox + (activeWord.length*15) < 224) {
            let tempWord = "";
            for (let i = 0; i < activeWord.length; i++) {
            if (activeWord[i] != gameBoardPosition || activeWord[i] != "*" || gameGridBox.value != undefined)
            return false
            else {
                tempWord += activeWord[i];
                gameBoardPosition + 15;
            }
        }
        console.log(tempWord);
    }
}

//!---------------------------------------------- Event Listeners ----------------------------------------------------
verticalSubmitBTN.addEventListener("click", submitVerticalAnswer)
horizontalSubmitBTN.addEventListener("click", submitHorizontalAnswer)


getNamesAndScoreboardInfo()
fillLetterBag()
pullLettersFromLetterBag();
tradeInLetters();
putLettersInTheGameGridBoxes()
gameGridBoxAddEventListeners()

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
