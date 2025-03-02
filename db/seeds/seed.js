const db = require("../connection");
const format = require("pg-format");
const utils = require("./utils.js");

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db
    .query("DROP TABLE IF EXISTS comments")
    .then(() => {
      return db.query("DROP TABLE IF EXISTS articles;");
    })
    .then(() => {
      return db.query("DROP TABLE IF EXISTS users;");
    })
    .then(() => {
      return db.query("DROP TABLE IF EXISTS topics;");
    })
    .then(() => {
      return db.query(`
        CREATE TABLE topics (
        slug VARCHAR(30) PRIMARY KEY,
        description VARCHAR(60) NOT NULL,
        img_url VARCHAR(1000)
        );`);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE users (
        username VARCHAR(80) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        avatar_url VARCHAR(1000)
        );`);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE articles (
        article_id SERIAL PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        topic VARCHAR(30) REFERENCES topics(slug) ON DELETE CASCADE,
        author VARCHAR(80) REFERENCES users(username) ON DELETE CASCADE,
        body TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        votes INT DEFAULT 0,
        article_img_url VARCHAR(1000)
        );`);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE comments (
        comment_id SERIAL PRIMARY KEY,
        article_id INT REFERENCES articles(article_id) ON DELETE CASCADE,
        body TEXT NOT NULL,
        votes INT DEFAULT 0,
        author VARCHAR(80) REFERENCES users(username) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT NOW()
        );`);
    })
    .then(() => {
      const formattedTopics = topicData.map((topic) => {
        return [topic.slug, topic.description, topic.img_url];
      });

      const sqlString = format(
        `INSERT INTO topics (slug, description, img_url) VALUES %L`,
        formattedTopics
      );

      return db.query(sqlString);
    })
    .then(() => {
      //seed users
      const formattedUsers = userData.map((users) => {
        return [users.username, users.name, users.avatar_url];
      });
      const sqlString = format(
        `INSERT INTO users (username, name, avatar_url) VALUES %L`,
        formattedUsers
      );
      return db.query(sqlString);
    })
    .then(() => {
      //seed articles
      const formattedArticles = articleData.map((articles) => {
        const createdJS = utils.convertTimestampToDate(articles);

        return [
          articles.title,
          articles.topic,
          articles.author,
          articles.body,
          createdJS.created_at,
          articles.votes,
          articles.article_image_url,
        ];
      });

      const sqlString = format(
        `INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url) VALUES %L RETURNING *`,
        formattedArticles
      );
      return db.query(sqlString);
    })
    .then((passedArticles) => {
      //seed comments
      const formattedComments = commentData.map((comment) => {
        const createdJS = utils.convertTimestampToDate(comment);
        let articleId = utils.getArticleId(
          passedArticles.rows,
          comment.article_title
        );

        return [
          articleId,
          comment.body,
          comment.votes,
          comment.author,
          createdJS.created_at,
        ];
      });
      const sqlString = format(
        `INSERT INTO comments (article_id, body, votes, author, created_at) VALUES %L`,
        formattedComments
      );
      return db.query(sqlString);
    });
};
module.exports = seed;
