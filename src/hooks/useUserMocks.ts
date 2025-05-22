
import { useEffect } from 'react';
import { useUsersStore, User } from '@/stores/users';

const countries = ['US', 'BR', 'CO', 'MX', 'ES', 'CA', 'AR', 'PE', 'CL'];

// Generate random date within the last year
const randomDate = () => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 365));
  return date;
};

// Generate mock user data
const generateMockUsers = (count: number): User[] => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `u${i + 100}`,
    alias: `Player${i + 100}`,
    email: `player${i + 100}@poker.com`,
    country: countries[Math.floor(Math.random() * countries.length)],
    balance: Math.round(Math.random() * 10000) / 100,
    kyc: (Math.floor(Math.random() * 4) as 0 | 1 | 2 | 3),
    banned: Math.random() < 0.1, // 10% chance of being banned
    registeredAt: randomDate()
  }));
};

export const useUserMocks = () => {
  const setUsers = useUsersStore((s) => s.setUsers);
  
  useEffect(() => {
    const mockUsers = generateMockUsers(40);
    setUsers(mockUsers);
  }, [setUsers]);
  
  return null;
};
