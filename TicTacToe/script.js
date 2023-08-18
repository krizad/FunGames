let currentPlayer = "X";
let board = ["", "", "", "", "", "", "", "", ""];

function makeMove(cell) {
    const index = Array.from(document.querySelectorAll(".cell")).indexOf(cell);

    if (board[index] === "" && !checkWinner()) {
        cell.textContent = currentPlayer;
        board[index] = currentPlayer;
        currentPlayer = currentPlayer === "X" ? "O" : "X";
    }
    //do after if statement
    setTimeout(checkWinner, 0);
    
}

function checkWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] !== "" && board[a] === board[b] && board[a] === board[c]) {
            alert(`${board[a]} wins!`);
            return true;
        }
    }

    if (board.every(cell => cell !== "")) {
        alert("It's a draw!");
        return true;
    }

    return false;
}


function resetBoard() {
    const cells = document.querySelectorAll(".cell");
    for (let i = 0; i < cells.length; i++) {
        cells[i].textContent = "";
        board[i] = "";
    }
    currentPlayer = "X";
}

resetBoard();
