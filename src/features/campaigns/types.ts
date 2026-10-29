export interface Campaign {
  id: string;
  name: string;
  description: string;
  image: string;
  type: 'display' | 'video' | 'social' | 'search';
  status: 'active' | 'paused' | 'completed' | 'draft';
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
  startDate: string;
  endDate: string;
  createdAt: string;
}
