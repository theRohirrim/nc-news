const express = require("express");
const { getTopics, getArticleById, getEndpoints, getCommentsByArticleId } = require("./controllers/topics.controller");
const { handlePsqlError, handleCustomError, handleServerError } = require("./errors");

const app = express();

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId)

app.get("/api", getEndpoints);

app.use(handlePsqlError);
app.use(handleCustomError);
app.use(handleServerError);

module.exports = app;