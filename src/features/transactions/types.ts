export type TransactionStatus = 'success' | 'pending' | 'failed';
export type TransactionType = 'payment' | 'refund' | 'withdrawal' | 'credit';

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  description: string;
  createdAt: string;
}
