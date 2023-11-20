const express = require("express");
const { getTopics, getArticleById } = require("./connectors/topics.connector");

const app = express();

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById)

module.exports = app;