const db = require("../db/connection");

const selectTopics = () => {
  return db.query(`SELECT description, slug FROM topics`).then(({ rows }) => {
    return rows;
  });
};

const selectArticleById = (id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `Article not found: ${id}`,
        });
      }
      return rows;
    });
};

const selectArticles = () => {
  return db
    .query(
      `SELECT author, title, article_id, topic, created_at, votes, article_img_url FROM articles ORDER BY created_at DESC`
    )
    .then(({ rows }) => {
      const returnArray = rows.map((row) => {
        return db
          .query(`SELECT COUNT(*) FROM comments WHERE article_id = $1`, [
            row.article_id,
          ])
          .then(({ rows }) => {
            row.comment_count = Number(rows[0].count);
            return row;
          });
      });

      return Promise.all(returnArray);
    });
};

const selectArticleComments = (id) => {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`,
      [id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `No comments found for article: ${id}`,
        });
      }
      return rows;
    });
};

module.exports = {
  selectTopics,
  selectArticleById,
  selectArticles,
  selectArticleComments,
};
