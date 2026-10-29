import { Campaign } from './types';
import { mockCampaigns } from './mock-data';
import { PaginationParams } from '@/types/global';

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

function filterCampaigns(params?: PaginationParams) {
  let filtered = [...mockCampaigns];
  if (params?.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.type.toLowerCase().includes(q) ||
        c.status.toLowerCase().includes(q)
    );
  }
  const total = filtered.length;
  if (params?.page && params?.pageSize) {
    const start = (params.page - 1) * params.pageSize;
    filtered = filtered.slice(start, start + params.pageSize);
  }
  return { data: filtered, total };
}

export const campaignService = {
  async list(params?: PaginationParams) {
    await delay();
    return filterCampaigns(params);
  },
  async get(id: string) {
    await delay();
    return mockCampaigns.find((c) => c.id === id) ?? null;
  },
  async create(payload: Omit<Campaign, 'id' | 'createdAt'>) {
    await delay();
    const campaign: Campaign = {
      ...payload,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    mockCampaigns.unshift(campaign);
    return campaign;
  },
  async update(id: string, payload: Partial<Campaign>) {
    await delay();
    const idx = mockCampaigns.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    mockCampaigns[idx] = { ...mockCampaigns[idx], ...payload };
    return mockCampaigns[idx];
  },
  async remove(id: string) {
    await delay();
    const idx = mockCampaigns.findIndex((c) => c.id === id);
    if (idx !== -1) mockCampaigns.splice(idx, 1);
    return true;
  },
};
