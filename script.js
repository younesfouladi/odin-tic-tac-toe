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
      players.one = { name: p1name || "Player 1", marker: p1marker, score: 0 };
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
        // Allow click only if the cell is empty and game is active
        if (gameBoard.board[index] === 0 && gameBoard.isGameActive) {
          // Player 1's move
          updateCell(cell, index, 1, players.one.marker);

          // Check for winner or tie after Player 1's move
          if (gameLogic()) {
            endRound();
          } else if (!gameBoard.board.includes(0)) {
            // It's a tie
            alert("Tie");
            endRound();
          } else {
            // AI's turn
            gameBoard.isGameActive = false; // Disable board during AI's turn
            setTimeout(() => {
              makeAIMove();
              // Check for winner or tie after AI's move
              if (gameLogic()) {
                endRound();
              } else if (!gameBoard.board.includes(0)) {
                alert("Tie");
                endRound();
              }
              gameBoard.isGameActive = true; // Re-enable board after AI's turn
            }, 500); // A small delay for AI move to feel more natural
          }
        }
      });
    });
  })();
}

// --- START OF AI IMPLEMENTATION (MINIMAX) ---

// This function makes the AI move.
function makeAIMove() {
  const bestMoveIndex = findBestMove();
  if (bestMoveIndex !== -1) {
    const cell = document.querySelectorAll(".board-cell")[bestMoveIndex];
    updateCell(cell, bestMoveIndex, 2, players.two.marker);
  }
}

// This function finds the best move for the AI.
function findBestMove() {
  let bestScore = -Infinity;
  let move = -1;
  for (let i = 0; i < gameBoard.board.length; i++) {
    // Is the spot available?
    if (gameBoard.board[i] === 0) {
      gameBoard.board[i] = 2; // AI's player number is 2
      let score = minimax(gameBoard.board, 0, false);
      gameBoard.board[i] = 0; // Undo the move
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

// The Minimax algorithm function
function minimax(board, depth, isMaximizing) {
  let result = checkWinner(board);
  if (result !== null) {
    if (result === 2) return 10 - depth; // AI (Maximizer) wins
    if (result === 1) return -10 + depth; // Player (Minimizer) wins
    return 0; // Tie
  }

  if (isMaximizing) {
    // AI's turn
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === 0) {
        board[i] = 2;
        let score = minimax(board, depth + 1, false);
        board[i] = 0;
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    // Player's turn
    let bestScore = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === 0) {
        board[i] = 1;
        let score = minimax(board, depth + 1, true);
        board[i] = 0;
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

// Helper function to check winner without side-effects (for AI analysis)
function checkWinner(board) {
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // Rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // Columns
    [0, 4, 8],
    [2, 4, 6], // Diagonals
  ];

  for (let combination of winningCombinations) {
    const [a, b, c] = combination;
    if (board[a] !== 0 && board[a] === board[b] && board[a] === board[c]) {
      return board[a]; // Returns 1 for player, 2 for AI
    }
  }

  if (!board.includes(0)) {
    return 0; // Tie
  }

  return null; // Game is not over
}

// --- END OF AI IMPLEMENTATION ---

// A helper function to update a cell on the board and in the DOM
function updateCell(cellElement, index, playerNumber, marker) {
  gameBoard.board[index] = playerNumber;
  cellElement.textContent = marker;
  cellElement.classList.add(
    marker.toLowerCase() === "x" ? "x-marker" : "o-marker"
  );
}

// Game Logic Function - Calculating Winner
function gameLogic() {
  const winner = checkWinner(gameBoard.board);
  if (winner) {
    if (winner === 1) {
      alert(`${players.one.name} Won!`);
      giveRoundPoints(1);
    } else if (winner === 2) {
      alert(`${players.two.name} Won!`);
      giveRoundPoints(2);
    }
    strikeLine();
    return true;
  }
  return false;
}

//Ends the round and shows the "Next Round" button
function endRound() {
  gameBoard.isGameActive = false; // Stop further moves
  disableGame();
  nextRound();
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
  });
}
function enableGame() {
  const cells = document.querySelectorAll(".board-cell");
  cells.forEach((cell) => {
    cell.style.backgroundColor = "inherit";
  });
}
// Reset Board & Go for Next Round
function nextRound() {
  const nextRoundBtn = document.querySelector(".next-round");
  nextRoundBtn.style.display = "block";
  nextRoundBtn.addEventListener(
    "click",
    () => {
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
      gameBoard.isGameActive = true;
    },
    { once: true }
  ); // Use {once: true} to prevent multiple event listeners
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
  board: [0, 0, 0, 0, 0, 0, 0, 0, 0], // 0: empty, 1: player1, 2: player2
  isGameActive: true, // To control when moves can be made
  PlayersChoice: PlayerOneChoiceFunction(),
};

// Global Player Details OBJECT
let players = {};
