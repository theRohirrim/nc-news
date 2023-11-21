const { checkExists } = require("../db/seeds/utils");
const { selectTopics, selectArticleById, selectEndpoints, selectCommentsByArticleId } = require("../models/topics.model")

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