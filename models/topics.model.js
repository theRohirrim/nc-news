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