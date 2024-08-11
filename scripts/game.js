function validate(arr) {
    // this function makes sure that the array is valid
    if (typeof(arr) != "object") {
        throw new TypeError("The argument must be of type array");
    }
    try {
        let sum = 0;
        for (var a of arr) {
            if ((a > 1) || (a < -1) || (typeof(a) !== "number")) {
                throw new Error("Unexpected value in the array")
            } else if (Math.floor(a) !== a) {
                throw new Error("Found non integer value in the array")
            }
            sum += a;
        }
        if (arr.length !== 9) {
            throw new Error("The length of the array must be 9")
        }
        if (sum > 1 || sum <= -1) {
            throw new Error("Invalid board, players must switch");
        }
    } catch (e) {
        if (e instanceof TypeError) {
            throw new Error("The argument must be of type array");
        } else {
            throw e;
        }
    }
}

function isEnd(arr) {
    // returns 1 if 1 is winner -1 if -1 is winner 0 if draw 2 if game is not over
    let sum = 0;
    // first check horizontal wins
    for (let i=0; i<=6; i+=3) {
        sum = arr[i] + arr[i+1] + arr[i+2];
        if (sum === 3) {
            return 1;
        } else if (sum == -3) {
            return -1;
        }
    }
    // check vertical wins
    for (let i=0; i<3; i++) {
        sum = arr[i] + arr[i+3] + arr[i+6];
        if (sum === 3) {
            return 1;
        } else if (sum == -3) {
            return -1;
        }
    }
    // check main diagonal
    sum = arr[0] + arr[4] + arr[8];
    if (sum === 3) {
        return 1;
    } else if (sum == -3) {
        return -1;
    }
    // check main diagonal
    sum = arr[2] + arr[4] + arr[6];
    if (sum === 3) {
        return 1;
    } else if (sum == -3) {
        return -1;
    }
    // check if the entire grid is full
    for (let i=0; i<9; i++) {
        if (arr[i] === 0) {
            return 2; // the cell is not occupied
        }
    }
    return 0; // it is a draw
}

function getNextPlayer(arr) {
    // returns 1 if next player is 1 and -1 if next player is -1
    let sum = 0;
    for (let i=0; i<9; i++) {
        sum += arr[i];
    }
    if (sum === 1) {
        return -1;
    } else if (sum === 0) {
        return 1;
    }
    throw new Error("Invalid board, sum was neither 1 nor 0");
}

function getBestPlay(arr, startingDepth, currentDepth, allowablePlays, player1, player2) {
    let nextPlayer = getNextPlayer(arr);
    let winner = isEnd(arr);
    if (currentDepth === 0 || winner !== 2) {
        return [winner,0];
    }
    let difference = player1.length - player2.length
    if ((nextPlayer === 1 && difference !== 0) || (nextPlayer === -1 && difference !== 1)) {
        throw new Error("The player's plays and next player computations are disjoint");
    }
    let result;
    if (nextPlayer === -1) {
        result = Array(9).fill(10);
    } else {
        result = Array(9).fill(-10)
    }
    let depth = Array(9).fill(startingDepth);
    for (let i=0; i<9; i++) {
        if (arr[i] === 0) {
            let [arrCopy] = [...arr];
            arrCopy[i] = nextPlayer;
            let player1Copy;
            let player2Copy;
            let ignore;
            // manage forgetting
            if (player2.length === allowablePlays) { // we use player2 cause player2 is either 1 step behind or on par with player1
                if (nextPlayer === 1) {
                    arrCopy[player1[0]] = 0;
                    [ignore, ...player1Copy] = [...player1];
                    player1Copy.push(i);
                } else {
                    arrCopy[player2[0]] = 0;
                    [ignore, ...player2Copy] = [...player2];
                    player2Copy.push(i);
                }
            } else {
                if (nextPlayer === 1) {
                    [player1Copy] = [...player1];
                    player1Copy.push(i);
                } else {
                    [player2Copy] = [...player2];
                    player2Copy.push(i);
                } 
            }
            [result[i],depth[i]] = [...getBestPlay(arrCopy, startingDepth, currentDepth-1, allowablePlays, player1Copy, player2Copy)];
            if (result[i] === 2) {
                result[i] = 0
            }
        }
    }
    let index = 0;
    if (nextPlayer === -1) {
        let minScore = 1;
        let minDepth = startingDepth;
        for (let i=0; i<9; i++) {
            if (result[i] <= minScore) {
                if (depth[i] <= minDepth) {
                    minDepth = depth[i];
                    minScore = result[i];
                    index = i;
                }
            }
        }
    } else {
        let maxScore = -1;
        let minDepth = startingDepth;
        for (let i=0; i<9; i++) {
            if (result[i] >= maxScore) {
                if (depth[i] <= minDepth) {
                    minDepth = depth[i];
                    maxScore = result[i];
                    index = i;
                }
            }
        }
    }
    if (startingDepth === currentDepth) {
        return index;
    }
    return [result[i], depth[i]]
}

// export { validate, isEnd, getNextPlayer, getNextPlayer };
module.exports.validate = validate;
module.exports.isEnd = isEnd;
module.exports.getNextPlayer = getNextPlayer;
module.exports.getBestPlay = getBestPlay;