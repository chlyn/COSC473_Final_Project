// ===============================
// left board + game flow + mode terminal
// ===============================

// Grab UI elements from index
const boardEl = document.getElementById("ttt-board");
const statusEl = document.getElementById("ttt-status");
const resetBtn = document.getElementById("ttt-reset");

// Mini terminal input for switching AI mode
const modeInput = document.getElementById("mode-input");
const modeFeedback = document.getElementById("mode-feedback");

// -------- GAME STATE --------
let board = Array(9).fill(null);

// human goes first
let currentPlayer = "O";

let gameOver = false;

// minimax by default
let algorithmMode = "minimax";

// All possible winnings
const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// Returns O or X if someone has a win line
// otherwise returns null
function checkWinner(b) {
  for (const [a, b1, c] of WIN_LINES) {
    if (b[a] && b[a] === b[b1] && b[a] === b[c]) return b[a];
  }
  return null;
}

function setMode(newMode) {
  algorithmMode = newMode;

  if (modeFeedback) {
    modeFeedback.textContent = `Current mode: ${algorithmMode}`;
  }

  // re-render so status line updates to show new mode
  renderBoard();
}

// Draws the 9 squares based on the current board
// refresh every new turn
// Also updates the status display as in turn winnder or draw
function renderBoard() {
  if (!boardEl) return;

  // clear previous squares
  boardEl.innerHTML = "";

  // create 9 clickable cells
  board.forEach((val, i) => {
    const cell = document.createElement("div");
    cell.className = "ttt-cell";

    // show the marker if played, otherwise show a dot placeholder
    cell.textContent = val ?? "·";

    // disable cell if already filled OR game ended
    if (val || gameOver) cell.classList.add("disabled");

    // clicking a cell triggers the human move
    cell.addEventListener("click", () => handleHumanMove(i));

    boardEl.appendChild(cell);
  });

  // update top status text
  const winner = checkWinner(board);
  if (winner) {
    statusEl.textContent = `Winner: ${winner}`;
  } else if (board.every(Boolean)) {
    statusEl.textContent = "Draw!";
  } else {
    statusEl.textContent = `Turn: ${currentPlayer}  |  AI: ${algorithmMode}`;
  }
}

function handleHumanMove(i) {
  // ignore if game ended, not human's turn, or square filled
  if (gameOver || currentPlayer !== "O" || board[i]) return;

  // place human marker
  board[i] = "O";

  // check if this ends the game
  const winner = checkWinner(board);
  if (winner || board.every(Boolean)) {
    gameOver = true;
    renderBoard();
    return;
  }

  // switch to AI turn
  currentPlayer = "X";
  renderBoard();

  // little delay so UI feels natural before AI plays lol
  setTimeout(aiMove, 220);
}

// Runs the AI move.
// Uses bestMove() from ai.js.
function aiMove() {
  if (gameOver) return;

  // double-check terminal state before thinking
  const winner = checkWinner(board);
  if (winner || board.every(Boolean)) {
    gameOver = true;
    renderBoard();
    return;
  }

  // Ask the AI for best move + thinking tree
  const result = window.TTT_AI.bestMove(board, algorithmMode);

  // render right panel BEFORE making move (thinking states)
  if (window.renderThinking) {
    window.renderThinking(result, algorithmMode);
  }

  // apply AI move if it found one
  if (result.move != null) {
    board[result.move] = "X";
  }

  // check if AI ends the game
  const w2 = checkWinner(board);
  if (w2 || board.every(Boolean)) {
    gameOver = true;
  } else {
    currentPlayer = "O";
  }

  renderBoard();
}

// reset button logic
resetBtn?.addEventListener("click", () => {
  board = Array(9).fill(null);
  currentPlayer = "O";
  gameOver = false;
  renderBoard();

  // clear/reset the right thinking panel
  if (window.renderThinking) {
    window.renderThinking(
      { children: [], nodes: 0, value: 0, move: null, comparison: null },
      algorithmMode
    );
  }
});

// ================== MODE TERMINAL INPUT (type minimax / alphabeta) ====================
if (modeInput) {
  modeInput.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;

    const cmd = modeInput.value.trim().toLowerCase();
    modeInput.value = "";

    if (cmd === "minimax" || cmd === "mini") {
      setMode("minimax");
      return;
    }
    if (cmd === "alphabeta" || cmd === "ab") {
      setMode("alphabeta");
      return;
    }

    // unknown command pls try again
    if (modeFeedback) {
      modeFeedback.textContent = `Unknown command: "${cmd}". Try: minimax  or  alphabeta`;
    }
  });
}

if (modeFeedback) {
  modeFeedback.textContent = `Current mode: ${algorithmMode}`;
}

// Initial draw
renderBoard();
