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

describe("GET /api", () => {
    test("200: Get the correct status code", () => {
        return request(app).get("/api").expect(200);
    })

    test("200: Check returned result is an object", () => {
        return request(app)
          .get("/api")
          .expect(200)
          .then((res) => {
            expect(typeof res.body).toBe('object')
            expect(Array.isArray(res.body.topics)).toBe(false);
        });
    });

    test("200: Endpoint objects should have correct keys", () => {
        return request(app)
          .get("/api")
          .expect(200)
          .then((res) => {
            for (const [key, value] of Object.entries(res.body.endpoints)) {
                if (key === 'GET /api') {
                    expect(value).toMatchObject({
                        description: expect.any(String)
                    })
                } else {
                    expect(value).toMatchObject({
                        description: expect.any(String),
                        queries: expect.any(Array),
                        exampleResponse: expect.any(Object)
                    })
                }
            }
        });
    });
})

describe("GET /api/articles", () => {
    test("200: Returned items are in an array", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then((res) => {
            expect(Array.isArray(res.body.articles)).toBe(true);
        });
    });

    test("200: Returned array has the right number of items", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then((res) => {
            console.log(res.body.articles);
            expect(res.body.articles.length).toBe(13)
        });
    });

    test("200: Returned array has the right properties (and doesn't include body property)", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then((res) => {
            const articlesArray = res.body.articles
            articlesArray.forEach((article) => {
                expect(article).toMatchObject({
                    article_id: expect.any(Number),
                    title: expect.any(String),
                    author: expect.any(String),
                    topic: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    article_img_url: expect.any(String),
                    comment_count: expect.any(String),
                })
                expect(article).not.toHaveProperty('body')
            })
        })
    })

    test("200: Ordered by date in descending order", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then((res) => {
            expect(res.body.articles).toBeSortedBy("created_at", {
                descending: true,
              });
        })
    })
});
