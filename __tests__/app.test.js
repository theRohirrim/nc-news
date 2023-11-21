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

describe("GET /api/articles/:article_id", () => {
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

    test('404: sends an appropriate status and error message when given a valid but non-existent id', () => {
        return request(app)
          .get('/api/articles/45012')
          .expect(404)
          .then((response) => {
            expect(response.body.msg).toBe('article does not exist');
        });
    });

    test('400: sends an appropriate status and error message when given an invalid id', () => {
        return request(app)
          .get('/api/articles/not-an-article')
          .expect(400)
          .then((response) => {
            expect(response.body.msg).toBe('Bad request');
        });
    });
})

describe("GET /api", () => {
    test("200: Get the correct status code", () => {
        return request(app).get("/api").expect(200);
    })

    test("200: Returned item is an object", () => {
        return request(app)
        .get("/api")
        .expect(200)
        .then((res) => {
          expect(typeof res.body).toBe('object')
          expect(Array.isArray(res.body.topics)).toBe(false);
        })
    })

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

describe("GET /api/articles/:article_id/comments", () => {
    test("200: Comments should be an array of correct length and have correct properties", () => {
        return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then((res) => {
            expect(res.body.comments.length).toBe(11)
            res.body.comments.forEach((comment) => {
                expect(comment).toMatchObject({
                    comment_id: expect.any(Number),
                    votes: expect.any(Number),
                    created_at: expect.any(String),
                    author: expect.any(String),
                    body: expect.any(String),
                    article_id: expect.any(Number),
                })
            })
        });
    })

    test("200: Comments should be ordered by most recent comments first", () => {
        return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then((res) => {
            expect(res.body.comments).toBeSortedBy('created_at', {
                descending: true,
              });
        });
    })

    test("200: No comments present, return an empty array", () => {
        return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then((res) => {
            expect(res.body.comments).toEqual([]);
        });
    })

    test('404: sends an appropriate status and error message when given a valid but non-existent id', () => {
        return request(app)
          .get('/api/articles/45012/comments')
          .expect(404)
          .then((response) => {
            expect(response.body.msg).toBe('resource not found');
        });
    });

    test('400: sends an appropriate status and error message when given an invalid id', () => {
        return request(app)
          .get('/api/articles/not-an-article')
          .expect(400)
          .then((response) => {
            expect(response.body.msg).toBe('Bad request');
        });
    });
})

describe("GET /api/articles", () => {
    test("200: Returned array has the right number of items", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then((res) => {
            expect(Array.isArray(res.body.articles)).toBe(true);
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

describe("POST: /api/articles/:article_id/comments", () => {
    test("201: Posts a new comment successfully with correct properties and values", () => {
        return request(app)
        .post("/api/articles/1/comments")
        .send({
            username: "rogersop",
            body: "I think it could have been worse"
        })
        .expect(201)
        .then((response) => {
        expect(response.body.comment).toMatchObject({
            article_id: 1,
            author: "rogersop",
            body: "I think it could have been worse",
            comment_id: 19,
            created_at: expect.any(String),
            votes: 0,
        });
    });
    });

    test("400: Rejects based on a bad request (article_id)", () => {
        return request(app)
        .post("/api/articles/not_article/comments")
        .send({
            username: "rogersop",
            body: "I think it could have been worse"
        })
        .expect(400)
    });

    test("400: Rejects based on missing NOT NULL key (username)", () => {
        return request(app)
        .post("/api/articles/1/comments")
        .send({
            body: "I think it could have been worse"
        })
        .expect(400)
    });

    test("404: Rejects based on a valid but non existing article_id)", () => {
        return request(app)
        .post("/api/articles/5555/comments")
        .send({
            username: "rogersop",
            body: "I think it could have been worse"
        })
        .expect(404)
    });
})

describe("GET /api/users", () => {
    test("200: Returns a list of all users, with correct number of users and properties", () => {
        return request(app)
        .get("/api/users")
        .expect(200)
        .then((res) => {
            expect(res.body.users.length).toBe(4)
            res.body.users.forEach((user) => {
                expect(user).toMatchObject({
                    username: expect.any(String),
                    name: expect.any(String),
                    avatar_url: expect.any(String)
                })
            })
        })
    })
})