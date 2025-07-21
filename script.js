let p1 = null;
let p2 = null;
let currentPlayer = null;
let gameOver = false;

const DOMManager = (() => {
  const gameForm = document.querySelector("form");
  const gameUI = document.querySelector(".content");
  const gameInfo = document.querySelector(".info");
  const gameBoard = document.querySelector(".gameBoard");
  const restartButton = document.querySelector("#restart");

  restartButton.addEventListener("click", () => {
    location.reload();
  });

  gameForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(gameForm);

    p1 = GameController.createPlayer(formData.get("p1"), "X");
    p2 = GameController.createPlayer(formData.get("p2"), "O");

    GameController.startGame(p1, p2);
  });

  for (let i = 0; i < gameBoard.childElementCount; i++) {
    gameBoard.children[i].addEventListener("click", (e) => {
      if (
        gameOver ||
        e.target.textContent === "X" ||
        e.target.textContent === "O"
      )
        return;
      // Get player input
      let currentInput = e.target.dataset.index;

      currentPlayer.setInput(Number(currentInput));
      e.target.textContent = currentPlayer.marker;

      console.log(GameBoard.getBoard());

      // Check game state
      let gameState = GameBoard.checkState();

      if (gameState === p1.marker) {
        gameOver = true;
        DOMManager.updateInfoText(`${p1.name} wins`);
        return;
      } else if (gameState === p2.marker) {
        gameOver = true;
        DOMManager.updateInfoText(`${p2.name} wins`);
        return;
      } else if (gameState === "Tie") {
        gameOver = true;
        DOMManager.updateInfoText(`It's a Tie`);
        return;
      }

      // Next input
      GameController.nextTurn();
    });
  }

  function turnOnGameUI() {
    gameForm.style.display = "none";
    gameUI.style.display = "flex";
  }

  function updateInfoText(text) {
    gameInfo.textContent = text;
  }

  return { turnOnGameUI, updateInfoText };
})();

const GameBoard = (() => {
  let board = ["", "", "", "", "", "", "", "", ""];

  function placeMarker(index, marker) {
    if (board[index] === "") {
      board[index] = marker;
    } else {
      console.log("Slot already in use.");
    }
  }

  function checkState() {
    const winPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // cols
      [0, 4, 8],
      [2, 4, 6], // diagonals
    ];

    for (let i = 0; i < winPatterns.length; i++) {
      if (
        board[winPatterns[i][0]] !== "" &&
        board[winPatterns[i][0]] === board[winPatterns[i][1]] &&
        board[winPatterns[i][1]] === board[winPatterns[i][2]]
      ) {
        return board[winPatterns[i][0]];
      }
    }

    for (let i = 0; i < board.length; i++) {
      if (board[i] === "") {
        return "Game still running";
      }
    }

    return "Tie";
  }

  function getBoard() {
    return [...board]; // return board
  }

  return {
    placeMarker,
    checkState,
    getBoard,
  };
})();

const GameController = (() => {
  function createPlayer(name, marker) {
    function setInput(index) {
      GameBoard.placeMarker(index, marker);
    }
    return { name, marker, setInput };
  }

  const players = [];

  function startGame(p1, p2) {
    players.push(p1);
    players.push(p2);
    currentPlayer = p1;
    DOMManager.turnOnGameUI();
    DOMManager.updateInfoText(`${currentPlayer.name}'s turn`);
  }

  function nextTurn() {
    if (currentPlayer === players[0]) {
      currentPlayer = players[1];
    } else {
      currentPlayer = players[0];
    }
    DOMManager.updateInfoText(`${currentPlayer.name}'s turn`);
  }

  return { createPlayer, startGame, nextTurn };
})();
