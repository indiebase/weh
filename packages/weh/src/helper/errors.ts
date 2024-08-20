interface InteractiveErrorOptions {
  retryable?: boolean;
  exportable?: boolean;
  reportable?: boolean;
  description?: string;
  message?: string;
  title?: string;
}

export class InteractiveError extends Error {
  retryable?: boolean;
  exportable?: boolean;
  reportable?: boolean;
  description?: string;
  title?: string;
  code?: string;

  constructor(options: InteractiveErrorOptions | string = {}) {
    super();

    if (typeof options === 'string') {
      this.message = options;
    } else {
      this.title = options.title;
      this.description = options.description;
      this.message = options.message as string;
      this.retryable = options.retryable ?? false;
      this.exportable = options.exportable ?? false;
      this.reportable = options.reportable ?? false;
    }
  }
}
