import { Transaction } from './types';

export const mockTransactions: Transaction[] = [
  { id: '1', userId: '1', userName: 'Alice Johnson', type: 'payment', amount: 5000, status: 'success', description: 'Campaign prepayment - Summer Sale', createdAt: '2026-07-01T10:00:00' },
  { id: '2', userId: '2', userName: 'Bob Smith', type: 'payment', amount: 2500, status: 'success', description: 'Campaign payment - Product Launch', createdAt: '2026-06-28T14:30:00' },
  { id: '3', userId: '3', userName: 'Carol White', type: 'refund', amount: 350, status: 'success', description: 'Overcharge refund', createdAt: '2026-06-25T09:15:00' },
  { id: '4', userId: '4', userName: 'David Brown', type: 'payment', amount: 10000, status: 'pending', description: 'Annual subscription', createdAt: '2026-07-07T16:45:00' },
  { id: '5', userId: '5', userName: 'Eve Davis', type: 'credit', amount: 2000, status: 'success', description: 'Credit top-up', createdAt: '2026-06-20T08:00:00' },
  { id: '6', userId: '1', userName: 'Alice Johnson', type: 'withdrawal', amount: 1500, status: 'failed', description: 'Withdrawal to bank account', createdAt: '2026-06-15T11:30:00' },
  { id: '7', userId: '6', userName: 'Frank Miller', type: 'payment', amount: 3000, status: 'success', description: 'Campaign budget top-up', createdAt: '2026-06-10T13:00:00' },
  { id: '8', userId: '2', userName: 'Bob Smith', type: 'refund', amount: 200, status: 'success', description: 'Campaign cancellation refund', createdAt: '2026-06-05T15:20:00' },
  { id: '9', userId: '7', userName: 'Grace Wilson', type: 'payment', amount: 1500, status: 'pending', description: 'New campaign budget', createdAt: '2026-07-06T10:10:00' },
  { id: '10', userId: '3', userName: 'Carol White', type: 'credit', amount: 500, status: 'success', description: 'Referral bonus', createdAt: '2026-06-01T12:00:00' },
];
