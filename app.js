const express = require("express");
const { getTopics, getEndpoints } = require("./connectors/topics.connector");

const app = express();

app.get("/api/topics", getTopics);

app.get("/api", getEndpoints)

module.exports = app;