const chai = require("chai");
const assert = chai.assert;

const Solver = require("../controllers/sudoku-solver.js");
const puzzleStrings = require("../controllers/puzzle-strings");
let solver = new Solver();

suite("UnitTests", () => {
  test("Logic handles a valid puzzle string of 81 characters", function (done) {
    let puzzle = puzzleStrings.puzzlesAndSolutions[0][0];
    let solution = puzzleStrings.puzzlesAndSolutions[0][1];
    assert.equal(solver.solve(puzzle), solution);
    done();
  });

  test("Logic handles a puzzle string with invalid characters (not 1-9 or .)", function (done) {
    let puzzle =
      "M.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
    let error = "Invalid characters in puzzle";
    assert.equal(solver.validate(puzzle).error, error);
    done();
  });

  test("Logic handles a puzzle string that is not 81 characters in length", function (done) {
    let puzzle =
      ".5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
    let error = "Expected puzzle to be 81 characters long";
    assert.equal(solver.validate(puzzle).error, error);
    done();
  });

  test("Logic handles a valid row placement", function (done) {
    let puzzle = puzzleStrings.puzzlesAndSolutions[0][0];
    let valid = false;

    assert.equal(
      solver.checkRowPlacement(solver.convertPuzzleToArray(puzzle), 0, "7"),
      valid
    );
    done();
  });

  test("Logic handles an invalid row placement", function (done) {
    let puzzle = puzzleStrings.puzzlesAndSolutions[0][0];
    let notValid = true;

    assert.equal(
      solver.checkRowPlacement(solver.convertPuzzleToArray(puzzle), 0, "1"),
      notValid
    );
    done();
  });

  test("Logic handles a valid column placement", function (done) {
    let puzzle = puzzleStrings.puzzlesAndSolutions[0][0];
    let valid = false;

    assert.equal(
      solver.checkColPlacement(solver.convertPuzzleToArray(puzzle), 1, "1"),
      valid
    );
    done();
  });

  test("Logic handles an invalid column placement", function (done) {
    let puzzle = puzzleStrings.puzzlesAndSolutions[0][0];
    let notValid = true;

    assert.equal(
      solver.checkColPlacement(solver.convertPuzzleToArray(puzzle), 1, "2"),
      notValid
    );
    done();
  });

  test("Logic handles a valid region (3x3 grid) placement", function (done) {
    let puzzle = puzzleStrings.puzzlesAndSolutions[0][0];
    let valid = false;

    assert.equal(
      solver.checkRegionPlacement(
        solver.convertPuzzleToArray(puzzle),
        0,
        1,
        "3"
      ),
      valid
    );
    done();
  });

  test("Logic handles an invalid region (3x3 grid) placement", function (done) {
    let puzzle = puzzleStrings.puzzlesAndSolutions[0][0];
    let notValid = true;

    assert.equal(
      solver.checkRegionPlacement(
        solver.convertPuzzleToArray(puzzle),
        0,
        1,
        "6"
      ),
      notValid
    );
    done();
  });

  test("Valid puzzle strings pass the solver", (done) => {
    let puzzle = puzzleStrings.puzzlesAndSolutions[0][0];
    let sudokuResolved = puzzleStrings.puzzlesAndSolutions[0][1];
    let result = "Puzzle is valid";

    assert.equal(solver.validate(puzzle), result);
    assert.equal(solver.checkPuzzleIsValid(puzzle), result);
    assert.equal(solver.solve(puzzle), sudokuResolved);
    done();
  });

  test("Invalid puzzle strings fail the solver", (done) => {
    let puzzle =
      "55..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
    let result = "Puzzle is valid";

    assert.notEqual(solver.validate(puzzle), result);
    assert.notEqual(solver.checkPuzzleIsValid(puzzle), result);
    done();
  });

  test("Solver returns the expected solution for an incomplete puzzle", (done) => {
    let puzzle = puzzleStrings.puzzlesAndSolutions[0][0];
    let sudokuResolved = puzzleStrings.puzzlesAndSolutions[0][1];

    assert.equal(solver.solve(puzzle), sudokuResolved);
    done();
  });
});
