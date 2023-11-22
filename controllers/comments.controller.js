const { checkExists } = require("../db/seeds/utils")
const { removeCommentById, amendCommentById, alterCommentById } = require("../models/comments.model")

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

exports.patchCommentById = (req, res, next) => {
    const {comment_id} = req.params
    const {inc_votes} = req.body
    return checkExists('comments', 'comment_id', comment_id)
    .then(() => {
        return alterCommentById(comment_id, inc_votes)
    })
    .then(({rows}) => {
        res.status(200).send({comment: rows[0]})
    })
    .catch(next)
}