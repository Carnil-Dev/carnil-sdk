/**
 * Carnil SDK Error Classes
 * Provides structured error handling across all providers
 */

export class CarnilError extends Error {
  public readonly code: string;
  public readonly type: string;
  public readonly statusCode?: number;
  public readonly provider?: string;
  public readonly providerError?: any;

  constructor(
    message: string,
    code: string = 'UNKNOWN_ERROR',
    type: string = 'CARNIL_ERROR',
    statusCode?: number,
    provider?: string,
    providerError?: any
  ) {
    super(message);
    this.name = 'CarnilError';
    this.code = code;
    this.type = type;
    this.statusCode = statusCode;
    this.provider = provider;
    this.providerError = providerError;

    // Maintains proper stack trace for where our error was thrown
    if ((Error as any).captureStackTrace) {
      (Error as any).captureStackTrace(this, CarnilError);
    }
  }
}

export class CarnilValidationError extends CarnilError {
  constructor(message: string, field?: string) {
    super(
      field ? `Validation error in field '${field}': ${message}` : message,
      'VALIDATION_ERROR',
      'VALIDATION_ERROR',
      400
    );
    this.name = 'CarnilValidationError';
  }
}

export class CarnilAuthenticationError extends CarnilError {
  constructor(message: string = 'Authentication failed', provider?: string) {
    super(message, 'AUTHENTICATION_ERROR', 'AUTHENTICATION_ERROR', 401, provider);
    this.name = 'CarnilAuthenticationError';
  }
}

export class CarnilPermissionError extends CarnilError {
  constructor(message: string = 'Insufficient permissions', provider?: string) {
    super(message, 'PERMISSION_ERROR', 'PERMISSION_ERROR', 403, provider);
    this.name = 'CarnilPermissionError';
  }
}

export class CarnilNotFoundError extends CarnilError {
  constructor(resource: string, id?: string, provider?: string) {
    const message = id ? `${resource} with id '${id}' not found` : `${resource} not found`;
    super(message, 'NOT_FOUND_ERROR', 'NOT_FOUND_ERROR', 404, provider);
    this.name = 'CarnilNotFoundError';
  }
}

export class CarnilRateLimitError extends CarnilError {
  public readonly retryAfter?: number;

  constructor(message: string = 'Rate limit exceeded', retryAfter?: number, provider?: string) {
    super(message, 'RATE_LIMIT_ERROR', 'RATE_LIMIT_ERROR', 429, provider);
    this.name = 'CarnilRateLimitError';
    this.retryAfter = retryAfter;
  }
}

export class CarnilServerError extends CarnilError {
  constructor(message: string = 'Internal server error', provider?: string) {
    super(message, 'SERVER_ERROR', 'SERVER_ERROR', 500, provider);
    this.name = 'CarnilServerError';
  }
}

export class CarnilNetworkError extends CarnilError {
  constructor(message: string = 'Network error', provider?: string) {
    super(message, 'NETWORK_ERROR', 'NETWORK_ERROR', undefined, provider);
    this.name = 'CarnilNetworkError';
  }
}

export class CarnilTimeoutError extends CarnilError {
  constructor(message: string = 'Request timeout', provider?: string) {
    super(message, 'TIMEOUT_ERROR', 'TIMEOUT_ERROR', undefined, provider);
    this.name = 'CarnilTimeoutError';
  }
}

export class CarnilWebhookError extends CarnilError {
  constructor(message: string = 'Webhook verification failed', provider?: string) {
    super(message, 'WEBHOOK_ERROR', 'WEBHOOK_ERROR', 400, provider);
    this.name = 'CarnilWebhookError';
  }
}

export class CarnilProviderError extends CarnilError {
  constructor(
    message: string,
    provider: string,
    providerError?: any,
    statusCode?: number
  ) {
    super(
      message,
      'PROVIDER_ERROR',
      'PROVIDER_ERROR',
      statusCode,
      provider,
      providerError
    );
    this.name = 'CarnilProviderError';
  }
}

// ============================================================================
// Error Factory Functions
// ============================================================================

export function createProviderError(
  provider: string,
  error: any,
  message?: string
): CarnilProviderError {
  const errorMessage = message || error.message || 'Provider error occurred';
  return new CarnilProviderError(errorMessage, provider, error, error.statusCode);
}

export function createValidationError(message: string, field?: string): CarnilValidationError {
  return new CarnilValidationError(message, field);
}

export function createNotFoundError(resource: string, id?: string, provider?: string): CarnilNotFoundError {
  return new CarnilNotFoundError(resource, id, provider);
}

export function createRateLimitError(retryAfter?: number, provider?: string): CarnilRateLimitError {
  return new CarnilRateLimitError('Rate limit exceeded', retryAfter, provider);
}

// ============================================================================
// Error Type Guards
// ============================================================================

export function isCarnilError(error: any): error is CarnilError {
  return error instanceof CarnilError;
}

export function isCarnilValidationError(error: any): error is CarnilValidationError {
  return error instanceof CarnilValidationError;
}

export function isCarnilAuthenticationError(error: any): error is CarnilAuthenticationError {
  return error instanceof CarnilAuthenticationError;
}

export function isCarnilPermissionError(error: any): error is CarnilPermissionError {
  return error instanceof CarnilPermissionError;
}

export function isCarnilNotFoundError(error: any): error is CarnilNotFoundError {
  return error instanceof CarnilNotFoundError;
}

export function isCarnilRateLimitError(error: any): error is CarnilRateLimitError {
  return error instanceof CarnilRateLimitError;
}

export function isCarnilServerError(error: any): error is CarnilServerError {
  return error instanceof CarnilServerError;
}

export function isCarnilNetworkError(error: any): error is CarnilNetworkError {
  return error instanceof CarnilNetworkError;
}

export function isCarnilTimeoutError(error: any): error is CarnilTimeoutError {
  return error instanceof CarnilTimeoutError;
}

export function isCarnilWebhookError(error: any): error is CarnilWebhookError {
  return error instanceof CarnilWebhookError;
}

export function isCarnilProviderError(error: any): error is CarnilProviderError {
  return error instanceof CarnilProviderError;
}

// ============================================================================
// Error Handler
// ============================================================================

export function handleError(error: any, provider?: string): CarnilError {
  if (isCarnilError(error)) {
    return error;
  }

  // Handle common HTTP status codes
  if (error.status || error.statusCode) {
    const status = error.status || error.statusCode;
    
    switch (status) {
      case 400:
        return new CarnilValidationError(error.message || 'Bad request', provider);
      case 401:
        return new CarnilAuthenticationError(error.message || 'Authentication failed', provider);
      case 403:
        return new CarnilPermissionError(error.message || 'Insufficient permissions', provider);
      case 404:
        return new CarnilNotFoundError('Resource', undefined, provider);
      case 429:
        return new CarnilRateLimitError(error.message || 'Rate limit exceeded', error.retryAfter, provider);
      case 500:
      case 502:
      case 503:
      case 504:
        return new CarnilServerError(error.message || 'Server error', provider);
      default:
        return createProviderError(provider || 'unknown', error);
    }
  }

  // Handle network errors
  if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
    return new CarnilNetworkError(error.message || 'Network error', provider);
  }

  // Handle timeout errors
  if (error.code === 'ETIMEDOUT' || error.name === 'TimeoutError') {
    return new CarnilTimeoutError(error.message || 'Request timeout', provider);
  }

  // Default to provider error
  return createProviderError(provider || 'unknown', error);
}
