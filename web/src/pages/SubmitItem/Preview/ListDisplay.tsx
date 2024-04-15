import React from "react";
import styled from "styled-components";
import { responsiveSize } from "styles/responsiveSize";
import ItemCard from "components/ItemCard";
import { items } from "~src/consts";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${responsiveSize(32, 24)};
`;

const StyledP = styled.p`
  color: ${({ theme }) => theme.primaryBlue};
  margin: 0;
`;

interface IListDisplay {}

const ListDisplay: React.FC<IListDisplay> = ({}) => {
  const item = items[0];
  return (
    <Container>
      <StyledP>Check how the item is displayed on the List page:</StyledP>
      <ItemCard {...item} />
    </Container>
  );
};
export default ListDisplay;
