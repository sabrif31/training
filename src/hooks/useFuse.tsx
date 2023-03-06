import Fuse from "fuse.js";
import { useCallback, useMemo, useState } from "react";
import { debounce } from "throttle-debounce";

interface List {
  activity: string;
  sector: string;
  category: string;
}

type Items = {
  activity: string;
  sector: string;
  category: string;
};

const highlight = (
  fuseSearchResult: Fuse.FuseResult<Items>[],
  highlightClassName: string = "highlight"
) => {
  const set = (obj: any, path: string, value: string) => {
    const pathValue = path.split(".");
    let i;

    for (i = 0; i < pathValue.length - 1; i++) {
      obj = obj[pathValue[i]];
    }

    obj[pathValue[i]] = value;
  };

  const generateHighlightedText = (inputText: string, regions = []) => {
    let content = "";
    let nextUnhighlightedRegionStartingIndex = 0;

    regions.forEach((region) => {
      const lastRegionNextIndex = region[1] + 1;

      content += [
        inputText.substring(nextUnhighlightedRegionStartingIndex, region[0]),
        `<mark class="${highlightClassName}">`,
        inputText.substring(region[0], lastRegionNextIndex),
        "</mark>",
      ].join("");

      nextUnhighlightedRegionStartingIndex = lastRegionNextIndex;
    });

    content += inputText.substring(nextUnhighlightedRegionStartingIndex);

    return content;
  };
  return fuseSearchResult
    .filter(({ matches }: Fuse.FuseResult<Items>) => matches && matches.length)
    .map(({ item, matches }: Fuse.FuseResult<Items>) => {
      const highlightedItem = { ...item };

      matches?.forEach((match: any) => {
        set(
          highlightedItem,
          match.key,
          generateHighlightedText(match.value, match.indices)
        );
      });

      return highlightedItem;
    });
};

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
        : highlight(fuse.search(query)),
    [fuse, query]
  );

  const setQuery = useCallback(debounce(100, updateQuery), []);

  const onSearch = useCallback(
    (e: any) => setQuery(e.target.value.trim()),
    [setQuery]
  );

  const removeMark = (text: string) => {
    const regex = /(<([^>]+)>)/gi;
    return text.replace(regex, "");
  };

  return {
    hits,
    onSearch,
    query,
    setQuery,
    removeMark,
  };
};
