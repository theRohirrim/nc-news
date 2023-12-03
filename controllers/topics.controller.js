const { selectTopics, insertTopic } = require("../models/topics.model")

exports.getTopics = (req, res, next) => {
    return selectTopics()
    .then((topics) => {
        res.status(200).send({topics});
    })
    .catch(next);
}

exports.postTopic = (req, res, next) => {
    return insertTopic(req.body)
    .then(({ rows }) => {
        res.status(201).send({ topic: rows[0] });
    })
    .catch(next)
}