let words = {
    4: [],
    5: [],
    6: []
};

let selectedWord = "";
let wordLength = 5;
let maxAttempts = 6;
let currentAttempt = 0;
let attempts = [];
const inputField = document.getElementById("myInput");
const gameBoard = document.getElementById("game-board");

fetch('index.txt')
    .then(response => response.text())
    .then(data => {
        const lines = data.split('\n');
        lines.forEach(line => {
            const word = line.split('/')[0].trim().toUpperCase(); 
            if (word.length >= 4 && word.length <= 6) {
                words[word.length].push(word);
            }
        });
        console.log(words); // For debugging purposes
    })
    .catch(error => console.error('Error loading words:', error));

// obtížnost hry
document.querySelectorAll(".count").forEach(button => {
    button.addEventListener("click", (e) => {
        wordLength = parseInt(e.target.innerText);
        startGame();
    });
});

function startGame() {
    if (words[wordLength].length === 0) {
        alert(`Nejsou dostupná slova pro délku ${wordLength}.`);
        return;
    }
    selectedWord = words[wordLength][Math.floor(Math.random() * words[wordLength].length)];
    currentAttempt = 0;
    attempts = [];
    clearInputField();
    renderGameBoard();
    console.log("Selected word:", selectedWord);
}

function renderGameBoard() {
    gameBoard.innerHTML = "";
    for (let i = 0; i < maxAttempts; i++) {
        const attemptRow = document.createElement("div");
        attemptRow.className = "attempt";
        for (let j = 0; j < wordLength; j++) {
            const letterBox = document.createElement("div");
            letterBox.className = "letter";
            attemptRow.appendChild(letterBox);
        }
        gameBoard.appendChild(attemptRow);
    }
}

document.querySelectorAll(".keyboard-button").forEach(button => {
    button.addEventListener("click", (e) => {
        handleInput(e.target.innerText);
    });
});

inputField.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        handleInput("Enter");
    } else if (e.key === "Backspace" || e.key === "Delete") {
        handleInput("Del");
    } else if (/^[a-zA-Zěščřžýáíéňďóťůú]$/i.test(e.key)) {
        handleInput(e.key.toUpperCase());
    }
});

function handleInput(key) {
    if (key === "Enter") {
        checkAttempt();
    } else if (key === "Del") {
        inputField.value = inputField.value.slice(0, -1);
    } else if (inputField.value.length < wordLength) {
        inputField.value += key;
    }
    updateDisplay();
}

function updateDisplay() {
    const currentRow = gameBoard.children[currentAttempt];
    const letters = currentRow.children;
    const attempt = inputField.value.toUpperCase();

    for (let i = 0; i < wordLength; i++) {
        if (i < attempt.length) {
            letters[i].textContent = attempt[i];
        } else {
            letters[i].textContent = "";
        }
    }
}

function checkAttempt() {
    const attempt = inputField.value.toUpperCase();
    if (attempt.length !== wordLength) {
        alert(`Slovo musí mít ${wordLength} písmen.`);
        return;
    }
    currentAttempt++;
    attempts.push(attempt);
    provideFeedback(attempt);
    if (attempt === selectedWord) {
        alert(`Gratulujeme! Uhodli jste slovo! Správné slovo bylo: ${selectedWord}`);
        startGame();
    } else if (currentAttempt >= maxAttempts) {
        alert(`Prohráli jste! Správné slovo bylo: ${selectedWord}`);
        startGame();
    }
    clearInputField();
}

function provideFeedback(attempt) {
    const currentRow = gameBoard.children[currentAttempt - 1];
    const letters = currentRow.children;
    const selectedWordArray = selectedWord.split('');
    const attemptArray = attempt.split('');

 
    const letterMatchStatus = Array(wordLength).fill('incorrect');

    for (let i = 0; i < wordLength; i++) {
        if (attemptArray[i] === selectedWordArray[i]) {
            letterMatchStatus[i] = 'correct';
            selectedWordArray[i] = null; 
        }
    }

    // Second pass: check for misplaced letters (pink)
    for (let i = 0; i < wordLength; i++) {
        if (letterMatchStatus[i] !== 'correct' && selectedWordArray.includes(attemptArray[i])) {
            letterMatchStatus[i] = 'misplaced';
            selectedWordArray[selectedWordArray.indexOf(attemptArray[i])] = null;
        }
    }

    // Apply classes to letters
    for (let i = 0; i < wordLength; i++) {
        letters[i].className = 'letter ' + letterMatchStatus[i];
    }
}

function clearInputField() {
    inputField.value = "";
}

startGame();
