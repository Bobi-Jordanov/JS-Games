document.addEventListener("DOMContentLoaded", () => {
    const grid = document.querySelector(".grid");
    const resultDisplay = document.querySelector(".result");
    let currentShooterIndex = 202;
    let width = 15;
    let direction = 1;
    let invadersId = null;
    let goingRight = true;
    let aliensRemoved = [];

    for (let i = 0; i < 255; i++) {
        const square = document.createElement("div");
        grid.appendChild(square);
    }

    let squares = Array.from(document.querySelectorAll(".grid div"));
    let alienInvaders = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 30,
        31, 32, 33, 34, 35, 36, 37, 38, 39,
    ];
    // function draw() {
    //     for (let i = 0; i < 9; i++) {
    //         if (i <= 9) {
    //             squares[i].classList.add("invader");
    //             squares[i + 15].classList.add("invader");
    //             squares[i + 30].classList.add("invader");
    //         }
    //     }
    // }
    function draw() {
        for (let i = 0; i < alienInvaders.length; i++) {
            if (!aliensRemoved.includes(i))
                squares[alienInvaders[i]].classList.add("invader");
        }
    }
    draw();

    //let alienInvaders = Array.from(document.querySelectorAll(".invader"));

    // function remove() {
    //     for (let i = 0; i < 9; i++) {
    //         if (i <= 9) {
    //             squares[i].classList.remove("invader");
    //             squares[i + 15].classList.remove("invader");
    //             squares[i + 30].classList.remove("invader");
    //         }
    //     }
    // }

    function remove() {
        for (let i = 0; i < alienInvaders.length; i++) {
            squares[alienInvaders[i]].classList.remove("invader");
        }
    }

    squares[currentShooterIndex].classList.add("shooter");

    function moveShooter(e) {
        squares[currentShooterIndex].classList.remove("shooter");
        switch (e.key) {
            case "ArrowLeft":
                if (currentShooterIndex % width !== 0) currentShooterIndex -= 1;
                break;
            case "ArrowRight":
                if (currentShooterIndex % width < width - 1) currentShooterIndex += 1;
                break;
        }
        squares[currentShooterIndex].classList.add("shooter");
    }
    document.addEventListener("keydown", moveShooter);

    function moveInvaders() {
        const leftEdge = alienInvaders[0] % width === 0;
        const rightEdge =
            alienInvaders[alienInvaders.length - 1] % width === width - 1;

        remove();

        if (rightEdge && goingRight) {
            for (let i = 0; i < alienInvaders.length; i++) {
                alienInvaders[i] += width + 1;
                direction = -1;
                goingRight = false;
            }
        }

        if (leftEdge && !goingRight) {
            for (let i = 0; i < alienInvaders.length; i++) {
                alienInvaders[i] += width - 1;
                direction = 1;
                goingRight = true;
            }
        }

        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += direction;
        }

        draw();

        //hit shooter
        if (squares[currentShooterIndex].classList.contains("invader", "shooter")) {
            resultDisplay.textContent = "Game Over";
            clearInterval(invadersId);
        }

        //bottom of grid
        for (let i = 0; i < alienInvaders.length; i++) {
            if (alienInvaders[i] > squares.length) {
                resultDisplay.textContent = "Game Over";
                clearInterval(invadersId);
            }
        }

        //check for a win
        if (aliensRemoved.length === alienInvaders.length) {
            resultDisplay.textContent = "You Win";
        }
    }
    invadersId = setInterval(moveInvaders, 5000);

    function shoot(e) {
        let laserId;
        let currentLaserIndex = currentShooterIndex;

        function moveLaser() {
            squares[currentLaserIndex].classList.remove("laser");
            currentLaserIndex -= width;
            squares[currentLaserIndex].classList.add("laser");

            if (squares[currentLaserIndex].classList.contains("invader")) {
                squares[currentLaserIndex].classList.remove("invader");
                squares[currentLaserIndex].classList.remove("laser");
                squares[currentLaserIndex].classList.remove("boom");

                setTimeout(() => squares[currentLaserIndex].classList.remove("boom"));
                clearInterval(laserId);

                const alienRemoved = alienInvaders.indexOf(currentLaserIndex);
                aliensRemoved.push(alienRemoved);
            }
        }
        switch (e.key) {
            case "ArrowUp":
                laserId = setInterval(moveLaser, 100);
        }
    }

    document.addEventListener("keydown", shoot);
});