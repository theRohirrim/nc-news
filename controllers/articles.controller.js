const { checkExists } = require("../db/seeds/utils");
const { selectAllArticles, selectArticleById, insertCommentByArticleId, selectCommentsByArticleId, alterArticleById } = require("../models/articles.model")

exports.getArticleById = (req, res, next) => {
    const {article_id} = req.params;
    return selectArticleById(article_id)
    .then((article) => {
        res.status(200).send({article: article})
    })
    .catch(next)
}

exports.getCommentsByArticleId = (req, res, next) => {
    const {article_id} = req.params;
    return checkExists('articles', 'article_id', article_id)
    .then(() => {
        return selectCommentsByArticleId(article_id) 
    })
    .then((comments) => {
        res.status(200).send({comments})
    })
    .catch(next)
}

exports.getArticles = (req, res, next) => {
    const query = req.query;
    return selectAllArticles(query)
    .then((articles) => {
        res.status(200).send({articles})
    })
    .catch(next);
}

exports.postCommentByArticleId = (req, res, next) => {
    const {article_id} = req.params;
    const {body, username} = req.body
    return checkExists('articles', 'article_id', article_id)
    .then(() => {
        return insertCommentByArticleId(article_id, body, username)
    })
    .then(({ rows }) => {
        res.status(201).send({ comment: rows[0] });
    })
    .catch(next)
}

exports.patchArticleById = (req, res, next) => {
    const {article_id} = req.params;
    const {inc_votes} = req.body
    return checkExists('articles', 'article_id', article_id)
    .then(() => {
        return alterArticleById(article_id, inc_votes)
    })
    .then(({rows}) => {
        res.status(200).send({article: rows[0]})
    })
    .catch(next)
}