const endpoints = require("../endpoints.json");
const { selectTopics, selectArticleById } = require("../models/news_models");

const getApi = (request, response) => {
  response.status(200).send({ endpoints });
};

const getTopics = (request, response) => {
  selectTopics().then((topics) => {
    response.status(200).send({ topics });
  });
};

const getArticleById = (request, response, next) => {
  const { article_id } = request.params;
  selectArticleById(article_id)
    .then((article) => {
      response.status(200).send({ article });
    })
    .catch((err) => {
      //console.log(err);
      next(err);
    });
};

module.exports = { getApi, getTopics, getArticleById };
