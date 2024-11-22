// === Game Initialization and Configuration ===

// Defines accepted characters for letter and number modes
const accepted_chars = {
    letters: "abcdefghijklmnopqrstuvwxyz",
    numbers: "0123456789"
};
number_mode = false

// Global game data
var gameData = {
    canPlay: true,
    step: 0,
    valueToFind: setNewValue(),
    typedValue: "",
    lettersFound: 0
};

// DOM elements and game structure
var wordleElements = {
    gridCases: {},
    inputCases: [],
    revealCases: [],
    revealSection: document.getElementsByClassName('reveal-section')[0],
    optionMenu: document.getElementById('option-menu'),
    playAgain: document.getElementById('playAgain'),
    row: 0
};

// === Initialization Functions ===

// Initializes the game (creates grid, resets values)
function startGame() {
    for (let i = 0; i < 5; i++) {
        wordleElements.revealCases.push(document.getElementById("reveal" + i));
    }
    createRows();
    setIndicator();
    document.getElementById("switchMode").checked = false; 
}
startGame();

// Sets a new target value (random number or word)
function setNewValue() {
    if (number_mode) {
        return Math.floor(Math.random() * 99999).toString();
    } else {
        return words[Math.floor(Math.random() * words.length)].toUpperCase();
    }
}

// === UI Management Functions ===

// Toggles the options menu display
function option() {
    if (wordleElements.optionMenu.style.display == "block") {
        wordleElements.optionMenu.style.display = "none";
    } else {
        wordleElements.optionMenu.style.display = "block";
    }
}

// Resets the grid and game data
function clearCases() {
    gameData.step = 0;
    wordleElements.row = 0;
    gameData.valueToFind = setNewValue();
    gameData.typedValue = "";
    gameData.lettersFound = 0;
    gameData.canPlay = true;

    for (let i = 0; i < 5; i++) {
        for (let k = 0; k < 5; k++) {
            wordleElements.gridCases["row" + i][k].classList.remove("valid", "almost", "fail");
            wordleElements.gridCases["row" + i][k].innerText = "";
        }
    }

    getNewRow();
    setIndicator();
}

// Updates input indicators to show the current typing position
function setIndicator() {
    for (let i = 0; i < 5; i++) {
        if (i == gameData.step) {
            wordleElements.inputCases[i].innerText = "_";
        } else if (wordleElements.inputCases[i].innerText == "_") {
            wordleElements.inputCases[i].innerText = "";
        }
    }
}

// Toggles between letter and number modes based on the checkbox state
function switchMode(checkbox) {
    number_mode = checkbox.checked;
    clearCases();
}

// === Game Logic Functions ===

// Creates the grid rows and initializes the grid structure
function createRows() {
    for (let i = 0; i < 5; i++) {
        let _row = document.getElementById('row' + i);
        wordleElements.gridCases["row" + i] = [];

        for (let k = 0; k < 5; k++) {
            var _case = document.createElement('div');
            _case.id = "r" + i + "c" + k;
            _case.className = "row-case";
            _row.appendChild(_case);
            wordleElements.gridCases["row" + i].push(_case);
        }
    }
    getNewRow();
}

// Sets up a new row for input
function getNewRow() {
    wordleElements.inputCases = [];
    for (let i = 0; i < 5; i++) {
        wordleElements.inputCases.push(wordleElements.gridCases["row" + wordleElements.row][i]);
    }
}

// Reveals the solution when the player runs out of attempts
async function reveal() {
    wordleElements.revealSection.classList.add('active');
    await new Promise(resolve => setTimeout(resolve, 750));

    for (let i = 0; i < 5; i++) {
        wordleElements.revealCases[i].innerText = gameData.valueToFind[i];
        await new Promise(resolve => setTimeout(resolve, 200));
    }
    wordleElements.playAgain.style.display = "block"
}

// Validates the current word and updates the grid with feedback
async function setNewRow() {
    gameData.lettersFound = 0;

    for (let i = 0; i < gameData.typedValue.length; i++) {
        if (gameData.valueToFind[i] == gameData.typedValue[i]) {
            wordleElements.gridCases["row" + wordleElements.row][i].classList.add("valid");
            gameData.lettersFound += 1;
        } else if (gameData.valueToFind.indexOf(gameData.typedValue[i]) > -1) {
            wordleElements.gridCases["row" + wordleElements.row][i].classList.add("almost");
        } else {
            wordleElements.gridCases["row" + wordleElements.row][i].classList.add("fail");
        }

        wordleElements.gridCases["row" + wordleElements.row][i].innerText = gameData.typedValue[i];
        await new Promise(resolve => setTimeout(resolve, 200));
    }

    gameData.typedValue = "";
    gameData.step = 0;
    wordleElements.row += 1;

    if (wordleElements.row == 5 && gameData.lettersFound < 5) {
        reveal();
        gameData.canPlay = false;
    } else if (gameData.lettersFound == 5) {
        gameData.canPlay = false;
        wordleElements.playAgain.style.display = "block"
    } else {
        getNewRow();
        setIndicator();
    }
}

// === Event Handlers ===

// Handles keydown events for Backspace and Enter keys
addEventListener("keydown", (event) => {
    if (event.key == "Backspace" && gameData.canPlay) {
        if (gameData.step > 0) {
            wordleElements.inputCases[gameData.step - 1].innerText = "";
            gameData.typedValue = gameData.typedValue.slice(0, -1);
            gameData.step--;
            setIndicator();
        }
    }

    if (event.key == "Enter") {
        if (gameData.typedValue.length == 5 && gameData.canPlay) {
            setNewRow();
        } else if (!gameData.canPlay) {
            clearCases();
            getNewRow();
            wordleElements.revealSection.classList.remove('active');
            for (let i = 0; i < 5; i++) {
                wordleElements.revealCases[i].innerText = "";
            }
            setIndicator();
            wordleElements.playAgain.style.display = "none"
        }
    }
});

// Handles keypress events for character input
addEventListener("keypress", (event) => {
    if (event.key == "Enter") return;
    if (wordleElements.optionMenu.style.display == "block") wordleElements.optionMenu.style.display = "none"
    if (gameData.step < wordleElements.inputCases.length && event.key.length == 1 && gameData.canPlay && accepted_chars[number_mode ? "numbers" : "letters"].includes(event.key.toLowerCase())) {

        wordleElements.inputCases[gameData.step].innerText = event.key.toUpperCase();
        gameData.typedValue += event.key.toUpperCase();
        gameData.step++;
        setIndicator();
    } else if (!accepted_chars[number_mode ? "numbers" : "letters"].includes(event.key.toLowerCase())) {
        wordleElements.inputCases[gameData.step].classList.add("error");
        setTimeout(() => {
            wordleElements.inputCases[gameData.step].classList.remove("error");
        }, 500);
    }
});