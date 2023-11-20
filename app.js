const express = require("express");
const { getTopics, getArticleById } = require("./connectors/topics.connector");
const { handlePsqlError, handleCustomError, handleServerError } = require("./errors");

const app = express();

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById)

app.use(handlePsqlError);
app.use(handleCustomError);
app.use(handleServerError);

module.exports = app;