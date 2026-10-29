export type UserRole = 'admin' | 'manager' | 'editor' | 'viewer';
export type UserStatus = 'active' | 'deleted' | 'deactivated';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  initialCredit: number;
  passport: string;
  plan: 'Starter' | 'Medium' | 'Pro';
  imageGenerated: number;
  lastActive: string;
  joinedAt: string;
}
