const endpoints = require("../endpoints.json");
const {
  selectTopics,
  selectArticleById,
  selectArticles,
  selectArticleComments,
  insertCommentFromId,
  updateArticleVotes,
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
      response.status(200).send(article);
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

const postArticleComment = (request, response, next) => {
  const { username, body } = request.body;
  const { article_id } = request.params;

  insertCommentFromId(username, body, article_id)
    .then((rows) => {
      response.status(201).send({ comment: rows });
    })
    .catch((err) => {
      next(err);
    });
};

const patchArticleById = (request, response, next) => {
  const { article_id } = request.params;
  const { inc_votes } = request.body;
  updateArticleVotes(article_id, inc_votes)
    .then((rows) => {
      response.status(200).send(rows);
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getApi,
  getTopics,
  getArticleById,
  getArticles,
  getArticleComments,
  postArticleComment,
  patchArticleById,
};
