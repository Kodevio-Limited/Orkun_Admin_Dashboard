export type LogLevel = 'info' | 'warning' | 'error';
export type LogAction = 'create' | 'update' | 'delete' | 'login' | 'logout' | 'export';

export interface SystemLog {
  id: string;
  timestamp: string;
  level: LogLevel;
  action: LogAction;
  user: string;
  entity: string;
  entityId: string;
  description: string;
  ip?: string;
}
