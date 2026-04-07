/** Usado pelos services; o error-handler lê statusCode, message e code opcional. */
class HttpError extends Error {
  constructor(statusCode, message, code) {
    super(message);
    this.name = 'HttpError';
    this.statusCode = statusCode;
    if (code !== undefined) {
      this.code = code;
    }
    Error.captureStackTrace?.(this, this.constructor);
  }
}

module.exports = { HttpError };
