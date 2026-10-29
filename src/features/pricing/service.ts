import { PricingPlan, CreditTransaction } from './types';
import { mockPricingPlans, mockCreditTransactions } from './mock-data';

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

export const pricingService = {
  async getPlans() {
    await delay();
    return mockPricingPlans;
  },
  async getCreditTransactions() {
    await delay();
    return mockCreditTransactions;
  },
  async updatePlan(id: string, payload: Partial<PricingPlan>) {
    await delay();
    const idx = mockPricingPlans.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    mockPricingPlans[idx] = { ...mockPricingPlans[idx], ...payload };
    return mockPricingPlans[idx];
  },
  async createPlan(payload: Omit<PricingPlan, 'id'>) {
    await delay();
    const plan: PricingPlan = {
      ...payload,
      id: crypto.randomUUID(),
    };
    mockPricingPlans.push(plan);
    return plan;
  },
  async removePlan(id: string) {
    await delay();
    const idx = mockPricingPlans.findIndex((p) => p.id === id);
    if (idx !== -1) mockPricingPlans.splice(idx, 1);
    return true;
  },
};
