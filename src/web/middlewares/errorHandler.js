const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .send(`Sorry, it looks like there's something wrong with the server.`);
};

module.exports = errorHandler;
