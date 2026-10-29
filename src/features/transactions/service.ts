import { Transaction } from './types';
import { mockTransactions } from './mock-data';
import { PaginationParams } from '@/types/global';

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

function filterTransactions(params?: PaginationParams) {
  let filtered = [...mockTransactions];
  if (params?.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.userName.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.type.toLowerCase().includes(q)
    );
  }
  const total = filtered.length;
  if (params?.page && params?.pageSize) {
    const start = (params.page - 1) * params.pageSize;
    filtered = filtered.slice(start, start + params.pageSize);
  }
  return { data: filtered, total };
}

export const transactionService = {
  async list(params?: PaginationParams) {
    await delay();
    return filterTransactions(params);
  },
  async get(id: string) {
    await delay();
    return mockTransactions.find((t) => t.id === id) ?? null;
  },
};
