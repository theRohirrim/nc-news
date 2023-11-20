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

    test("200: Check returned result is an array", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then((res) => {
            expect(Array.isArray(res.body.topics)).toBe(true);
        });
    });
    
    test("200: Check the returned results keys are correct", () => {
    return request(app)
        .get("/api/topics")
        .expect(200)
        .then((res) => {
        res.body.topics.forEach((topic) => {
            expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String)
            });
        });
        });
    });

    test("200: Topics table should have correct number of rows", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then((res) => {
            expect(res.body.topics.length).toBe(3);
        });
    });
})