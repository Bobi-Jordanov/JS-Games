document.addEventListener("DOMContentLoaded", () => {
    var board_grid = document.getElementById("board")
    var board = []
    var rows = 8
    var cols = 8

    var minesCount = 5
    var minesLocation = []

    var tilesClicked = 0

    var flagEnabled = false
    var gameOver = false

    window.onload = function() {
        startGame()
    }

    // finish by adding the user's input for mines
    // and a button for starting the game

    function setMines() {
        // minesLocation.push("2-2")
        // minesLocation.push("2-3")
        // minesLocation.push("5-6")
        // minesLocation.push("3-4")
        // minesLocation.push("1-1")

        let minesLeft = minesCount

        while (minesLeft > 0) {
            let rows_rand = Math.floor(Math.random() * rows)
            let cols_rand = Math.floor(Math.random() * cols)
            let id = rows_rand.toString() + "-" + cols_rand.toString()

            // minesLocation.push(rows_rand.toString() + "-" + cols_rand.toString())

            // To avoid genrating the same id twice / multiple times
            if (!minesLocation.includes(id)) {
                minesLocation.push(id)
                minesLeft--
            }

        }
    }

    function startGame() {
        document.getElementById("mines-count").innerText = minesCount
        document.getElementById("flag-button").addEventListener("click", setFlag)

        setMines()
            // populate board
        for (let i = 0; i < rows; i++) {
            let row = []
            for (let j = 0; j < cols; j++) {
                let tile = document.createElement("div")
                tile.id = i.toString() + "-" + j.toString()

                tile.addEventListener("click", clickTile)

                board_grid.append(tile)
                row.push(tile)
            }
            board.push(row)
        }
        console.log(board)
    }

    // controls the flag, which controls the clickTile() function
    function setFlag() {
        if (flagEnabled) {
            flagEnabled = false
            document.getElementById("flag-button").style.backgroundColor = "lightgray"

        } else {
            flagEnabled = true
            document.getElementById("flag-button").style.backgroundColor = "darkgray"
        }
    }

    function clickTile() {
        if (gameOver || this.classList.contains("tile-clicked"))
            return

        // refers to the tile that was clicked
        let tile = this
        if (flagEnabled) {
            if (tile.innerText == "") {
                tile.innerText = "🚩"
            } else if (tile.innerText == "🚩") {
                tile.innerText = ""
            }
            return
        }

        if (minesLocation.includes(tile.id)) {
            // alert("GAME OVER")
            gameOver = true

            revealMines()

            return
        }

        let coords = tile.id.split("-") // "0-0" -> ["0", "0"]
        let r = parseInt(coords[0])
        let c = parseInt(coords[1])
        checkMine(r, c)
    }

    function revealMines() {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                //let tile = board[i][j]
                let tile = document.getElementById(i.toString() + "-" + j.toString())
                if (minesLocation.includes(tile.id)) {
                    tile.innerText = "💣"
                    tile.style.backgroundColor = "red"
                }
            }
        }
    }

    function checkMine(r, c) {
        // out of bounds -> no mines
        if (r < 0 || r >= rows || c < 0 || c >= cols)
            return

        if (board[r][c].classList.contains("tile-clicked"))
            return

        board[r][c].classList.add("tile-clicked")

        tilesClicked += 1

        let minesFound = 0

        // top three
        minesFound += checkTiles(r - 1, c - 1) // top left
        minesFound += checkTiles(r - 1, c) // top
        minesFound += checkTiles(r - 1, c + 1) // top right

        // left and right
        minesFound += checkTiles(r, c - 1) // left
        minesFound += checkTiles(r, c + 1) // right

        // bottom three
        minesFound += checkTiles(r + 1, c - 1) // bottom left
        minesFound += checkTiles(r + 1, c) // bottom
        minesFound += checkTiles(r + 1, c + 1) // bottom right

        if (minesFound > 0) {
            board[r][c].innerText = minesFound
            board[r][c].classList.add("x" + minesFound.toString())
        } else {
            // top three
            checkMine(r - 1, c - 1)
            checkMine(r - 1, c)
            checkMine(r - 1, c + 1)

            // left and right
            checkMine(r, c - 1)
            checkMine(r, c + 1)

            // bottom three
            checkMine(r + 1, c - 1)
            checkMine(r + 1, c)
            checkMine(r + 1, c + 1)
        }

        console.log(tilesClicked)

        // are all of the tiles clicked? 
        if (tilesClicked == rows * cols - minesCount) {
            document.getElementById("mines-count").innerText = "Cleared"
            gameOver = true
        }
    }

    function checkTiles(r, c) {
        // out of bounds -> no mines
        if (r < 0 || r >= rows || c < 0 || c >= cols)
            return 0

        if (minesLocation.includes(r.toString() + "-" + c.toString()))
            return 1

        return 0
    }
})