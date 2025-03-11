const db = require("../db/connection");

const selectTopics = () => {
  return db.query(`SELECT description, slug FROM topics`).then(({ rows }) => {
    return rows;
  });
};

module.exports = { selectTopics };
