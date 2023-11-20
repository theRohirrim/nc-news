const express = require("express");
const { getTopics } = require("./connectors/topics.connector");

const app = express();
app.use(express.json())

app.get("/api/topics", getTopics);

module.exports = app;