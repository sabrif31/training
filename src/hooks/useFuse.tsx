import Fuse from "fuse.js";
import { useCallback, useMemo, useState } from "react";
import { debounce } from "throttle-debounce";

interface List {
  activity: string;
  sector: string;
  category: string;
}

export const useFuse = (list: List[], options: Fuse.IFuseOptions<T>) => {
  const [query, updateQuery] = useState("");
  const { ...fuseOptions } = options;
  const fuse = useMemo(() => new Fuse(list, fuseOptions), [list, fuseOptions]);

  const hits = useMemo(
    () =>
      !query
        ? fuse
            .getIndex()
            .docs.map((item: List, refIndex: number) => ({ item, refIndex }))
        : fuse.search(query),
    [fuse, query]
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
