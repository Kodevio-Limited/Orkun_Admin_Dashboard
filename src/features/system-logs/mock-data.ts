import { SystemLog } from './types';

export const mockLogs: SystemLog[] = [
  { id: '1', timestamp: '2026-07-07T10:30:00', level: 'info', action: 'login', user: 'Alice Johnson', entity: 'User', entityId: '1', description: 'User logged in', ip: '192.168.1.1' },
  { id: '2', timestamp: '2026-07-07T10:25:00', level: 'info', action: 'create', user: 'Alice Johnson', entity: 'Campaign', entityId: '7', description: 'Created new campaign "YouTube Pre-roll"', ip: '192.168.1.1' },
  { id: '3', timestamp: '2026-07-07T09:15:00', level: 'warning', action: 'update', user: 'Bob Smith', entity: 'Campaign', entityId: '3', description: 'Updated campaign budget beyond limit', ip: '192.168.1.2' },
  { id: '4', timestamp: '2026-07-06T18:00:00', level: 'error', action: 'delete', user: 'System', entity: 'Transaction', entityId: '6', description: 'Failed to process withdrawal - insufficient funds', ip: '' },
  { id: '5', timestamp: '2026-07-06T16:45:00', level: 'info', action: 'logout', user: 'David Brown', entity: 'User', entityId: '4', description: 'User logged out', ip: '192.168.1.3' },
  { id: '6', timestamp: '2026-07-06T14:20:00', level: 'info', action: 'login', user: 'Bob Smith', entity: 'User', entityId: '2', description: 'User logged in', ip: '192.168.1.2' },
  { id: '7', timestamp: '2026-07-05T11:00:00', level: 'warning', action: 'export', user: 'Carol White', entity: 'Report', entityId: 'RPT-001', description: 'Exported sensitive data report', ip: '192.168.1.4' },
  { id: '8', timestamp: '2026-07-05T09:00:00', level: 'error', action: 'update', user: 'System', entity: 'System', entityId: 'SYS', description: 'Database connection timeout', ip: '' },
];
