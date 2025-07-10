import { useEffect, useMemo, useState } from "react";
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

const MAX_PAGES = 20;

export function usePaginatedQuery<
  T extends { nextKey?: string; items: unknown[] },
>(
  options: UsePaginatedQueryOptions<T>
): { data?: ExtractItemType<T>[]; isFetching: boolean } {
  const [page, setPage] = useState(1);
  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery({
    queryKey: options.queryKey,
    queryFn: options.queryFn,
    getNextPageParam: (lastPage): string | undefined => lastPage?.nextKey,
    initialPageParam: undefined as string | undefined,
    staleTime: options.staleTime,
    enabled: options.enabled,
  });

  useEffect(() => {
    if (hasNextPage && !isFetching && page < MAX_PAGES) {
      setPage((s) => s + 1);
      fetchNextPage();
    }
  }, [hasNextPage, isFetching, fetchNextPage, page]);

  const memoizedData = useMemo(() => {
    return data?.pages.flatMap((p) => p?.items ?? []) as ExtractItemType<T>[];
  }, [data]);

  return {
    data: memoizedData as ExtractItemType<T>[],
    isFetching,
  };
}
