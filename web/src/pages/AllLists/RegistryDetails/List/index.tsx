import React from "react";
import styled from "styled-components";
import Skeleton from "react-loading-skeleton";
import StatsAndFilters from "components/StatsAndFilters";
import ItemCard from "components/ItemCard";
import { ItemDetailsFragment } from "src/graphql/graphql";
import Search from "components/Search";

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
`;

const SkeletonItemCard = styled(Skeleton)`
  height: 64px;
`;

interface IList {
  items: ItemDetailsFragment[] | undefined;
}

const List: React.FC<IList> = ({ items }) => {
  return (
    <>
      <Search />
      <StatsAndFilters fields={[{ label: "Items", value: items?.length.toString() }]} />
      <ListContainer>
        {items
          ? items.map((item) => <ItemCard key={item.id} {...item} />)
          : Array.from({ length: 3 }).map((_, index) => <SkeletonItemCard key={index} />)}
      </ListContainer>
    </>
  );
};

export default List;
