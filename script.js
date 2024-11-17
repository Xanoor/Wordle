const words = [
    "AVION",
    "BONNE",
    "DURER",
    "ECRAN",
    "FLEUR",
    "GRAVE",
    "HOTEL",
    "JOUER",
    "LIVRE",
    "MOTEL",
    "NAPPE",
    "OPERA",
    "PLAGE",
    "QUOTA",
    "RIVET",
    "SABLE",
    "TACHE",
    "UNION",
    "WAGON",
    "YACHT",
    "ZEBRE"
];

var canPlay = true
var wordStep = 0
var row = 0
var inputCases = []
var wordToFind = words[Math.floor(Math.random() * words.length)]
var keyList = "abcdefghijklmnopqrstuvwxyz"
var word = ""
var gridCases = {}
var lettersFound = 0

for (i=0; i<5; i++) {
    inputCases.push(document.getElementById("wordStep"+i))
}



console.log(inputCases)

function getActualRow() {
    for (i=0; i<5; i++) {
        _row = document.getElementById('row'+i)
        gridCases["row"+i] = []
        for (k=0; k<5; k++) {
            var _case = document.createElement('div')
            _case.id = "r"+i+"c"+k
            _case.className = "row-case"
            _row.appendChild(_case)
            gridCases["row"+i].push(_case)
        }
    }
    console.log(gridCases)
}
getActualRow()

function clearCases() {
    for (i=0; i<5; i++) {
        for (k=0; k<5; k++) {
            gridCases["row"+i][k].classList.remove("valid")
            gridCases["row"+i][k].classList.remove("almost")
            gridCases["row"+i][k].classList.remove("fail")
            gridCases["row"+i][k].innerText = ""
        }
    }
}

async function setNewRow() {
    resetInput();
    lettersFound = 0
    for (let i = 0; i < word.length; i++) {
        if (wordToFind[i] == word[i]) {
            gridCases["row" + row][i].classList.add("valid");
            lettersFound+=1
        } else if (wordToFind.indexOf(word[i]) > -1) {
            gridCases["row" + row][i].classList.add("almost");
        } else {
            gridCases["row" + row][i].classList.add("fail");
        }

        gridCases["row" + row][i].innerText = word[i];

        await new Promise(resolve => setTimeout(resolve, 200));
    }


    word = "";
    wordStep = 0;
    row += 1;
    if (row==5 && lettersFound<5) {
        reveal()
        canPlay = false
    } else if (lettersFound == 5) {
        canPlay = false
    } else {
        setIndicator()
    }
}

async function reveal() {
    for (i=0; i<5; i++) {
        inputCases[i].innerText = wordToFind[i]
        await new Promise(resolve => setTimeout(resolve, 200));
    }
}

function resetInput() {
    for (i=4; i>=0; i--) {
        inputCases[i].innerText = ""
    }
    setIndicator()
}

addEventListener("keydown", (event) => {
    if (event.key == "Backspace" && canPlay) {
        if (wordStep > 0) {
            inputCases[wordStep-1].innerText = ""
            word = word.slice(0, -1)
            wordStep--
            setIndicator()
        }
    }
    if (event.key == "Enter") {
        if (word.length == 5 && canPlay) {
            setNewRow()
        } else if (!canPlay) {
            resetInput()
            clearCases()
            wordStep = 0
            row = 0
            wordToFind = words[Math.floor(Math.random() * words.length)]
            word = ""
            lettersFound = 0
            canPlay = true
        }
    }
});


addEventListener("keypress", (event) => {
    if (wordStep < inputCases.length && event.key.length == 1 && canPlay && event.key != "_") {
        inputCases[wordStep].innerText = event.key.toUpperCase()
        word+=event.key.toUpperCase()
        wordStep++
        setIndicator()
    }
});

function setIndicator() {
    for (i=0; i<5; i++) {
        if (i == wordStep) {
            inputCases[i].innerText = "_"
        } else if (inputCases[i].innerText =="_") {
            inputCases[i].innerText = ""
        }
    }
}

setIndicator()
