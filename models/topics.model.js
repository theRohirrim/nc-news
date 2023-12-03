const db = require("../db/connection");

exports.selectTopics = () => {
    return db.query(`SELECT * FROM topics;`)
    .then(({rows}) => {
        return rows
    })
}

exports.insertTopic = (topic) => {
    const { slug, description } = topic

    return db.query(`INSERT INTO topics (slug, description)
    VALUES ($1, $2) RETURNING *;`, [slug, description])
}