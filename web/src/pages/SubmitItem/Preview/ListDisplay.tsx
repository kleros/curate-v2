import React, { useMemo } from "react";
import styled from "styled-components";
import { responsiveSize } from "styles/responsiveSize";
import ItemInformationCard from "components/ItemInformationCard";
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

interface IListDisplay {}

const ListDisplay: React.FC<IListDisplay> = ({}) => {
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
      <ItemInformationCard
        props={props}
        policyURI="/ipfs/QmSxGYpXHBWBGvGnBeZD1pFxh8fRHj4Z7o3fBzrGiqNx4v/tokens-policy.pdf"
        status={Status.RegistrationRequested}
        id="1"
        chainId={42161}
        disputed={false}
      />
    </Container>
  );
};
export default ListDisplay;
