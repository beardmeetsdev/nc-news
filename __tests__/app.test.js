const endpointsJson = require("../endpoints.json");
/* Set up your test imports here */
const request = require("supertest");
const app = require("../app.js");

const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");

beforeEach(() => {
  return seed(data);
});
afterAll(() => {
  return db.end();
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET: /api/topics", () => {
  test("200: Responds with all topic in an array", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description");
        });
      });
  });
});

describe("GET: /api/articles/:id", () => {
  test("200: Responds with a single article object from the requested id", () => {
    return request(app)
      .get("/api/articles/4")
      .expect(200)
      .then(({ body }) => {
        expect(body.article_id).toBe(4);
        expect(body.author).toBe("rogersop");
        expect(body.title).toBe("Student SUES Mitch!");
        expect(body.body).toBe(
          "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages"
        );
        expect(body.topic).toBe("mitch");
        expect(body.created_at).toBe("2020-05-06T01:14:00.000Z");
        expect(body.votes).toBe(0);
        expect(body.article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
        expect(typeof body.article_id).toBe("number");
        expect(typeof body.author).toBe("string");
        expect(typeof body.title).toBe("string");
        expect(typeof body.body).toBe("string");
        expect(typeof body.topic).toBe("string");
        expect(typeof body.created_at).toBe("string");
        expect(typeof body.votes).toBe("number");
        expect(typeof body.article_img_url).toBe("string");
      });
  });
  test("404: Responds when tyring to get an article which does not exist (99)", () => {
    return request(app)
      .get("/api/articles/99")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Resource not found with value: 99");
      });
  });
  test("400: Responds when given a bad request (seal)", () => {
    return request(app)
      .get("/api/articles/seal")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid DB input format");
      });
  });
});

describe("GET: /api/articles", () => {
  test("200: Responds with all articles in an array", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(13);
        expect(articles[0].article_id).toBe(3);
        articles.forEach((article) => {
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("number");
        });
      });
  });
  test("200: Responds with all articles in an array sorted by column (title) and order ASC", () => {
    return request(app)
      .get("/api/articles?sort_by=title&order=asc")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles[0].title).toBe("A");
      });
  });
  test("200: Responds with all articles in an array sorted by column (title) and order DESC", () => {
    return request(app)
      .get("/api/articles?sort_by=title&order=desc")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles[0].title).toBe("Z");
      });
  });
  test("400: Responds when given a bad request when ordered by non-table column", () => {
    return request(app)
      .get("/api/articles?sort_by=genre&order=desc")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Table column does not exist");
      });
  });
});

describe("GET: /api/articles/:id/comments", () => {
  test("200: Responds with an array of comments from the given article ID", () => {
    return request(app)
      .get("/api/articles/5/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.article.length).toBe(2);
        expect(body.article[0]).toHaveProperty("comment_id");
        expect(body.article[0]).toHaveProperty("votes");
        expect(body.article[0]).toHaveProperty("created_at");
        expect(body.article[0]).toHaveProperty("author");
        expect(body.article[0]).toHaveProperty("body");
        expect(body.article[0]).toHaveProperty("article_id");
      });
  });
  test("404: Responds when trying to get an article comment which does not exist (99)", () => {
    return request(app)
      .get("/api/articles/99/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Resource not found with value: 99");
      });
  });
  test("200: article exists but has no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toEqual([]);
      });
  });
  test("400: Responds when given a bad request (seal)", () => {
    return request(app)
      .get("/api/articles/seal/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid DB input format");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: Responds with the posted comment when adding comment for a username", () => {
    const comment = {
      username: "butter_bridge",
      body: "driving pug",
    };
    return request(app)
      .post("/api/articles/3/comments")
      .send(comment)
      .expect(201)
      .then(({ body }) => {
        const comment = body.comment;

        expect(body).toHaveProperty("comment");
        expect(comment).toHaveProperty("comment_id");
        expect(comment).toHaveProperty("article_id");
        expect(comment).toHaveProperty("body", "driving pug");
        expect(comment).toHaveProperty("votes");
        expect(comment).toHaveProperty("author", "butter_bridge");
        expect(comment).toHaveProperty("created_at");
        expect(typeof comment).toBe("object");
      });
  });

  test("400: Responds when field not available", () => {
    const comment = {
      username: "butter_bridge",
      body: null,
    };
    return request(app)
      .post("/api/articles/3/comments")
      .send(comment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Violation of constraint: body cannot be NULL");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: Responds with updated article when positive votes updated", () => {
    const votes = { inc_votes: 999 };

    return request(app)
      .patch("/api/articles/1")
      .send(votes)
      .expect(200)
      .then(({ body }) => {
        expect(body.votes).toBe(1099);
        expect(body).toHaveProperty("article_id");
        expect(body).toHaveProperty("votes");
      });
  });

  test("200: Responds with updated article when negative votes updated", () => {
    const votes = { inc_votes: -110 };

    return request(app)
      .patch("/api/articles/1")
      .send(votes)
      .expect(200)
      .then(({ body }) => {
        expect(body.votes).toBe(-10);
      });
  });

  test("404: Responds when votes are passed an article that does not exist (3000)", () => {
    const votes = { inc_votes: 50 };

    return request(app)
      .patch("/api/articles/3000")
      .send(votes)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Resource not found with value: 3000");
      });
  });

  test("400: Responds when wrong format of votes is passed in (yes)", () => {
    const votes = { inc_votes: "yes" };

    return request(app)
      .patch("/api/articles/1")
      .send(votes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid DB input format");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: Responds with nothing when deleting a comment given a comment_id", () => {
    return request(app).delete("/api/comments/3").expect(204);
  });
  test("400: Responds when wrong format of comment_id is sent (car)", () => {
    return request(app)
      .delete("/api/comments/car")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid DB input format");
      });
  });
  test("404: Responds when comment_id passed to be deleted that does not exist", () => {
    return request(app)
      .delete("/api/comments/99")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Resource not found with value: 99");
      });
  });
});

describe("GET: /api/users", () => {
  test("200: Responds with all users as an array of objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users.length).toBe(4);
        users.forEach((user) => {
          expect(user).toHaveProperty("username");
          expect(user).toHaveProperty("name");
          expect(user).toHaveProperty("avatar_url");
        });
      });
  });
});
