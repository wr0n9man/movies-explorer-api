class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.message ='Ресурс не найден.'
    this.statusCode = 404;
  }
}

module.exports = NotFoundError;
