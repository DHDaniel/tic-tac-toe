
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
  played = true; // flag inside the makeNextMove() function
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
    if (rowToCounter(row) && countered === false) {
      var idx = row.indexOf(null); // get empty space coordinate
      var coord = coords[idxOfRow][idx];

      play(coord);
      countered = true; // setting flag that one has already been countered
    }
  });
}

function win() {
  var won = false;
  forEachRow(function (row, coords, idxOfRow) {
    if (row.)
  })
}

function makeNextMove() {
  var played = false;


  // countering any move that is about to win
  ifNotPlayed(played, counter);

}
