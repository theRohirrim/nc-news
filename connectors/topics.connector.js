const { selectTopics, selectEndpoints } = require("../models/topics.model")

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