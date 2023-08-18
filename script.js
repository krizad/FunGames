// Get DOM elements
const startButton = document.getElementById('start-button');
const autoPlayButton = document.getElementById('auto-play-button');
const resetButton = document.getElementById('reset-button');
const rollDiceButton = document.getElementById('roll-dice-button');
const diceContainer = document.getElementById('dice-container');
const targetContainer = document.getElementById('target-container');
const dice1Element = document.getElementById('dice1');
const dice2Element = document.getElementById('dice2');
const totalElement = document.getElementById('total');
const remainingTargetsElement = document.getElementById('remaining-targets');
const chosenNumbersInput = document.getElementById('chosen-numbers');
const submitButton = document.getElementById('submit-button');
const resultElement = document.getElementById('result');

let intervalId;
var dice1 = 0;
var dice2 = 0;

// Initialize game variables
let targetNumbers
let rollCount = 0;

let canPlay = true;


// Add event listener to start button
startButton.addEventListener('click', () => {
    startGame();
});

autoPlayButton.addEventListener('click', () => {
    startAutoPlay();
});

resetButton.addEventListener('click', () => {
    resetGame();
});

// Add event listener to roll dice button
rollDiceButton.addEventListener('click', () => {
    dice1 = rollDice();
    dice2 = rollDice();
    updateUI(dice1, dice2);
    showElement(diceContainer);
    showElement(submitButton);

    canPlay = checkCanPlay(dice1, dice2, targetNumbers, rollCount)

    //check if game is over
    if (!canPlay) {
        submitButton.disabled = true;
        rollDiceButton.disabled = true;

        const logList = document.getElementById('log-list');
        const logListItem = document.createElement('li');
        logListItem.textContent = `Game over! You cannot match any numbers in ${rollCount} rolls.`;
        logList.appendChild(logListItem);

        return;
    }

    //disable roll dice button if dice have been rolled
    rollDiceButton.disabled = true;
    //enable submit button if dice have been rolled
    submitButton.disabled = false;

    resultElement.textContent = '';
});

// Add event listener to submit button
submitButton.addEventListener('click', () => {
    submitNumbers();
});

//Start game
function startGame() {
    showElement(diceContainer);
    showElement(targetContainer);
    hideElement(startButton);
    hideElement(autoPlayButton);
    showElement(rollDiceButton);
    hideElement(submitButton);
    showElement(resetButton);
    rollCount = 0;
    targetNumbers = Array.from({ length: 9 }, (_, i) => i + 1);
    updateRemainingTargets();
    resultElement.textContent = '';
    dice1Element.textContent = '';
    dice2Element.textContent = '';
    totalElement.textContent = '';
    chosenNumbersInput.value = '';
}

//Roll dice
function rollDice() {
    return Math.floor(Math.random() * 6) + 1;
}

// Submit chosen numbers
function submitNumbers() {
    const total = dice1 + dice2;
    const chosenNumbers = chosenNumbersInput.value
        .split(',')
        .map(num => parseInt(num.trim()))
        .filter(num => !isNaN(num));
    
    //check if chosen are the same
    if (chosenNumbers.length !== new Set(chosenNumbers).size) {
        resultElement.textContent = 'Sorry, you cannot choose the same number more than once.';
        return;
    }

    if (chosenNumbers.length > 0 && chosenNumbers.reduce((sum, num) => sum + num, 0) === total) {
        const matchedNumbers = chosenNumbers.filter(num => targetNumbers.includes(num));

        if (matchedNumbers.length === chosenNumbers.length) {
            for (const matchedNumber of matchedNumbers) {
                targetNumbers = targetNumbers.filter(num => num !== matchedNumber);
            }
            rollCount++;
            resultElement.textContent = 'Congratulations! You matched the chosen numbers!';
            //disable submit button if game is over
            submitButton.disabled = true;
            //reset chosen numbers input
            chosenNumbersInput.value = '';
            //enable roll dice button if game is not over
            if (targetNumbers.length > 0) {
                rollDiceButton.disabled = false;
            }
            addLogList(dice1, dice2, chosenNumbers, rollCount);
        } else {
            resultElement.textContent = 'Sorry, not all chosen numbers match.';
        }
    } else {
        resultElement.textContent = 'Sorry, try again!';
    }

    updateRemainingTargets();

    if (targetNumbers.length === 0) {
        resultElement.textContent = `Congratulations! You matched all numbers in ${rollCount} rolls.`;
        submitButton.disabled = true;
        rollDiceButton.disabled = true;

        const logList = document.getElementById('log-list');
        const logListItem = document.createElement('li');
        logListItem.textContent = `Winner!!: You matched all numbers in ${rollCount} rolls.`;
        logList.appendChild(logListItem);

        canPlay = false;

    }
}

