const format = require("pg-format");
const db = require("../connection");

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

exports.getArticleId = function (articles, commentTitle) {
  for (let i = 0; i < articles.length; i++) {
    if (articles[i].title === commentTitle) {
      return articles[i].article_id;
    }
  }
  return null;
};

exports.checkExists = async (table, column, value) => {
  const queryStr = format("SELECT * FROM %I WHERE %I = $1;", table, column);
  const dbOutput = await db.query(queryStr, [value]);
  if (dbOutput.rows.length === 0) {
    return Promise.reject({
      status: 404,
      msg: `Resource not found with value: ${value}`,
    });
  }
};
