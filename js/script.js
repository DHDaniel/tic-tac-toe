
var $ticBoard = $("#tic-tac-toe-table");

var matrix = getMatrixValues();

var playerTurn = true;
var xStyle = "X";
var oStyle = "O";

var xColor = "#FF9B28";
var oColor = "#FF4242";

var $playerCounter = $("#results #player .count");
var $computerCounter = $("#results #computer .count");
var $tieCounter = $("#results #ties .count");

var $results = $("#results");

var playerStyle = xStyle;
var computerStyle = oStyle;

var playerColor = xColor;
var computerColor = oColor;

// initializing AI and getting all rows from its helper
var computerAI = new TicTacToeAI(matrix);

var allRows = computerAI.getAllRows();

function displayResult(result) {
  var scoring = $results.html();
  $results.children().fadeOut(100);

  $results.html(result).fadeIn(100);

  setTimeout(function () {
    $results.html(scoring).fadeIn(100);
  }, 2000);
}

// Determines the styling to use for each box in tic tac toe board
function addStyling($box, value) {
  switch (value) {
    case null:
      $box.html("");
      break;
    case 0:
      $box.html(computerStyle);
      $box.css("color", computerColor);
      break;
    case 1:
      $box.html(playerStyle);
      $box.css("color", playerColor);
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

function resetMatrix() {
  return [[null, null, null], [null, null, null], [null, null, null]];
}

function resetGame() {
  matrix = resetMatrix();
  setMatrixValues(matrix);
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

function resolveGame(outcome) {
  switch (outcome) {
    case 1:
      $("#results #player .count").html( parseInt($("#results #player .count").html()) + 1);
      displayResult("Player wins!");
      resetGame();
      return true;
    case 0:
      $("#results #computer .count").html( parseInt($("#results #computer .count").html()) + 1);
      displayResult("Computer wins!");
      resetGame();
      return true;
    case true:
      $("#results #ties .count").html( parseInt($("#results #ties .count").html()) + 1);
      displayResult("Tie game!");
      resetGame();
      return true;;
  }

  return false;
}


// for choosing which item you want to be
$("#x").click(function () {
  playerStyle = xStyle;
  computerStyle = oStyle;
  playerColor = xColor;
  computerColor = oColor;
  resetGame();
  playerTurn = true;

  // applying proper styling
  $("#choose").children().removeClass("selected");
  $(this).addClass("selected");
});

$("#o").click(function () {
  playerStyle = oStyle;
  computerStyle = xStyle;
  playerColor = oColor;
  computerColor = xColor;
  resetGame();
  playerTurn = true;

  // applying proper styling
  $("#choose").children().removeClass("selected");
  $(this).addClass("selected");
});


$("#tic-tac-toe-table td").click(function () {
  var isEmpty = Boolean($(this).data("val") === null);

  if (isEmpty && playerTurn) {

      var coord = getBoxCoordinate($(this), matrix);
      matrix[coord[0]][coord[1]] = 1; // making the move

      setMatrixValues(matrix); // updating matrix

      playerTurn = false;

      // waiting .5 seconds for computer to make its move
      setTimeout(function () {

        // checking if player won
        computerAI.update(matrix);
        var allRows = computerAI.getAllRows();
        var outcome = checkForWins(allRows);
        resolveGame(outcome);

        computerAI.update(matrix);
        computerAI.makeNextMove();
        matrix = computerAI.getMatrix();

        setMatrixValues(matrix); // updating matrix

        computerAI.update(matrix); // updating before getting rows, because the setMatrixValues does not update diagonals or columns
        allRows = computerAI.getAllRows();

        setTimeout(function () {
          var outcome = checkForWins(allRows);
          resolveGame(outcome);
        }, 100);

        playerTurn = true;


      }, 500);
  }
});