//Reset game
function resetGame() {
    hideElement(diceContainer);
    hideElement(targetContainer);
    showElement(startButton);
    showElement(autoPlayButton);
    hideElement(rollDiceButton);
    hideElement(submitButton);
    hideElement(resetButton);
    rollCount = 0;
    targetNumbers = Array.from({ length: 9 }, (_, i) => i + 1);
    updateRemainingTargets();
    resultElement.textContent = '';
    dice1Element.textContent = '';
    dice2Element.textContent = '';
    totalElement.textContent = '';
    chosenNumbersInput.value = '';

    rollDiceButton.disabled = false;

    const logList = document.getElementById('log-list')
    logList.innerHTML = '';

    canPlay = true;


}

// Function to update UI with dice rolls and total
function updateUI(dice1, dice2) {
    dice1Element.textContent = dice1;
    dice2Element.textContent = dice2;
    totalElement.textContent = dice1 + dice2;
}

// Function to update UI with remaining target numbers
function updateRemainingTargets() {
    remainingTargetsElement.textContent = targetNumbers.join(', ');
}

// Function to hide element
function hideElement(element) {
    element.classList.add('hidden');
}

// Function to show element
function showElement(element) {
    element.classList.remove('hidden');
}

function addLogList(dice1, dice2, chosenNumbers, rollCount) {
    const logList = document.getElementById('log-list');
    const logListItem = document.createElement('li');
    logListItem.textContent = `${rollCount}: You rolled ${dice1} and ${dice2}. You chose ${chosenNumbers.join(', ')}.`;
    logList.appendChild(logListItem);
}

function checkCanPlay(dice1, dice2, targetNumbers) {
    const total = dice1 + dice2;
    const sums = getDistinctSums(targetNumbers);
    return sums.includes(total);

}

function getDistinctSums(numbers) {
    const result = new Set(); // To store unique sums

    // Recursive function to generate combinations
    function generateCombinations(startIndex, currentSum, currentSet) {
        if (currentSum > 12) {
            return;
        }
        if (currentSet.size >= 1) { // Change condition to allow single numbers
            result.add(currentSum);
        }

        for (let i = startIndex; i < numbers.length; i++) {
            currentSet.add(numbers[i]);
            generateCombinations(i + 1, currentSum + numbers[i], currentSet);
            currentSet.delete(numbers[i]);
        }
    }

    generateCombinations(0, 0, new Set());

    return Array.from(result);
}

function getDistinctSumsAndNumbers() {
    const result = new Set(); // To store unique sums

    // Recursive function to generate combinations
    function generateCombinations(startIndex, currentSum, currentSet) {
        if (currentSum > 12) {
            return;
        }

        if (currentSet.size >= 1) { // Change condition to allow single numbers
            result.add({ sum: currentSum, numbers: Array.from(currentSet) });
        }

        for (let i = startIndex; i < targetNumbers.length; i++) {
            currentSet.add(targetNumbers[i]);
            generateCombinations(i + 1, currentSum + targetNumbers[i], currentSet);
            currentSet.delete(targetNumbers[i]);
        }
    }

    generateCombinations(0, 0, new Set());

    return Array.from(result);
}

function startAutoPlay() {
    startGame();
    autoPlay()
    intervalId = setInterval(autoPlay, 3000);


}

async function autoPlay() {

    // Step 1
    await autoRollDices();

    if (!canPlay) {
        clearInterval(intervalId);
        return;
    }

    // Step 2
    await autoFillNumber();

    // Step 3
    await autoSubmit();

}

// Simulated asynchronous functions
function autoRollDices() {
    return new Promise(resolve => {
        setTimeout(() => {
            rollDiceButton.click();
            resolve();
        }, 1000);
    });
}

function autoFillNumber() {
    return new Promise(resolve => {
        setTimeout(() => {
            //enter random combination of numbers to match total
            let total = dice1 + dice2;
            let allPossibleSums = getDistinctSumsAndNumbers();

            let chosenNumbers = allPossibleSums.filter(sum => sum.sum === total).sort((a, b) => a.numbers.length - b.numbers.length);
            console.log(chosenNumbers);
            //choose minimum number of numbers to match total
            chosenNumbersInput.value = chosenNumbers[0].numbers.join(',');
            resolve();
        }, 1000);
    });
}

function autoSubmit() {
    return new Promise(resolve => {
        setTimeout(() => {
            submitButton.click();
            resolve();
        }, 1000);
    });
}



