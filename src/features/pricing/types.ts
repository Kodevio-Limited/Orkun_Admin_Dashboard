export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  credits: number;
  features: string[];
  popular?: boolean;
}

export interface CreditTransaction {
  id: string;
  userId: string;
  userName: string;
  credits: number;
  type: 'purchase' | 'usage' | 'bonus' | 'refund';
  description: string;
  createdAt: string;
  balance: number;
}
