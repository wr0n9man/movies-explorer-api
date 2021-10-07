class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.message ='Переданны некоректные данные'
    this.statusCode = 400;
  }
}

module.exports = ValidationError;
