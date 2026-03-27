document.addEventListener("DOMContentLoaded", () => {
    // board
    let board = document.getElementById("board")
    let board_width = 360
    let board_height = 640
    let context

    // bird
    let bird_width = 34
    let bird_height = 24
    let bird_x = board_width / 8
    let bird_y = board_height / 2
    let bird_img

    // pipes
    let pipeArray = []
    let pipe_width = 64
    let pipe_height = 512
    let pipe_x = board_width
    let pipe_y = 0

    let topPipeImg
    let bottomPipeImg

    // physics
    let velocity_x = -2
    let velocity_y = 0 // bird jump speed
    let gravity = 0.4

    let gameOver = false
    let score = 0

    let point_sound = new Audio("./sfx_point.wav")
    let wing_sound = new Audio("./sfx_wing.wav")
    let hit_sound = new Audio("./sfx_hit.wav")
    let bgm = new Audio("./bgm_mario.mp3")
    bgm.loop = true

    let Bird = {
        x: bird_x,
        y: bird_y,
        width: bird_width,
        height: bird_height
    }

    window.onload = function() {
        board.height = board_height
        board.width = board_width
        context = board.getContext("2d") // used for drawing on the board

        // draw flappy bird
        // context.fillStyle = "green"
        // context.fillRect(Bird.x, Bird.y, Bird.width, Bird.height)

        // load images
        bird_img = new Image()
        bird_img.src = "./img/flappybird.png"
        bird_img.onload = function() {
            context.drawImage(bird_img, Bird.x, Bird.y, Bird.width, Bird.height)
        }

        topPipeImg = new Image()
        topPipeImg.src = "./img/toppipe.png"

        bottomPipeImg = new Image()
        bottomPipeImg.src = "./img/bottompipe.png"

        requestAnimationFrame(update)
        setInterval(placePipes, 1500) // every 1.5 sec

        document.addEventListener("keydown", moveBird)

    }

    // To redraw the canvas over and over again
    function update() {
        requestAnimationFrame(update)
        if (gameOver)
            return

        context.clearRect(0, 0, board.width, board.height)

        // bird
        velocity_y += gravity
            //Bird.y += velocity_y
        Bird.y = Math.max(Bird.y + velocity_y, 0) // 0 - top of the canvas
        context.drawImage(bird_img, Bird.x, Bird.y, Bird.width, Bird.height)

        if (Bird.y > board.height)
            gameOver = true

        // pipes
        for (let i = 0; i < pipeArray.length; i++) {
            let pipe = pipeArray[i]
            pipe.x += velocity_x // moving the pipes left

            context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height)

            if (!pipe.passed && Bird.x > (pipe.x + pipe.width)) {
                score += 0.5 // there are two pipes, 1 for each set of pipes
                pipe.passed = true
                point_sound.play()
            }

            if (detectCollision(Bird, pipe)) {
                hit_sound.play()
                gameOver = true

            }
        }

        // clearing the pipes that have gone ofscreen
        while (pipeArray.length > 0 && pipeArray[0].x < -pipe_width) {
            pipeArray.shift() // removes the first element from the array
        }

        // score
        context.fillStyle = "white"
        context.font = "45px sans-serif"
        context.fillText(score, 5, 45)

        if (gameOver) {
            context.fillText("GAME OVER", 0, 90)
            bgm.pause()
            bgm.currentTime = 0
        }
    }

    function placePipes() {
        if (gameOver)
            return

        //let random_pipe_y = Math.floor(Math.random() * (pipe_y - pipe_height / 4))

        // range: (-1/4 * pipe_height) - (-3/4 * pipe_height)
        let random_pipe_y = pipe_y - pipe_height / 4 - Math.random() * (pipe_height / 2)
        let opening_space = board.height / 4

        console.log(random_pipe_y)

        let TopPipe = {
            img: topPipeImg,
            x: pipe_x,
            y: random_pipe_y,
            width: pipe_width,
            height: pipe_height,
            passed: false // if the flappy bird has passed the pipe
        }

        pipeArray.push(TopPipe)

        let BottomPipe = {
            img: bottomPipeImg,
            x: pipe_x,
            y: random_pipe_y + pipe_height + opening_space,
            width: pipe_width,
            height: pipe_height,
            passed: false
        }

        pipeArray.push(BottomPipe)
    }

    function moveBird(e) {
        if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
            // jump
            velocity_y = -6

            wing_sound.play()

            if (bgm.paused)
                bgm.play()

            // reset
            if (gameOver) {
                Bird.y = bird_y
                pipeArray = []
                score = 0
                gameOver = false
            }
        }
    }

    function detectCollision(a, b) {
        return a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y
    }
})