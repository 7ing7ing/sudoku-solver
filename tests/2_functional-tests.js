const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");

const puzzleStrings = require("../controllers/puzzle-strings");

chai.use(chaiHttp);

suite("Functional Tests", () => {
  suite("POST request to /api/solve", function () {
    test("Solve a puzzle with valid puzzle string", function (done) {
      chai
        .request(server)
        .post("/api/solve")
        .send({
          puzzle: puzzleStrings.puzzlesAndSolutions[0][0],
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(
            res.body.solution,
            puzzleStrings.puzzlesAndSolutions[0][1]
          );
          done();
        });
    });
  });
});
