const foundWordsSet = new Set();
const foundWordsList = document.querySelector("ul.found-words");
const foundWordsForm = document.querySelector("form.words-form");
const gameBoard = document.querySelector(".game-board");
const foundWordBox = foundWordsForm.querySelector("#word-input");

let score = 0;
let countdown = 60;
let timerId;


function setIndicator(s, errMsg=false) {
    const wordStatusIndicator = document.querySelector("#word-status");
    wordStatusIndicator.innerText = s
    
    if (errMsg) {
        wordStatusIndicator.classList.add("status-error")
    }
    else {
        wordStatusIndicator.classList.remove("status-error")
    }
}

function updateScore() {
    const scoreDisp = document.querySelector("#score-num");
    scoreDisp.innerText = score;
}

async function formSubmit(evt) {
    evt.preventDefault();
    
    if(countdown == 0) {
        return
    }
    
    const foundWord = foundWordBox.value;
    foundWordBox.value = "";
    
    setIndicator("...")
    try {
        response = await axios.post("/word", {
            word : foundWord
        })
        const { word, result } = response.data
        
        if (result == "ok" && !foundWordsSet.has(word)) {
            foundWordsSet.add(word)
            setIndicator("")
            
            const newLi = document.createElement("li");
            newLi.innerText = word;
            foundWordsList.appendChild(newLi);
            
            score += word.length;
            updateScore();
        }
        else if (foundWordsSet.has(word)) {
            setIndicator(`The word "${word}" is already found!`, true)
        }
        else if (result == "not-word") {
            setIndicator(`The word "${word}" is not in the dictionary`, true)
        }
        else if (result == "not-on-board") {
            setIndicator(`The word ${word} is not on the board`, true)
        }
        else {
            setIndicator("I don't know how you got here but this shouldn't happen", true)
        }
    }
    catch {
        wordStatusIndicator.innerText = "error in axios request"
    }
}

foundWordsForm.addEventListener("submit", formSubmit);

// startup stuff here: hide the game board
// when you press the button (add this to gameboard.html),
// show the gameboard and start the timer

function countdownInterval(){
    if (--countdown == 0) {
        clearInterval(timerId);
        setIndicator("Time's up!");
        foundWordBox.disabled = true;
        reportScore();
    }
    const timeIndicator = document.querySelector("#timer-num");
    timeIndicator.innerText = countdown
}

function updateRecords(numGames, highScore) {
    const gamesDisp = document.querySelector("#num-games");
    const scoreDisp = document.querySelector("#high-score");
    
    gamesDisp.innerText = numGames;
    scoreDisp.innerText = highScore;
}

async function reportScore() {
    console.log("reporting score")
    response = await axios.post("/stats", {score})
    
    console.log(response.data)
}

gameBoard.style.display = "none";

const startButton = document.querySelector("#start-button");

function startGame() {
    
    // show the game board, hide the start button
    gameBoard.style.display = "initial";
    startButton.style.display = "none";
    
    countdown = 60;
    timerId = setInterval(countdownInterval, 1000)
}

startButton.addEventListener("click", startGame)