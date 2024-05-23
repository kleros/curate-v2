import React, { useMemo } from "react";
import styled from "styled-components";
import { responsiveSize } from "styles/responsiveSize";
import RegistryInformationCard from "components/InformationCards/RegistryInformationCard";
import { useSubmitListContext } from "context/SubmitListContext";
import { Status } from "src/graphql/graphql";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${responsiveSize(32, 24)};
`;

const StyledP = styled.p`
  color: ${({ theme }) => theme.primaryBlue};
  margin: 0;
`;

const StyledInformationCard = styled(RegistryInformationCard)`
  margin: 0px;
`;

const ListPageDisplay: React.FC = () => {
  const { listMetadata } = useSubmitListContext();
  const previewData = useMemo(() => listMetadata, [listMetadata]);

  return (
    <Container>
      <StyledP>Check how the list is displayed on the List page:</StyledP>
      <StyledInformationCard
        id=""
        parentRegistryAddress=""
        registerer={{ id: "" }}
        itemId=""
        title={previewData.title}
        description={previewData.description}
        status={Status.Registered}
        disputed={false}
        logoURI={previewData.logoURI}
        policyURI="https://cdn.kleros.link/ipfs/QmSxGYpXHBWBGvGnBeZD1pFxh8fRHj4Z7o3fBzrGiqNx4v/tokens-policy.pdf"
      />
    </Container>
  );
};
export default ListPageDisplay;
