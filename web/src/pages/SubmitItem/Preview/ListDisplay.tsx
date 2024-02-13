import React from "react";
import styled from "styled-components";
import { responsiveSize } from "styles/responsiveSize";
import ItemCard from "components/ItemCard";
import { Status } from "consts/status";

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
  return (
    <Container>
      <StyledP>Check how the item is displayed on the List page:</StyledP>
      <ItemCard id={1} title="Item title goes here" status={Status.Pending} />
    </Container>
  );
};
export default ListDisplay;
