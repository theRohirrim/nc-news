const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");

const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");

const {convertTimestampToDate} = require("../db/seeds/utils")

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

describe.only("GET /api/articles/:article_id", () => {
    test("200: Get the correct status code", () => {
        return request(app).get("/api/articles/1").expect(200);
    })

    test("200: Check returned result is an object", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then((res) => {
            expect(Array.isArray(res.body.article)).toBe(false);
            expect(typeof res.body).toBe('object');
        });
    });

    test("200: Returned results keys and values are correct", () => {
        return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then((res) => {
                expect(res.body.article).toMatchObject({
                    article_id: 1,
                    title: "Living in the shadow of a great man",
                    topic: "mitch",
                    author: "butter_bridge",
                    body: "I find this existence challenging",
                    created_at: convertTimestampToDate(1594329060000),
                    votes: 100,
                    article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
            })
        });
    });
})