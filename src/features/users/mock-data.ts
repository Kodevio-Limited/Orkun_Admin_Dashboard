import { User } from './types';

export const mockUsers: User[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', role: 'admin', status: 'active', initialCredit: 5000, passport: '', plan: 'Pro', imageGenerated: 1250, lastActive: '2026-07-10T10:30:00', joinedAt: '2025-01-15' },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', role: 'manager', status: 'active', initialCredit: 2500, passport: '', plan: 'Medium', imageGenerated: 780, lastActive: '2026-07-09T14:20:00', joinedAt: '2025-03-20' },
  { id: '3', name: 'Carol White', email: 'carol@example.com', role: 'editor', status: 'active', initialCredit: 1000, passport: '', plan: 'Starter', imageGenerated: 340, lastActive: '2026-07-08T09:15:00', joinedAt: '2025-06-10' },
  { id: '4', name: 'David Brown', email: 'david@example.com', role: 'viewer', status: 'deactivated', initialCredit: 500, passport: '', plan: 'Starter', imageGenerated: 95, lastActive: '2026-06-01T16:45:00', joinedAt: '2025-08-05' },
  { id: '5', name: 'Eve Davis', email: 'eve@example.com', role: 'editor', status: 'active', initialCredit: 2000, passport: '', plan: 'Medium', imageGenerated: 620, lastActive: '2026-07-10T08:00:00', joinedAt: '2025-02-28' },
  { id: '6', name: 'Frank Miller', email: 'frank@example.com', role: 'manager', status: 'active', initialCredit: 3000, passport: '', plan: 'Pro', imageGenerated: 980, lastActive: '2026-07-07T11:30:00', joinedAt: '2025-04-15' },
  { id: '7', name: 'Grace Wilson', email: 'grace@example.com', role: 'viewer', status: 'deleted', initialCredit: 500, passport: '', plan: 'Starter', imageGenerated: 45, lastActive: '2026-05-20T13:00:00', joinedAt: '2025-09-01' },
  { id: '8', name: 'Henry Taylor', email: 'henry@example.com', role: 'admin', status: 'active', initialCredit: 10000, passport: '', plan: 'Pro', imageGenerated: 2100, lastActive: '2026-07-10T12:10:00', joinedAt: '2025-01-10' },
];
