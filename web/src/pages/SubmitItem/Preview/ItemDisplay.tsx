import React, { useMemo } from "react";
import styled from "styled-components";
import { responsiveSize } from "styles/responsiveSize";
import ItemCard from "components/ItemCard";
import { useSubmitItemContext } from "context/SubmitItemContext";
import { ItemDetailsFragment, Status } from "src/graphql/graphql";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${responsiveSize(32, 24)};
`;

const StyledP = styled.p`
  color: ${({ theme }) => theme.primaryBlue};
  margin: 0;
`;

interface IItemDisplay {}

const ItemDisplay: React.FC<IItemDisplay> = ({}) => {
  const { fields } = useSubmitItemContext();

  const props = useMemo(
    () =>
      fields.columns.reduce<ItemDetailsFragment["props"]>((acc, current) => {
        acc.push({ ...current, value: fields?.values?.[current.label] });
        return acc;
      }, []),
    [fields]
  );

  return (
    <Container>
      <StyledP>Check how the item is displayed on the List page:</StyledP>
      <ItemCard props={props} status={Status.RegistrationRequested} />
    </Container>
  );
};
export default ItemDisplay;
