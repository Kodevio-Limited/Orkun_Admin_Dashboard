import { PricingPlan, CreditTransaction } from './types';

export const mockPricingPlans: PricingPlan[] = [
  { id: 'starter', name: 'Starter', price: 29, credits: 500, features: ['Basic analytics', 'Email support'], popular: false },
  { id: 'professional', name: 'Professional', price: 99, credits: 2500, features: ['Advanced analytics', 'Unlimited campaigns', 'Ad campaign management', 'Email support'], popular: true },
  { id: 'enterprise', name: 'Enterprise', price: 299, credits: 10000, features: ['All features', 'Dedicated support', 'API access', 'SLA guarantee', 'Custom integration', 'Custom reports'], popular: false },
];

export const mockCreditTransactions: CreditTransaction[] = [
  { id: 'ct1', userId: '1', userName: 'Alice Johnson', credits: 2500, type: 'purchase', description: 'Professional plan purchase', createdAt: '2026-07-01T10:00:00', balance: 3200 },
  { id: 'ct2', userId: '2', userName: 'Bob Smith', credits: -150, type: 'usage', description: 'Campaign impressions usage', createdAt: '2026-06-30T14:00:00', balance: 850 },
  { id: 'ct3', userId: '3', userName: 'Carol White', credits: 500, type: 'bonus', description: 'Referral bonus', createdAt: '2026-06-25T09:00:00', balance: 1500 },
  { id: 'ct4', userId: '1', userName: 'Alice Johnson', credits: -200, type: 'usage', description: 'Video campaign cost', createdAt: '2026-06-20T11:00:00', balance: 700 },
  { id: 'ct5', userId: '4', userName: 'David Brown', credits: 10000, type: 'purchase', description: 'Enterprise plan purchase', createdAt: '2026-06-15T16:00:00', balance: 10000 },
];
