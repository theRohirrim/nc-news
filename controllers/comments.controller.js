const { checkExists } = require("../db/seeds/utils")
const { removeCommentById } = require("../models/comments.model")

exports.deleteCommentById = (req, res, next) => {
    const {comment_id} = req.params
    return checkExists('comments', 'comment_id', comment_id)
    .then(() => {
        return removeCommentById(comment_id)
    })
    .then(() => {
        res.sendStatus(204)
    })
    .catch(next)
}