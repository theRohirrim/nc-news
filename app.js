const express = require("express");
const { getTopics, getEndpoints, getArticles } = require("./controllers/topics.controller");

const app = express();

app.get("/api/topics", getTopics);

app.get("/api", getEndpoints)

app.get("/api/articles", getArticles)

module.exports = app;