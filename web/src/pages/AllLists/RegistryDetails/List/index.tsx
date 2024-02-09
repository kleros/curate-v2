import React from "react";
import Search from "../Search";
import StatsAndFilters from "~src/components/StatsAndFilters";

interface IList {}

const List: React.FC<IList> = ({}) => {
  return (
    <>
      <Search />
      <StatsAndFilters fields={[{ label: "Items", value: "0" }]} />
    </>
  );
};
export default List;
