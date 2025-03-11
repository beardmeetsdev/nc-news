const endpoints = require("../endpoints.json");

const getApi = (request, response) => {
  console.log(endpoints);
  response.status(200).send({ endpoints });
};

module.exports = { getApi };
