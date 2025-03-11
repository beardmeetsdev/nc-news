const endpoints = require("../endpoints.json");
const {
  selectTopics,
  selectArticleById,
  selectArticles,
  selectArticleComments,
} = require("../models/news_models");

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
      next(err);
    });
};

const getArticleComments = (request, response, next) => {
  const { article_id } = request.params;
  selectArticleComments(article_id)
    .then((article) => {
      response.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

const getArticles = (request, response) => {
  selectArticles().then((articles) => {
    response.status(200).send({ articles });
  });
};

module.exports = {
  getApi,
  getTopics,
  getArticleById,
  getArticles,
  getArticleComments,
};
