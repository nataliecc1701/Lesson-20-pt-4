const foundWordsSet = new Set();
const foundWordsList = document.querySelector("ul.found-words");
const foundWordsForm = document.querySelector("form.words-form");
const foundWordBox = foundWordsForm.querySelector("#word-input")

async function formSubmit(evt) {
    evt.preventDefault();
    
    const foundWord = foundWordBox.value;
    foundWordBox.value = "";
    
    try {
        response = await axios.post("/word", {
            word : foundWord
        })
    }
    catch {
        alert("error in axios request")
    }
    
    // foundWordsSet.add(foundWord);
    
    // const newLi = document.createElement("li");
    // newLi.innerText = foundWord;
    
    // foundWordsList.appendChild(newLi);
}

foundWordsForm.addEventListener("submit", formSubmit);