// ===========================================================
// Chalk & Slate — Tic-Tac-Toe vs Bot
// Player is always X and moves first. Bot is O.
// ===========================================================

const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6]             // diagonals
];

// Cell centers on a 0-100 viewBox, laid out to match the 3x3 grid.
const CELL_CENTERS = [
  [16.6, 16.6], [50, 16.6], [83.3, 16.6],
  [16.6, 50],   [50, 50],   [83.3, 50],
  [16.6, 83.3], [50, 83.3], [83.3, 83.3]
];

const boardEl = document.getElementById('board');
const cells = Array.from(document.querySelectorAll('.cell'));
const statusEl = document.getElementById('status');
const resetBtn = document.getElementById('reset');
const difficultySelect = document.getElementById('difficulty');
const strikeSvg = document.getElementById('strike');
const strikeLine = document.getElementById('strike-line');
const scoreXEl = document.getElementById('score-x');
const scoreOEl = document.getElementById('score-o');
const scoreDrawEl = document.getElementById('score-draw');

let board = Array(9).fill(null);
let gameOver = false;
let botThinking = false;

const scores = { X: 0, O: 0, draw: 0 };

// ---------- Rendering helpers ----------

function drawMark(cell, mark) {
  cell.dataset.mark = mark;
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 100 100');

  if (mark === 'X') {
    const d = 'M25,25 L75,75 M75,25 L25,75';
    const path = document.createElementNS(ns, 'path');
    path.setAttribute('d', d);
    svg.appendChild(path);
    cell.appendChild(svg);
    animateStroke(path);
  } else {
    // hand-drawn circle, slightly imperfect via a cubic-bezier loop
    const d = 'M50,22 C68,22 78,36 78,50 C78,66 65,78 50,78 ' +
               'C33,78 22,65 22,50 C22,34 35,22 50,22';
    const path = document.createElementNS(ns, 'path');
    path.setAttribute('d', d);
    svg.appendChild(path);
    cell.appendChild(svg);
    animateStroke(path);
  }
}

function animateStroke(path) {
  const length = path.getTotalLength();
  path.style.strokeDasharray = length;
  path.style.strokeDashoffset = length;
  // force reflow so the transition actually triggers
  path.getBoundingClientRect();
  requestAnimationFrame(() => {
    path.style.strokeDashoffset = 0;
  });
}

function setStatus(text, cls) {
  statusEl.textContent = text;
  statusEl.classList.remove('win-x', 'win-o', 'draw');
  if (cls) statusEl.classList.add(cls);
}

function updateScoreboard() {
  scoreXEl.textContent = scores.X;
  scoreOEl.textContent = scores.O;
  scoreDrawEl.textContent = scores.draw;
}

function drawStrike(line) {
  const [a, , c] = line;
  const [x1, y1] = CELL_CENTERS[a];
  const [x2, y2] = CELL_CENTERS[c];
  // scale from 0-100 viewBox space to the 0-300 strike svg viewBox
  strikeLine.setAttribute('x1', x1 * 3);
  strikeLine.setAttribute('y1', y1 * 3);
  strikeLine.setAttribute('x2', x2 * 3);
  strikeLine.setAttribute('y2', y2 * 3);
  const length = strikeLine.getTotalLength ? strikeLine.getTotalLength() : 340;
  strikeLine.style.strokeDasharray = length;
  strikeLine.style.strokeDashoffset = length;
  strikeLine.classList.remove('draw-strike');
  void strikeLine.getBoundingClientRect();
  strikeLine.classList.add('draw-strike');
  requestAnimationFrame(() => {
    strikeLine.style.strokeDashoffset = 0;
  });
}

function clearStrike() {
  strikeLine.classList.remove('draw-strike');
  strikeLine.setAttribute('x1', 0);
  strikeLine.setAttribute('y1', 0);
  strikeLine.setAttribute('x2', 0);
  strikeLine.setAttribute('y2', 0);
}

// ---------- Game logic ----------

function checkWinner(b) {
  for (const line of WIN_LINES) {
    const [a, bIdx, c] = line;
    if (b[a] && b[a] === b[bIdx] && b[a] === b[c]) {
      return { mark: b[a], line };
    }
  }
  if (b.every(Boolean)) return { mark: 'draw', line: null };
  return null;
}

