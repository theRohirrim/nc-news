const db = require("../db/connection");
const fs = require("fs/promises")

exports.selectAllArticles = (query) => {
    const { author, topic, sort_by, order, limit, p } = query;

    if (topic && !["coding", "football", "cooking", "mitch", "cats", "paper"].includes(topic)) {
        return Promise.reject({ status: 400, msg: "Invalid topic query" });
    }

    let queryString = `SELECT article_id, title, articles.author, topic, articles.created_at, articles.votes, article_img_url, COUNT(*) AS comment_count
    FROM articles
    LEFT JOIN comments USING (article_id)`

    let queryJoins = []

    if (topic) queryJoins.push(` topic = '${topic}' `);

    if (author) queryJoins.push(` articles.author = '${author}' `);

    if (topic || author) queryString += ` WHERE ${queryJoins.join('AND')}`;

    queryString += `GROUP BY article_id, title, articles.author, topic, articles.created_at, articles.votes, article_img_url`

    let querySort
    if (sort_by && order) {
        querySort = ` ORDER BY ${sort_by} ${order}`
    } else {
        querySort = ` ORDER BY created_at DESC`
    }

    queryString += querySort

    const limitValue = limit ? limit : 10;
    queryString += ` LIMIT ${limitValue}`

    if (p) {
        const pageStr = ` OFFSET ${limitValue * (p - 1)}`
        queryString += pageStr
    }

    const fullQuery = queryString + ';';

    return db.query(fullQuery).then(({ rows }) => {
        return rows;
  });
}

exports.insertArticle = (article) => {
    let {author, title, body, topic, article_img_url} = article
    let valuesArr = [author, title, body, topic]

    let valuesStr
    if (article_img_url) {
        valuesStr = `(author, title, body, topic, article_img_url) 
        VALUES ($1, $2, $3, $4, $5)`
        valuesArr.push(article_img_url)
    } else {
        valuesStr = `(author, title, body, topic) 
        VALUES ($1, $2, $3, $4)`
    }

    const fullQuery = `INSERT INTO articles ${valuesStr} RETURNING *`
    
    return db.query(fullQuery, valuesArr)
}

exports.selectArticleById = (article_id) => {
    return db.query(`SELECT articles.*, COUNT(*) AS comment_count 
    FROM articles 
    LEFT JOIN comments USING (article_id)
    WHERE article_id = $1
    GROUP BY article_id, title, topic, articles.author, articles.body, articles.created_at, articles.votes, article_img_url;`, [article_id])
    .then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg: "article does not exist"})
        }
        return rows[0]
    })
}

exports.alterArticleById = (article_id, votes) => {
    return db.query(`UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2 RETURNING *;`, [votes, article_id])
}

exports.selectCommentsByArticleId = (article_id, query) => {
    const {limit, p} = query

    let queryString = `SELECT comment_id, comments.votes, comments.created_at, comments.author, comments.body, article_id
    FROM comments 
    JOIN articles USING (article_id)
    WHERE article_id = $1
    ORDER BY comments.created_at DESC`

    const limitValue = limit ? limit : 10;
    queryString += ` LIMIT ${limitValue}`

    if (p) {
        const pageStr = ` OFFSET ${limitValue * (p - 1)}`
        queryString += pageStr
    }

    return db.query(`${queryString};`, [article_id])
    .then(({rows}) => {
        return rows
    })
}

exports.insertCommentByArticleId = (article_id, body, username) => {
    return db.query(`INSERT INTO comments
    (body, article_id, author)
    VALUES ($1, $2, $3)
    RETURNING *;`, [body, article_id, username])
}

exports.removeArticleById = (article_id) => {
    return db.query(`DELETE 
    FROM articles 
    WHERE article_id = $1;`, [article_id])
}
