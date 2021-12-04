const { puzzlesAndSolutions } = require("./puzzle-strings");

class SudokuSolver {
  convertPuzzleToArray(puzzleString) {
    let arr = [];
    for (let i = 0; i < 9; i++) {
      arr.push(puzzleString.substring(i * 9, (i + 1) * 9));
    }
    return arr;
  }

  checkRowPlacement(puzzle, row, value) {
    //Puzzle = array of strings
    // Row & column starts at 0
    if (puzzle[row].indexOf(value) !== -1) {
      return true;
    } else {
      return false;
    }
  }

  checkColPlacement(puzzle, column, value) {
    for (let i = 0; i < puzzle.length; i++) {
      if (puzzle[i][column] === value) {
        return true;
      }
    }
    return false;
  }

  checkRegionPlacement(puzzle, row, column, value) {
    let minCol;
    let maxCol;
    let minRow;
    let maxRow;

    if (row % 3 === 0) {
      minRow = row;
      maxRow = row + 2;
    } else if (row % 3 === 1) {
      minRow = row - 1;
      maxRow = row + 1;
    } else {
      minRow = row - 2;
      maxRow = row;
    }

    if (column % 3 === 0) {
      minCol = column;
      maxCol = column + 2;
    } else if (column % 3 === 1) {
      minCol = column - 1;
      maxCol = column + 1;
    } else {
      minCol = column - 2;
      maxCol = column;
    }

    for (let i = minRow; i <= maxRow; i++) {
      for (let j = minCol; j <= maxCol; j++) {
        if (puzzle[i][j] === value) {
          return true;
        }
      }
    }
    return false;
  }

  deletePossibities(possibilitiesArray, row, column, value) {
    // Check row and delete possibilities
    for (let i = 0; i < possibilitiesArray[row].length; i++) {
      if (
        Array.isArray(possibilitiesArray[row][i]) &&
        possibilitiesArray[row][i].indexOf(value) !== -1
      ) {
        possibilitiesArray[row][i].splice(
          possibilitiesArray[row][i].indexOf(value),
          1
        );
      }
    }

    // Check column and delete possibilities
    for (let i = 0; i < possibilitiesArray.length; i++) {
      if (
        Array.isArray(possibilitiesArray[i][column]) &&
        possibilitiesArray[i][column].indexOf(value) !== -1
      ) {
        possibilitiesArray[i][column].splice(
          possibilitiesArray[i][column].indexOf(value),
          1
        );
      }
    }

    // Check region and delete
    let minCol;
    let maxCol;
    let minRow;
    let maxRow;

    if (row % 3 === 0) {
      minRow = row;
      maxRow = row + 2;
    } else if (row % 3 === 1) {
      minRow = row - 1;
      maxRow = row + 1;
    } else {
      minRow = row - 2;
      maxRow = row;
    }

    if (column % 3 === 0) {
      minCol = column;
      maxCol = column + 2;
    } else if (column % 3 === 1) {
      minCol = column - 1;
      maxCol = column + 1;
    } else {
      minCol = column - 2;
      maxCol = column;
    }

    for (let i = minRow; i <= maxRow; i++) {
      for (let j = minCol; j < maxCol; j++) {
        if (
          Array.isArray(possibilitiesArray[i][j]) &&
          possibilitiesArray[i][j].indexOf(value) !== -1
        ) {
          possibilitiesArray[i][j].splice(
            possibilitiesArray[i][j].indexOf(value),
            1
          );
        }
      }
    }
  }

  resolvePuzzle(possibilitiesArray) {
    let isSolved = true;
    for (let i = 0; i < possibilitiesArray.length; i++) {
      if (!isSolved) {
        break;
      }
      for (let j = 0; j < possibilitiesArray[i].length; j++) {
        if (Array.isArray(possibilitiesArray[i][j])) {
          isSolved = false;
          break;
        }
      }
    }
    if (isSolved) {
      return possibilitiesArray;
    } else {
      for (let i = 0; i < possibilitiesArray.length; i++) {
        for (let j = 0; j < possibilitiesArray[i].length; j++) {
          if (
            Array.isArray(possibilitiesArray[i][j]) &&
            possibilitiesArray[i][j].length === 1
          ) {
            let cellSolution = possibilitiesArray[i][j][0];
            possibilitiesArray[i][j] = cellSolution;
            this.deletePossibities(possibilitiesArray, i, j, cellSolution);
          }
        }
      }
      return this.resolvePuzzle(possibilitiesArray);
    }
  }

  solve(puzzleString) {
    puzzleString = this.convertPuzzleToArray(puzzleString);
    let possibilitiesArray = [...puzzleString]; //Matrix that will include all the solutions
    for (let i = 0; i < possibilitiesArray.length; i++) {
      possibilitiesArray[i] = possibilitiesArray[i].split("");
    }
    //Loops through the initial matrix (the one we have to resolve)
    //--Check if there is any number from 1 to 9 that can fit when the matrix is "."
    //----If a number can be the solution, then insert it in the matrix of possibilities (same position we are looking into)
    for (let i = 0; i < puzzleString.length; i++) {
      for (let j = 0; j < puzzleString[i].length; j++) {
        if (puzzleString[i][j] === ".") {
          let possibilities = [];
          for (let number = 1; number < 10; number++) {
            if (
              this.checkRowPlacement(puzzleString, i, String(number)) ===
                false &&
              this.checkColPlacement(puzzleString, j, String(number)) ===
                false &&
              this.checkRegionPlacement(puzzleString, i, j, String(number)) ===
                false
            ) {
              possibilities.push(number);
            }
          }
          possibilitiesArray[i][j] = possibilities;
        }
      }
    }

    return this.resolvePuzzle(possibilitiesArray);
  }

  validate(puzzleString) {
    if (puzzleString.match(/[^1-9\.]/)) {
      //^ matches the opossite of the regex (matches not number and not period)
      return false;
    } else {
      return true;
    }
  }
}

module.exports = SudokuSolver;
