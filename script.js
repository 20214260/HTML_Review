const board = document.getElementById("puzzle-board");
const timerText = document.getElementById("timer");
const message = document.getElementById("message");
const shuffleBtn = document.getElementById("shuffleBtn");

let pieces = [];
let timeLeft = 60;
let timer;
let gameActive = false;

function initPuzzle() {
  pieces = [];
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const index = row * 4 + col;
      const div = document.createElement("div");
      div.classList.add("tile");
      div.draggable = true;
      div.style.backgroundPosition = `-${col * 100}px -${row * 100}px`;
      div.dataset.index = index;

      div.addEventListener("dragstart", dragStart);
      div.addEventListener("dragover", dragOver);
      div.addEventListener("drop", dropPiece);
      div.addEventListener("dragend", dragEnd);

      pieces.push(div);
    }
  }
  renderBoard();
}

function renderBoard() {
  board.innerHTML = "";
  pieces.forEach((p) => board.appendChild(p));
}

function shuffle() {
  pieces.sort(() => Math.random() - 0.5);
  renderBoard();
  startTimer();
  message.textContent = "";
  gameActive = true;
}

let draggedPiece = null;

function dragStart(e) {
  if (!gameActive) return;
  draggedPiece = this;
  this.style.opacity = "0.5";
}

function dragOver(e) {
  e.preventDefault();
}

function dropPiece(e) {
  if (!gameActive || !draggedPiece || this === draggedPiece) return;

  const tempBg = draggedPiece.style.backgroundPosition;
  const tempIndex = draggedPiece.dataset.index;

  draggedPiece.style.backgroundPosition = this.style.backgroundPosition;
  draggedPiece.dataset.index = this.dataset.index;

  this.style.backgroundPosition = tempBg;
  this.dataset.index = tempIndex;

  checkWin();
}

function dragEnd(e) {
  this.style.opacity = "1";
  draggedPiece = null;
}

function checkWin() {
  const isComplete = [...board.children].every(
    (tile, i) => Number(tile.dataset.index) === i
  );
  if (isComplete) {
    clearInterval(timer);
    gameActive = false;
    message.textContent = "🎉 퍼즐 완성!";
  }
}

function startTimer() {
  clearInterval(timer);
  timeLeft = 60;
  timerText.textContent = `남은 시간: ${timeLeft}초`;
  timer = setInterval(() => {
    timeLeft--;
    timerText.textContent = `남은 시간: ${timeLeft}초`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      message.textContent = "⏰ 시간 종료! 다시 시도하세요.";
      gameActive = false;
    }
  }, 1000);
}

shuffleBtn.addEventListener("click", shuffle);
initPuzzle();
