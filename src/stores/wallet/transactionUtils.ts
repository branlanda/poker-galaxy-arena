
import { TransactionType } from './types';

// Helper functions for fraud prevention
export async function checkDepositSafety(amount: number): Promise<{safe: boolean, reason?: string}> {
  // Implement basic deposit safety checks
  if (amount <= 0) {
    return { safe: false, reason: 'Invalid deposit amount' };
  }
  
  if (amount > 10000) {
    return { safe: false, reason: 'Deposit amount exceeds maximum limit' };
  }
  
  return { safe: true };
}

export async function checkWithdrawSafety(address: string, amount: number): Promise<{safe: boolean, reason?: string}> {
  // Validate TRC20 address for withdrawals
  if (!/^T[A-Za-z0-9]{33}$/.test(address)) {
    return { safe: false, reason: 'Invalid TRC20 address' };
  }
  
  if (amount <= 0) {
    return { safe: false, reason: 'Invalid withdrawal amount' };
  }
  
  if (amount > 10000) {
    return { safe: false, reason: 'Withdrawal amount exceeds maximum limit' };
  }
  
  return { safe: true };
}
