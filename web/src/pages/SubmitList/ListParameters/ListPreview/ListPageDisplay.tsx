import React, { useMemo } from "react";
import styled from "styled-components";
import { responsiveSize } from "styles/responsiveSize";
import InformationCard from "components/InformationCard";
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

const StyledInformationCard = styled(InformationCard)`
  margin: 0px;
`;

const ListPageDisplay: React.FC = () => {
  const { listMetadata } = useSubmitListContext();
  const previewData = useMemo(() => listMetadata, [listMetadata]);

  return (
    <Container>
      <StyledP>Check how the list is displayed on the List page:</StyledP>
      <StyledInformationCard
        title={previewData.title}
        description={previewData.description}
        chainId={421614}
        status={mapFromSubgraphStatus(Status.Registered, false)}
        logoURI={previewData.logoURI}
      />
    </Container>
  );
};
export default ListPageDisplay;
