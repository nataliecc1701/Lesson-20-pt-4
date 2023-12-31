const foundWordsSet = new Set();
const foundWordsList = document.querySelector("ul.found-words");
const foundWordsForm = document.querySelector("form.words-form");
const gameBoard = document.querySelector(".game-board");
const foundWordBox = foundWordsForm.querySelector("#word-input");

let score = 0;
let countdown = 60;
let timerId;

class Game {
    constructor() {
        this.score = 0
        this.countdown = 60
    }
    
    setIndicator(s, errMsg=false) {
        const wordStatusIndicator = document.querySelector("#word-status");
        wordStatusIndicator.innerText = s
        
        if (errMsg) {
            wordStatusIndicator.classList.add("status-error")
        }
        else {
            wordStatusIndicator.classList.remove("status-error")
        }
    }
    
    updateScore() {
        const scoreDisp = document.querySelector("#score-num");
        scoreDisp.innerText = score;
    }
    
    updateRecords(numGames, highScore) {
        const gamesDisp = document.querySelector("#num-games");
        const scoreDisp = document.querySelector("#high-score");
        
        gamesDisp.innerText = numGames;
        scoreDisp.innerText = highScore;
    }
    
    async reportScore() {
        response = await axios.post("/stats", {score})
        const { gamesPlayed, highScore } = response.data;
        
        this.updateRecords(gamesPlayed, highScore);
    }
}

// these functions are called as event listeners
// so they don't go inside a class because otherwise I have to deal with the tangle that
// javascript makes of this.

async function formSubmit(evt) {
    evt.preventDefault();
    
    if(game.countdown == 0) {
        return
    }
    
    const foundWord = foundWordBox.value;
    foundWordBox.value = "";
    
    game.setIndicator("...")
    try {
        response = await axios.get(`/word?word=${foundWord}`)
        const { word, result } = response.data
        
        if (result == "ok" && !foundWordsSet.has(word)) {
            foundWordsSet.add(word)
            game.setIndicator("")
            
            const newLi = document.createElement("li");
            newLi.innerText = word;
            foundWordsList.appendChild(newLi);
            
            score += word.length;
            game.updateScore();
        }
        else if (foundWordsSet.has(word)) {
            game.setIndicator(`The word "${word}" is already found!`, true)
        }
        else if (result == "not-word") {
            game.setIndicator(`The word "${word}" is not in the dictionary`, true)
        }
        else if (result == "not-on-board") {
            game.setIndicator(`The word ${word} is not on the board`, true)
        }
        else {
            game.setIndicator("I don't know how you got here but this shouldn't happen", true)
        }
    }
    catch {
        game.setIndicator("error in axios request", true);
    }
}

function countdownInterval(){
    if (--game.countdown == 0) {
        clearInterval(game.timer);
        game.setIndicator("Time's up!");
        foundWordBox.disabled = true;
        game.reportScore();
    }
    const timeIndicator = document.querySelector("#timer-num");
    timeIndicator.innerText = game.countdown
}

// startup stuff here: hide the game board
// when you press the button (add this to gameboard.html),
// show the gameboard and start the timer

game = new Game;
foundWordsForm.addEventListener("submit", formSubmit);

gameBoard.style.display = "none";
const startButton = document.querySelector("#start-button");


// one last event listener
function startGame() {
    
    // show the game board, hide the start button
    gameBoard.style.display = "initial";
    startButton.style.display = "none";
    
    game.countdown = 60;
    game.timer = setInterval(countdownInterval, 1000)
}

startButton.addEventListener("click", startGame)