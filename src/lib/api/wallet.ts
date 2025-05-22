
export async function getBalance() {
  const res = await fetch(`${import.meta.env.VITE_WALLET_API}/balance`, { 
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    }
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch balance');
  }
  
  return res.json();
}

export async function requestDeposit(amount: number) {
  const res = await fetch(`${import.meta.env.VITE_WALLET_API}/deposit`, {
    method: 'POST',
    body: JSON.stringify({ amount }),
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include'
  });
  
  if (!res.ok) {
    throw new Error('Failed to generate deposit address');
  }
  
  return res.json(); // {address, memo, amount}
}

export async function requestWithdraw(address: string, amount: number) {
  const res = await fetch(`${import.meta.env.VITE_WALLET_API}/withdraw`, {
    method: 'POST',
    body: JSON.stringify({ address, amount }),
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include'
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(errorData.message || 'Failed to process withdrawal request');
  }
  
  return res.json();
}

export async function getLedger() {
  const res = await fetch(`${import.meta.env.VITE_WALLET_API}/ledger`, { 
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    }
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch transaction history');
  }
  
  return res.json();
}

// Verify a blockchain transaction
export async function verifyTransaction(txHash: string) {
  const res = await fetch(`${import.meta.env.VITE_WALLET_API}/verify`, {
    method: 'POST',
    body: JSON.stringify({ txHash }),
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include'
  });
  
  if (!res.ok) {
    throw new Error('Failed to verify transaction');
  }
  
  return res.json();
}
