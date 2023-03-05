import Fuse from "fuse.js";
import { useCallback, useMemo, useState } from "react";
import { debounce } from "throttle-debounce";

interface List {
  activity: string;
  sector: string;
  category: string;
}

interface FuseOptions {
  includeMatches?: boolean;
  shouldSort?: boolean;
  threshold?: number;
  location?: number;
  distance?: number;
  useExtendedSearch?: boolean;
  matchAllOnEmptyQuery?: boolean;
  keys?: string[];
  limit?: number;
}

export const useFuse = (list: List[], options: FuseOptions) => {
  const [query, updateQuery] = useState("");
  const { limit, matchAllOnEmptyQuery, ...fuseOptions } = options;
  const fuse = useMemo(() => new Fuse(list, fuseOptions), [list, fuseOptions]);

  const hits = useMemo(
    () =>
      !query && matchAllOnEmptyQuery
        ? fuse
            .getIndex()
            .docs.slice(0, limit)
            .map((item: List, refIndex: number) => ({ item, refIndex }))
        : fuse.search(query),
    [fuse, limit, matchAllOnEmptyQuery, query]
  );

  const setQuery = useCallback(debounce(100, updateQuery), []);

  const onSearch = useCallback(
    (e: any) => setQuery(e.target.value.trim()),
    [setQuery]
  );

  return {
    hits,
    onSearch,
    query,
    setQuery,
  };
};
