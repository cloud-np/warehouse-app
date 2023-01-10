class BaseHTTPError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

class MissingRowError extends BaseHTTPError {
  constructor(message) {
    super(message);
    this.name = 'MissingRowError';
  }
}

class RowFoundException extends BaseHTTPError {
  constructor(message) {
    super(message);
    this.name = 'RowFoundException';
  }
}

class QueryFailureError extends BaseHTTPError {
  constructor(message) {
    super(message);
    this.name = 'QueryFailureError';
  }
}


module.exports = {
  MissingRowError,
  RowFoundException,
  QueryFailureError,
}
