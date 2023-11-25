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
                    article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                    comment_count: "11"
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

    test("200: User can filter articles by topic", () => {
        return request(app)
          .get("/api/articles?topic=cats")
          .expect(200)
          .then((res) => {
            res.body.articles.forEach((article) => {
                expect(article).toMatchObject({
                    topic: "cats"
                })
            })
        })
    })

    test("200: User can filter articles by topic and author", () => {
        return request(app)
          .get("/api/articles?topic=cats&author=rogersop")
          .expect(200)
          .then((res) => {
            expect(res.body.articles[0]).toMatchObject({
                author: "rogersop",
                topic: "cats",
            })
        })
    })

    test("200: No user defined order defaults to ordering by created_at, most recent", () => {
        return request(app)
          .get("/api/articles?topic=cats")
          .expect(200)
          .then((res) => {
            expect(res.body.articles).toBeSortedBy("created_at", {
                descending: false,
            })
        })
    })

    test("200: User can order by author, ascending", () => {
        return request(app)
          .get("/api/articles?sort_by=author&order=asc")
          .expect(200)
          .then((res) => {
            expect(res.body.articles).toBeSortedBy("author", {
                descending: false,
            })
        })
    })

    test("200: User can filter by author, and order by topic descending", () => {
        return request(app)
          .get("/api/articles?author=butter_bridge&sort_by=topic&order=desc")
          .expect(200)
          .then((res) => {
            expect(res.body.articles).toBeSortedBy("topic", {
                descending: false,
            })
            res.body.articles.forEach((article) => {
                expect(article).toMatchObject({
                    author: 'butter_bridge'
                })
            })
        })
    })

    test("200: Valid query but no returned results", () => {
        return request(app)
          .get("/api/articles?topic=paper")
          .expect(200)
          .then((response) => {
            expect(response.body.articles.length).toBe(0);
        });
    });

    test("400: Invalid topic query", () => {
        return request(app)
        .get("/api/articles?topic=cheese")
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe("Invalid topic query");
        });
    });
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
        .then((response) => {
            expect(response.body.msg).toBe('Bad request');
        })
    });

    test("400: Rejects based on missing NOT NULL key (username)", () => {
        return request(app)
        .post("/api/articles/1/comments")
        .send({
            body: "I think it could have been worse"
        })
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Bad request');
        })
    });

    test("404: Rejects based on a valid but non existing article_id)", () => {
        return request(app)
        .post("/api/articles/5555/comments")
        .send({
            username: "rogersop",
            body: "I think it could have been worse"
        })
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('resource not found');
        })
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

describe("GET /api/users/:username", () => {
    test("200: Returned results keys and values are correct", () => {
        return request(app)
            .get("/api/users/lurker")
            .expect(200)
            .then((res) => {
                expect(res.body.user).toMatchObject({
                    username: 'lurker',
                    avatar_url: 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                    name: 'do_nothing'
            })
        });
    });

    test('404: sends an appropriate status and error message when given a valid but non-existent username', () => {
        return request(app)
          .get('/api/users/peter_jones')
          .expect(404)
          .then((response) => {
            expect(response.body.msg).toBe('user does not exist');
        });
    });
})

describe("DELETE /api/comments/:comment_id", () => {
    test("204: Successfully deletes comment and returns no content", () => {
        return request(app)
        .delete('/api/comments/1')
        .expect(204)
    })

    test("400: Rejects based on an invalid comment_id", () => {
        return request(app)
        .delete('/api/comments/string')
        .expect(400)
        .then((res) => {
            expect(res.body.msg).toBe('Bad request')
        })   
    })

    test("404: Rejects based on a valid but non existing comment_id", () => {
        return request(app)
        .delete('/api/comments/9999')
        .expect(404)
        .then((res) => {
            expect(res.body.msg).toBe('resource not found')
        })   
    })
})

