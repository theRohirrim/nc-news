const express = require("express");
const { handlePsqlError, handleCustomError, handleServerError } = require("./errors");
const cors = require('cors');

const app = express();
app.use(cors())
app.use(express.json())

const apiRouter = require('./routes/api-router');

app.use('/api', apiRouter);

app.use(handlePsqlError);
app.use(handleCustomError);
app.use(handleServerError);

module.exports = app;