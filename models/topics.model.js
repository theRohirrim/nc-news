const db = require("../db/connection");
const fs = require("fs/promises")

exports.selectTopics = () => {
    return db.query(`SELECT * FROM topics;`)
    .then(({rows}) => {
        return rows
    })
}

exports.selectEndpoints = () => {
    return fs.readFile(`${__dirname}/../endpoints.json`)
    .then((res) => {
        return JSON.parse(res)
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