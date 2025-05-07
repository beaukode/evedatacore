import { useMudSql } from "@/contexts/AppContext";
import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";

function useCharacter() {
  const account = useAccount();
  const mudSql = useMudSql();

  const { isLoading, data } = useQuery({
    staleTime: 1000 * 60 * 60, // 1 hour
    queryKey: ["Character", account.address],
    queryFn: async () => {
      if (!account.address) return null;
      const character = await mudSql.getCharacter(account.address);
      if (!character) return null;
      return character;
    },
    enabled: Boolean(account.address),
  });

  return {
    isLoading,
    character: data,
  };
}

export default useCharacter;
