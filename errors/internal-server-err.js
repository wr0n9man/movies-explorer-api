class InternalServerError extends Error {
  constructor(message) {
    super(message);
    this.message='Произошла ошибка';
    this.statusCode = 500;
  }
}

module.exports = InternalServerError;
