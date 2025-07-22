import { useEffect, useMemo, useState } from "react";
import { QueryKey, useInfiniteQuery } from "@tanstack/react-query";

interface UsePaginatedQueryOptions<
  T extends { nextKey?: string; items: unknown[] },
> {
  queryKey: QueryKey;
  queryFn: ({ pageParam }: { pageParam: string | undefined }) => Promise<T>;
  staleTime?: number;
  enabled?: boolean;
}

type ExtractItemType<T> = T extends { items: (infer I)[] } ? I : never;

type UsePaginatedQueryReturn<T> = {
  data?: ExtractItemType<T>[];
  isFetching: boolean;
  hasNextPage: boolean;
  refetch: () => void;
} & ({ isError: false; error: null } | { isError: true; error: Error });

const MAX_PAGES = 100;

function usePaginatedQuery<T extends { nextKey?: string; items: unknown[] }>(
  options: UsePaginatedQueryOptions<T>
): UsePaginatedQueryReturn<T> {
  const [page, setPage] = useState(1);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isError,
    error,
    refetch,
  } = useInfiniteQuery({
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

  if (isError) {
    return {
      data: undefined,
      isFetching: false,
      hasNextPage: false,
      isError: true,
      error,
      refetch,
    };
  } else {
    return {
      data: memoizedData,
      isFetching,
      hasNextPage,
      isError: false,
      error,
      refetch,
    };
  }
}

export default usePaginatedQuery;
