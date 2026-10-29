import { Prompt } from './types';
import { mockPrompts } from './mock-data';
import { PaginationParams } from '@/types/global';

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

type PromptListParams = PaginationParams & { category?: string };

let prompts: Prompt[] = [...mockPrompts];

function filterPrompts(params?: PromptListParams) {
  let filtered = [...prompts];
  if (params?.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q)
    );
  }
  if (params?.category) {
    filtered = filtered.filter((p) => p.category === params.category);
  }
  return filtered;
}

export const promptService = {
  async list(params?: PromptListParams) {
    await delay();
    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 20;
    const filtered = filterPrompts(params);
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
    return prompts.find((p) => p.id === id) ?? null;
  },

  async create(payload: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>) {
    await delay();
    const now = new Date().toISOString();
    const prompt: Prompt = {
      ...payload,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    prompts.unshift(prompt);
    return prompt;
  },

  async update(id: string, payload: Partial<Prompt>) {
    await delay();
    const idx = prompts.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    prompts[idx] = { ...prompts[idx], ...payload, updatedAt: new Date().toISOString() };
    return prompts[idx];
  },

  async remove(id: string) {
    await delay();
    prompts = prompts.filter((p) => p.id !== id);
    return true;
  },

  async duplicate(id: string) {
    await delay();
    const source = prompts.find((p) => p.id === id);
    if (!source) return null;
    const now = new Date().toISOString();
    const copy: Prompt = {
      ...source,
      id: crypto.randomUUID(),
      title: `${source.title} (Copy)`,
      createdAt: now,
      updatedAt: now,
    };
    prompts.unshift(copy);
    return copy;
  },
};
