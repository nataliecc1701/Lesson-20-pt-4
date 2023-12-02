const foundWordsSet = new Set();
const foundWordsList = document.querySelector("ul.found-words");
const foundWordsForm = document.querySelector("form.words-form");
const foundWordBox = foundWordsForm.querySelector("#word-input");


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

async function formSubmit(evt) {
    evt.preventDefault();
    
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