class BaseHTTPError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

export class MissingRowError extends BaseHTTPError {
  constructor(message) {
    super(message);
    this.name = 'MissingRowError';
  }
}

export class RowFoundException extends BaseHTTPError {
  constructor(message) {
    super(message);
    this.name = 'RowFoundException';
  }
}

export class QueryFailureError extends BaseHTTPError {
  constructor(message) {
    super(message);
    this.name = 'QueryFailureError';
  }
}
