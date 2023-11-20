const { selectTopics } = require("../models/topics.model")

exports.getTopics = (req, res, next) => {
    console.log("HERE IN CONTROLLER")
    return selectTopics()
    .then((topics) => {
        res.status(200).send(topics);
    })
}