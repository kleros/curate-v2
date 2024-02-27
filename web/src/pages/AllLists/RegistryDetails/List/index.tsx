import React from "react";
import Search from "../Search";
import StatsAndFilters from "~src/components/StatsAndFilters";
import styled from "styled-components";
import { items } from "consts/index";
import ItemCard from "components/ItemCard";

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
`;

interface IList {}

const List: React.FC<IList> = ({}) => {
  return (
    <>
      <Search />
      <StatsAndFilters fields={[{ label: "Items", value: "0" }]} />
      <ListContainer>
        {items.map((item) => (
          <ItemCard key={item.id} {...item} />
        ))}
      </ListContainer>
    </>
  );
};
export default List;
