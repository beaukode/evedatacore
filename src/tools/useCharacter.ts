import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { getCharacterId } from "@/api/evedatacore-v2";

function useCharacter() {
  const account = useAccount();

  const { isLoading, data } = useQuery({
    staleTime: 1000 * 60 * 60, // 1 hour
    queryKey: ["Character", account.address],
    queryFn: async () => {
      if (!account.address) return null;
      const character = await getCharacterId({
        path: { id: account.address.toLowerCase() },
      });
      if (!character.data) return null;
      return character.data;
    },
    enabled: Boolean(account.address),
  });

  return {
    isLoading,
    character: data,
  };
}

export default useCharacter;
