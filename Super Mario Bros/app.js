document.addEventListener("DOMContentLoaded", () => {

    const GRAVITY = 0.5
    const JUMP_FORCE = -12
    const MOVE_SPEED = 2.5
    const ENEMY_SPEED = 1

    // Game state
    let gameState = {
        score: 0,
        level: 1,
        lives: 3,
        gameRunning: true,
        keys: {}
    }

    // Player object
    let Player = {
        element: document.getElementById("mario"),
        x: 50,
        y: 340,
        width: 20,
        height: 20,
        velocityX: 0,
        velocityY: 0,
        grounded: false,
        big: false,
        bigTimer: 0
    }

    // Game objects arrays
    let gameObjects = {
        platforms: [],
        enemies: [],
        coins: [],
        surpriseBlocks: [],
        pipes: []
    }

    // Levels
    const levels = [
            // lvl 1
            {
                platforms: [{
                        x: 0,
                        y: 360,
                        width: 400,
                        height: 40,
                        type: "ground"
                    },
                    {
                        x: 500,
                        y: 360,
                        width: 300,
                        height: 40,
                        type: "ground"
                    },
                    {
                        x: 200,
                        y: 280,
                        width: 60,
                        height: 20,
                        type: "floating"
                    },
                    {
                        x: 300,
                        y: 240,
                        width: 60,
                        height: 20,
                        type: "floating"
                    },
                    {
                        x: 600,
                        y: 280,
                        width: 80,
                        height: 20,
                        type: "floating"
                    }
                ],

                enemies: [{
                        x: 250,
                        y: 340,
                        type: "brown"
                    },
                    {
                        x: 550,
                        y: 340,
                        type: "brown"
                    }
                ],

                coins: [{
                        x: 220,
                        y: 260
                    },
                    {
                        x: 320,
                        y: 220
                    },
                    {
                        x: 620,
                        y: 260
                    },
                ],

                surpriseBlocks: [{
                    x: 350,
                    y: 220,
                    type: "mushroom"
                }],

                pipes: [{
                    x: 750,
                    y: 320
                }]
            }, // end lvl 1

            // lvl 2
            {
                platforms: [{
                        x: 0,
                        y: 360,
                        width: 200,
                        height: 40,
                        type: "blue"
                    },
                    {
                        x: 300,
                        y: 360,
                        width: 200,
                        height: 40,
                        type: "blue"
                    },
                    {
                        x: 600,
                        y: 360,
                        width: 200,
                        height: 40,
                        type: "blue"
                    },
                    {
                        x: 150,
                        y: 300,
                        width: 40,
                        height: 20,
                        type: "blue"
                    },
                    {
                        x: 250,
                        y: 280,
                        width: 40,
                        height: 20,
                        type: "blue"
                    },
                    {
                        x: 350,
                        y: 260,
                        width: 40,
                        height: 20,
                        type: "blue"
                    },
                    {
                        x: 450,
                        y: 240,
                        width: 40,
                        height: 20,
                        type: "blue"
                    },
                    {
                        x: 550,
                        y: 280,
                        width: 40,
                        height: 20,
                        type: "blue"
                    }
                ],

                enemies: [{
                        x: 350,
                        y: 344,
                        type: "purple"
                    },
                    {
                        x: 650,
                        y: 344,
                        type: "purple"
                    },
                    {
                        x: 570,
                        y: 264,
                        type: "purple"
                    }
                ],

                coins: [{
                        x: 170,
                        y: 280
                    },
                    {
                        x: 270,
                        y: 260
                    },
                    {
                        x: 370,
                        y: 240
                    },
                    {
                        x: 470,
                        y: 220
                    },
                    {
                        x: 570,
                        y: 260
                    }
                ],

                surpriseBlocks: [{
                        x: 200,
                        y: 260,
                        type: "coin"
                    },
                    {
                        x: 400,
                        y: 220,
                        type: "mushroom"
                    }
                ],

                pipes: [{
                    x: 750,
                    y: 320
                }]
            }
        ] // end lvl 2

    // Initilizing Game
    function initGame() {
        loadLevel(gameState.level - 1)

        gameLoop()
    }


    function loadLevel(lvlIndex) {
        if (lvlIndex >= levels.length) {
            showGameOver(true)
            return
        }

        // Clearing the exsisting objects
        clearLvl()

        const level = levels[lvlIndex]
        const gameArea = document.getElementById("game-area")

        // Reset the area
        Player.x = 50
        Player.y = 340
        Player.velocityX = 0
        Player.velocityY = 0
        Player.big = false
        Player.bigTimer = 0
        Player.element.className = " "

        updateElementPosition(Player.element, Player.x, Player.y)

        // Creating the Platforms
        level.platforms.forEach((platformData, index) => {
            // not the same as document.createElement
            const platform = createElement("div", `platform ${platformData.type}`, {
                left: platformData.x + "px",
                top: platformData.y + "px",
                width: platformData.width + "px",
                height: platformData.height + "px",
            })

            gameArea.appendChild(platform)
            gameObjects.platforms.push({
                element: platform,
                ...platformData,
                id: "platform-" + index
            })
        })

        // Creating Enemies
        level.enemies.forEach((enemyData, index) => {
            const enemy = createElement("div", `enemy ${enemyData.type}`, {
                left: enemyData.x + "px",
                top: enemyData.y + "px"
            })

            gameArea.appendChild(enemy)
            gameObjects.enemies.push({
                element: enemy,
                x: enemyData.x,
                y: enemyData.y,
                width: 20,
                height: 20,
                direction: -1,
                speed: ENEMY_SPEED,
                id: 'enemy-' + index,
                alive: true

            })
        })

        // Creating Coins
        level.coins.forEach((coinData, index) => {
            const coin = createElement("div", "coin", {
                left: coinData.x + "px",
                top: coinData.y + "px"
            })

            gameArea.appendChild(coin)
            gameObjects.coins.push({
                element: coin,
                x: coinData.x,
                y: coinData.y,
                width: 20,
                height: 20,
                collected: false,
                id: 'coin-' + index,
            })
        })

        // Creating Surprise Box
        level.surpriseBlocks.forEach((blockData, index) => {
            const block = createElement("div", "surprise-block", {
                left: blockData.x + "px",
                top: blockData.y + "px"
            })

            gameArea.appendChild(block)
            gameObjects.surpriseBlocks.push({
                element: block,
                x: blockData.x,
                y: blockData.y,
                width: 20,
                height: 20,
                type: blockData.type,
                hit: false,
                id: 'block-' + index,
            })
        })

        // Creating Pipes
        level.pipes.forEach((pipeData, index) => {
            const pipe = createElement("div", "pipe", {
                left: pipeData.x + "px",
                top: pipeData.y + "px"
            })

            const pipeTopLeft = createElement("div", "pipe-top")
            const pipeTopRight = createElement("div", "pipe-top-right")
            const pipeBottomLeft = createElement("div", "pipe-bottom")
            const pipeBottomRight = createElement("div", "pipe-bottom-right")

            pipe.append(pipeTopLeft, pipeTopRight, pipeBottomLeft, pipeBottomRight)

            gameArea.appendChild(pipe)
            gameObjects.pipes.push({
                element: pipe,
                x: pipeData.x,
                y: pipeData.y,
                width: 40,
                height: 40,
                id: "pipe-" + index

            })

        })

    }

    function updateElementPosition(element, x, y) {
        element.style.left = x + "px"
        element.style.top = y + "px"

    }

    function createElement(type, className, styles = {}) {
        const element = document.createElement("div")
        element.className = className
        Object.assign(element.style, styles)

        return element
    }

    function showGameOver(won) {
        gameState.gameRunning = false
        document.getElementById("game-over").textContent =
            won ? "Congratulations! You've won" : "Game Over"
        document.getElementById("final-score").textContent = gameState.score
        document.getElementById("game-over").style.display = "block"
    }

    function clearLvl() {
        // const gameArea = document.getElementById("game-area")

        // removing all DOM elements for all game objects
        // flat() - turns an array consisting of multiple other arrays into a single array

        // ex1
        // Object.values(gameObjects).forEach(arr => {
        //     arr.forEach(obj => {
        //         obj.element.remove()
        //     })
        // })

        // ex2
        // Object -> refers to the current object
        Object.values(gameObjects).flat().forEach(obj => {
            if (obj.element && obj.element.parentNode) {
                obj.element.remove()
            }
        })

        // ex1 & ex2 do the same thing

        gameObjects = {
            platforms: [],
            enemies: [],
            coins: [],
            surpriseBlocks: [],
            pipes: []
        }
    }

    // Input Handeling
    document.addEventListener("keydown", (e) => {
        gameState.keys[e.code] = true

        if (e.code === "Space") {
            e.preventDefault() // to jump, not to move left / write
        }
    })


    document.addEventListener("keyup", (e) => {
        gameState.keys[e.code] = false
    })

    // Game Loop
    function gameLoop() {
        if (!gameState.gameRunning)
            return

        update()
        requestAnimationFrame(gameLoop)
    }

    // Update Game Logic
    function update() {
        // Moving left & right
        if (gameState.keys['ArrowLeft'] || gameState.keys["KeyA"]) {
            Player.velocityX = -MOVE_SPEED
        } else if (gameState.keys['ArrowRight'] || gameState.keys["KeyD"]) {
            Player.velocityX = MOVE_SPEED
        } else {
            // friction
            Player.velocityX *= 0.8
        }

        // Jumping
        if (gameState.keys["Space"] && Player.grounded) {
            Player.velocityY = JUMP_FORCE
            Player.grounded = false
        }

        // Apply gravity
        if (!Player.grounded) {
            Player.velocityY += GRAVITY
        }

        // update the player's position
        Player.x += Player.velocityX
        Player.y += Player.velocityY

        // by default, mario should always be falling
        Player.grounded = false

        // Platform collision
        for (let platform of gameObjects.platforms) {
            if (checkCollision(Player, platform)) {
                // check falling
                if (Player.velocityY > 0) {
                    Player.y = platform.y - Player.height
                    Player.velocityY = 0
                    Player.grounded = true
                }
            }
        }

        // Pipe collision
        for (let pipe of gameObjects.pipes) {
            if (checkCollision(Player, pipe)) {
                // check if it's falling down into the pipe
                if (Player.velocityY > 0) {
                    Player.y = pipe.y - Player.height
                    Player.velocityY = 0
                    Player.grounded = true
                }
            }
        }

        // Enemy movement & collision
        for (let enemy of gameObjects.enemies) {
            if (!enemy.alive)
                continue

            enemy.x += enemy.speed * enemy.direction

            let onPlatform = false

            // Reverse direction at platform edges or borders
            for (let platform of gameObjects.platforms) {
                if (checkCollision(enemy, platform)) {
                    onPlatform = true
                    break
                }
            }

            if (!onPlatform || enemy.x <= 0 || enemy.x >= 800)
                enemy.direction *= -1

            updateElementPosition(enemy.element, enemy.x, enemy.y)

            // Check player-enemy collision
            if (checkCollision(Player, enemy)) {
                // Check if player is falling down and is above the enemy
                if (Player.velocityY > 0 && Player.y < enemy.y) {
                    // Jump on enemy
                    enemy.alive = false
                    enemy.element.remove()
                    Player.velocityY = JUMP_FORCE * 0.7
                    gameState.score += 100
                } else {
                    // Hit by enemy
                    if (Player.big) {
                        Player.big = false
                        Player.bigTimer = 0
                        Player.element.classList.remove("big")
                        Player.width = 20
                        Player.height = 20
                    } else {
                        loseLife()
                    }
                }
            }

            // Coin collection
            for (let coin of gameObjects.coins) {
                if (!coin.collected && checkCollision(Player, coin)) {
                    coin.collected = true
                    coin.element.remove()
                    gameState.score += 50
                }
            }

            // Surprise blocks
            for (let block of gameObjects.surpriseBlocks) {
                if (!block.hit && checkCollision(Player, block) && Player.velocityY < 0) {
                    block.hit = true
                    block.element.classList.add("hit")

                    if (block.type === "mushroom") {
                        Player.big = true
                        Player.bigTimer = 600 // 10secs at 60fps
                        Player.element.classList.add("big")
                        Player.width = 30
                        Player.height = 30
                        gameState.score += 100
                    } else if (block.type === "coin") {
                        gameState.score += 50
                    }
                }
            }

            // Pipe interaction with the Next lvl
            for (let pipe of gameObjects.pipes) {
                if (Player.grounded &&
                    Player.x + Player.width > pipe.x &&
                    Player.x < pipe.x + pipe.width &&
                    Math.abs(Player.y + Player.height - pipe.y) < 5 &&
                    gameState.keys['ArrowDown']) {
                    nextLevel()
                }
            }


            // Death by Falling
            if (Player.y > 400) {
                loseLife()
            }

        }


        updateElementPosition(Player.element, Player.x, Player.y)

        // document.getElementById("score").textContent = gameState.score
        // document.getElementById("level").textContent = gameState.level
        // document.getElementById("lives").textContent = gameState.lives

    }

    function checkCollision(element1, element2) {
        return element1.x < element2.x + element2.width &&
            element1.x + element1.width > element2.x &&
            element1.y <= element2.y + element2.height &&
            element1.y + element1.height >= element2.y
    }

    function loseLife() {
        gameState.lives--;

        if (gameState.lives <= 0) {
            showGameOver(false)
        } else {
            Player.x = 50
            Player.y = 300
            Player.velocityX = 0
            Player.velocityY = 0
            Player.big = false
            Player.bigTimer = 0
            Player.element.classList.remove("big")
            Player.width = 20
            Player.height = 20
        }
    }

    function nextLevel() {
        gameState.level++;

        if (gameState.level > levels.length) {
            showGameOver(true)
        } else {
            loadLevel(gameState.level - 1)

        }

    }

    function restartGame() {

    }


    // Start Game
    initGame()
})