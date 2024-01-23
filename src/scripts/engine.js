const state = {
    score:{
        playerScore: 0,
        computerScore: 0,
        scoreWin: document.getElementById("score_win"),
        scoreDefeat: document.getElementById("score_defeat")
    },
    cardSprites: {
       avatar: document.getElementById("img_card"), 
       name: document.getElementById("card_name"), 
       type: document.getElementById("card_type")
    },
    fieldCards:{
        player: document.getElementById("player_field_card"),
        computer: document.getElementById("computer_field_card")
    },
    actions: {
        button: document.getElementById("next_duel"),
    },

}

const playerSides = {
    player1: "player",
    computer: "computer"
}

const cardData = [
    {
        id: 0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: "./src/assets/icons/dragon.png",
        WinOf: [1],
        LoseOf: [2]
    },

    {
        id: 1,
        name: "Dark Magician",
        type: "Rock",
        img: "./src/assets/icons/magician.png",
        WinOf: [2],
        LoseOf: [0]
    },

    {
        id: 2,
        name: "Exodia",
        type: "Scissors",
        img: "./src/assets/icons/exodia.png",
        WinOf: [0],
        LoseOf: [1],
    },
]

async function getRandomCardID(){
    const randomIndex = Math.floor(Math.random() * cardData.length)
    return cardData[randomIndex].id;
}

async function createCardImage(IdCard, fieldSide){
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "120px");
    cardImage.setAttribute("width", "100px");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", IdCard);
    cardImage.classList.add("card");

    if (fieldSide === playerSides.player1){
        cardImage.addEventListener("click",()=>{
            setCardsField(cardImage.getAttribute("data-id"));
        })

        cardImage.addEventListener("mouseover", () =>{
            drawSelectCard(IdCard);
        })
    }

    return cardImage;
}

async function drawSelectCard(IdCard){
    state.cardSprites.avatar.src = cardData[IdCard].img;
    state.cardSprites.name.innerText = cardData[IdCard].name;
    state.cardSprites.type.innerText = "Attribute : " + cardData[IdCard].type;
}

async function drawCards(cardNumbers, fieldSide){
    for(let i = 0; i < cardNumbers; i++){
        const randomIdCard = await getRandomCardID();
        const cardImage = await createCardImage(randomIdCard, fieldSide);

        document.getElementById(fieldSide).appendChild(cardImage);
    }

}

async function setCardsField(cardId){
    await removeAllCardsImages();

    let computerCardId = await getRandomCardID();

    state.fieldCards.player.style.display = "block";
    state.fieldCards.computer.style.display = "block";

    state.cardSprites.avatar.src = "";
    state.cardSprites.name.innerText = ""; //Reseta as informações das cartas 
    state.cardSprites.type.innerText = "";

    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;

    let duelResults = await checkDuelResults(cardId, computerCardId)

    await updateScore();
    await drawButton(duelResults);
}

async function removeAllCardsImages(){
    let cards = document.querySelector("#computer");
    let imgElements = cards.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());

    cards = document.querySelector("#player");
    imgElements = cards.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());
}

async function checkDuelResults(playerCardId, computerCardId){
    let duelResults = "Empate";
    let playerCard = cardData[playerCardId];

    if (playerCard.WinOf.includes(computerCardId)){
        duelResults = "Ganhou";
        await playAudio("win")
        state.score.playerScore++;
    }

    if (playerCard.LoseOf.includes(computerCardId)){
        duelResults = "Derrota";
        await playAudio("lose")
        state.score.computerScore++;
    }
    return duelResults;
}

async function drawButton(text){
    state.actions.button.innerText = text;
    state.actions.button.style.display = "block";
}

async function updateScore(){
    state.score.scoreWin.innerText = "WIN : " + state.score.playerScore;
    state.score.scoreDefeat.innerText = "LOSE : " + state.score.computerScore;
}

async function resetDuel(){
    state.cardSprites.avatar.src = "";
    state.actions.button.style.display = "none";

    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display ="none";

    init();
}

async function playAudio(status){
    const audio = new Audio(`./src/assets/audios/${status}.wav`)
    audio.play();
}

function init() {
    drawCards(5, playerSides.player1);
    drawCards(5, playerSides.computer);

    const backgroundmusic = 
    document.getElementById("backgroundmusic");

    backgroundmusic.play()
}

init();