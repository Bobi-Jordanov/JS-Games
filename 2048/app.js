document.addEventListener("DOMContentLoaded", () => {
  const gridDisplay = document.querySelector(".grid");
  const scoreDisplay = document.querySelector(".score");
  const resultDisplay = document.querySelector(".result");
  const width = 4;
  let score = 0;
  let squares = [];

  //generate div board
  function createBoard() {
    for (var i = 0; i < width * width; i++) {
      let square = document.createElement("div");
      square.setAttribute("class", "square");
      square.textContent = 0;
      gridDisplay.appendChild(square);
      squares.push(square);
    }
    generateNumber();
    generateNumber();
  }

  createBoard();

  function generateNumber() {
    let randomNumber = Math.floor(Math.random() * squares.length);
    if (squares[randomNumber].textContent == 0) {
      squares[randomNumber].textContent = 2;
      gameOver();
    } else generateNumber();
  }

  //swipe right
  function moveRight() {
    for (let i = 0; i < 16; i++) {
      if (i % 4 === 0) {
        let totalOne = squares[i].textContent;
        let totalTwo = squares[i + 1].textContent;
        let totalThree = squares[i + 2].textContent;
        let totalFour = squares[i + 3].textContent;
        let row = [
          parseInt(totalOne),
          parseInt(totalTwo),
          parseInt(totalThree),
          parseInt(totalFour),
        ];
        //it gives out only the numbers on the board, without the zeros
        let filteredRow = row.filter((num) => num);
        let missing = 4 - filteredRow.length;
        let zeros = Array(missing).fill(0);
        let newRow = zeros.concat(filteredRow);

        squares[i].textContent = newRow[0];
        squares[i + 1].textContent = newRow[1];
        squares[i + 2].textContent = newRow[2];
        squares[i + 3].textContent = newRow[3];
      }
    }
  }

  function moveLeft() {
    for (let i = 0; i < 16; i++) {
      if (i % 4 === 0) {
        let totalOne = squares[i].textContent;
        let totalTwo = squares[i + 1].textContent;
        let totalThree = squares[i + 2].textContent;
        let totalFour = squares[i + 3].textContent;
        let row = [
          parseInt(totalOne),
          parseInt(totalTwo),
          parseInt(totalThree),
          parseInt(totalFour),
        ];

        //it gives out only the numbers on the board, without the zeros
        let filteredRow = row.filter((num) => num);
        let missing = 4 - filteredRow.length;
        let zeros = Array(missing).fill(0);
        let newRow = filteredRow.concat(zeros);

        squares[i].textContent = newRow[0];
        squares[i + 1].textContent = newRow[1];
        squares[i + 2].textContent = newRow[2];
        squares[i + 3].textContent = newRow[3];
      }
    }
  }

  //swipeDown
  function moveDown() {
    for (let i = 0; i < 4; i++) {
      let totalOne = squares[i].textContent;
      let totalTwo = squares[i + width].textContent;
      let totalThree = squares[i + width * 2].textContent;
      let totalFour = squares[i + width * 3].textContent;
      let column = [
        parseInt(totalOne),
        parseInt(totalTwo),
        parseInt(totalThree),
        parseInt(totalFour),
      ];

      //it gives out only the numbers on the board, without the zeros
      let filteredColumn = column.filter((num) => num);
      let missing = 4 - filteredColumn.length;
      let zeros = Array(missing).fill(0);
      let newColumn = zeros.concat(filteredColumn);

      squares[i].textContent = newColumn[0];
      squares[i + width].textContent = newColumn[1];
      squares[i + width * 2].textContent = newColumn[2];
      squares[i + width * 3].textContent = newColumn[3];
    }
  }

  //swipeUp
  function moveUp() {
    for (let i = 0; i < 4; i++) {
      let totalOne = squares[i].textContent;
      let totalTwo = squares[i + width].textContent;
      let totalThree = squares[i + width * 2].textContent;
      let totalFour = squares[i + width * 3].textContent;
      let column = [
        parseInt(totalOne),
        parseInt(totalTwo),
        parseInt(totalThree),
        parseInt(totalFour),
      ];

      //it gives out only the numbers on the board, without the zeros
      let filteredColumn = column.filter((num) => num);
      let missing = 4 - filteredColumn.length;
      let zeros = Array(missing).fill(0);
      let newColumn = filteredColumn.concat(zeros);

      squares[i].textContent = newColumn[0];
      squares[i + width].textContent = newColumn[1];
      squares[i + width * 2].textContent = newColumn[2];
      squares[i + width * 3].textContent = newColumn[3];
    }
  }

  function combineRow() {
    for (let i = 0; i < 15; i++) {
      if (squares[i].textContent === squares[i + 1].textContent) {
        let combineTotal =
          parseInt(squares[i].textContent) +
          parseInt(squares[i + 1].textContent);
        squares[i + 1].textContent = combineTotal;
        squares[i].textContent = 0;

        score += combineTotal;
        scoreDisplay.textContent = score;
      }
    }
    checkForWin();
  }

  function combineColumn() {
    for (let i = 0; i < 12; i++) {
      if (squares[i].textContent === squares[i + width].textContent) {
        let combineTotal =
          parseInt(squares[i].textContent) +
          parseInt(squares[i + width].textContent);
        squares[i + width].textContent = combineTotal;
        squares[i].textContent = 0;

        score += combineTotal;
        scoreDisplay.textContent = score;
      }
    }
    checkForWin();
  }

  //assing keycodes
  function control(e) {
    if (e.key === "ArrowRight") {
      keyRight();
    }
    if (e.key == "ArrowLeft") {
      keyLeft();
    }
    if (e.key == "ArrowDown") {
      keyDown();
    }
    if (e.key == "ArrowUp") {
      keyUp();
    }
  }
  document.addEventListener("keydown", control);

  function keyRight() {
    moveRight();
    combineRow();
    moveRight();
    generateNumber();
  }

  function keyLeft() {
    moveLeft();
    combineRow();
    moveLeft();
    generateNumber();
  }

  function keyDown() {
    moveDown();
    combineColumn();
    moveDown();
    generateNumber();
  }

  function keyUp() {
    moveUp();
    combineColumn();
    moveUp();
    generateNumber();
  }

  //check for a win - 2048
  function checkForWin() {
    for (let i = 0; i < squares.length; i++) {
      if (squares[i].textContent == 2048) {
        resultDisplay.textContent = "You Win";
        document.removeEventListener("keydown", control);
      }
    }
  }

  //check if there are no zeros on the board
  function gameOver() {
    let zeros = 0;
    for (let i = 0; i < squares.length; i++) {
      if (squares[i].textContent == zeros) {
        zeros++;
      }
    }

    if (zeros === 0) {
      resultDisplay.textContent = "You lose";
      document.removeEventListener("keydown", control);
    }
  }
});
