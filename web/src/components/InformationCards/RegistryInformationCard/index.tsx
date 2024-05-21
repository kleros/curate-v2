import React from "react";
import styled from "styled-components";
import { responsiveSize } from "styles/responsiveSize";
import { Card, Copiable } from "@kleros/ui-components-library";
import AliasDisplay from "components/RegistryInfo/AliasDisplay";
import { mapFromSubgraphStatus } from "components/RegistryCard/StatusBanner";
import { Policies } from "./Policies";
import ActionButton from "../../ActionButton";
import TopInfo from "./TopInfo";
import { RegistryDetails } from "context/RegistryDetailsContext";

const StyledCard = styled(Card)`
  display: flex;
  width: 100%;
  height: auto;
  flex-direction: column;
  margin-bottom: 64px;
`;

const Divider = styled.hr`
  border: none;
  height: 1px;
  background-color: ${({ theme }) => theme.stroke};
  margin: ${responsiveSize(20, 28)} ${responsiveSize(24, 32)};
`;

const BottomInfo = styled.div`
  display: flex;
  padding: 0 ${responsiveSize(24, 32)} 12px ${responsiveSize(24, 32)};
  flex-wrap: wrap;
  gap: 20px;
  justify-content: space-between;
`;

interface IInformationCard
  extends Pick<
    RegistryDetails,
    | "title"
    | "description"
    | "logoURI"
    | "disputed"
    | "registerer"
    | "status"
    | "policyURI"
    | "latestRequestSubmissionTime"
  > {
  id: string;
  itemId: string;
  parentRegistryAddress: string;
  className?: string;
  refetch: () => void;
}

const RegistryInformationCard: React.FC<IInformationCard> = ({
  id,
  title,
  logoURI,
  description,
  registerer,
  status,
  disputed,
  policyURI,
  className,
  itemId,
  parentRegistryAddress,
  latestRequestSubmissionTime,
  refetch = () => {},
}) => (
  <StyledCard {...{ className }}>
    <TopInfo
      {...{
        id,
        title,
        description,
        logoURI,
        status,
        disputed,
        latestRequestSubmissionTime,
        registryAddress: parentRegistryAddress,
      }}
    />
    <Divider />
    <BottomInfo>
      <Copiable copiableContent={registerer?.id ?? ""}>
        <AliasDisplay address={registerer?.id} />
      </Copiable>
      <ActionButton
        {...{
          status: mapFromSubgraphStatus(status, disputed),
          registryAddress: parentRegistryAddress as `0x${string}`,
          itemId,
          isItem: false,
          refetch,
        }}
      />
    </BottomInfo>
    <Policies policyURI={policyURI ?? ""} />
  </StyledCard>
);

export default RegistryInformationCard;
