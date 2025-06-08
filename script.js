// on the Form Page, Change Selected Marker Color Base on User Selection
const changeSlectedMarkerColorForm = (function () {
  const markerXcolor = document.querySelector(".marker-x");
  const markerOcolor = document.querySelector(".marker-o");

  markerXcolor.addEventListener("click", () => {
    if (markerXcolor.querySelector("label").classList != "selected-mark") {
      markerXcolor.querySelector("label").classList.add("selected-mark");
    } else {
      markerXcolor.querySelector("label").classList.remove("selected-mark");
    }
    if (
      markerOcolor.querySelector("label").classList.contains("selected-mark")
    ) {
      markerOcolor.querySelector("label").classList.remove("selected-mark");
      markerXcolor.querySelector("label").classList.add("selected-mark");
    }
  });

  markerOcolor.addEventListener("click", () => {
    if (markerOcolor.querySelector("label").classList != "selected-mark") {
      markerOcolor.querySelector("label").classList.add("selected-mark");
    } else {
      markerOcolor.querySelector("label").classList.remove("selected-mark");
    }
    if (
      markerXcolor.querySelector("label").classList.contains("selected-mark")
    ) {
      markerXcolor.querySelector("label").classList.remove("selected-mark");
      markerOcolor.querySelector("label").classList.add("selected-mark");
    }
  });
})();

// Global Player Details OBJECT
let players = {};

// Function for Get Players Name & Marker (form submission)
(function () {
  document.querySelector("#get-players").addEventListener("submit", (e) => {
    e.preventDefault();
    const p1name = document.querySelector(".get-player1-name").value;
    const p1marker = document.querySelector(
      'input[name="p1marker"]:checked'
    ).value;
    launchGame();
    // Sending Players Info to the Players Object
    (function () {
      players.one = { name: p1name, marker: p1marker };
      players.two = {
        name: "Computer",
        marker: p1marker.toLowerCase() === "x" ? "O" : "X",
      };
    })();
    putPlayersOnPage();
  });
  // Reset Form After Submit
  document.querySelector("#get-players").reset();
})();

// Launch Game -> Close Players Form Page and Open Game Page
function launchGame() {
  document.querySelector("#get-players").style.display = "none";
  document.querySelector(".container").style.display = "grid";
}

// This Function Displays The Players Info on Page
function putPlayersOnPage() {
  const playerOneName = document.querySelector(".player1-name");
  const playerTwoName = document.querySelector(".player2-name");
  const playerOneMark = document.querySelector(".player1-marker");
  const playerTwoMark = document.querySelector(".player2-marker");
  (function () {
    playerOneName.textContent = players.one.name;
    playerTwoName.textContent = players.two.name;
    playerOneMark.textContent = players.one.marker;
    playerTwoMark.textContent = players.two.marker;
  })();
}

// Function For Filling Board Cell while clicking
function PlayerOneChoiceFunction() {
  (function () {
    const cells = document.querySelectorAll(".board-cell");
    cells.forEach((cell, index) => {
      if (cell.textContent === "" || cell.textContent === null)
        cell.addEventListener("click", (e) => {
          e.target.textContent = players.one.marker;
          if (players.one.marker == "x") {
            cell.classList.add("x-marker");
          } else {
            cell.classList.add("o-marker");
          }
          gameBoard.board[index] = 0;
          console.log(index);
        });
    });
  })();
}

// Gameboard **************** OBJECT *************
const gameBoard = {
  board: ["", "", "", "", "", "", "", "", ""],
  PlayerOneChoice: PlayerOneChoiceFunction(),
};
