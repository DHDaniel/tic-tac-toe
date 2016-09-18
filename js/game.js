
/*===================================
COMPUTER AI
====================================*/

// Disclaimer - this AI is very basic. It in no way represent what a true AI should look like. Sorry.

function TicTacToeAI(board) {

  // creating a reference to this in order to use inside helper functions
  var self = this;
  // initial variables
  this.matrix = board;

    this.coords = getCoords(this.matrix);
    this.diagonals = getDiagonals(this.matrix);
    this.columns = getColumns(this.matrix);

    this.diagCoords = getDiagonals(this.coords);
    this.colCoords = getColumns(this.coords);
    this.cornerCoords = [[0, 0], [0, 2], [2, 0], [2, 2]];


  /*=================
  HELPER FUNCTIONS
  ===================*/

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


  function play(coordinate, matrix) {
      // puts the AI's decision on the board
        matrix[coordinate[0]][coordinate[1]] = 0;
  }


  function forEachRow(func) {
    for (var i = 0; i < self.matrix.length; i++) {
      func(self.matrix[i], i, self.coords); //passing current row and the index of that row for reference when using coords
    }

    for (var i = 0; i < self.columns.length; i++) {
      func(self.columns[i], i, self.colCoords);
    }

    for (var i = 0; i < self.diagonals.length; i++) {
      func(self.diagonals[i], i, self.diagCoords);
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

  function getCoords(matrix) {
    var coords = [[], [], []];

    // populating coordinates array
    for (var i = 0; i < matrix.length; i++) {
      for (var j = 0; j < matrix[i].length; j++) {
        coords[i].push([i, j]); // column, row
      }
    }

    return coords;
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

  this.counter = function () {
  	var countered = false;
    forEachRow(function (row, idxOfRow, coords) {
      // if row needs countering and a play hasn't been made
      if (rowToCounter(row) && countered === false) {
        var idx = row.indexOf(null); // get empty space coordinate
        var coord = coords[idxOfRow][idx];

        play(coord, self.matrix);
        countered = true; // setting flag since function may execute more times
      }
    });

    return countered; // returns true if executed
  }

  this.win = function () {
    var won = false;
    forEachRow(function (row, idxOfRow, coords) {
      if (count(row, 0) == 2 && won === false && row.indexOf(null) > -1) {
        var idx = row.indexOf(null);
        var coord = coords[idxOfRow][idx];

        play(coord, self.matrix);
        won = true;
      }
    });

    return won; // returns won if executed
  }

  this.playCenter = function () {
    // if center is not taken, then take the center
    if (self.matrix[1][1] === null) {
      play([1, 1], self.matrix);
      return true;
    }
    return false;
  }

  this.playCorners = function () {
    // looking to see if any of the corners are available, and taking them.
    for (var i = 0; i < self.cornerCoords.length; i++) {
      var c = self.cornerCoords[i];
      if (self.matrix[c[0]][c[1]] === null) {
        play(c, self.matrix);
        return true;
      }
    }
    return false;
  }

  // plays on any empty spot
  this.playEmpty = function () {
    for (var i = 0; i < self.matrix.length; i++) {
      for (var j = 0; j < self.matrix[i].length; j++) {
        if (self.matrix[i][j] === null) {
          play([i, j], self.matrix);
          return true;
        }
      }
    }
    return false;
  }

  this.makeNextMove = function () {

      var moves = [this.win, this.counter, this.playCenter, this.playCorners, this.playEmpty]; // list of moves in order that they are to be tried

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


  this.update = function (matrix) {
    this.matrix = matrix;

    this.diagonals = getDiagonals(this.matrix);
    this.columns = getColumns(this.matrix);

    this.diagCoords = getDiagonals(this.coords);
    this.colCoords = getColumns(this.coords);
    this.cornerCoords = [[0, 0], [0, 2], [2, 0], [2, 2]];
  }

  this.getMatrix = function () {
    return this.matrix;
  }

  this.getAllRows = function () {
    return {
      "rows" : this.matrix,
      "columns" : this.columns,
      "diagonals" : this.diagonals
    }
  }
}
