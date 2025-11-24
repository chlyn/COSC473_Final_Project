// ===============================
// renders right thinking panel
// ===============================

(function () {
  const root = document.getElementById("thinking-root");

  function valueClass(v) {
    if (v === 1) return "val-win";
    if (v === -1) return "val-lose";
    return "val-draw";
  }

  // Creates a small 3×3 mini-board DOM element.
  // board - 9-element array for that child stat
  // highlightMove - index that AI played to create this child
  function renderMiniBoard(board, highlightMove) {
    const mini = document.createElement("div");
    mini.className = "mini-board";

    board.forEach((cell, i) => {
      const c = document.createElement("div");
      c.className = "mini-cell";

      // Highlight the best move
      if (i === highlightMove) c.classList.add("highlight");

      // Show X / O, or dot if empty
      c.textContent = cell ? cell : "·";
      mini.appendChild(c);
    });

    return mini;
  }

  // Main render function called from ttt.js.
  // result.children = array of possible moves
  // result.move = best move index
  // result.value = best value
  // result.nodes = recursion calls for chosen algorithm
  // result.comparison = { minimaxNodes, alphabetaNodes, pruned } for terminal
  function renderThinking(result, algorithmMode) {
    if (!root) return;

    root.innerHTML = "";

    // header
    const header = document.createElement("div");
    header.className = "thinking-header";

    const title = document.createElement("div");
    title.className = "thinking-title";
    title.textContent = "AI EVALUATION";

    header.appendChild(title);

    // grid
    const grid = document.createElement("div");
    grid.id = "thinkingGrid";
    grid.className = "thinking-grid";

    result.children.forEach((ch) => {
      const card = document.createElement("div");
      card.className = "think-card" + (ch.move === result.move ? " best" : "");

      card.appendChild(renderMiniBoard(ch.board, ch.move));

      const meta = document.createElement("div");
      meta.className = "think-meta";
      meta.innerHTML = `
        Move: <b>${ch.move}</b><br/>
        Value: <b class="${valueClass(ch.value)}">${ch.value}</b>
      `;
      card.appendChild(meta);

      grid.appendChild(card);
    });

    // terminal (always overwrites)
    const term = document.createElement("div");
    term.className = "thinking-terminal";

    const c = result.comparison || {
      minimaxNodes: 0,
      alphabetaNodes: 0,
      pruned: 0,
    };

    // overwrites terminal view each ai move
    term.innerHTML = `<span class="ps-prefix">PS C:\\cosc473\\tictactoe&gt;</span> <span class="ps-dim">AI evaluated next move</span>
<span class="ps-prefix">PS C:\\cosc473\\tictactoe&gt;</span> mode=<span class="ps-accent">${algorithmMode}</span>, bestMove=<span class="ps-accent">${result.move}</span>, value=<span class="ps-accent">${result.value}</span>
<span class="ps-prefix">PS C:\\cosc473\\tictactoe&gt;</span> minimaxNodes=${c.minimaxNodes}, alphaBetaNodes=${c.alphabetaNodes}, pruned=${c.pruned}`;

    // adding to terminal window ui in order
    root.appendChild(header);
    root.appendChild(grid);
    root.appendChild(term);
  }

  window.renderThinking = renderThinking;
})();
