function forEachBoardChild(board, player, callback) {
    for (let i in board) {
        if (board[i] === '') {
            let nBoard = board.slice(0);
            nBoard[i] = player;
            callback(nBoard);
        }
    }
}

function benchmark() {
    reset();
    for (let i = 0; i < 9; ++i) {
        let then = performance.now();
        aiMove();
        let now = performance.now();
        console.log(`Layer #${i} took ${now-then} millis.`);
    }
}

function arrayEquals(arrOne, arrTwo) {
    if (arrOne.length === arrTwo.length) {
        for (let i in arrOne) {
            if (arrOne[i] !== arrTwo[i]) {
                return false;
            }
        }
        return true;
    }
    return false;
}

function aiMove() {
    switch (currAgent) {
        case AGENT_JAIBEL: superMove();  break;
        case AGENT_KURT:   hardMove();   break;
        case AGENT_BOB:    mediumMove(); break;
        case AGENT_GEORGE: easyMove();   break;
    }
}

function doPriorityMove() {
    // middle, top-left, bottom-right, bottom-left, top-right
    // top, left, right, bottom.
    let placePriority = [4, 0, 8, 6, 2, 1, 3, 5, 7];

    for (let pos of placePriority) {
        if (board[pos] === '') {
            let x = pos % 3;
            let y = Math.floor(pos / 3);
            placeCell(x,y);
            console.log("Did priority placement");
            return;
        }
    }
}

function easyMove() {

    if (Math.random() < 0.5) {
        mediumMove();
        return;
    }

    // middle, top-left, bottom-right, bottom-left, top-right
    // top, left, right, bottom.
    let placePriority = [0, 8, 6, 2, 1, 3, 5, 7, 4];

    for (let pos of placePriority) {
        if (board[pos] === '') {
            let x = pos % 3;
            let y = Math.floor(pos / 3);
            placeCell(x,y);
            console.log("Did priority placement");
            return;
        }
    }
}

function mediumMove() {
    if (Math.random() < 0.5) {
        hardMove();
    } else {
        doPriorityMove();
    }
}

function hardMove() {
    console.log("making a hardMove");
    let me = currPlayer;
    let other = currPlayer === PLAYER_X ? PLAYER_O : currPlayer === PLAYER_O ? PLAYER_X : "How?";

    if (Math.abs(minimax(board, 0, currPlayer !== PLAYER_X)) !== 0) {
        if (Math.random() < 0.8) {
            console.log("Did minimax");
            superMove();
            return;
        }
    }

    doPriorityMove();    
    console.log("hardMove over");
}

function superMove() {
    if (currPlayer === PLAYER_X) {
        if (arrayEquals(board, ['','','',
                                '','','',
                                '','',''])) {
            placeCell(0,0);
            return;
        }
        if (arrayEquals(board, [PLAYER_X, '',      '',
                                '',       PLAYER_O,'',
                                '',       '',      ''])) {
            placeCell(2,2);
            return;
        }
    }
    
    let score = { bestScore: currPlayer === PLAYER_X ? -Infinity : Infinity, bestMove: -1};
    for (let i in board) {
        if (board[i] === '') {
            board[i] = currPlayer;
            let minimaxEval = minimax(board, 0, currPlayer === PLAYER_O);
            if (currPlayer === PLAYER_X) {
                if (minimaxEval > score.bestScore) {
                    score.bestScore = minimaxEval;
                    score.bestMove = i;
                }
            } else {
                if (minimaxEval < score.bestScore) {
                    score.bestScore = minimaxEval;
                    score.bestMove = i;
                }
            }
            board[i] = '';
        }
    }
    let x = score.bestMove % 3;
    let y = Math.floor(score.bestMove / 3);
    placeCell(x, y);
}

function minimax(board, depth, isMaximizing) {
    let winState = getState(board);
    if (winState) {
        if (winState.winner === PLAYER_X) { return 10 - depth; }
        if (winState.winner === PLAYER_O) { return -10 + depth; }
        if (winState.winner === GAME_TIE) { return 0; }
    }

    if (isMaximizing) {
        let maxEval = -Infinity;
        for (let i in board) {
            if (board[i] === '') {
                board[i] = PLAYER_X;
                let eval = minimax(board, depth + 1, false);
                board[i] = '';
                maxEval = Math.max(eval, maxEval);
            }
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        for (let i in board) {
            if (board[i] === '') {
                board[i] = PLAYER_O;
                let eval = minimax(board, depth + 1, true);
                board[i] = '';
                minEval = Math.min(eval, minEval);
            }
        }
        return minEval;
    }
}

function logBoard(board) {
    output =  "#=======#\n";
    output += `| ${board[0] || " "} ${board[1] || " "} ${board[2] || " "} |\n`;
    output += `| ${board[3] || " "} ${board[4] || " "} ${board[5] || " "} |\n`;
    output += `| ${board[6] || " "} ${board[7] || " "} ${board[8] || " "} |\n`;
    output += "#=======#";
    console.log(output);
}

function equalsThree(a,b,c) {
    return a === b && b === c;
}

const winStates = [
    [0,1,2], // top horizontal line
    [3,4,5], // middle horizontal line
    [6,7,8], // bottom horizontal line
    [0,3,6], // left vertical line
    [1,4,7], // middle vertical line
    [2,5,8], // right vertical line
    [0,4,8], // top-left to bottom-right line
    [2,4,6], // top-right to bottom-left line
]

function getState(board) {
    for (let winState of winStates) {
        if (board[winState[0]] !== '' && equalsThree(board[winState[0]], board[winState[1]], board[winState[2]])) {
            return {winner: board[winState[0]], start: winState[0], end: winState[2]};
        }
    }

    for (let cell of board) {
        if (cell === '') {
            return null;
        }
    }
    
    return {winner: GAME_TIE};
}

console.log("gameFunctions.js loaded");