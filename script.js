let boxes = document.querySelectorAll(".box");
let msg = document.querySelector(".msg");
let resetbtn = document.querySelector(".resetgame");
let newbtn = document.querySelector(".newgame");
let msgcontainer = document.querySelector(".msg-container");

let turn0 = true;
let moveCount = 0; // 🔁 Track total moves

const winpattern = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

boxes.forEach((box) => {
  box.addEventListener("click", () => {
    if (turn0) {
      box.innerText = "0";
      turn0 = false;
    } else {
      box.innerText = "X";
      turn0 = true;
    }
    box.disabled = true;
    moveCount++; // ⬆️ Count move
    let iswinner = checkWinner();

    // ✅ Check Tie: If 9 moves done and no winner
    if (moveCount === 9 && !iswinner) {
      showTie();
    }
  });
});

const checkWinner = () => {
  for (const pattern of winpattern) {
    let pass1 = boxes[pattern[0]].innerText;
    let pass2 = boxes[pattern[1]].innerText;
    let pass3 = boxes[pattern[2]].innerText;
    if (pass1 != "" && pass2 != "" && pass3 != "") {
      if (pass1 === pass2 && pass2 === pass3) {
        showWinner(pass1);
        return true;
      }
    }
  }
  return false;
};

const showWinner = (winner) => {
  msgcontainer.classList.remove("hide");
  msg.innerText = `🎉 Congratulations! Player ${winner} won!`;
  disableBoxes();
};

const showTie = () => {
  msgcontainer.classList.remove("hide");
  msg.innerText = `😐 It's a Tie!`;
};

const disableBoxes = () => {
  for (const box of boxes) {
    box.disabled = true;
  }
};

const enableBoxes = () => {
  for (const box of boxes) {
    box.disabled = false;
    box.innerText = "";
  }
};

const resetGame = () => {
  turn0 = true;
  moveCount = 0;
  enableBoxes();
  msgcontainer.classList.add("hide");
};

newbtn.addEventListener("click", resetGame);
resetbtn.addEventListener("click", resetGame);
