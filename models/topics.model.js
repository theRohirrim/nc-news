const db = require("../db/connection");
const fs = require("fs/promises")

exports.selectTopics = () => {
    return db.query(`SELECT * FROM topics;`)
    .then(({rows}) => {
        return rows
    })
}

exports.selectArticleById = (article_id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg: "article does not exist"})
          }
        return rows[0]
    })
}

exports.selectEndpoints = () => {
    return fs.readFile(`${__dirname}/../endpoints.json`)
    .then((res) => {
        return JSON.parse(res)
    })
}

exports.selectCommentsByArticleId = (article_id) => {
    return db.query(`SELECT comment_id, comments.votes, comments.created_at, comments.author, comments.body, article_id
                     FROM comments 
                     JOIN articles USING (article_id)
                     WHERE article_id = $1
                     ORDER BY comments.created_at DESC;`, [article_id])
    .then(({rows}) => {
        return rows
    })
}

exports.selectAllArticles = () => {
    return db.query(`SELECT article_id, title, articles.author, topic, articles.created_at, articles.votes, article_img_url, COUNT(*) AS comment_count
                     FROM articles
                     LEFT JOIN comments USING (article_id)
                     GROUP BY article_id, title, articles.author, topic, articles.created_at, articles.votes, article_img_url
                     ORDER BY created_at DESC;`)
    .then(({rows}) => {
        return rows
    })
}