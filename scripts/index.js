import {dictionary} from "../Dictionary/dictionary.js"

console.log(dictionary.length)
localStorage.setItem("dictionary",dictionary)

let inputFieldForP1Name = document.getElementById("inputFieldForP1Name");
let inputFieldForP2Name = document.getElementById("inputFieldForP2Name");
let submitNameButton = document.getElementById("submitNameButton");
localStorage.setItem("scrabblePlayerOneName", "");
localStorage.setItem("scrabblePlayerTwoName", "");

submitNameButton.addEventListener("click", () => {
        let player1Name = inputFieldForP1Name.value;
        let player2Name = inputFieldForP2Name.value;
          // console.log(player1Name);
          // console.log(player2Name);
        localStorage.setItem("scrabblePlayerOneName", player1Name);
        localStorage.setItem("scrabblePlayerTwoName", player2Name);
        location.href = "./gameBoard.html";
});

// function submitName(yourNameHere) {
//   saveName();
//   location.href = "./gameBoard.html";
// }

