"use strict";

const { puzzlesAndSolutions } = require("../controllers/puzzle-strings.js");
const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route("/api/check").post((req, res) => {
    let puzzleString = req.body.puzzle;

    if (
      !puzzleString ||
      puzzleString === "" ||
      !req.body.coordinate ||
      req.body.coordinate === "" ||
      !req.body.value ||
      req.body.value === ""
    ) {
      return res.json({
        error: "Required field(s) missing",
      });
    }

    if (!solver.validate(puzzleString)) {
      return res.json({
        error: "Invalid characters in puzzle",
      });
    }

    if (puzzleString.length !== 81) {
      return res.json({
        error: "Expected puzzle to be 81 characters long",
      });
    }

    let puzzle = solver.convertPuzzleToArray(puzzleString); //This function is dividing the string in an array of 9 strings.
    let row = req.body.coordinate[0].toUpperCase();
    let column = req.body.coordinate[1];
    let value = req.body.value;

    if (parseInt(value) < 1 || parseInt(value) > 10) {
      return res.json({
        error: "Invalid value",
      });
    }

    if (req.body.coordinate.length > 2) {
      return res.json({
        error: "Invalid coordinate",
      });
    }

    let rowLetter = "ABCDEFGHI";
    row = rowLetter.indexOf(row); // Use index instead of letters.
    column--; // The index for the column starts at 1 in the HTML, but here it will start at 0.

    if (row === -1 || column > 8 || column < 0) {
      return res.json({
        error: "Invalid coordinate",
      });
    }

    if (value === puzzle[row][column]) {
      return res.json({ valid: true });
    }

    if (
      solver.checkRowPlacement(puzzle, row, value) === false &&
      solver.checkColPlacement(puzzle, column, value) === false &&
      solver.checkRegionPlacement(puzzle, row, column, value) === false
    ) {
      return res.json({ valid: true });
    } else {
      let conflictArray = [];
      if (solver.checkRowPlacement(puzzle, row, value) === true) {
        conflictArray.push("row");
      }
      if (solver.checkColPlacement(puzzle, column, value) === true) {
        conflictArray.push("column");
      }
      if (solver.checkRegionPlacement(puzzle, row, column, value) === true) {
        conflictArray.push("region");
      }

      return res.json({
        valid: false,
        conflict: conflictArray,
      });
    }
  });

  app.route("/api/solve").post((req, res) => {
    let puzzle = req.body.puzzle;

    if (!puzzle || puzzle === "") {
      return res.json({
        error: "Required field missing",
      });
    }

    if (!solver.validate(puzzle)) {
      return res.json({
        error: "Invalid characters in puzzle",
      });
    }

    if (puzzle.length !== 81) {
      return res.json({
        error: "Expected puzzle to be 81 characters long",
      });
    }

    //Check if the sudoku can be solved or there are numbers repeated in row/column/region
    let puzzleArray = solver.convertPuzzleToArray(puzzle);
    for (let i = 0; i < puzzleArray.length; i++) {
      for (let j = 0; j < puzzleArray[i].length; j++) {
        if (puzzleArray[i][j] !== ".") {
          let number = puzzleArray[i][j];
          //Modidying puzzleArray[i][j] so the check functions don't detect the number from the position we are passing
          //(since the number is going to exist in its own position)
          puzzleArray[i] =
            puzzleArray[i].substring(0, puzzleArray[i].indexOf(number)) +
            "." +
            puzzleArray[i].substring(puzzleArray[i].indexOf(number) + 1);
          if (
            solver.checkRowPlacement(puzzleArray, i, number) === true ||
            solver.checkColPlacement(puzzleArray, j, number) === true ||
            solver.checkRegionPlacement(puzzleArray, i, j, number) === true
          ) {
            return res.json({
              error: "Puzzle cannot be solved",
            });
          }
        }
      }
    }

    //Solve the sudoku
    let solution = solver.solve(req.body.puzzle);
    for (let i = 0; i < solution.length; i++) {
      solution[i] = solution[i].join("");
    }

    solution = solution.join("");
    return res.json({
      solution: solution,
    });
  });
};
