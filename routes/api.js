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

    let validation = solver.validate(puzzle);
    if (validation !== "Puzzle is valid") {
      return res.json(validation);
    }

    let puzzle = solver.convertPuzzleToArray(puzzleString); //This function is dividing the string in an array of 9 strings.
    let row = req.body.coordinate[0].toUpperCase();
    let column = req.body.coordinate[1];
    let value = req.body.value;

    if (isNaN(value) || parseInt(value) < 1 || parseInt(value) > 9) {
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

    let validation = solver.validate(puzzle);
    if (validation !== "Puzzle is valid") {
      return res.json(validation);
    }

    //Solve the sudoku
    let solution = solver.solve(req.body.puzzle);
    console.log(solution);
    return res.json({
      solution: solution,
    });
  });
};
