import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Carnil } from '../carnil';
import { CarnilError } from '../errors';

// Mock provider for testing
class MockProvider {
  public name = 'mock';

  async init(config: Record<string, any>): Promise<void> {
    // Mock initialization
  }

  async healthCheck(): Promise<boolean> {
    return true;
  }

  async createCustomer(params: any): Promise<any> {
    return {
      id: 'cus_mock_123',
      email: params.email,
      name: params.name,
      created: new Date().toISOString(),
    };
  }

  async retrieveCustomer(params: any): Promise<any> {
    return {
      id: params.id,
      email: 'test@example.com',
      name: 'Test Customer',
      created: new Date().toISOString(),
    };
  }

  async updateCustomer(id: string, params: any): Promise<any> {
    return {
      id,
      ...params,
      updated: new Date().toISOString(),
    };
  }

  async deleteCustomer(id: string): Promise<void> {
    // Mock deletion
  }

  async listCustomers(params?: any): Promise<any[]> {
    return [];
  }

  // Add other required methods as mocks
  async createPaymentMethod(params: any): Promise<any> {
    return {};
  }
  async retrievePaymentMethod(params: any): Promise<any> {
    return {};
  }
  async updatePaymentMethod(id: string, params: any): Promise<any> {
    return {};
  }
  async deletePaymentMethod(id: string): Promise<void> {}
  async listPaymentMethods(params?: any): Promise<any[]> {
    return [];
  }
  async createProduct(params: any): Promise<any> {
    return {};
  }
  async retrieveProduct(params: any): Promise<any> {
    return {};
  }
  async updateProduct(id: string, params: any): Promise<any> {
    return {};
  }
  async listProducts(params?: any): Promise<any[]> {
    return [];
  }
  async createPrice(params: any): Promise<any> {
    return {};
  }
  async retrievePrice(params: any): Promise<any> {
    return {};
  }
  async updatePrice(id: string, params: any): Promise<any> {
    return {};
  }
  async listPrices(params?: any): Promise<any[]> {
    return [];
  }
  async createSubscription(params: any): Promise<any> {
    return {};
  }
  async retrieveSubscription(params: any): Promise<any> {
    return {};
  }
  async updateSubscription(id: string, params: any): Promise<any> {
    return {};
  }
  async cancelSubscription(id: string): Promise<any> {
    return {};
  }
  async listSubscriptions(params?: any): Promise<any[]> {
    return [];
  }
  async retrieveInvoice(params: any): Promise<any> {
    return {};
  }
  async listInvoices(params?: any): Promise<any[]> {
    return [];
  }
  async createRefund(params: any): Promise<any> {
    return {};
  }
  async retrieveRefund(params: any): Promise<any> {
    return {};
  }
  async listRefunds(params?: any): Promise<any[]> {
    return [];
  }
  async retrieveDispute(params: any): Promise<any> {
    return {};
  }
  async listDisputes(params?: any): Promise<any[]> {
    return [];
  }
  async createPaymentIntent(params: any): Promise<any> {
    return {};
  }
  async retrievePaymentIntent(params: any): Promise<any> {
    return {};
  }
  async updatePaymentIntent(id: string, params: any): Promise<any> {
    return {};
  }
  async listPaymentIntents(params?: any): Promise<any[]> {
    return [];
  }
}

describe('Carnil', () => {
  let carnil: Carnil;

  beforeEach(() => {
    // Register mock provider
    Carnil.registerProvider('mock', MockProvider);
    carnil = new Carnil({
      provider: {
        provider: 'mock',
        apiKey: 'test-key',
      },
    });
  });

  describe('Provider Registration', () => {
    it('should register a provider', () => {
      expect(() => {
        Carnil.registerProvider('test-provider', MockProvider);
      }).not.toThrow();
    });

    it('should throw error for unknown provider', () => {
      expect(() => {
        new Carnil({
          provider: {
            provider: 'unknown-provider',
            apiKey: 'test-key',
          },
        });
      }).toThrow(CarnilError);
    });
  });

  describe('Customer Management', () => {
    it('should create a customer', async () => {
      const response = await carnil.createCustomer({
        email: 'test@example.com',
        name: 'Test Customer',
      });

      expect(response.success).toBe(true);
      expect(response.data).toHaveProperty('id');
      expect(response.data).toHaveProperty('email', 'test@example.com');
      expect(response.data).toHaveProperty('name', 'Test Customer');
    });

    it('should retrieve a customer', async () => {
      const response = await carnil.getCustomer('cus_123');

      expect(response.success).toBe(true);
      expect(response.data).toHaveProperty('id', 'cus_123');
      expect(response.data).toHaveProperty('email');
      expect(response.data).toHaveProperty('name');
    });

    it('should update a customer', async () => {
      const response = await carnil.updateCustomer('cus_123', {
        name: 'Updated Name',
      });

      expect(response.success).toBe(true);
      expect(response.data).toHaveProperty('id', 'cus_123');
      expect(response.data).toHaveProperty('name', 'Updated Name');
    });

    it('should delete a customer', async () => {
      const response = await carnil.deleteCustomer('cus_123');
      expect(response.success).toBe(true);
    });

    it('should list customers', async () => {
      const response = await carnil.listCustomers();
      expect(response.success).toBe(true);
      expect(Array.isArray(response.data.data)).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle provider errors', async () => {
      // Mock a provider that throws an error
      class ErrorProvider extends MockProvider {
        async createCustomer(params: any): Promise<any> {
          throw new Error('Provider error');
        }
      }

      Carnil.registerProvider('error-provider', ErrorProvider);
      const errorCarnil = new Carnil({
        provider: {
          provider: 'error-provider',
          apiKey: 'test-key',
        },
      });

      const response = await errorCarnil.createCustomer({
        email: 'test@example.com',
        name: 'Test Customer',
      });

      expect(response.success).toBe(false);
      expect(response.error).toBe('Provider error');
    });
  });
});
