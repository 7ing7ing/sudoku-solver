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

    let rowLetter = "ABCDEFGHI";
    row = rowLetter.indexOf(row); // Use index instead of letters.
    column--; // The index for the column starts at 1 in the HTML, but here it will start at 0.

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

    for (let i = 0; i < puzzle.length; i++) {
      for (let j = 0; j < puzzle[i].length; j++) {
        if (
          puzzle[i][j] !== "." &&
          (solver.checkRowPlacement(puzzle, i, puzzle[i][j]) === true ||
            solver.checkColPlacement(puzzle, j, puzzle[i][j]) === true ||
            solver.checkRegionPlacement(puzzle, i, j, puzzle[i][j]) === true)
        ) {
          return res.json({
            error: "Puzzle cannot be solved",
          });
        }
      }
    }

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
