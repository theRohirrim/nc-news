const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");

const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data")

beforeEach(() => {
    return seed(data);
});
  
afterAll(() => {
    return db.end();
});

describe("GET /api/topics", () => {
    test("200: Get the correct status code", () => {
        return request(app).get("/api/topics").expect(200);
    })
})