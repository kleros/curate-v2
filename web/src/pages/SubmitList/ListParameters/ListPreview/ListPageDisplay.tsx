import React from "react";
import styled from "styled-components";
import { responsiveSize } from "styles/responsiveSize";
import { Status } from "consts/status";
import InformationCard from "components/InformationCard";
import { useSubmitListContext } from "context/SubmitListContext";
import { getIpfsUrl } from "utils/getIpfsUrl";

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
  return (
    <Container>
      <StyledP>Check how the list is displayed on the List page:</StyledP>
      <StyledInformationCard
        title={listMetadata.title}
        description={listMetadata.description}
        chainId={421614}
        status={Status.Included}
        logoURI={getIpfsUrl(listMetadata.logoURI)}
      />
    </Container>
  );
};
export default ListPageDisplay;
