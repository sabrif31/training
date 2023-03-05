import { FC, ReactElement } from "react";
import BlockBox from "../organisms/Box";
import Search from "../molecules/Search";
import MySearch from "../molecules/SearchV2";

const SearchPage: FC = (): ReactElement => {
  return (
    <BlockBox>
      <h2>First test</h2>
      <Search keys={["activity", "category", "sector"]} />
      <h2>Second test with hook</h2>
      <MySearch keys={["activity", "category", "sector"]} />
    </BlockBox>
  );
};

export default SearchPage;
