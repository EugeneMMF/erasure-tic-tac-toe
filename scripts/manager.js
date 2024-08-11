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

function render(arr) {
    let myString = "";
    for (let i=0; i<9; i++) {
        if (i % 3 == 0) {
            myString += "\n";
        }
        let letter;
        if (arr[i] == 1){
            letter = 'X';
        } else if (arr[i] == -1) {
            letter = "O";
        } else {
            letter = "_";
        }
        myString += letter;
    }
    return myString;
}

function getBestPlay(arr, startingDepth, currentDepth, allowablePlays, player1, player2) {
    // console.log("HHHH", arr, startingDepth, currentDepth, allowablePlays, player1, player2);
    let nextPlayer = getNextPlayer(arr);
    let winner = isEnd(arr);
    let disallowed;
    if (currentDepth === 0 || winner !== 2) {
        // console.log("Returning", winner);
        return [winner,0];
    }
    let difference = player1.length - player2.length
    // if ((nextPlayer === 1 && difference !== 0) || (nextPlayer === -1 && difference !== 1)) {
    //     throw new Error("The player's plays and next player computations are disjoint");
    // }
    let result;
    if (nextPlayer === -1) {
        result = Array(9).fill(20);
    } else {
        result = Array(9).fill(-20)
    }
    let depth = Array(9).fill(startingDepth);
    for (let i=0; i<9; i++) {
        if (arr[i] === 0) {
            let arrCopy = [...arr];
            arrCopy[i] = nextPlayer;
            let player1Copy = [...player1];
            let player2Copy = [...player2];
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
                if (currentDepth == startingDepth) {
                    // console.log("ignore", ignore, "iteration", currentDepth);
                }
                disallowed = ignore;
            } else {
                if (nextPlayer === 1) {
                    player1Copy = [...player1];
                    player1Copy.push(i);
                } else {
                    player2Copy = [...player2];
                    player2Copy.push(i);
                } 
            }
            // console.log("WWW",player1Copy, player2Copy);
            let myres = getBestPlay(arrCopy, startingDepth, currentDepth-1, allowablePlays, player1Copy, player2Copy);
            depth[i] = myres[1];
            depth[i] += 1;
            // console.log("returned with", myres[0], depth[i], "for player", nextPlayer, "at position", [Math.floor(i/3), i%3], render(arr), "\n", render(arrCopy));
            result[i] = myres[0];
            if (myres[0] === 2) {
                if (nextPlayer == 1) {
                    result[i] = -10;
                } else {
                    result[i] = 10;
                }
            }
        }
    }
    let index = 0;
    if (nextPlayer === -1) {
        let minScore = 20;
        result[disallowed] = 20;
        let minDepth = startingDepth;
        for (let i=0; i<9; i++) {
            if (result[i] < minScore) {
                minScore = result[i];
                minDepth = depth[i];
                index = i;
            } else if (result[i] == minScore && depth[i] < minDepth) {
                minDepth = depth[i];
                index = i;
            }
        }
    } else {
        let maxScore = -20;
        result[disallowed] = -20;
        let minDepth = startingDepth;
        for (let i=0; i<9; i++) {
            if (result[i] > maxScore) {
                maxScore = result[i];
                minDepth = depth[i];
                index = i;
            } else if (result[i] == maxScore && depth[i] < minDepth) {
                minDepth = depth[i];
                index = i;
            }
        }
    }
    // console.log("returning with", result[index], depth[index], "for player", nextPlayer, "at position", [Math.floor(index/3), index%3], render(arr),"\n", player1, player2);
    if (startingDepth === currentDepth) {
        console.log(player1, player2);
        console.log(result, disallowed);
        return index;
    }
    return [result[index], depth[index]]
}

function newgame() {
    let cells = document.getElementsByClassName("cell");
    for (let ind=0; ind<cells.length; ind++) {
        let cell = cells[ind];
        cell.innerText = "";
        cell.disabled = true;
        cell.setAttribute("class", `cell cell${ind}`);
    }
    document.getElementById('option').hidden = false;
    document.getElementById('result').hidden = true;
    document.getElementById('playValue').setAttribute('value',"");
    document.getElementById('firstPlay').setAttribute('value',true);
    document.getElementById('caution').setAttribute("hidden",true);
    document.getElementById("player2").value = "";
    document.getElementById("player1").value = "";
    document.getElementsByTagName('body')[0].removeAttribute("class");
    let canvas = document.getElementById('helper');
    let context = canvas.getContext('2d');
    let canvasWidth = canvas.width;
    let canvasHeight = canvas.height;
    context.clearRect(0, 0, canvasWidth, canvasHeight);
}

function getArray() {
    let arr = Array(9).fill(0);
    let value;
    let cells = document.getElementsByClassName("cell");
    for (let i=0; i<9; i++) {
        value = cells[i].innerText;
        if (value === "X") {
            arr[i] = 1;
        } else if (value === "O") {
            arr[i] = -1;
        }
    }
    return arr;
}

function playAsX() {
    document.getElementById('playValue').setAttribute('value', "X");
    document.getElementById('compValue').setAttribute('value', "O");
    const cells = document.getElementsByClassName('cell');
    for (const cell of cells){
        cell.removeAttribute('disabled')
    }
    document.getElementById('option').hidden = true;
}

function playAsO() {
    document.getElementById('playValue').setAttribute('value', "O");
    document.getElementById('compValue').setAttribute('value', "X");
    const cells = document.getElementsByClassName('cell');
    for (const cell of cells){
        cell.removeAttribute('disabled')
    }
    document.getElementById('option').hidden = true;
    play(null);
}

