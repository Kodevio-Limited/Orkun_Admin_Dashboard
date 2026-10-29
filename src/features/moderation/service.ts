import { ScanResult, SafetySettings } from './types';
import { mockScanResults, mockSafetySettings } from './mock-data';
import { PaginationParams } from '@/types/global';

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

type ModerationListParams = PaginationParams & { status?: string; userId?: string };

let scanResults: ScanResult[] = [...mockScanResults];
let safetySettings: SafetySettings = { ...mockSafetySettings };

function filterScans(params?: ModerationListParams) {
  let filtered = [...scanResults];
  if (params?.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter(
      (r) => r.userName.toLowerCase().includes(q) || r.scanResult.toLowerCase().includes(q)
    );
  }
  if (params?.status) {
    filtered = filtered.filter((r) => r.status === params.status);
  }
  if (params?.userId) {
    filtered = filtered.filter((r) => r.userId === params.userId);
  }
  return filtered;
}

export const moderationService = {
  async list(params?: ModerationListParams) {
    await delay();
    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 20;
    const filtered = filterScans(params);
    const start = (page - 1) * pageSize;
    return {
      success: true as const,
      data: filtered.slice(start, start + pageSize),
      total: filtered.length,
      page,
      pageSize,
    };
  },

  async get(id: string) {
    await delay();
    return scanResults.find((r) => r.id === id) ?? null;
  },

  async update(id: string, payload: Partial<ScanResult>) {
    await delay();
    const idx = scanResults.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    scanResults[idx] = { ...scanResults[idx], ...payload };
    return scanResults[idx];
  },

  async remove(id: string) {
    await delay();
    scanResults = scanResults.filter((r) => r.id !== id);
    return true;
  },

  async reset(id: string) {
    await delay();
    const idx = scanResults.findIndex((r) => r.id === id);
    if (idx !== -1) {
      scanResults[idx] = {
        ...scanResults[idx],
        status: 'pending',
        scanResult: 'Pending Analysis',
        confidence: 0,
        reason: 'Awaiting scan results',
        moderatorNotes: '',
      };
    }
    return true;
  },

  async rescan(id: string) {
    await delay();
    const idx = scanResults.findIndex((r) => r.id === id);
    if (idx !== -1) {
      scanResults[idx] = { ...scanResults[idx], status: 'scanning', scanResult: 'Scanning...' };
    }
    return true;
  },

  async getStats() {
    await delay();
    const today = new Date().toISOString().slice(0, 10);
    const scannedToday = scanResults.filter((r) => r.uploadTime.slice(0, 10) === today).length;
    return {
      scannedToday,
      approved: scanResults.filter((r) => r.status === 'approved').length,
      rejected: scanResults.filter((r) => r.status === 'rejected').length,
      flagged: scanResults.filter((r) => r.status === 'flagged').length,
      pending: scanResults.filter((r) => r.status === 'pending').length,
    };
  },

  async getSettings() {
    await delay();
    return { ...safetySettings };
  },

  async saveSettings(settings: SafetySettings) {
    await delay();
    safetySettings = { ...settings };
    return { ...safetySettings };
  },
};