describe("PATCH /api/articles/:article_id", () => {
    test("200: Successful patch will return the article", () => {
        return request(app)
        .patch('/api/articles/1')
        .send({
            inc_votes: 5
        })
        .expect(200)
        .then((res) => {
            expect(res.body.article).toMatchObject({
                article_id: 1,
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: convertTimestampToDate(1594329060000),
                votes: 105,
                article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
            })
        })
    })

    test("200: Successfully decremented the article", () => {
        return request(app)
        .patch('/api/articles/1')
        .send({
            inc_votes: -50
        })
        .expect(200)
        .then((res) => {
            expect(res.body.article).toMatchObject({
                article_id: 1,
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: convertTimestampToDate(1594329060000),
                votes: 50,
                article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
            })
        })
    })

    test("400: Rejects based on a bad request (article_id)", () => {
        return request(app)
        .patch("/api/articles/not_article")
        .send({
            inc_votes: 5
        })
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Bad request');
        })
    });

    test("404: Rejects based on a valid but non existing article_id", () => {
        return request(app)
        .patch("/api/articles/5555")
        .send({
            inc_votes: 5
        })
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('resource not found');
        })
    });

    test("400: Rejects based on a invalid request body (wrong property)", () => {
        return request(app)
        .patch("/api/articles/1")
        .send({
            in_vot: 5 
        })
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Bad request');
        })
    });

    test("400: Rejects based on a invalid request body (wrong value type)", () => {
        return request(app)
        .patch("/api/articles/1")
        .send({
            inc_votes: "Hello" 
        })
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Bad request');
        })
    });
})

describe("PATCH /api/comments/:comment_id", () => {
    test("200: Successful patch will return the comment", () => {
        return request(app)
        .patch('/api/comments/1')
        .send({
            inc_votes: 5
        })
        .expect(200)
        .then((res) => {
            expect(res.body.comment).toMatchObject({
                comment_id: 1,
                body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
                author: "butter_bridge",
                article_id: 9,
                created_at: expect.any(String),
                votes: 21
            })
        })
    })

    test("200: Successfully decrement the comment votes", () => {
        return request(app)
        .patch('/api/comments/1')
        .send({
            inc_votes: -50
        })
        .expect(200)
        .then((res) => {
            expect(res.body.comment).toMatchObject({
                votes: -34
            })
        })
    })

    test("400: Rejects based on a bad request (comment_id)", () => {
        return request(app)
        .patch("/api/comments/not_comment")
        .send({
            inc_votes: 5
        })
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Bad request');
        })
    });

    test("404: Rejects based on a valid but non existing article_id", () => {
        return request(app)
        .patch("/api/comments/5555")
        .send({
            inc_votes: 5
        })
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('resource not found');
        })
    });

    test("400: Rejects based on a invalid request body (wrong property)", () => {
        return request(app)
        .patch("/api/comments/1")
        .send({
            in_vot: 5 
        })
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Bad request');
        })
    });

    test("400: Rejects based on a invalid request body (wrong value type)", () => {
        return request(app)
        .patch("/api/comments/1")
        .send({
            inc_votes: "Hello" 
        })
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Bad request');
        })
    });
})

describe("POST: /api/articles", () => {
    test("201: Posts a new article successfully with correct properties and values", () => {
        return request(app)
        .post("/api/articles/")
        .send({
            author: "butter_bridge",
            title: "test article",
            body: "this article is about cats",
            topic: "cats",
            article_img_url: 'https://placeholder.jpg'
        })
        .expect(201)
        .then((response) => {
            expect(response.body.article).toMatchObject({
                author: "butter_bridge",
                title: "test article",
                body: "this article is about cats",
                topic: "cats",
                article_img_url: 'https://placeholder.jpg',
                article_id: 14,
                votes: 0,
                created_at: expect.any(String)
            });
        }); 
    });

    test("201: Posts a new article successfully with article_img_url defaulted", () => {
        return request(app)
        .post("/api/articles")
        .send({
            author: "butter_bridge",
            title: "test article",
            body: "this article is about cats",
            topic: "cats"
        })
        .expect(201)
        .then((response) => {
            expect(response.body.article).toMatchObject({
                author: "butter_bridge",
                title: "test article",
                body: "this article is about cats",
                topic: "cats",
                article_img_url: 'https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700',
                article_id: 14,
                votes: 0,
                created_at: expect.any(String)
            });
        }); 
    });

    test("400: Rejects based on missing NOT NULL key (title)", () => {
        return request(app)
        .post("/api/articles")
        .send({
            author: "butter_bridge",
            body: "this article is about cats",
            topic: "cats",
            article_img_url: 'https://placeholder.jpg'
        })
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Bad request');
        })
    });
})