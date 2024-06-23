import React, { useMemo } from "react";
import styled from "styled-components";
import { responsiveSize } from "styles/responsiveSize";
import RegistryCard from "components/RegistryCard";
import { useSubmitListContext } from "context/SubmitListContext";
import { Status } from "src/graphql/graphql";
import { mapFromSubgraphStatus } from "components/RegistryCard/StatusBanner";
import { DEFAULT_LIST_LOGO } from "src/consts";

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
  const previewData = useMemo(() => listMetadata, [listMetadata]);
  return (
    <Container>
      <StyledP>Check how the list is displayed on the home page:</StyledP>
      <RegistryCard
        id={"1"}
        title={previewData.title}
        status={mapFromSubgraphStatus(Status.RegistrationRequested, false)}
        logoURI={previewData?.logoURI ?? DEFAULT_LIST_LOGO}
        totalItems={23}
        overrideIsListView
      />
    </Container>
  );
};
export default HomePageDisplay;
