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
      players.one = { name: p1name, marker: p1marker, score: 0 };
      players.two = {
        name: "Computer",
        marker: p1marker.toLowerCase() === "x" ? "O" : "X",
        score: 0,
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
      cell.addEventListener("click", (e) => {
        if (cell.textContent == "" || cell.textContent == null) {
          e.target.textContent = players.one.marker;
          // For DOM Marker Style
          if (players.one.marker === "X") {
            cell.classList.add("x-marker");
          } else {
            cell.classList.add("o-marker");
          }
          gameBoard.board[index] = 1;
          // Calls game Logic to Chack Winner for player 1
          if (gameLogic()) {
            alert("Player 1 Won");
            disableGame();
            nextRound();
          } else {
            if (gameBoard.board.includes(0)) {
              // Call Other Function To Get Player2 Choice
              PlayerTwoChoiceFunction();
              // Calls game logic again to check winner for player 2
              if (gameLogic()) {
                alert("player 2 Won");
                disableGame();
                nextRound();
              }
            }
            // Tie Statement
            else {
              alert("Tie");
              disableGame();
              nextRound();
            }
          }
        }
      });
    });
  })();
}

// Function For Filling Board Cell for Player Two (Computer for now)
function PlayerTwoChoiceFunction() {
  const cells = document.querySelectorAll(".board-cell");
  const ai = (function () {
    let random;
    do {
      random = Math.floor(Math.random() * 9);
    } while (gameBoard.board[random] != 0);

    if (cells[random].textContent == "" || cells[random].textContent == null) {
      cells[random].textContent = players.two.marker;
      gameBoard.board[random] = 2;
      // For DOM Marker Style
      if (players.two.marker == "X") {
        cells[random].classList.add("x-marker");
      } else {
        cells[random].classList.add("o-marker");
      }
    }
  })();
}

// Game Logic Function - Calculating Winner
function gameLogic() {
  const board = gameBoard.board;
  const emptyCellValue = 0;
  // ALl POSSIBLE CONDITIONS FOR WINNING STATEMENT
  const winningCombinations = [
    // Rows
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // Columns
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // Diameter
    [0, 4, 8],
    [2, 4, 6],
  ];

  // Looping winning statements
  for (let i of winningCombinations) {
    const [a, b, c] = i;
    if (
      board[a] !== emptyCellValue &&
      board[a] === board[b] &&
      board[a] === board[c]
    ) {
      if (board[a] === 1) {
        strikeLine();
        giveRoundPoints(1);
        return players.one.name;
      } else if (board[a] === 2) {
        strikeLine();
        giveRoundPoints(2);
        return players.two.name;
      }
      return null;
    }
  }
}

// Drawing Strike Line Function
function strikeLine() {
  const winningCombinations = [
    // Rows
    { combo: [0, 1, 2], strikeClass: "strike-row1" },
    { combo: [3, 4, 5], strikeClass: "strike-row2" },
    { combo: [6, 7, 8], strikeClass: "strike-row3" },
    // Columns
    { combo: [0, 3, 6], strikeClass: "strike-col1" },
    { combo: [1, 4, 7], strikeClass: "strike-col2" },
    { combo: [2, 5, 8], strikeClass: "strike-col3" },
    // Diagonals
    { combo: [0, 4, 8], strikeClass: "strike-diag1" },
    { combo: [2, 4, 6], strikeClass: "strike-diag2" },
  ];
  for (const { combo, strikeClass } of winningCombinations) {
    const [a, b, c] = combo;
    const board = gameBoard.board;
    if (board[a] !== 0 && board[a] === board[b] && board[a] === board[c]) {
      const strikeLine = document.querySelector("#strike-line");
      strikeLine.classList.add(strikeClass);
    }
  }
}

// Disable GameBoard Cells on Dom after winning game
function disableGame() {
  const cells = document.querySelectorAll(".board-cell");
  cells.forEach((cell) => {
    cell.style.backgroundColor = "#fdebee";
    cell.style.pointerEvents = "none";
  });
}
function enableGame() {
  const cells = document.querySelectorAll(".board-cell");
  cells.forEach((cell) => {
    cell.style.backgroundColor = "inherit";
    cell.style.pointerEvents = "all";
  });
}
// Reset Board & Go for Next Round
function nextRound() {
  const nextRoundBtn = document.querySelector(".next-round");
  nextRoundBtn.style.display = "block";
  nextRoundBtn.addEventListener("click", () => {
    nextRoundBtn.style.display = "none";
    enableGame();
    document.querySelector("#strike-line").setAttribute("class", "");
    for (let i = 0; i < gameBoard.board.length; i++) {
      gameBoard.board[i] = 0;
    }
    const cells = document.querySelectorAll(".board-cell");
    cells.forEach((cell) => {
      cell.textContent = "";
      cell.classList.remove("x-marker", "o-marker");
    });
  });
}

// Give Score Points to the Players
function giveRoundPoints(winner) {
  const playerOneScore = document.querySelector(".player1-score");
  const playerTwoScore = document.querySelector(".player2-score");
  if (winner === 1) {
    players.one.score += 1;
    playerOneScore.textContent = players.one.score;
  } else if (winner === 2) {
    players.two.score += 1;
    playerTwoScore.textContent = players.two.score;
  }
}

// Gameboard **************** OBJECT *************
const gameBoard = {
  board: [0, 0, 0, 0, 0, 0, 0, 0, 0],
  PlayersChoice: PlayerOneChoiceFunction(),
};

// Global Player Details OBJECT
let players = {};
