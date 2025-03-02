const db = require("./db/connection");

return db
  .query("SELECT * FROM users;")
  .then((response) => {
    console.log(response.rows);
  })
  .then(() => {
    return db.query("SELECT * FROM articles WHERE topic = 'coding';");
  })
  .then((response) => {
    console.log(response.rows);
  })
  .then(() => {
    return db.query("SELECT * FROM comments WHERE votes < 0;");
  })
  .then((response) => {
    console.log(response.rows);
  })
  .then(() => {
    return db.query("SELECT * FROM topics;");
  })
  .then((response) => {
    console.log(response.rows);
  })
  .then(() => {
    return db.query("SELECT * FROM articles WHERE author = 'grumpy19';");
  })
  .then((response) => {
    console.log(response.rows);
  })
  .then(() => {
    return db.query("SELECT * FROM comments WHERE votes > 10;");
  })
  .then((response) => {
    console.log(response.rows);
  })
  .finally(() => {
    db.end();
  });
