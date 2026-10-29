import { SystemLog } from './types';
import { mockLogs } from './mock-data';
import { PaginationParams } from '@/types/global';

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

export const logService = {
  async list(params?: PaginationParams) {
    await delay();
    let filtered = [...mockLogs];
    if (params?.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (l) =>
          l.user.toLowerCase().includes(q) ||
          l.description.toLowerCase().includes(q) ||
          l.action.toLowerCase().includes(q)
      );
    }
    const total = filtered.length;
    if (params?.page && params?.pageSize) {
      const start = (params.page - 1) * params.pageSize;
      filtered = filtered.slice(start, start + params.pageSize);
    }
    return { data: filtered, total };
  },
};
