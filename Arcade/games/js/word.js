createGrid();

function createGrid(){
    let grid = document.getElementById("grid");
    if(grid){
        for(let i = 1; i <= 30; i++){
            let cell = document.createElement("div");
            cell.setAttribute("id", `cell${i}`)
            cell.setAttribute("class", "cell");
            grid.appendChild(cell);
        } 
    }
}

function chooseHiddenWord(){
    let randomInt = parseInt((Math.random() * wordBank.length), 10);
    let hiddenWord = wordBank[randomInt];
    return hiddenWord;
}
let hiddenWord = chooseHiddenWord();

let guessIndex = 0;
function executeWordle() {
    let guess = document.getElementById('userInput').value.toUpperCase();
    if (checkGuessForErrors(guess)){
        validGuessList[guessIndex] = guess;
        displayGuessInCells(guessIndex);
        guessIndex = guessIndex + 1;
        if (hiddenWord == guess){
            allowWordleReplay('won');
        }
        else if(guessIndex == 6){
            allowWordleReplay('lost');
        }
    }
    document.getElementById('form').reset();
    return false;
}

function checkGuessForErrors(guess){
    const isRequiredLength = guess.length == 5;
    const isValidWord = wordBank.includes(guess) || allowedWords.includes(guess);
    if(isRequiredLength && isValidWord){
        return true;
    }
    else if (!isRequiredLength){
        alert('Please enter a 5 letter word');
        return false;
    }
    else if (!isValidWord){
        alert('Invalid word');
        return false;
    }
}

function breakStringIntoCharArray(string){
    let charArray = string.split("");
    return charArray;
}

let cellId = 1;
function displayGuessInCells(guessIndex){
    let guessCharArray = breakStringIntoCharArray(validGuessList[guessIndex]);
    guessCharArray.forEach((char, index) => {
        document.getElementById('cell' + cellId).innerHTML = char;
        updateCellColor(cellId, char, index);
        cellId = cellId + 1;   
    });
}

const INCORRECT = "#90A9B7";
const ALMOST = "#FCFF4B"
const CORRECT = "#329F5B"

let correctLetters = [];
function updateCellColor(cellId, char, charIndex) {
    let hiddenWordCharArray = breakStringIntoCharArray(hiddenWord);
    if (hiddenWordCharArray.includes(char)){
        if (char == hiddenWordCharArray[charIndex]){
            correctLetters.push(char);
            document.getElementById('cell' + cellId).style.backgroundColor = CORRECT;
            document.getElementById('cell' + cellId).style.borderColor = CORRECT;
            document.getElementById(char).style.backgroundColor = CORRECT;
            document.getElementById(char).style.borderColor = CORRECT;
            document.getElementById(char).style.color = 'black';
        }
        else{
            document.getElementById('cell' + cellId).style.backgroundColor = ALMOST;
            document.getElementById('cell' + cellId).style.borderColor = ALMOST;
            document.getElementById(char).style.backgroundColor = ALMOST;
            document.getElementById(char).style.borderColor = ALMOST;
            document.getElementById(char).style.color = 'black';
            if(correctLetters.includes(char)){
                document.getElementById(char).style.backgroundColor = CORRECT;
                document.getElementById(char).style.borderColor = CORRECT;
                document.getElementById(char).style.color = 'black';
            }
        }
    }
    else{
        document.getElementById('cell' + cellId).style.backgroundColor = INCORRECT;
        document.getElementById('cell' + cellId).style.borderColor = INCORRECT;
        document.getElementById(char).style.backgroundColor = INCORRECT;
        document.getElementById(char).style.color = 'black';
    }
}

function allowWordleReplay(status){
    document.getElementById('form').style.display = 'none';
    document.getElementById('gameOver').style.display = 'flex';
    if (status == 'won'){
        document.getElementById('status').innerHTML = "WINNER!";
        document.getElementById('answer').style.display = 'none';

    }
    else if(status == 'lost'){
        document.getElementById('status').innerHTML = "LOSER!";
        document.getElementById('answer').innerHTML = "The correct answer was " + hiddenWord;
    }
}

function input(e){
    let userInput = document.getElementById('userInput');
    if (userInput.value.length < 5){
        userInput.value = userInput.value + e.value;
    }
}

function del(){
    let userInput = document.getElementById('userInput');
    userInput.value = userInput.value.substr(0, userInput.value.length - 1);
}