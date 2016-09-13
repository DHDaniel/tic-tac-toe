
function log(x) {
console.log(x);
}

var matrix = [[0, 1, 0], [0, 1, 1], [1, 0, 0]];


/*=================================
GETTING ROWS, COLUMNS, DIAGONALS
=================================*/

// getting an identical array with the coordinates of each point - useful for when telling AI how/where to play
var coords = [[], [], []];
for (var i = 0; i < matrix.length; i++) {
  for (var j = 0; j < matrix[i].length; j++) {
    coords[i].push([i, j]); // column, row
  }
}

function getColumns(coords) {
  var arr = [];
  // getting number of columns into array
  for (var i = 0; i < coords.length; i++) {
  	arr.push([]);
  }
  for (var i = 0; i < coords.length; i++) {
     for (var j = 0; j < coords[i].length; j++) {
        arr[j].push(coords[i][j]);
     }
   }
   return arr;
}

function getDiagonals(coords) {
  return [[coords[0][0], coords[1][1], coords[2][2]],
                   [coords[0][2], coords[1][1], coords[2][0]]];
}

// very useful variables - containing actual numbers
var columns = getColumns(matrix);
var diagonals = getDiagonals(matrix);

// containing coordinates to matrix
var colCoords = getColumns(coords);
var diagCoords = getDiagonals(coords);
var cornerCoords = [[0, 0], [0, 2], [2, 0], [2, 2]];


/*=========================================
CHECKING FOR WINS FUNCTIONALITY
==========================================*/

// checks if all elements in an array are the same
function checkRow(row) {
  var first = row[0];
  for (var i = 1; i < row.length; i++) {
    if (row[i] !== first) {
      return false;
    }
  }
  return true;
}

// checks if there are any wins in the tic tac toe matrix
function checkForWins(matrix) {
  // checking rows
  for (var i = 0; i < matrix.length; i++) {
     if (checkRow(matrix[i])) {
        return true;
     }
   }
   // columns
  for (var i = 0; i < columns.length; i++) {
    if (checkRow(columns[i])) {
      return true;
    }
  }
  // diagonals
  for (var i = 0; i < diagonals.length; i++) {
    if (checkRow(diagonals[i])) {
      return true;
    }
  }

  return false; // if no wins
}

/*===================================
COMPUTER AI
====================================*/

// Disclaimer - this AI is very basic. It in no way represent what a true AI should look like. Sorry.

// puts the AI's decision on the board
function play(coordinate) {
  matrix[coordinate[0]][coordinate[1]] = 0;
}

// counts the number of certain elements in an array
function count(arr, elem) {
  var count = 0;
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] === elem) {
      count++;
    }
  }
  return count;
}

// executes function if AI has not yet played.
function ifNotPlayed(played, func) {
  if (played === false) {
    func();
  }
}

function forEachRow(func) {
  for (var i = 0; i < matrix.length; i++) {
    func(matrix[i], coords, i); //passing current row and the index of that row for reference when using coords
  }

  for (var i = 0; i < columns.length; i++) {
    func(columns[i], colCoords, i);
  }

  for (var i = 0; i < diagonals.length; i++) {
    func(diagonals[i], diagCoords, i);
  }
}

// returns true if the row needs a counter-attack because it might win soon
function rowToCounter(row) {
  // player uses "1"
  var oneCount = 0;
  // checking that row is NOT full yet
  if (row.indexOf(null) == -1) {
    return false;
  }
  for (var i = 0; i < row.length; i++) {
    if (row[i] == 1) {
      oneCount++;
    }
  }
  if (oneCount >= 2) {
    return true;
  }
}

function counter() {
	var countered = false;
  forEachRow(function (row, coords, idxOfRow) {
    // if row needs countering and a play hasn't been made
    if (rowToCounter(row) && countered === false) {
      var idx = row.indexOf(null); // get empty space coordinate
      var coord = coords[idxOfRow][idx];

      play(coord);
      countered = true; // setting flag since function may execute more times
    }
  });

  return countered; // returns true if executed
}

function win() {
  var won = false;
  forEachRow(function (row, coords, idxOfRow) {
    if (count(row, 0) == 2 && won === false && row.indexOf(null) > -1) {
      var idx = row.indexOf(null);
      var coord = [idxOfRow, idx];

      play(coord);
      won = true;
    }
  });

  return won; // returns won if executed
}

function playCenter() {
  // if center is not taken, then take the center
  if (matrix[1][1] === null) {
    play([1, 1]);
    return true;
  }
  return false;
}

function playCorners() {
  // looking to see if any of the corners are available, and taking them.
  for (var i = 0; i < cornerCoords.length; i++) {
    var c = cornerCoords[i];
    if (matrix[c[0], c[1]] === null) {
      play(c);
      return true;
    }
  }
  return false;
}

// plays on any empty spot
function playEmpty() {
  for (var i = 0; i < matrix.length; i++) {
    for (var j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j] === null) {
        play([i, j]);
        return true;
      }
    }
  }
  return false;
}

function makeNextMove() {

  var moves = [win, counter, playCenter, playCorner, playEmpty]; // list of moves in order that they are to be tried

  var notMoved = true;
  for (var i = 0; i < moves.length; i++) {
    if (notMoved) {
    // executing next move in cue
    // returns true if move was executed
      var moved = moves[i]();
    }

    // setting notMoved to the opposite of returned "executed" value. If executed is true, then notMoved is now false.
    notMoved = !moved;
  }
}
