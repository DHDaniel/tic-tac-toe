
var $ticBoard = $("#tic-tac-toe-table");

var matrix = getMatrixValues();
var playerTurn = true;

// getting an identical array with the coordinates of each point - useful for when telling AI how/where to play
var coords = [[], [], []];
for (var i = 0; i < matrix.length; i++) {
  for (var j = 0; j < matrix[i].length; j++) {
    coords[i].push([i, j]); // column, row
  }
}

// very useful variables - containing actual numbers for AI
var columns = getColumns(matrix);
var diagonals = getDiagonals(matrix);

// containing coordinates to matrix
var colCoords = getColumns(coords);
var diagCoords = getDiagonals(coords);
var cornerCoords = [[0, 0], [0, 2], [2, 0], [2, 2]];

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


$("#tic-tac-toe-table td").click(function () {
  var isEmpty = Boolean($(this).data("val") === null);
  console.log(isEmpty);

  if (isEmpty) {
      var coord = getBoxCoordinate($(this), matrix);
      matrix[coord[0]][coord[1]] = 1; // making the move
      setMatrixValues(matrix); // updating matrix

      // getting columns and diagonals again for AI
      columns = getColumns(matrix);
      diagonals = getDiagonals(matrix);

      makeNextMove(matrix); // AI move
      setMatrixValues(matrix); // updating matrix
  }
});
