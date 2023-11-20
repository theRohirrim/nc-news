const { selectTopics, selectEndpoints, selectAllArticles } = require("../models/topics.model")

exports.getTopics = (req, res, next) => {
    return selectTopics()
    .then((topics) => {
        res.status(200).send({topics});
    })
    .catch(next);
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