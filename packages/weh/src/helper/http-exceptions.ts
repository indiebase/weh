import { HTTPException } from 'hono/http-exception';
import { StatusCode } from 'hono/utils/http-status';

interface HTTPExceptionOptions {
  res?: Response;
  message?: string;
  cause?: unknown;
}

export class InternalServerErrorException extends HTTPException {
  constructor(options?: HTTPExceptionOptions, status: StatusCode = 500) {
    super(status, { message: 'Internal Server Error', ...options });
  }
}

export class BadRequestException extends HTTPException {
  constructor(options?: HTTPExceptionOptions, status: StatusCode = 400) {
    super(status, { message: 'Bad Request', ...options });
  }
}

export class RequestTimeoutException extends HTTPException {
  constructor(options?: HTTPExceptionOptions, status: StatusCode = 408) {
    super(status, { message: 'Request Timeout', ...options });
  }
}

export class ServiceUnavailableException extends HTTPException {
  constructor(options?: HTTPExceptionOptions, status: StatusCode = 503) {
    super(status, { message: 'Service Unavailable', ...options });
  }
}

export class GatewayTimeoutException extends HTTPException {
  constructor(options?: HTTPExceptionOptions, status: StatusCode = 504) {
    super(status, { message: 'Gateway Timeout', ...options });
  }
}

export class ConflictException extends HTTPException {
  constructor(options?: HTTPExceptionOptions, status: StatusCode = 409) {
    super(status, { message: 'Conflict', ...options });
  }
}

export class ForbiddenException extends HTTPException {
  constructor(options?: HTTPExceptionOptions, status: StatusCode = 403) {
    super(status, { message: 'Forbidden', ...options });
  }
}

export class BadGatewayException extends HTTPException {
  constructor(options?: HTTPExceptionOptions, status: StatusCode = 502) {
    super(status, { message: 'Bad Gateway', ...options });
  }
}
