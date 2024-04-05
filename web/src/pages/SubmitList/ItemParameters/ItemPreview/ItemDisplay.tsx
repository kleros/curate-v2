import React from "react";
import styled from "styled-components";
import { responsiveSize } from "styles/responsiveSize";
import ItemInformationCard from "components/ItemInformationCard";
import { useSubmitListContext } from "context/SubmitListContext";
import { constructItemWithMockValues } from "utils/submitListUtils";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${responsiveSize(32, 24)};
`;

const StyledP = styled.p`
  color: ${({ theme }) => theme.primaryBlue};
  margin: 0;
`;

const StyledItemInformationCard = styled(ItemInformationCard)`
  margin: 0px;
`;

interface IItemDisplay {}

const ItemDisplay: React.FC<IItemDisplay> = ({}) => {
  const { listMetadata } = useSubmitListContext();
  const item = constructItemWithMockValues(listMetadata);
  return (
    <Container>
      <StyledP>Check how the item is displayed on the Item page:</StyledP>
      <StyledItemInformationCard {...item} />
    </Container>
  );
};
export default ItemDisplay;
