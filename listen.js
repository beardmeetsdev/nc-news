const app = require("./app");

app.listen(9001, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Listening to 9001 <<<");
  }
});
