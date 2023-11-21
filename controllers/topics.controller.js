const { selectTopics, selectEndpoints, selectAllArticles, selectArticleById, insertCommentByArticleId } = require("../models/topics.model")

exports.getTopics = (req, res, next) => {
    return selectTopics()
    .then((topics) => {
        res.status(200).send({topics});
    })
    .catch(next);
}

exports.getArticleById = (req, res, next) => {
    const {article_id} = req.params;
    return selectArticleById(article_id)
    .then((article) => {
        res.status(200).send({article: article})
    })
    .catch(next)
}

exports.getEndpoints = (req, res, next) => {
    return selectEndpoints()
    .then((endpoints) => {
        res.status(200).send({endpoints})
    })
    .catch(next);
}

exports.getArticles = (req, res, next) => {
    return selectAllArticles()
    .then((articles) => {
        res.status(200).send({articles})
    })
    .catch(next);
}

exports.postCommentByArticleId = (req, res, next) => {
    const {article_id} = req.params;
    const {body, username} = req.body
    return insertCommentByArticleId(article_id, body, username)
    .then(({ rows }) => {
        res.status(201).send({ comment: rows[0] });
      })
      .catch(next);
}