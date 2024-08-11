var ALLOWABLE_PLAYS = 3;

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

function getWinType(arr) {
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

function getPlayer(arr) {
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

function render(arr, prespace="") {
    let myString = "";
    for (let i=0; i<9; i++) {
        if (i % 3 == 0) {
            myString += "\n" + prespace;
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

function getBestPlay(arr, xPlays, oPlays, allowablePlays, currentForesight, maxForesight, playerValue) {
    // check if there is a winner/draw
    let winner = isEnd(arr);
    if (winner !== 2) {
        // console.log("jj", arr, getPlayer(arr));
        return [winner, -1];
    } else if (currentForesight > maxForesight) {
        // console.log("here", arr, getPlayer(arr));
        return [0, -1];
    } else {
        // there game is not over
        // we go through arr and if we find a 0 we can play there
        // first get the playerValue
        let firstValue;
        let returnedValue;
        // declare arrays to store the win values of each play and the depth at which they were found
        let winValues;
        let depthValues = Array(9).fill(maxForesight+10);
        if (playerValue === 1) {
            winValues = Array(9).fill(-10); // filled with -10 since we will pick the maximum value
        } else {
            winValues = Array(9).fill(10); // filled with 10 since we will pick the minimum value
        }
        // now we go through arr
        for (let [i, val] of arr.entries()) {
            if (val === 0) {
                // we can play here
                // create a copy of all arrays
                let arrCopy = [...arr];
                let xPlaysCopy = [...xPlays];
                let oPlaysCopy = [...oPlays];
                // record the play then remove the first play if the length ends up greater than the number of allowable plays
                arrCopy[i] = playerValue;
                if (playerValue === 1) {
                    xPlaysCopy.push(i);
                    if (xPlaysCopy.length > allowablePlays) {
                        [firstValue, ...xPlaysCopy] = [...xPlaysCopy];
                        arrCopy[firstValue] = 0;
                    }
                } else {
                    oPlaysCopy.push(i);
                    if (oPlaysCopy.length > allowablePlays) {
                        [firstValue, ...oPlaysCopy] = [...oPlaysCopy];
                        arrCopy[firstValue] = 0;
                    }
                }
                // recurse
                let space = "";
                for (let j=0; j<currentForesight; j++) { space += "    "; }
                returnedValue = getBestPlay(arrCopy, xPlaysCopy, oPlaysCopy, allowablePlays, currentForesight+1, maxForesight, playerValue*-1);
                // console.log(render(arr, `${space} ${currentForesight}: `), "\n", render(arrCopy, `${space} ${currentForesight}: `), "\n", `${space} ${currentForesight}: winner: ${returnedValue[0]} depth: ${returnedValue[1]}`);
                // console.log(`${space} ${currentForesight}: player: ${playerValue} playing at: ${i} winner: ${returnedValue[0]} depth: ${returnedValue[1]}`);
                winValues[i] = returnedValue[0];
                depthValues[i] = 1 + returnedValue[1];
            }
        }
        // if the current foresight is 0 then it means we need to return the index to play at only
        // otherwise we return the max or min win value and the min depth at which it occurs
        let returnWinValue;
        let returnDepthValue = maxForesight + 10;
        let returnIndex;
        if (playerValue === 1) {
            // we get the max win value
            returnWinValue = -10;
            if (Math.max(...winValues) == -1) { // we will lose either way but we can maximize our chances
                returnDepthValue = -1;
                for (let [i, val] of winValues.entries()) {
                    if (val > returnWinValue) {
                        returnWinValue = val;
                        returnIndex = i;
                        returnDepthValue = depthValues[i];
                    } else if (val === returnWinValue && depthValues[i] > returnDepthValue) {
                        returnDepthValue = depthValues[i];
                        returnIndex = i;
                    }
                }
            } else {
                for (let [i, val] of winValues.entries()) {
                    if (val > returnWinValue) {
                        returnWinValue = val;
                        returnIndex = i;
                        returnDepthValue = depthValues[i];
                    } else if (val === returnWinValue && depthValues[i] < returnDepthValue) {
                        returnDepthValue = depthValues[i];
                        returnIndex = i;
                    }
                }
            }
        } else {
            // we get the min win value
            returnWinValue = 10;
            if (Math.min(...winValues) == 1) {
                returnDepthValue = -1;
                for (let [i, val] of winValues.entries()) {
                    if (val < returnWinValue) {
                        returnWinValue = val;
                        returnIndex = i;
                        returnDepthValue = depthValues[i];
                    } else if (val === returnWinValue && depthValues[i] > returnDepthValue) {
                        returnDepthValue = depthValues[i];
                        returnIndex = i;
                    }
                }
            } else {
                for (let [i, val] of winValues.entries()) {
                    if (val < returnWinValue) {
                        returnWinValue = val;
                        returnIndex = i;
                        returnDepthValue = depthValues[i];
                    } else if (val === returnWinValue && depthValues[i] < returnDepthValue) {
                        returnDepthValue = depthValues[i];
                        returnIndex = i;
                    }
                }
            }
        }
        if (currentForesight === 0) {
            return returnIndex;
        } else {
            return [returnWinValue, returnDepthValue];
        }
    }
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
    document.getElementById("xPlays").value = "";
    document.getElementById("oPlays").value = "";
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

function play(cellNumber) {
    const cells = document.getElementsByClassName('cell');
    let arr = getArray();
    console.log(arr);
    let player = getPlayer(arr);
    let playerLetter = document.getElementById('playValue').value;
    let computerLetter = document.getElementById('compValue').value;
    let maxForesight = Number(document.getElementById('level').value);
    const xPlaysElement = document.getElementById('xPlays');
    const oPlaysElement = document.getElementById('oPlays');
    if ((player === 1 && playerLetter !== "X") || (player === -1 && playerLetter !== "O")) {
        throw Error("Disjoint relation between document and grid values.");
    } else {
        let xPlays = [...xPlaysElement.value];
        let oPlays = [...oPlaysElement.value];
        xPlays = xPlays.map((value) => { return Number(value); });
        oPlays = oPlays.map((value) => { return Number(value); });
        let firstValue;
        arr[cellNumber] = player;
        cells[cellNumber].innerText = playerLetter;
        cells[cellNumber].disabled = true;
        if (playerLetter === "X") {
            xPlays.push(cellNumber);
        } else {
            oPlays.push(cellNumber);
        }
        if (xPlays.length > ALLOWABLE_PLAYS) {
            [firstValue, ...xPlays] = [...xPlays];
            cells[firstValue].innerText = "";
            cells[firstValue].disabled = false;
            arr[firstValue] = 0;
            cells[firstValue].setAttribute("class", `cell cell${firstValue}`);
            cells[xPlays[0]].setAttribute("class", `cell cell${xPlays[0]} toremove`);
        }
        if (oPlays.length > ALLOWABLE_PLAYS) {
            [firstValue, ...oPlays] = [...oPlays];
            cells[firstValue].innerText = "";
            arr[firstValue] = 0;
            cells[firstValue].disabled = false;
            cells[firstValue].setAttribute("class", `cell cell${firstValue}`);
            cells[oPlays[0]].setAttribute("class", `cell cell${oPlays[0]} toremove`);
        }
        player *= -1;
        let bestPlay = getBestPlay(arr, xPlays, oPlays, ALLOWABLE_PLAYS, 0, maxForesight, player);
        if (bestPlay instanceof Object) {
            console.log("winner:", bestPlay[0]);
            return;
        }
        console.log("bestPlay:",bestPlay)
        arr[bestPlay] = player;
        cells[bestPlay].innerText = computerLetter;
        cells[bestPlay].disabled = true;
        if (playerLetter === "X") {
            oPlays.push(bestPlay);
        } else {
            xPlays.push(bestPlay);
        }
        if (xPlays.length > ALLOWABLE_PLAYS) {
            [firstValue, ...xPlays] = [...xPlays];
            cells[firstValue].innerText = "";
            cells[firstValue].disabled = false;
            arr[firstValue] = 0;
            cells[firstValue].setAttribute("class", `cell cell${firstValue}`);
            cells[xPlays[0]].setAttribute("class", `cell cell${xPlays[0]} toremove`);
        }
        if (oPlays.length > ALLOWABLE_PLAYS) {
            [firstValue, ...oPlays] = [...oPlays];
            cells[firstValue].innerText = "";
            cells[firstValue].disabled = false;
            arr[firstValue] = 0;
            cells[firstValue].setAttribute("class", `cell cell${firstValue}`);
            cells[oPlays[0]].setAttribute("class", `cell cell${oPlays[0]} toremove`);
        }
        let winner = isEnd(arr);
        if (winner !== 2) {
            console.log("winner:", winner);
            return;
        }
        let myString = "";
        xPlays.map((value) => { myString += value; });
        xPlaysElement.value = myString;
        myString = "";
        oPlays.map((value) => { myString += value; });
        oPlaysElement.value = myString;
    }
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
    let maxForesight = Number(document.getElementById('level').value);
    let bestPlay = getBestPlay(getArray(), [], [], ALLOWABLE_PLAYS, 0, maxForesight);
    cells[bestPlay].innerText = "X";
    cells[bestPlay].disabled = true;
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