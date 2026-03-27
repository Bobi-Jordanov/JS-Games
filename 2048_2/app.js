document.addEventListener("DOMContentLoaded", () => {

    var board = document.getElementById("board");

    var score = 0;
    var rows = 4;
    var cols = 4;

    window.onload = function() {
        setGame();

    }

    function setGame() {
        // boardArr = [
        //     [2, 0, 0, 64],
        //     [128, 4, 0, 0],
        //     [0, 0, 16, 0],
        //     [0, 32, 0, 0]
        // ];

        boardArr = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ]

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                let tile = document.createElement("div");

                tile.id = i.toString() + "-" + j.toString();

                let num = boardArr[i][j];

                updateTile(tile, num);

                board.appendChild(tile);

            }
        }

        setTwo();
        setTwo();

        console.log(boardArr)

    }

    function updateTile(tile, num) {
        tile.innerText = "";
        tile.classList.value = "";
        tile.classList.add("tile");

        if (num > 0) {
            tile.innerText = num;
            if (num < 4096) {
                tile.classList.add("x" + num.toString());
            } else {
                tile.classList.add("x8192");
            }
        }
    }

    function hasEmptyTile() {
        for (let i = 0; i < 0; i++) {
            for (let j = 0; j < 0; j++) {
                if (boardArr[i][j] == 0)
                    return true;
            }
        }
        return false;
    }

    function setTwo() {
        // Exit if it doesn't have space to add a "2"
        if (!hasEmptyTile)
            return;

        let found = false;

        while (!found) {
            rows_rand = Math.floor(Math.random() * rows)
            cols_rand = Math.floor(Math.random() * cols)

            if (boardArr[rows_rand][cols_rand] == 0) {
                boardArr[rows_rand][cols_rand] = 2;

                let tile = document.getElementById(rows_rand.toString() + "-" + cols_rand.toString())
                tile.innerText = "2"
                tile.classList.add("x2")

                found = true
            }
        }
    }

    document.addEventListener("keyup", (e) => {
        if (e.code == "ArrowLeft") {
            slideLeft();
            setTwo();
        } else if (e.code == "ArrowRight") {
            slideRight();
            setTwo();
        } else if (e.code == "ArrowUp") {
            slideUp();
            setTwo();
        } else if (e.code == "ArrowDown") {
            slideDown();
            setTwo();
        }
        document.getElementById("score").innerText = score
    })

    // function transpose(boardArr) {
    //     let tmp = []
    //     for (let i = 0; i < rows; i++) {
    //         for (let j = 0; j < cols; j++) {
    //             if (!tmp[j])
    //                 tmp[j] = []
    //             tmp[j][i] = boardArr[i][j]
    //         }
    //     }

    //     return tmp
    // }

    function filterZeros(row) {
        // creating a new array without the zeros
        return row.filter(num => num != 0)
    }

    // function reverse(row) {
    //     for (let i = row; i > 0; i--) {
    //         var tmp = []
    //         tmp.push(row[i])
    //     }
    //     return tmp
    // }

    // [0, 2, 2, 2]
    // slideLeft()  -> [4, 2, 0, 0]
    // slideRight() -> [0, 0, 2, 4]
    function slide(row) {
        // [0, 2, 2, 2]

        // delete zeros -> [2, 2, 2]
        row = filterZeros(row)

        // slide
        for (let i = 0; i < row.length - 1; i++) {
            // check if neighboring values are equal
            if (row[i] == row[i + 1]) {
                row[i] *= 2
                row[i + 1] = 0
                score += row[i]
            } // [2, 2, 2] -> [4, 0, 2]
        }

        // [4, 2]
        row = filterZeros(row)

        // add zeros
        while (row.length < cols) {
            row.push(0) // [4, 2, 0, 0]
        }

        return row
    }

    function slideLeft() {
        for (let i = 0; i < rows; i++) {
            let row = boardArr[i]

            row = slide(row)
            boardArr[i] = row

            for (let j = 0; j < cols; j++) {
                let tile = document.getElementById(i.toString() + "-" + j.toString())
                let num = boardArr[i][j]

                updateTile(tile, num)
            }
        }
    }

    function slideRight() {
        for (let i = 0; i < rows; i++) {
            let row = boardArr[i]

            row.reverse()
            row = slide(row)
            row.reverse()
            boardArr[i] = row

            for (let j = 0; j < cols; j++) {
                let tile = document.getElementById(i.toString() + "-" + j.toString())
                let num = boardArr[i][j]

                updateTile(tile, num)
            }
        }
    }

    function slideUp() {
        // let tmp = transpose(boardArr)
        // boardArr = tmp

        // for (let i = 0; i < rows; i++) {
        //     let row = boardArr[i]

        //     row = slide(row)

        //     boardArr[i] = row



        //     for (let j = 0; j < cols; j++) {
        //         let tile = document.getElementById(j.toString() + "-" + i.toString())
        //         let num = boardArr[i][j]

        //         updateTile(tile, num)
        //     }
        // }

        for (let j = 0; j < cols; j++) {
            let row = [boardArr[0][j], boardArr[1][j], boardArr[2][j], boardArr[3][j]]

            row = slide(row)

            // boardArr[0][j] = row[0]
            // boardArr[1][j] = row[1]
            // boardArr[2][j] = row[2]
            // boardArr[3][j] = row[3]

            for (let i = 0; i < rows; i++) {
                boardArr[i][j] = row[i]
                let tile = document.getElementById(i.toString() + "-" + j.toString())
                let num = boardArr[i][j]

                updateTile(tile, num)
            }
        }
    }

    function slideDown() {
        for (let j = 0; j < cols; j++) {
            let row = [boardArr[0][j], boardArr[1][j], boardArr[2][j], boardArr[3][j]]

            row.reverse()
            row = slide(row)
            row.reverse()

            // boardArr[0][j] = row[0]
            // boardArr[1][j] = row[1]
            // boardArr[2][j] = row[2]
            // boardArr[3][j] = row[3]

            for (let i = 0; i < rows; i++) {
                boardArr[i][j] = row[i]

                let tile = document.getElementById(i.toString() + "-" + j.toString())
                let num = boardArr[i][j]

                updateTile(tile, num)
            }
        }
    }

})