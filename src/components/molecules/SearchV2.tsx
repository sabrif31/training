import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import ClickAwayListener from "@mui/base/ClickAwayListener";
import { FixedSizeList as List } from "react-window";
import AutoSizer, { Size } from "react-virtualized-auto-sizer";

import { useFuse } from "../../hooks/useFuse";
import data from "../../datas/datas.json";
import CustomTextField from "../atoms/TextField";
import Item from "../atoms/Item";

type Items = {
  activity: string;
  sector: string;
  category: string;
};

interface IFormatted {
  [key: number]: number;
}

interface Matches {
  indices: Array<IFormatted>;
  key: string;
  value: string;
}

type FuseResult = {
  item: Items;
  matches: Matches[];
  refIndex: number;
};
type Row = {
  index: number;
  style: React.CSSProperties;
};
type SearchProps = {
  keys: string[];
};

const highlight = (
  fuseSearchResult: FuseResult[],
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
    .filter(({ matches }: FuseResult) => matches && matches.length)
    .map(({ item, matches }: FuseResult) => {
      const highlightedItem = { ...item };

      matches.forEach((match: any) => {
        set(
          highlightedItem,
          match.key,
          generateHighlightedText(match.value, match.indices)
        );
      });

      return highlightedItem;
    });
};

const MySearch = (props: SearchProps) => {
  const [value, setValue] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { hits, query, onSearch } = useFuse(data, {
    matchAllOnEmptyQuery: true,
    includeMatches: true,
    shouldSort: true,
    threshold: 0.1,
    location: 0,
    distance: 100,
    useExtendedSearch: true,
    keys: props.keys,
  });

  const Row = ({ index, style }: Row) => (
    <ListItem
      onClick={() => {
        console.log(hits[index]);
        setValue(hits[index].item.activity);
        setIsOpen(false);
      }}
      style={style}
    >
      <Item {...highlight(hits)[index]} key={index} />
    </ListItem>
  );

  useEffect(() => {
    setIsOpen(query.length > 1);
  }, [query]);

  return (
    <SearchContainer>
      <ClickAwayListener onClickAway={() => setIsOpen(false)}>
        <>
          <CustomTextField
            name={"search"}
            type={"search"}
            className="search"
            label={"Search activity"}
            changeHandler={(e) => {
              onSearch(e);
              setValue(e.target.value);
            }}
            value={value}
          />
          {isOpen && (
            <ItemContainer>
              <DivAutoSizer>
                <AutoSizer>
                  {({ height, width }: Size) => (
                    <List
                      className="List"
                      height={height}
                      itemCount={hits.length}
                      itemSize={85}
                      width={width}
                    >
                      {Row}
                    </List>
                  )}
                </AutoSizer>
              </DivAutoSizer>
            </ItemContainer>
          )}
        </>
      </ClickAwayListener>
    </SearchContainer>
  );
};

export default MySearch;

const SearchContainer = styled.div`
  position: relative;
`;
const ItemContainer = styled.div`
  position: absolute;
  z-index: 10;
  top: 40px;
  border-left: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
  width: 100%;
  height: 350px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  max-height: 350px;
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.2);
  .item {
    width: 100%;
  }
  .item .logo {
    width: 12%;
    float: left;
  }
  .item .name {
    width: 88%;
    float: left;
  }
  .item .name p {
    margin-top: 2px;
  }
`;
const DivAutoSizer = styled.div`
  flex: 1 1 auto;
  height: 350px;
`;
const ListItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  :nth-child(odd) {
    background-color: #f5f5f5;
  }
  :nth-child(even) {
    background-color: #fff;
  }
  .sub {
    color: #686980;
    font-size: 12px;
  }
  :hover {
    background-color: #c1c1c1;
    color: #fff;
    .sub {
      color: #fff;
    }
  }
`;
