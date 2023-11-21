const express = require("express");
const { getTopics, getEndpoints, getArticles, getArticleById, postCommentByArticleId, getCommentsByArticleId } = require("./controllers/topics.controller");
const { handlePsqlError, handleCustomError, handleServerError } = require("./errors");

const app = express();
app.use(express.json())

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles)

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId)

app.get("/api", getEndpoints);

app.get("/api/articles", getArticles)

app.post("/api/articles/:article_id/comments", postCommentByArticleId)

app.use(handlePsqlError);
app.use(handleCustomError);
app.use(handleServerError);


module.exports = app;