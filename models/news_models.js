const db = require("../db/connection");
const { checkExists } = require("../db/seeds/utils");

const selectTopics = () => {
  return db.query(`SELECT description, slug FROM topics`).then(({ rows }) => {
    return rows;
  });
};

const selectArticleById = (id) => {
  return checkExists("articles", "article_id", id)
    .then(() => {
      return db.query(`SELECT * FROM articles WHERE article_id = $1`, [id]);
    })
    .then(({ rows }) => {
      return rows[0];
    });
};

const selectArticles = () => {
  return db
    .query(
      `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, 
        CAST(COUNT(comments.comment_id) AS INT) AS comment_count 
        FROM articles  
        LEFT JOIN comments ON articles.article_id = comments.article_id
        GROUP BY articles.article_id
        ORDER BY articles.created_at DESC`
    )
    .then(({ rows }) => {
      return rows;
    });
};

const selectArticleComments = (id) => {
  return checkExists("articles", "article_id", id)
    .then(() => {
      return db.query(
        `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`,
        [id]
      );
    })
    .then(({ rows }) => {
      return rows;
    });
};

const insertCommentFromId = (username, body, id) => {
  return db
    .query(
      `INSERT INTO comments (article_id, body, author)
        VALUES ($1, $2, $3)
        RETURNING *`,
      [id, body, username]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

const updateArticleVotes = (article_id, inc_votes) => {
  return checkExists("articles", "article_id", article_id).then(() => {
    return db
      .query(`SELECT votes FROM articles WHERE article_id = $1`, [article_id])
      .then(({ rows }) => {
        const newVotes = rows[0].votes + inc_votes;
        return db
          .query(
            `UPDATE articles SET votes = $1 WHERE article_id = $2 RETURNING *`,
            [newVotes, article_id]
          )
          .then(({ rows }) => {
            return rows[0];
          });
      });
  });
};

const deleteCommentById = (comment_id) => {
  return checkExists("comments", "comment_id", comment_id).then(() => {
    return db
      .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *`, [
        comment_id,
      ])
      .then(() => {});
  });
};

module.exports = {
  selectTopics,
  selectArticleById,
  selectArticles,
  selectArticleComments,
  insertCommentFromId,
  updateArticleVotes,
  deleteCommentById,
};
