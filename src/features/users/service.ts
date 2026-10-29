import { User } from './types';
import { mockUsers } from './mock-data';
import { PaginationParams } from '@/types/global';

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

function filterUsers(params?: PaginationParams) {
  let filtered = [...mockUsers];
  if (params?.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter(
      (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
  }
  const total = filtered.length;
  if (params?.page && params?.pageSize) {
    const start = (params.page - 1) * params.pageSize;
    filtered = filtered.slice(start, start + params.pageSize);
  }
  return { data: filtered, total };
}

export const userService = {
  async list(params?: PaginationParams) {
    await delay();
    return filterUsers(params);
  },
  async get(id: string) {
    await delay();
    return mockUsers.find((u) => u.id === id) ?? null;
  },
  async create(payload: Omit<User, 'id' | 'joinedAt'>) {
    await delay();
    const user: User = {
      ...payload,
      id: crypto.randomUUID(),
      joinedAt: new Date().toISOString(),
    };
    mockUsers.unshift(user);
    return user;
  },
  async update(id: string, payload: Partial<User>) {
    await delay();
    const idx = mockUsers.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    mockUsers[idx] = { ...mockUsers[idx], ...payload };
    return mockUsers[idx];
  },
  async remove(id: string) {
    await delay();
    const idx = mockUsers.findIndex((u) => u.id === id);
    if (idx !== -1) mockUsers.splice(idx, 1);
    return true;
  },
};