function play(cellNumber) {
    cellNumber = Number(cellNumber);
    let arr = getArray();
    let nextPlayer = getNextPlayer(arr);
    let playValue = document.getElementById('playValue').getAttribute('value');
    let compValue = document.getElementById('compValue').getAttribute('value');
    let level = Number(document.getElementById('level').value);
    let cells = document.getElementsByClassName('cell');
    let player1 = [...document.getElementById("player1").value];
    let player2 = [...document.getElementById("player2").value];
    player1 = player1.map((value) => {return Number(value);});
    player2 = player2.map((value) => {return Number(value);});
    let ignore;
    let computerPlay;
    let end;
    let myString;
    if ((playValue === "X" && nextPlayer === 1) || (playValue === "O" && nextPlayer === -1)) {
        cells[cellNumber].disabled = true;
        cells[cellNumber].innerText = playValue;
        arr[cellNumber] = nextPlayer;
        if (player1.length === 3) {
            [ignore, ...player1] = [...player1];
            arr[ignore] = 0;
            cells[ignore].innerText = "";
            cells[ignore].disabled = false;
            cells[ignore].setAttribute("class", `cell cell${ignore}`);
            cells[player1[0]].setAttribute("class", `cell cell${player1[0]} toremove`);
        }
        end = isEnd(arr);
        if (end !== 2) {
            console.log(end);
            return;
        }
        player1.push(cellNumber);
        nextPlayer *= -1;
        computerPlay = getBestPlay(arr, level, level, 3, player1, player2);
        if (player2.length === 3) {
            [ignore, ...player2] = [...player2];
            arr[ignore] = 0;
            cells[ignore].innerText = "";
            cells[ignore].disabled = false;
            cells[ignore].setAttribute("class", `cell cell${ignore}`);
            cells[player2[0]].setAttribute("class", `cell cell${player2[0]} toremove`);
        }
        cells[computerPlay].disabled = true;
        cells[computerPlay].innerText = compValue;
        player2.push(computerPlay);
        arr[computerPlay] = nextPlayer;
        myString = "";
        player2.map((holder) => {myString+=holder;});
        document.getElementById("player2").value = myString;
        myString = "";
        player1.map((holder) => {myString+=holder;});
        document.getElementById("player1").value = myString;
        end = isEnd(arr);
        if (end !== 2) {
            console.log(end);
        }
    } else {
        cells[cellNumber].disabled = true;
        cells[cellNumber].innerText = playValue;
        arr[cellNumber] = nextPlayer;
        if (player1.length === 3) {
            [ignore, ...player1] = [...player1];
            arr[ignore] = 0;
            cells[ignore].innerText = "";
            cells[ignore].disabled = false;
        }
        player1.push(cellNumber);
        nextPlayer *= -1;
        computerPlay = getBestPlay(arr, level, level, 3, player1, player2);
        if (player2.length === 3) {
            [ignore, ...player2] = [...player2];
            arr[ignore] = 0;
            cells[ignore].innerText = "";
            cells[ignore].disabled = false;
            cells[ignore].setAttribute("class", `cell cell${ignore}`);
            cells[player2[0]].setAttribute("class", `cell cell${player2[0]} toremove`);
        }
        cells[computerPlay].disabled = true;
        cells[computerPlay].innerText = compValue;
        player2.push(computerPlay);
        arr[computerPlay] = nextPlayer;
        myString = "";
        player2.map((holder) => {myString+=holder;});
        document.getElementById("player2").value = myString;
        myString = "";
        player1.map((holder) => {myString+=holder;});
        document.getElementById("player1").value = myString;
        end = isEnd(arr);
        if (end !== 2) {
            console.log(end);
        }
    }
}

function testRegeneration(cellNumber) {
    let playValue = document.getElementById('playValue').getAttribute('value');
    let level = Number(document.getElementById('level').value);
    let cells = document.getElementsByClassName('cell');
    let player1 = [...document.getElementById("player1").value];
    let player2 = [...document.getElementById("player2").value];
    player1 = player1.map((value) => { return Number(value); });
    player2 = player2.map((value) => { return Number(value); });
    let firstValue;
    let myString;
    if (playValue === "X") {
        if (player1.length >= level) {
            [firstValue, ...player1] = [...player1];
            cells[firstValue].innerText = "";
            cells[firstValue].disabled = false;
            cells[firstValue].setAttribute("class", `cell cell${firstValue}`);
            cells[player1[0]].setAttribute("class", `cell cell${player1[0]} toremove`);
        }
        player1.push(cellNumber);
        arr[cellNumber] = play
        cells[cellNumber].innerText = playValue;
        cells[cellNumber].disabled = true;
        myString = "";
        player1.map((holder) => {myString+=holder;});
        document.getElementById("player1").value = myString;
        document.getElementById('playValue').value = "O";
    } else {
        if (player2.length >= level) {
            [firstValue, ...player2] = [...player2];
            cells[firstValue].innerText = "";
            cells[firstValue].disabled = false;
            cells[firstValue].setAttribute("class", `cell cell${firstValue}`);
            cells[player2[0]].setAttribute("class", `cell cell${player2[0]} toremove`);
        }
        player2.push(cellNumber);
        cells[cellNumber].innerText = playValue;
        cells[cellNumber].disabled = true;
        myString = "";
        player2.map((holder) => {myString+=holder;});
        document.getElementById("player2").value = myString;
        document.getElementById('playValue').value = "X";
    }
}

module.exports.getBestPlay = getBestPlay;