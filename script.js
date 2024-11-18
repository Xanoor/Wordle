
letter_edition = false

var gameData = {
    canPlay: true,
    wordStep: 0,
    wordToFind: setNewValue(),
    word: "",
    lettersFound: 0
    
}

var wordleGridElements = {
    gridCases: {},
    inputCases: [],
    row: 0
}


for (i=0; i<5; i++) {
    wordleGridElements.inputCases.push(document.getElementById("wordStep"+i))
}

function setNewValue() {
    if (letter_edition) {
        return Math.floor(Math.random() * 99999).toString()
    } else {
        return words[Math.floor(Math.random() * words.length)].toUpperCase()
    }
}

getActualRow()
setIndicator()

function getActualRow() {
    for (i=0; i<5; i++) {
        _row = document.getElementById('row'+i)
        wordleGridElements.gridCases["row"+i] = []
        for (k=0; k<5; k++) {
            var _case = document.createElement('div')
            _case.id = "r"+i+"c"+k
            _case.className = "row-case"
            _row.appendChild(_case)
            wordleGridElements.gridCases["row"+i].push(_case)
        }
    }
}

function clearCases() {
    for (i=0; i<5; i++) {
        for (k=0; k<5; k++) {
            wordleGridElements.gridCases["row"+i][k].classList.remove("valid")
            wordleGridElements.gridCases["row"+i][k].classList.remove("almost")
            wordleGridElements.gridCases["row"+i][k].classList.remove("fail")
            wordleGridElements.gridCases["row"+i][k].innerText = ""
        }
    }
}

async function setNewRow() {
    resetInput();
    gameData.lettersFound = 0
    for (let i = 0; i < gameData.word.length; i++) {
        if (gameData.wordToFind[i] == gameData.word[i]) {
            wordleGridElements.gridCases["row" + wordleGridElements.row][i].classList.add("valid");
            gameData.lettersFound+=1
        } else if (gameData.wordToFind.indexOf(gameData.word[i]) > -1) {
            wordleGridElements.gridCases["row" + wordleGridElements.row][i].classList.add("almost");
        } else {
            wordleGridElements.gridCases["row" + wordleGridElements.row][i].classList.add("fail");
        }

        wordleGridElements.gridCases["row" + wordleGridElements.row][i].innerText = gameData.word[i];

        await new Promise(resolve => setTimeout(resolve, 200));
    }


    gameData.word = "";
    gameData.wordStep = 0;
    wordleGridElements.row += 1;
    if (wordleGridElements.row==5 && gameData.lettersFound<5) {
        reveal()
        gameData.canPlay = false
    } else if (gameData.lettersFound == 5) {
        gameData.canPlay = false
    } else {
        setIndicator()
    }
}

async function reveal() {
    for (i=0; i<5; i++) {
        wordleGridElements.inputCases[i].innerText = gameData.wordToFind[i]
        await new Promise(resolve => setTimeout(resolve, 200));
    }
}

function resetInput() {
    for (i=4; i>=0; i--) {
        wordleGridElements.inputCases[i].innerText = ""
    }
    setIndicator()
}

addEventListener("keydown", (event) => {
    if (event.key == "Backspace" && gameData.canPlay) {
        if (gameData.wordStep > 0) {
            wordleGridElements.inputCases[gameData.wordStep-1].innerText = ""
            gameData.word = gameData.word.slice(0, -1)
            gameData.wordStep--
            setIndicator()
        }
    }
    if (event.key == "Enter") {
        if (gameData.word.length == 5 && gameData.canPlay) {
            setNewRow()
        } else if (!gameData.canPlay) {
            resetInput()
            clearCases()
            gameData.wordStep = 0
            wordleGridElements.row = 0
            gameData.wordToFind = setNewValue()
            gameData.word = ""
            gameData.lettersFound = 0
            gameData.canPlay = true
        }
    }
});


addEventListener("keypress", (event) => {
    if (gameData.wordStep < wordleGridElements.inputCases.length && event.key.length == 1 && gameData.canPlay && event.key != "_") {
        wordleGridElements.inputCases[gameData.wordStep].innerText = event.key.toUpperCase()
        gameData.word+=event.key.toUpperCase()
        gameData.wordStep++
        setIndicator()
    }
});

function setIndicator() {
    for (i=0; i<5; i++) {
        if (i == gameData.wordStep) {
            wordleGridElements.inputCases[i].innerText = "_"
        } else if (wordleGridElements.inputCases[i].innerText =="_") {
            wordleGridElements.inputCases[i].innerText = ""
        }
    }
}

