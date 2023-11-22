const db = require("../db/connection");

exports.removeCommentById = (comment_id) => {
    return db.query(`DELETE 
    FROM comments 
    WHERE comment_id = $1;`, [comment_id])
}

exports.alterCommentById = (comment_id, votes) => {
    return db.query(`UPDATE comments
    SET votes = votes + $1
    WHERE comment_id = $2 RETURNING *;`, [votes, comment_id])
}