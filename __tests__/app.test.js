const endpointsJson = require("../endpoints.json");
/* Set up your test imports here */
const request = require("supertest");
const app = require("../app.js");

// const db = require("../db/connection");
// const seed = require("../db/seeding/seed");
// const data = require("../db/data/test-data");
// to git pull
/* Set up your beforeEach & afterAll functions here */
// beforeEach(() => {
//   return seed(data);
// });
// afterAll(() => {
//   return db.end();
// });

describe.only("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});
