document.addEventListener("DOMContentLoaded", () => {
    const cardArray = [{
            name: "fries",
            img: "img/fries.png",
        },
        {
            name: "cheeseburger",
            img: "img/cheeseburger.png",
        },
        {
            name: "hotdog",
            img: "img/hotdog.png",
        },
        {
            name: "ice-cream",
            img: "img/ice-cream.png",
        },
        {
            name: "milkshake",
            img: "img/milkshake.png",
        },
        {
            name: "pizza",
            img: "img/pizza.png",
        },

        {
            name: "fries",
            img: "img/fries.png",
        },
        {
            name: "cheeseburger",
            img: "img/cheeseburger.png",
        },
        {
            name: "hotdog",
            img: "img/hotdog.png",
        },
        {
            name: "ice-cream",
            img: "img/ice-cream.png",
        },
        {
            name: "pizza",
            img: "img/pizza.png",
        },
        {
            name: "milkshake",
            img: "img/milkshake.png",
        },
        // {
        //     name: 'white',
        //     img: 'img/white.png'
        // },
        // {
        //     name: 'blank',
        //     img: 'img/blank.png'
        // }
    ];

    cardArray.sort(() => 0.5 - Math.random());
    const girdDisplay = document.querySelector(".grid");
    var resultDisplay = document.querySelector("#result");
    let cardsChosen = [];
    let cardsChosenIds = [];
    let cardsWon = [];

    function createBoard() {
        for (let i = 0; i < cardArray.length; i++) {
            const card = document.createElement("img");
            card.setAttribute("src", "img/blank.png");
            card.setAttribute("data-id", i);

            card.addEventListener("click", flipCard);
            girdDisplay.appendChild(card);
        }
    }

    createBoard();

    function flipCard() {
        let cardId = this.getAttribute("data-id");
        let cardsName = cardArray[cardId].name;
        cardsChosen.push(cardsName);
        cardsChosenIds.push(cardId);
        this.setAttribute("src", cardArray[cardId].img);

        if (cardsChosen.length == 2) {
            setTimeout(checkMatch, 500);
        }
    }

    console.log(cardsChosen);

    function checkMatch() {
        const cards = document.querySelectorAll("img");
        const optionOneId = cardsChosenIds[0];
        const optionTwoId = cardsChosenIds[1];

        if (cardsChosen[0] == cardsChosen[1]) {
            cards[optionOneId].setAttribute("src", "img/white.png");
            cards[optionTwoId].setAttribute("src", "img/white.png");
            cards[optionOneId].removeEventListener("click", flipCard);
            cards[optionTwoId].removeEventListener("click", flipCard);
            cardsWon.push(cardsChosen);
        } else if (optionOneId == optionTwoId) {
            alert("You have clicked the same card");
            cards[optionOneId].setAttribute("src", "img/blank.png");
            cards[optionTwoId].setAttribute("src", "img/blank.png");
        } else {
            cards[optionOneId].setAttribute("src", "img/blank.png");
            cards[optionTwoId].setAttribute("src", "img/blank.png");
        }

        resultDisplay.textContent = cardsWon.length * 10;
        cardsChosen = [];
        cardsChosenIds = [];

        if (cardsWon.lenth === cardArray.length / 2) {
            resultDisplay.textContent = "You have won";
        }
    }
});