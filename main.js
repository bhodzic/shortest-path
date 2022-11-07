

let MATRIX_SIZE = 8;
let NUMBER_OF_BLOCKED_CELLS = 18;
var matrix = [];
var timeouts = [];

function generateMatrix() {
    let matrix = [];
    for (let i = 0; i < MATRIX_SIZE; i++) {
        matrix.push([]);
        for (let j = 0; j < MATRIX_SIZE; j++) {
            matrix[i][j] = '*';
        }
    }
    let blockedArray = getRandomArrayOfBlockedCells(NUMBER_OF_BLOCKED_CELLS);
    matrix[blockedArray[0][0]][blockedArray[0][1]] = 'START';
    matrix[blockedArray[1][0]][blockedArray[1][1]] = 'END';
    for (let i = 2; i < blockedArray.length; i++) {
        matrix[blockedArray[i][0]][blockedArray[i][1]] = 'X';
    }

    return matrix;
}

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function getRandomArrayOfBlockedCells(numberOfBlockedCells) {
    let blockedArray = [];
    while (blockedArray.length < numberOfBlockedCells + 2) {
        let i = randomIntFromInterval(0, MATRIX_SIZE - 1);
        let j = randomIntFromInterval(0, MATRIX_SIZE - 1);
        let sameElement = blockedArray.find(element => (i == element[0] && j == element[1]));
        if (!sameElement) {
            blockedArray.push([i, j]);
        }
    }
    return blockedArray;
}

function drawMatrix(matrix) {
    $('#matrix-wrapper').html('');
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            let cellClass = (matrix[i][j] == 'X') ? 'blocked-cell' : 'cell';
            let cellText = (matrix[i][j] == 'END' || matrix[i][j] == 'START') ? matrix[i][j] : ''
            $('#matrix-wrapper').append(`<div class=${cellClass} data-index=${i + '' + j}>${cellText}</div>`);
        }
    }
}

function shortestPath(matrix) {
    let visitedMatrix = [];
    let start;
    for (let i = 0; i < matrix.length; i++) {
        visitedMatrix.push([]);
        for (let j = 0; j < matrix[i].length; j++) {
            visitedMatrix[i][j] = (matrix[i][j] == 'X');
            if (matrix[i][j] == 'START') {
                start = { i, j, path: [] };
                visitedMatrix[i][j] = true;
            }
        }
    }
    let movesArray = [start];
    while (movesArray.length) {
        let currentCell = movesArray.shift();
        let i = currentCell.i;
        let j = currentCell.j;
        if (matrix[i][j] == 'END') {
            return [...currentCell.path, [i, j]];
        }
        if (i - 1 >= 0 && !visitedMatrix[i - 1][j]) {
            visitedMatrix[i - 1][j] = true;
            movesArray.push({ i: i - 1, j, path: [...currentCell.path, [i, j]] });
        }
        if (i + 1 < matrix.length && !visitedMatrix[i + 1][j]) {
            visitedMatrix[i + 1][j] = true;
            movesArray.push({ i: i + 1, j, path: [...currentCell.path, [i, j]] });
        }
        if (j - 1 >= 0 && !visitedMatrix[i][j - 1]) {
            visitedMatrix[i][j - 1] = true;
            movesArray.push({ i, j: j - 1, path: [...currentCell.path, [i, j]] });
        }
        if (j + 1 < matrix[i].length && !visitedMatrix[i][j + 1]) {
            visitedMatrix[i][j + 1] = true;
            movesArray.push({ i, j: j + 1, path: [...currentCell.path, [i, j]] });
        }
    }

    return [];
}

function clearTimeouts(timeoutsArray) {
    for (let i = 0; i < timeoutsArray.length; i++) {
        clearTimeout(timeoutsArray[i]);
    }
}

$(document).ready(function () {
    matrix = generateMatrix();
    clearTimeouts(timeouts);
    drawMatrix(matrix);
    $('#sp-msg').text('');

    $('#shortest-path-btn').on('click', function () {
        let shortestPathArray = shortestPath(matrix);
        let spLengthTxt = shortestPathArray.length ? 'Shortest path length is ' + shortestPathArray.length : 'There is no path';
        $('#sp-msg').text(spLengthTxt);
        for (let i = 0; i < shortestPathArray.length; i++) {
            timeouts.push(setTimeout(function () {
                $(`[data-index=${shortestPathArray[i][0] + '' + shortestPathArray[i][1]}]`).addClass('green-background')
            }, 300 + i * 500));
        }
    });

    $('#load-new-btn').on('click', function () {
        matrix = generateMatrix();
        clearTimeouts(timeouts);
        drawMatrix(matrix);
        $('#sp-msg').text('');
    });

});
