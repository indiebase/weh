import { HTTPException } from 'hono/http-exception';
import { StatusCode } from 'hono/utils/http-status';

type HTTPExceptionOptions = {
  res?: Response;
  message?: string;
  cause?: unknown;
};

export class InternalServerErrorException extends HTTPException {
  constructor(status: StatusCode = 500, options?: HTTPExceptionOptions) {
    super(status, { message: 'Internal Server Error', ...options });
  }
}

export class BadRequestException extends HTTPException {
  constructor(status: StatusCode = 400, options?: HTTPExceptionOptions) {
    super(status, { message: 'Bad Request', ...options });
  }
}

export class RequestTimeoutException extends HTTPException {
  constructor(status: StatusCode = 408, options?: HTTPExceptionOptions) {
    super(status, { message: 'Request Timeout', ...options });
  }
}

export class ServiceUnavailableException extends HTTPException {
  constructor(status: StatusCode = 503, options?: HTTPExceptionOptions) {
    super(status, { message: 'Service Unavailable', ...options });
  }
}

export class GatewayTimeoutException extends HTTPException {
  constructor(status: StatusCode = 504, options?: HTTPExceptionOptions) {
    super(status, { message: 'Gateway Timeout', ...options });
  }
}

export class ConflictException extends HTTPException {
  constructor(status: StatusCode = 409, options?: HTTPExceptionOptions) {
    super(status, { message: 'Conflict', ...options });
  }
}

export class ForbiddenException extends HTTPException {
  constructor(status: StatusCode = 403, options?: HTTPExceptionOptions) {
    super(status, { message: 'Forbidden', ...options });
  }
}

export class BadGatewayException extends HTTPException {
  constructor(status: StatusCode = 502, options?: HTTPExceptionOptions) {
    super(status, { message: 'Bad Gateway', ...options });
  }
}
