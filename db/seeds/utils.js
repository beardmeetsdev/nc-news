const db = require("../../db/connection");

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
