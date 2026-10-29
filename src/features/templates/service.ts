import { Template } from './types';
import { mockTemplates } from './mock-data';
import { PaginationParams } from '@/types/global';

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

let templates: Template[] = [...mockTemplates];

function filterTemplates(params?: PaginationParams & { category?: string }) {
  let filtered = [...templates];
  if (params?.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.theme.toLowerCase().includes(q)
    );
  }
  if (params?.category) {
    filtered = filtered.filter((t) => t.category === params.category);
  }
  return filtered;
}

export const templateService = {
  async list(params?: PaginationParams & { category?: string }) {
    await delay();
    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 20;
    const filtered = filterTemplates(params);
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
    return templates.find((t) => t.id === id) ?? null;
  },

  async create(payload: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>) {
    await delay();
    const now = new Date().toISOString();
    const template: Template = {
      ...payload,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    templates.unshift(template);
    return template;
  },

  async update(id: string, payload: Partial<Template>) {
    await delay();
    const idx = templates.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    templates[idx] = { ...templates[idx], ...payload, updatedAt: new Date().toISOString() };
    return templates[idx];
  },

  async remove(id: string) {
    await delay();
    templates = templates.filter((t) => t.id !== id);
    return true;
  },

  async duplicate(id: string) {
    await delay();
    const source = templates.find((t) => t.id === id);
    if (!source) return null;
    const now = new Date().toISOString();
    const copy: Template = {
      ...source,
      id: crypto.randomUUID(),
      name: `${source.name} (Copy)`,
      createdAt: now,
      updatedAt: now,
    };
    templates.unshift(copy);
    return copy;
  },
};
