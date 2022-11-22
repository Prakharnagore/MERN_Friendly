const errorHandlerMiddleware = (err, req, res, next) => {
  console.log(err);
};

module.exports = errorHandlerMiddleware;
