import server from "../index.js";
import chai from "chai";
import chaiHttp from 'chai-http';

chai.should();
chai.use(chaiHttp);

describe("Offers APIs", () => {
  describe("Test GET route /offers", () => {
    it("It should return all offers", (done) => {
      chai
        .request(server)
        .get("/offers")
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a("array");
          done();
        });
    });
  });
});
