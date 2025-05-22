
import { useQuery } from "@tanstack/react-query";
import { getBalance } from "@/lib/api/wallet";

export function useBalance() {
  return useQuery({
    queryKey: ['balance'],
    queryFn: getBalance,
    refetchInterval: 60000, // Refetch every minute
  });
}
