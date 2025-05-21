
export async function getBalance() {
  const res = await fetch(`${import.meta.env.VITE_WALLET_API}/balance`, { credentials: 'include' });
  return res.json();
}

export async function requestDeposit(amount: number) {
  const res = await fetch(`${import.meta.env.VITE_WALLET_API}/deposit`, {
    method: 'POST',
    body: JSON.stringify({ amount }),
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include'
  });
  return res.json(); // {address, memo, amount}
}

export async function requestWithdraw(address: string, amount: number) {
  return fetch(`${import.meta.env.VITE_WALLET_API}/withdraw`, {
    method: 'POST',
    body: JSON.stringify({ address, amount }),
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include'
  });
}

export async function getLedger() {
  return fetch(`${import.meta.env.VITE_WALLET_API}/ledger`, { credentials: 'include' })
    .then((res) => res.json());
}
