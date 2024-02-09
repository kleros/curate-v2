import React from "react";
import Search from "../Search";
import StatsAndFilters from "../StatsAndFilters";

interface IList {}

const List: React.FC<IList> = ({}) => {
  return (
    <>
      <Search />
      <StatsAndFilters totalItems={0} />
    </>
  );
};
export default List;
