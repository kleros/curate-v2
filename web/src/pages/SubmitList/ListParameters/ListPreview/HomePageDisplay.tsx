import React from "react";
import styled from "styled-components";
import { responsiveSize } from "styles/responsiveSize";
import RegistryCard from "components/RegistryCard";
import { useSubmitListContext } from "context/SubmitListContext";
import { Status } from "src/graphql/graphql";
import { mapFromSubgraphStatus } from "components/RegistryCard/StatusBanner";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${responsiveSize(32, 24)};
`;

const StyledP = styled.p`
  color: ${({ theme }) => theme.primaryBlue};
  margin: 0;
`;

const HomePageDisplay: React.FC = () => {
  const { listMetadata } = useSubmitListContext();
  return (
    <Container>
      <StyledP>Check how the list is displayed on the home page:</StyledP>
      <RegistryCard
        id={"1"}
        title={listMetadata.title}
        status={mapFromSubgraphStatus(Status.RegistrationRequested, false)}
        logoURI={listMetadata?.logoURI}
        chainId={421614}
        totalItems={23}
        overrideIsList
      />
    </Container>
  );
};
export default HomePageDisplay;
