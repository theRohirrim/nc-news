const express = require("express");
const { getTopics, getEndpoints, getArticles } = require("./connectors/topics.connector");

const app = express();

app.get("/api/topics", getTopics);

app.get("/api", getEndpoints)

app.get("/api/articles", getArticles)

module.exports = app;