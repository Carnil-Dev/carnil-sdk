import { describe, it, expect } from 'vitest';
import {
  CarnilError,
  CarnilAuthenticationError,
  CarnilValidationError,
  CarnilPermissionError,
  CarnilRateLimitError,
  CarnilProviderError,
} from '../errors';

describe('Carnil Errors', () => {
  describe('CarnilError', () => {
    it('should create a basic error', () => {
      const error = new CarnilError('Test error', 'test_code', 'test_type');

      expect(error.message).toBe('Test error');
      expect(error.type).toBe('test_type');
      expect(error.code).toBe('test_code');
      expect(error.name).toBe('CarnilError');
    });

    it('should create an error with all properties', () => {
      const error = new CarnilError('Test error', 'test_code', 'test_type', 400, 'stripe');

      expect(error.message).toBe('Test error');
      expect(error.type).toBe('test_type');
      expect(error.code).toBe('test_code');
      expect(error.statusCode).toBe(400);
      expect(error.provider).toBe('stripe');
    });
  });

  describe('CarnilAuthenticationError', () => {
    it('should create an authentication error', () => {
      const error = new CarnilAuthenticationError('Invalid API key');

      expect(error.message).toBe('Invalid API key');
      expect(error.type).toBe('AUTHENTICATION_ERROR');
      expect(error.name).toBe('CarnilAuthenticationError');
    });
  });

  describe('CarnilValidationError', () => {
    it('should create a validation error', () => {
      const error = new CarnilValidationError('Invalid parameter', 'invalid_param');

      expect(error.message).toBe("Validation error in field 'invalid_param': Invalid parameter");
      expect(error.type).toBe('VALIDATION_ERROR');
      expect(error.name).toBe('CarnilValidationError');
    });
  });

  describe('CarnilPermissionError', () => {
    it('should create a permission error', () => {
      const error = new CarnilPermissionError('Insufficient permissions');

      expect(error.message).toBe('Insufficient permissions');
      expect(error.type).toBe('PERMISSION_ERROR');
      expect(error.name).toBe('CarnilPermissionError');
    });
  });

  describe('CarnilProviderError', () => {
    it('should create a provider error', () => {
      const error = new CarnilProviderError('Provider unavailable', 'stripe');

      expect(error.message).toBe('Provider unavailable');
      expect(error.type).toBe('PROVIDER_ERROR');
      expect(error.provider).toBe('stripe');
      expect(error.name).toBe('CarnilProviderError');
    });
  });
});
