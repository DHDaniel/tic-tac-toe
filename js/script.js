
var $ticBoard = $("#tic-tac-toe-table");

var matrix = getMatrixValues();

// initializing AI and getting all rows from its helper
var computerAI = new TicTacToeAI(matrix);

var allRows = computerAI.getAllRows();

console.log(allRows);

var playerTurn = true;

// Determines the styling to use for each box in tic tac toe board
function addStyling($box, value) {
  switch (value) {
    case null:
      $box.css("background-color", "white");
      break;
    case 0:
      $box.css("background-color", "blue");
      break;
    case 1:
      $box.css("background-color", "red");
      break;
  }
}

function getMatrixValues() {
  var rows = $ticBoard.find("tr");
  var matrix = [];
  for (var i = 0; i < rows.length; i++) {
    // making second jQuery object
    var row = rows.eq(i);
    var arr = [];
    var boxes = row.find("td");
    for (var j = 0; j < boxes.length; j++) {
      var box = boxes.eq(j);
      var value = boxes.data("val");
      arr.push(value);
    }
    matrix.push(arr);
  }

  return matrix;
}

function setMatrixValues(matrix) {
  var rows = $ticBoard.find("tr");
  for (var i = 0; i < rows.length; i++) {
    var row = matrix[i];
    var tableRow = rows.eq(i);
    var boxes = tableRow.find("td");
    for (var j = 0; j < boxes.length; j++) {
      // setting corresponding value
      var box = boxes.eq(j);
      box.data("val", row[j]);

      // determines how to style the box based on its value
      addStyling(box, row[j]);
    }
  }
}

function getBoxCoordinate($box, matrix) {
  var rows = $ticBoard.find("tr");
  for (var i = 0; i < rows.length; i++) {
    // making second jQuery object
    var row = rows.eq(i);
    var boxes = row.find("td");
    for (var j = 0; j < boxes.length; j++) {
      var box = boxes.eq(j);
      // checking that the box that was clicked is this actual box
      if ($box.is(box)) {
        return [i, j]; // returning coordinate in the matrix
      }
    }
  }

  return null;
}


  // checks if all elements in an array are the same
  function checkRow(row) {
    var first = row[0];
    for (var i = 1; i < row.length; i++) {
      if (row[i] !== first || row[i] === null) {
        return false;
      }
    }
    return true;
  }

// checks if there are any wins in the tic tac toe matrix
function checkForWins(rows) {
  // checking rows
  var allFull = true;
  for (var i = 0; i < rows.rows.length; i++) {
     if (checkRow(rows.rows[i])) {
        return rows.rows[i][0];
     }

     if (rows.rows[i].indexOf(null) > -1) {
       allFull = false;
     }
   }
   // columns
  for (var i = 0; i < rows.columns.length; i++) {
    if (checkRow(rows.columns[i])) {
      return rows.columns[i][0];
    }
  }
  // diagonals
  for (var i = 0; i < rows.diagonals.length; i++) {
    if (checkRow(rows.diagonals[i])) {
      return rows.diagonals[i][0];
    }
  }

  if (allFull) {
    return true;
  }
  return false; // if no wins
}


$("#tic-tac-toe-table td").click(function () {
  var isEmpty = Boolean($(this).data("val") === null);

  if (isEmpty && playerTurn) {

      var coord = getBoxCoordinate($(this), matrix);
      matrix[coord[0]][coord[1]] = 1; // making the move

      setMatrixValues(matrix); // updating matrix
      playerTurn = false;

      // waiting .5 seconds for computer to make its move
      setTimeout(function () {

        computerAI.update(matrix);
        computerAI.makeNextMove();
        matrix = computerAI.getMatrix();

        setMatrixValues(matrix); // updating matrix

        computerAI.update(matrix); // updating before getting rows, because the setMatrixValues does not update diagonals or columns
        allRows = computerAI.getAllRows();

        setTimeout(function () {
          var outcome = checkForWins(allRows);

          switch (outcome) {
            case 1:
              alert("Player wins!");
              break;
            case 0:
              alert("Computer wins!");
              break;
            case true:
              alert("Tie game");
              break;
          }

        }, 100);

        playerTurn = true;


      }, 500);
  }
});