function endGame(result) {
  gameOver = true;
  cells.forEach(c => c.disabled = true);

  if (result.mark === 'draw') {
    setStatus("Chalk dust and nothing else. It's a draw.", 'draw');
    scores.draw++;
  } else if (result.mark === 'X') {
    setStatus('You win! Nicely sketched.', 'win-x');
    scores.X++;
    result.line.forEach(i => cells[i].classList.add('win-cell'));
    drawStrike(result.line);
  } else {
    setStatus('The bot wins this round.', 'win-o');
    scores.O++;
    result.line.forEach(i => cells[i].classList.add('win-cell'));
    drawStrike(result.line);
  }
  updateScoreboard();
}

function playerMove(index) {
  if (gameOver || botThinking || board[index]) return;

  board[index] = 'X';
  drawMark(cells[index], 'X');
  cells[index].disabled = true;

  const result = checkWinner(board);
  if (result) {
    endGame(result);
    return;
  }

  setStatus("Bot's turn. It's thinking...");
  botThinking = true;
  setTimeout(botMove, 450);
}

function botMove() {
  if (gameOver) { botThinking = false; return; }

  const difficulty = difficultySelect.value;
  const index = chooseBotMove(board, difficulty);

  if (index === -1) { botThinking = false; return; }

  board[index] = 'O';
  drawMark(cells[index], 'O');
  cells[index].disabled = true;
  botThinking = false;

  const result = checkWinner(board);
  if (result) {
    endGame(result);
    return;
  }

  setStatus('Your move, chalk in hand.');
}

// ---------- Bot move selection ----------

function emptyIndices(b) {
  return b.reduce((acc, v, i) => { if (!v) acc.push(i); return acc; }, []);
}

function chooseBotMove(b, difficulty) {
  const empties = emptyIndices(b);
  if (empties.length === 0) return -1;

  if (difficulty === 'easy') {
    // pure random — the bot is just doodling
    return empties[Math.floor(Math.random() * empties.length)];
  }

  if (difficulty === 'medium') {
    // simple heuristic: win if possible, else block, else center,
    // else a corner, else whatever's left
    return winOrBlock(b) ??
           (b[4] === null ? 4 : null) ??
           pickFirstAvailable(b, [0, 2, 6, 8]) ??
           empties[Math.floor(Math.random() * empties.length)];
  }

  // hard: unbeatable via minimax
  return bestMinimaxMove(b);
}

// returns a winning move for O, or a blocking move against X, or null
function winOrBlock(b) {
  for (const mark of ['O', 'X']) {
    for (const [a, b2, c] of WIN_LINES) {
      const line = [b[a], b[b2], b[c]];
      const marks = line.filter(v => v === mark).length;
      const empties = line.filter(v => v === null).length;
      if (marks === 2 && empties === 1) {
        const idxInLine = [a, b2, c][line.indexOf(null)];
        return idxInLine;
      }
    }
  }
  return null;
}

function pickFirstAvailable(b, indices) {
  for (const i of indices) if (b[i] === null) return i;
  return null;
}

function bestMinimaxMove(b) {
  let bestScore = -Infinity;
  let move = -1;
  for (const i of emptyIndices(b)) {
    b[i] = 'O';
    const score = minimax(b, 0, false);
    b[i] = null;
    if (score > bestScore) {
      bestScore = score;
      move = i;
    }
  }
  return move;
}

function minimax(b, depth, isMaximizing) {
  const result = checkWinner(b);
  if (result) {
    if (result.mark === 'O') return 10 - depth;
    if (result.mark === 'X') return depth - 10;
    return 0;
  }

  if (isMaximizing) {
    let best = -Infinity;
    for (const i of emptyIndices(b)) {
      b[i] = 'O';
      best = Math.max(best, minimax(b, depth + 1, false));
      b[i] = null;
    }
    return best;
  } else {
    let best = Infinity;
    for (const i of emptyIndices(b)) {
      b[i] = 'X';
      best = Math.min(best, minimax(b, depth + 1, true));
      b[i] = null;
    }
    return best;
  }
}

// ---------- Setup ----------

function resetGame() {
  board = Array(9).fill(null);
  gameOver = false;
  botThinking = false;
  cells.forEach(cell => {
    cell.disabled = false;
    cell.innerHTML = '';
    delete cell.dataset.mark;
    cell.classList.remove('win-cell');
  });
  clearStrike();
  setStatus('Your move, chalk in hand.');
}

cells.forEach(cell => {
  cell.addEventListener('click', () => playerMove(Number(cell.dataset.index)));
});

resetBtn.addEventListener('click', resetGame);

difficultySelect.addEventListener('change', () => {
  resetGame();
});

updateScoreboard();