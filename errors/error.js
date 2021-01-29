function sendError(res, err) {
  let errorCode = 500;
  if (err.name === "ValidationError") {
    errorCode = 400;
  }
  res.status(errorCode).send({ message: err.message });
}

module.exports = { sendError };
