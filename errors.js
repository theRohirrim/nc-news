exports.handlePsqlError = (err, req, res, next) => {
  console.log('ENTERS PSQL ERROR')
    if (err.code) {
      res.status(400).send({ msg: 'Bad request' });
    } else next(err);
}

exports.handleCustomError = (err, req, res, next) => {
    if (err.status) {
      res.status(err.status).send({ msg: err.msg });
    } else next(err);
}

exports.handleServerError = (err, req, res, next) => {
    console.log(err);
    res.status(500).send({ msg: 'Internal Server Error' });
}