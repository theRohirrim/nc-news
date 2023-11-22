const express = require("express");
const { getTopics } = require("./controllers/topics.controller");
const { handlePsqlError, handleCustomError, handleServerError } = require("./errors");
const { getArticles, getArticleById, getCommentsByArticleId, postCommentByArticleId, patchArticleById } = require("./controllers/articles.controller");
const { getAllUsers } = require("./controllers/users.controller");
const { deleteCommentById } = require("./controllers/comments.controller");
const { getEndpoints } = require("./controllers/api.controller");

const app = express();
app.use(express.json())

const apiRouter = require('./routes/api-router');

app.use('/api', apiRouter);

app.use(handlePsqlError);
app.use(handleCustomError);
app.use(handleServerError);

module.exports = app;