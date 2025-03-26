import { useMudWeb3 } from "@/contexts/AppContext";
import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";

export type Character = {
  id: bigint;
  name?: string;
};

function useCharacter() {
  const account = useAccount();
  const mudWeb3 = useMudWeb3();

  const { isLoading, data } = useQuery({
    staleTime: 1000 * 60 * 60, // 1 hour
    queryKey: ["Character", account.address],
    queryFn: async () => {
      if (!account.address) return null;
      const id = await mudWeb3.characterGetId({
        ownerAddress: account.address,
      });
      if (!id) return null;
      const metadata = await mudWeb3.assemblyGetMetadata({
        assemblyId: id,
      });
      return {
        id,
        name: metadata.name,
      };
    },
    enabled: Boolean(account.address),
  });

  return {
    isLoading,
    character: data,
  };
}

export default useCharacter;
