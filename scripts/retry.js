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
            return [1, "horizontal", Math.floor(i/3)];
        } else if (sum == -3) {
            return [-1, "horizontal", Math.floor(i/3)];
        }
    }
    // check vertical wins
    for (let i=0; i<3; i++) {
        sum = arr[i] + arr[i+3] + arr[i+6];
        if (sum === 3) {
            return [1, "vertical", i];
        } else if (sum == -3) {
            return [-1, "vertical", i];
        }
    }
    // check main diagonal
    sum = arr[0] + arr[4] + arr[8];
    if (sum === 3) {
        return [1, "diagonal", 0];
    } else if (sum == -3) {
        return [-1, "diagonal", 0];
    }
    // check secondary diagonal
    sum = arr[2] + arr[4] + arr[6];
    if (sum === 3) {
        return [1, "diagonal", 1];
    } else if (sum == -3) {
        return [-1, "diagonal", 1];
    }
    // check if the entire grid is full
    for (let i=0; i<9; i++) {
        if (arr[i] === 0) {
            return [2, "no", 0]; // the cell is not occupied
        }
    }
    return [0, "draw", 0]; // it is a draw
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

function getBestPlay(arr, xPlays, oPlays, allowablePlays, currentForesight, maxForesight, playerValue, returnEverything=false) {
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
        if (returnEverything) {
            return [returnIndex, returnWinValue, returnDepthValue];
        } else if (currentForesight === 0) {
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
    document.getElementById('caution').hidden = true;
    document.getElementById('playValue').setAttribute('value',"");
    document.getElementById('caution').setAttribute("hidden",true);
    document.getElementById("xPlays").value = "";
    document.getElementById("oPlays").value = "";
    document.getElementsByTagName('main')[0].removeAttribute("class");
    let canvas = document.getElementById('helper');
    let context = canvas.getContext('2d');
    let canvasWidth = canvas.width;
    let canvasHeight = canvas.height;
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    console.log("New game");
    document.cookie = `assist=0;`;
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

function renderEnd(arr, userPlayer, actualPlay) {
    let [sol, direction, type] = getWinType(arr);
    console.log(sol, direction, type);
    if (actualPlay) {
        let wins = Number(getCookie("wins"));
        let games = Number(getCookie("games"));
        let usedAssist = Number(getCookie("assist"));
        let level = Number(getCookie("level"));
        let noOfStars = Number(getCookie("number"));
        if (sol == userPlayer) {
            const result = document.getElementById('result');
            result.setAttribute('class', 'winner');
            document.getElementsByTagName('main')[0].setAttribute("class", "greenborderpermanent");
            result.hidden = false;
            result.innerText = "😊 Congradulations! You Won! 😊";
            if (usedAssist === 0) {
                games += 1;
                wins += 1;
                level = Math.round((wins/games)*noOfStars);
            }
        } else if (sol == 0) {
            const result = document.getElementById('result');
            result.setAttribute('class','draw');
            document.getElementsByTagName('main')[0].setAttribute("class", "greyborderpermanent");
            result.hidden = false;
            result.innerText = "😮‍💨 Draw! 😮‍💨";
            if (usedAssist === 0) {
                games += 1;
                level = Math.round((wins/games)*noOfStars);
            }
        } else {
            const result = document.getElementById('result');
            result.setAttribute('class','loser');
            document.getElementsByTagName('main')[0].setAttribute("class", "redborderpermanent");
            result.innerText = "☹️ Sorry! Computer wins! ☹️";
            result.hidden = false;
            if (usedAssist === 0) {
                games += 1;
                level = Math.round((wins/games)*noOfStars);
            }
        }
        document.cookie = `games=${games};`;
        document.cookie = `wins=${wins};`;
        document.cookie = `level=${level};`;
        drawStars();
        const cells = document.getElementsByClassName('cell');
        for (let cell of cells) {
            cell.disabled = true;
        }
        document.getElementById('playValue').setAttribute('value',"");
    }
    if (sol != 2) {
        let canvas = document.getElementById('helper');
        let context = canvas.getContext('2d');
        let canvasWidth = canvas.width;
        let canvasHeight = canvas.height;
        context.clearRect(0, 0, canvasWidth, canvasHeight);
        if (sol == 0) {
            return;
        } else {
            if (!actualPlay) {
                if (sol != userPlayer) {
                    context.strokeStyle = "#ff0000";
                    let caution = document.getElementById('caution');
                    let grid = document.getElementById("grid");
                    caution.innerText = "You will lose!";
                    caution.setAttribute('class', "losertext");
                    grid.setAttribute('class', "container zoominout");
                    document.getElementsByTagName('main')[0].setAttribute("class", "redborder");
                    caution.removeAttribute("hidden");
                } else {
                    context.strokeStyle = "#00ff00";
                    let caution = document.getElementById('caution');
                    caution.innerText = "You will win!"
                    caution.setAttribute('class', "winner");
                    document.getElementsByTagName('main')[0].setAttribute("class", "greenborder");
                    caution.removeAttribute("hidden");
                }
            }
            if (sol != userPlayer) {
                context.strokeStyle = "#ff0000";
            } else {
                context.strokeStyle = "#00ff00";
            }
            context.beginPath();
            if (direction == "diagonal") {
                if (type == 0) {
                    // main diagonal
                    context.moveTo(0, 0);
                    context.lineTo(canvasWidth, canvasHeight);
                    context.stroke();
                } else {
                    // secondary diagonal
                    context.moveTo(canvasWidth, 0);
                    context.lineTo(0, canvasHeight);
                    context.stroke();
                }
            } else if (direction == "vertical") {
                let location = Math.floor(type * (canvasWidth/3) + (canvasWidth/6));
                context.moveTo(location, 0);
                context.lineTo(location, canvasHeight);
                context.stroke();
            } else if (direction == "horizontal") {
                let location = Math.floor(type * (canvasHeight/3) + (canvasHeight/6));
                context.moveTo(0, location);
                context.lineTo(canvasWidth, location);
                context.stroke();
            }
        }
    }
}

function play(cellNumber) {
    const cells = document.getElementsByClassName('cell');
    let compAssistPlay = document.getElementById("compAssistPlay").value;
    if (compAssistPlay !== "") {
        compAssistPlay = Number(compAssistPlay);
        cells[compAssistPlay].innerHTML = "";
        cells[compAssistPlay].setAttribute("class", `cell cell${compAssistPlay}`);
        document.getElementById("compAssistPlay").value = ""
    }
    let arr = getArray();
    console.log(arr);
    let player; // = getPlayer(arr);
    let playerLetter = document.getElementById('playValue').value;
    let computerLetter = document.getElementById('compValue').value;
    let maxForesight = Number(document.getElementById('level').value);
    const xPlaysElement = document.getElementById('xPlays');
    const oPlaysElement = document.getElementById('oPlays');
    if (playerLetter === "X") {
        player = 1;
    } else {
        player = -1;
    }
    let xPlays = [...xPlaysElement.value];
    let oPlays = [...oPlaysElement.value];
    xPlays = xPlays.map((value) => { return Number(value); });
    oPlays = oPlays.map((value) => { return Number(value); });
    let firstValue;
    arr[cellNumber] = player;
    cells[cellNumber].innerText = playerLetter;
    cells[cellNumber].disabled = true;
    cells[cellNumber].setAttribute("class", `cell cell${cellNumber}`);
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
    } else if (xPlays.length === ALLOWABLE_PLAYS) {
        cells[xPlays[0]].setAttribute("class", `cell cell${xPlays[0]} toremove`);
    }
    if (oPlays.length > ALLOWABLE_PLAYS) {
        [firstValue, ...oPlays] = [...oPlays];
        cells[firstValue].innerText = "";
        arr[firstValue] = 0;
        cells[firstValue].disabled = false;
        cells[firstValue].setAttribute("class", `cell cell${firstValue}`);
        cells[oPlays[0]].setAttribute("class", `cell cell${oPlays[0]} toremove`);
    } else if (oPlays.length === ALLOWABLE_PLAYS) {
        cells[oPlays[0]].setAttribute("class", `cell cell${oPlays[0]} toremove`);
    }
    player *= -1;
    let bestPlay = getBestPlay(arr, xPlays, oPlays, ALLOWABLE_PLAYS, 0, maxForesight, player);
    if (bestPlay instanceof Object) {
        console.log("Type1 winner:", bestPlay[0]);
        renderEnd(arr, player*-1, true);
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
    } else if (xPlays.length === ALLOWABLE_PLAYS) {
        cells[xPlays[0]].setAttribute("class", `cell cell${xPlays[0]} toremove`);
    }
    if (oPlays.length > ALLOWABLE_PLAYS) {
        [firstValue, ...oPlays] = [...oPlays];
        cells[firstValue].innerText = "";
        cells[firstValue].disabled = false;
        arr[firstValue] = 0;
        cells[firstValue].setAttribute("class", `cell cell${firstValue}`);
        cells[oPlays[0]].setAttribute("class", `cell cell${oPlays[0]} toremove`);
    } else if (oPlays.length === ALLOWABLE_PLAYS) {
        cells[oPlays[0]].setAttribute("class", `cell cell${oPlays[0]} toremove`);
    }
    let winner = isEnd(arr);
    if (winner !== 2) {
        renderEnd(arr, player*-1, true);
        console.log("Type2 winner:", winner);
        return;
    }
    let myString = "";
    xPlays.map((value) => { myString += value; });
    xPlaysElement.value = myString;
    myString = "";
    oPlays.map((value) => { myString += value; });
    oPlaysElement.value = myString;
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
    document.getElementById('xPlays').value = String(bestPlay);
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

function assistEnter(cellNumber) {
    const cells = document.getElementsByClassName('cell');
    const assistance = Number(document.getElementById("assistance").value);
    if (cells[cellNumber].disabled || assistance === 0) {
        return;
    }
    let arr = getArray();
    let player; // = getPlayer(arr);
    let playerLetter = document.getElementById('playValue').value;
    let computerLetter = document.getElementById('compValue').value;
    let maxForesight = Number(document.getElementById('level').value);
    document.cookie = `assist=${assistance};`;
    const xPlaysElement = document.getElementById('xPlays');
    const oPlaysElement = document.getElementById('oPlays');
    if (playerLetter === "X") {
        player = 1;
    } else {
        player = -1;
    }
    let xPlays = [...xPlaysElement.value];
    let oPlays = [...oPlaysElement.value];
    xPlays = xPlays.map((value) => { return Number(value); });
    oPlays = oPlays.map((value) => { return Number(value); });
    let firstValue;
    arr[cellNumber] = player;
    cells[cellNumber].innerText = playerLetter;
    cells[cellNumber].setAttribute("class", `cell cell${cellNumber} temporary`);
    if (playerLetter === "X") {
        xPlays.push(cellNumber);
    } else {
        oPlays.push(cellNumber);
    }
    if (xPlays.length > ALLOWABLE_PLAYS) {
        [firstValue, ...xPlays] = [...xPlays];
        arr[firstValue] = 0;
    }
    if (oPlays.length > ALLOWABLE_PLAYS) {
        [firstValue, ...oPlays] = [...oPlays];
        arr[firstValue] = 0;
    }
    player *= -1;
    let bestPlay = getBestPlay(arr, xPlays, oPlays, ALLOWABLE_PLAYS, 0, maxForesight, player, true);
    console.log(`BestPlay => ${bestPlay}`)
    if (bestPlay.length === 2) {
        renderEnd(arr, player*-1, false);
        document.getElementById('compAssistPlay').value = "";
        return;
    } else {
        let winValue = bestPlay[1];
        let depthValue = bestPlay[2]; 
        bestPlay = bestPlay[0];
        if (winValue !== 2 && depthValue <= assistance) {
            if (winValue === player) {
                let caution = document.getElementById('caution');
                caution.innerText = "You will lose!";
                caution.setAttribute('class', "losertext");
                grid.setAttribute('class', "container zoominout");
                document.getElementsByTagName('main')[0].setAttribute("class", "redborder");
                caution.removeAttribute("hidden");
            } else if (winValue === player*-1) {
                let caution = document.getElementById('caution');
                caution.innerText = "You could win!";
                caution.setAttribute('class', "winner");
                document.getElementsByTagName('main')[0].setAttribute("class", "greenborder");
                caution.removeAttribute("hidden");
            }
        }
    }
    document.getElementById('compAssistPlay').value = bestPlay.toString();
    console.log(`compAssistPlay: ${bestPlay}`);
    arr[bestPlay] = player;
    cells[bestPlay].innerText = computerLetter;
    if ([...cells[bestPlay].classList].indexOf("toremove") != -1) {
        // console.log(`replaceIndex: ${bestPlay}`);
        document.getElementById("replaceIndex").value = bestPlay;
    }
    cells[bestPlay].setAttribute("class", `cell cell${bestPlay} temporary`);
    if (playerLetter === "X") {
        oPlays.push(bestPlay);
    } else {
        xPlays.push(bestPlay);
    }
    if (xPlays.length > ALLOWABLE_PLAYS) {
        [firstValue, ...xPlays] = [...xPlays];
        arr[firstValue] = 0;
    }
    if (oPlays.length > ALLOWABLE_PLAYS) {
        [firstValue, ...oPlays] = [...oPlays];
        arr[firstValue] = 0;
    }
    let winner = isEnd(arr);
    if (winner !== 2) {
        renderEnd(arr, player*-1, false);
    }
}

function assistLeave(cellNumber) {
    const cells = document.getElementsByClassName('cell');
    let compAssistPlay = document.getElementById("compAssistPlay").value;
    const assistance = Number(document.getElementById("assistance").value);
    if (cells[cellNumber].disabled || assistance === 0) {
        document.getElementById("replaceIndex").value = "";
        document.getElementById('compAssistPlay').value = "";
        return;
    }
    if (compAssistPlay !== "") {
        compAssistPlay = Number(compAssistPlay);
        cells[compAssistPlay].setAttribute("class", `cell cell${compAssistPlay}`);
        cells[compAssistPlay].innerText = "";
    }
    let replaceIndex = document.getElementById("replaceIndex").value;
    if (replaceIndex !== "") {
        replaceIndex = Number(replaceIndex);
        cells[replaceIndex].innerText = document.getElementById("playValue").value;
        console.log("Got you, ha ha ha!");
        cells[replaceIndex].setAttribute("class", `cell cell${replaceIndex} toremove`);
        document.getElementById("replaceIndex").value = "";
    }
    document.getElementById('compAssistPlay').value = "";
    cells[cellNumber].setAttribute("class", `cell cell${cellNumber}`);
    cells[cellNumber].innerText = "";
    document.getElementsByTagName('main')[0].removeAttribute("class");
    let caution = document.getElementById('caution');
    let grid = document.getElementById("grid");
    caution.innerText = "";
    caution.removeAttribute('class');
    caution.setAttribute("hidden",true);
    grid.setAttribute('class', "container");
    let canvas = document.getElementById('helper');
    let context = canvas.getContext('2d');
    let canvasWidth = canvas.width;
    let canvasHeight = canvas.height;
    context.clearRect(0, 0, canvasWidth, canvasHeight);
}

function changeDifficulty(element) {
    element.previousElementSibling.previousElementSibling.value=element.value
    const assistance = document.getElementById("assistance");
    if (assistance.value > element.value) {
        assistance.value = element.value;
        assistance.previousElementSibling.previousElementSibling.value=element.value;
    }
    assistance.setAttribute("max", element.value);
}

function drawStars(level=0) {
    const canvas = document.getElementById("myCanvas");
    let context = canvas.getContext('2d');
    const {width, height} = canvas.getBoundingClientRect();
    context.clearRect(0, 0, width, height);
    let number;
    number = Number(getCookie("number"));
    level = Number(getCookie("level"));
    if (isNaN(number)) {return;}
    const fraction = width/number;
    const positionY = height/2;
    let positionX = fraction/2;
    let value = fraction;
    let points = []
    let angle = 90-72;
    let outerRadius = 0.9*Math.min(positionX, positionY);
    let innerRadius = 0.3*Math.min(positionX, positionY);
    context.strokeStyle = "#000000";
    context.fillStyle = "gold";
    context.beginPath();
    for (let i=0; i<number; i++) {
        angle = 90-72;
        for (let j=0; j<11; j++) {
            let x;
            let y;
            let angleRadians = angle*Math.PI/180;
            if ((j%2) == 0) {
                x = Math.round(innerRadius * Math.cos(angleRadians) + positionX);
                y = Math.round(innerRadius * Math.sin(angleRadians) + positionY);
            } else {
                x = Math.round(outerRadius * Math.cos(angleRadians) + positionX);
                y = Math.round(outerRadius * Math.sin(angleRadians) + positionY);
            }
            if (j == 0) {
                context.moveTo(x,y);
            } else {
                context.lineTo(x,y);
        context.stroke();
            }
            angle += 36;
        }
        if (i<level) {
            context.fill();
        }
        positionX += value;
    }
}

function getCookie(cname) {
    let name = cname+"=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ind = decodedCookie.indexOf(name);
    if (ind == -1) {return "";}
    decodedCookie = decodedCookie.substring(ind);
    let ca = decodedCookie.split(';')[0].replace(name,"");
    return ca;
}

if (getCookie("number") == "") {
    document.cookie = "number=5;";
}
if (getCookie("level") == "") {
    document.cookie = "level=0;";
}
if (getCookie("games") == "") {
    document.cookie = "games=0;";
}
if (getCookie("wins") == "") {
    document.cookie = "wins=0;";
}
if (getCookie("assist") == "") {
    document.cookie = "assist=0;";
}
// document.cookie = "number=5;";
// document.cookie = "level=0;";
// document.cookie = "games=0;"
// document.cookie = "wins=0;";
// document.cookie = "assist=0;";

function renderCanvas() {
    let match = window.matchMedia("(max-width: 500px)");
    let listItem = document.getElementById("canvasDiv");
    for (let node of listItem.childNodes){
        listItem.removeChild(node);
    }
    let element = document.createElement("canvas");
    element.setAttribute("id", "myCanvas");
    if (match.matches) {
        element.setAttribute("width", "75px");
        element.setAttribute("height", "15px");
        listItem.appendChild(element);
    } else {
        element.setAttribute("width", "150px");
        element.setAttribute("height", "30px");
        listItem.appendChild(element);
    }
}

function fullRedraw() {
    renderCanvas();
    drawStars();
}

renderCanvas()
drawStars();

window.addEventListener('resize', fullRedraw);

// module.exports.getBestPlay = getBestPlay;