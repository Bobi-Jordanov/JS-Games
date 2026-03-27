const $board = $("#board");
const ROWS = 10;
const COLS = 10;

function createBoard(rows, cols) {
    $board.empty();
    for (let i = 0; i < rows; i++) {
        const $row = $("<div>").addClass("row");
        for (let j = 0; j < cols; j++) {
            const $col = $("<div>")
                .addClass("col hidden")
                .attr("data-row", i)
                .attr("data-col", j);

            //generating Mines
            if (Math.random() < 0.1) {
                $col.addClass("mine");
            }
            $board.append($col);
        }
        $board.append($row);
    }
}

function restart() {
    createBoard(ROWS, COLS);
}

function gameOver(isWin) {
    let message = null;
    if (isWin) {
        message = "You Won";
    } else {
        message = "You Lose";
        restart();
    }
    alert(message);
}

function reveal(originalI, originalJ) {
    const seen = {};

    function helper(i, j) {
        if (i >= ROWS || j >= COLS || i < 0 || j <= 0) return;
        const key = `${i} ${j}`;
        if (seen[key]) return;
        const $cell = $(`.col.hidden[data-row=${i}][data-col=${j}]`);
        const mineCount = 0;

        if (!$cell.hasClass("hidden") || $cell.hasClass("mine")) {
            return;
        }

        $cell.removeClass("hidden");

        if (mineCount) {
            $cell.text(mineCount);
            return;
        }

        //for ()
    }
}

$board.on("click", ".col.hidden", function() {
    const $cell = $(this);
    const row = $cell.data("row");
    const col = $cell.data("col");
    console.log(row, col);
    if ($cell.hasClass("mine")) {
        gameOver(false);
    } else {
        reveal(row, col);
    }
});

restart();