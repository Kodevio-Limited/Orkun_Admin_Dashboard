export interface LoginPayload {
  email: string;
  password: string;
  remember?: boolean;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  token: string;
}
