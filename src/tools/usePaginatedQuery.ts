import { useEffect, useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

interface UsePaginatedQueryOptions<
  T extends { nextKey?: string; items: unknown[] },
> {
  queryKey: string[];
  queryFn: ({ pageParam }: { pageParam: string | undefined }) => Promise<T>;
  staleTime?: number;
  enabled?: boolean;
}

type ExtractItemType<T> = T extends { items: (infer I)[] } ? I : never;

export function usePaginatedQuery<
  T extends { nextKey?: string; items: unknown[] },
>(
  options: UsePaginatedQueryOptions<T>
): { data?: ExtractItemType<T>[]; isFetching: boolean } {
  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery({
    queryKey: options.queryKey,
    queryFn: options.queryFn,
    getNextPageParam: (lastPage): string | undefined => lastPage?.nextKey,
    initialPageParam: undefined as string | undefined,
    staleTime: options.staleTime,
    enabled: options.enabled,
  });

  useEffect(() => {
    if (hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetching, fetchNextPage]);

  const memoizedData = useMemo(() => {
    return data?.pages.flatMap((p) => p?.items ?? []) as ExtractItemType<T>[];
  }, [data]);

  return {
    data: memoizedData as ExtractItemType<T>[],
    isFetching,
  };
}
