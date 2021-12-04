"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route("/api/check").post((req, res) => {
    let puzzle = solver.convertPuzzleToArray(req.body.puzzle);
    let row = req.body.coordinate[0];
    let column = req.body.coordinate[1];
    let value = req.body.value;

    let rowLetter = "ABCDEFGHI";
    row = rowLetter.indexOf(row); // Use index instead of letters.
    column--; // The index for the column starts at 1 in the HTML, but here it will start at 0.
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
