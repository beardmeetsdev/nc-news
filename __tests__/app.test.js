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
  test("200:, responds with all topic in an array", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description");
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });
      });
  });
});

describe("GET: /api/articles/:id", () => {
  test("200: responds with a single article object from the requested id", () => {
    return request(app)
      .get("/api/articles/4")
      .expect(200)
      .then(({ body }) => {
        expect(body.article[0].article_id).toBe(4);
        expect(body.article[0].author).toBe("rogersop");
        expect(body.article[0].title).toBe("Student SUES Mitch!");
        expect(body.article[0].body).toBe(
          "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages"
        );
        expect(body.article[0].topic).toBe("mitch");
        expect(body.article[0].created_at).toBe("2020-05-06T01:14:00.000Z");
        expect(body.article[0].votes).toBe(0);
        expect(body.article[0].article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
        expect(typeof body.article[0].article_id).toBe("number");
        expect(typeof body.article[0].author).toBe("string");
        expect(typeof body.article[0].title).toBe("string");
        expect(typeof body.article[0].body).toBe("string");
        expect(typeof body.article[0].topic).toBe("string");
        expect(typeof body.article[0].created_at).toBe("string");
        expect(typeof body.article[0].votes).toBe("number");
        expect(typeof body.article[0].article_img_url).toBe("string");
      });
  });
  test("404: trying to get an article which does not exist (article_id too high)", () => {
    return request(app)
      .get("/api/articles/99")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Resource not found with value: 99");
      });
  });
  test("400: responds when given a bad request", () => {
    return request(app)
      .get("/api/articles/seal")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
});

describe("GET: /api/articles", () => {
  test("200:, responds with all articles in an array", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(13);
        articles.forEach((article) => {
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("article_id");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("article_img_url");
          expect(article).toHaveProperty("comment_count");
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
});

describe("GET: /api/articles/:id/comments", () => {
  test("200: responds with an array of comments from the given article ID", () => {
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
  test("404: trying to get an article comment which does not exist (article_id too high)", () => {
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
  test("400: responds when given a bad request", () => {
    return request(app)
      .get("/api/articles/seal/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: Adds a comment for a username and returns the posted comment", () => {
    const comment = {
      username: "butter_bridge",
      body: "driving pug",
    };

    return request(app)
      .post("/api/articles/3/comments")
      .send(comment)
      .expect(201)
      .then(({ body }) => {
        expect(typeof body.comment).toBe("object");
      });
  });
  test("400: Checks all fields are available", () => {
    const comment = {
      username: "butter_bridge",
      body: null,
    };

    return request(app)
      .post("/api/articles/3/comments")
      .send(comment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Missing fields");
      });
  });
});
