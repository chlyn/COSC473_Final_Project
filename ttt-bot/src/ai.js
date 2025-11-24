// ===============================
// Minimax + Alpha-Beta
// ===============================

(function () {
  // values just for comparison in minimax.
  let MAX = 1000;
  let MIN = -1000;

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

  // Check if someone has already won
  // ran after every move
  function checkWinner(cells) {
    for (const [a, b, c] of WIN_LINES) {
      // cells[a] must be non-null AND match b and c
      if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
        return cells[a];
      }
    }
    return null;
  }

  // Converts a win/draw state into minimax score.
  // X win = +1, O win = -1, draw / no win yet = 0
  function utility(cells) {
    const w = checkWinner(cells);
    if (w === "X") return 1;
    if (w === "O") return -1;
    return 0;
  }

  // Returns all empty squares (legal moves).
  function availableMoves(cells) {
    const moves = [];
    for (let i = 0; i < 9; i++) {
      if (!cells[i]) moves.push(i);
    }
    return moves;
  }

  // BONUS PART: ordering to improve alpha-beta pruning:
  // center first
  // then corners
  // then edges
  // only changes the order of exploration
  function orderedMoves(cells) {
    const m = availableMoves(cells);
    const center = [4];
    const corners = [0, 2, 6, 8];
    const edges = [1, 3, 5, 7];
    return [
      ...center.filter((i) => m.includes(i)),
      ...corners.filter((i) => m.includes(i)),
      ...edges.filter((i) => m.includes(i)),
    ];
  }

  // =============== Vanilla Minimax (no pruning) ============
  // Standard minimax recursion.
  // depth - recursion depth (not used for scoring)
  // boolean maximizingPlayer
  //      - true  => X to play (maximize)
  //      - false => O to play (minimize)
  // counter - tracks number of recursive calls
  // returns {-1|0|1}
  function minimaxVanilla(depth, maximizingPlayer, cells, counter) {
    counter.count++;

    // win or full board
    if (checkWinner(cells) || cells.every(Boolean)) {
      return utility(cells);
    }

    // MAX node: X is trying to get the highest score
    if (maximizingPlayer) {
      let best = MIN;

      for (const mv of orderedMoves(cells)) {
        // copy board
        const next = cells.slice();
        // try X move
        next[mv] = "X";

        const val = minimaxVanilla(depth + 1, false, next, counter);
        best = Math.max(best, val);
      }
      return best;

      // MIN node: O is trying to get the lowest score
    } else {
      let best = MAX;

      for (const mv of orderedMoves(cells)) {
        const next = cells.slice();
        next[mv] = "O";

        const val = minimaxVanilla(depth + 1, true, next, counter);
        best = Math.min(best, val);
      }
      return best;
    }
  }

  // ================= Alpha-Beta Minimax ==============
  // alpha = best score X (max) can guarantee so far
  // beta  = best score O (min) can guarantee so far
  // When beta <= alpha, prune remaining siblings.
  function minimax(depth, maximizingPlayer, cells, alpha, beta, counter) {
    counter.count++;

    if (checkWinner(cells) || cells.every(Boolean)) {
      return utility(cells);
    }

    if (maximizingPlayer) {
      let best = MIN;

      for (const mv of orderedMoves(cells)) {
        const next = cells.slice();
        next[mv] = "X";

        const val = minimax(depth + 1, false, next, alpha, beta, counter);
        best = Math.max(best, val);

        // update alpha: max player improves lower bound
        alpha = Math.max(alpha, best);

        // prune if min player can't do better than our alpha
        if (beta <= alpha) break;
      }
      return best;
    } else {
      let best = MAX;

      for (const mv of orderedMoves(cells)) {
        const next = cells.slice();
        next[mv] = "O";

        const val = minimax(depth + 1, true, next, alpha, beta, counter);
        best = Math.min(best, val);

        // update beta: min player improves upper bound
        beta = Math.min(beta, best);

        if (beta <= alpha) break; // prune
      }
      return best;
    }
  }

  // -------- Best move for AI + thinking data for UI--------
  // cells - current board
  // returns object with best move + values + thinking tree
  function bestMove(cells, algorithm = "minimax") {
    const legal = orderedMoves(cells);

    let bestVal = MIN;
    let bestMv = null;

    // counter for mode
    const counterChosen = { count: 0 };

    // store each child for right-side thinking display
    const children = [];

    // evaluate children using chosen mode
    for (const mv of legal) {
      const next = cells.slice();
      next[mv] = "X";

      let val;
      if (algorithm === "minimax") {
        val = minimaxVanilla(0, false, next, counterChosen);
      } else {
        val = minimax(0, false, next, MIN, MAX, counterChosen);
      }

      // store this child for UI visualization
      children.push({ move: mv, value: val, board: next });

      // maximize: choose move with highest score
      if (val > bestVal) {
        bestVal = val;
        bestMv = mv;
      }
    }

    // speed comparison run both from current state
    // for terminal stats
    const counterMini = { count: 0 };
    const counterAB = { count: 0 };

    minimaxVanilla(0, true, cells.slice(), counterMini);
    minimax(0, true, cells.slice(), MIN, MAX, counterAB);

    const minimaxNodes = counterMini.count;
    const alphabetaNodes = counterAB.count;
    const pruned = minimaxNodes - alphabetaNodes;

    return {
      move: bestMv,
      value: bestVal,
      nodes: counterChosen.count,
      children,
      comparison: { minimaxNodes, alphabetaNodes, pruned },
    };
  }

  // export to global
  window.TTT_AI = { bestMove };
})();
