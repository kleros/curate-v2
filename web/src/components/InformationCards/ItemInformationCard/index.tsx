import React from "react";
import { Card, Copiable } from "@kleros/ui-components-library";
import styled, { css } from "styled-components";
import Skeleton from "react-loading-skeleton";
import AliasDisplay from "components/RegistryInfo/AliasDisplay";
import ActionButton from "components/ActionButton";
import { mapFromSubgraphStatus } from "components/RegistryCard/StatusBanner";
import { responsiveSize } from "styles/responsiveSize";
import { landscapeStyle } from "styles/landscapeStyle";
import { Policies } from "../RegistryInformationCard/Policies";
import FieldsDisplay from "./FieldsDisplay";
import StatusDisplay from "../StatusDisplay";
import { ItemDetailsQuery } from "src/graphql/graphql";
import { Address } from "viem";
import { validateItem } from "src/types/CurateItem";
import { isUndefined } from "src/utils";

const StyledCard = styled(Card)`
  display: flex;
  width: 100%;
  height: auto;
  flex-direction: column;
  margin-bottom: 64px;
`;

const TopInfo = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  padding: 12px 32px;
  ${landscapeStyle(
    () => css`
      flex-wrap: nowrap;
    `
  )};
`;

const TopLeftInfo = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 16px;
  padding-top: 16px;
`;

const TopRightInfo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: start;
  gap: 48px;
  padding-top: 20px;
  flex-shrink: 1;
  ${landscapeStyle(
    () => css`
      flex-shrink: 0;
    `
  )}
`;

const StyledLabel = styled.label`
  color: ${({ theme }) => theme.primaryBlue};
`;

const Divider = styled.hr`
  border: none;
  height: 1px;
  background-color: ${({ theme }) => theme.stroke};
  margin: ${responsiveSize(20, 28)} 32px;
`;

const BottomInfo = styled.div`
  display: flex;
  padding: 0 32px;
  padding-bottom: 12px;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: space-between;
`;

const AliasContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
`;

const WarningContainer = styled.p`
  width: 100%;
  padding: 8px 32px;
  margin: 0;
  background-color: ${({ theme }) => theme.warningLight};
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.warning};
  text-align: center;
`;

type ItemDetails = NonNullable<ItemDetailsQuery["item"]>;
interface IItemInformationCard extends ItemDetails {
  className?: string;
  policyURI: string;
  registryAddress: Address;
  isPreview?: boolean;
}

const ItemInformationCard: React.FC<IItemInformationCard> = ({
  className,
  registerer,
  status,
  disputed,
  policyURI,
  itemID,
  props,
  registryAddress,
  latestRequestSubmissionTime,
  data,
  isPreview = false,
}) => {
  const showWarning = isPreview || isUndefined(data) ? false : !validateItem(data).success;

  return (
    <StyledCard {...{ className }}>
      {showWarning ? (
        <WarningContainer>This item does not pass the validation checks. Please review carefully.</WarningContainer>
      ) : null}
      <TopInfo>
        <TopLeftInfo>
          {props ? <FieldsDisplay {...{ props, registryAddress }} /> : <Skeleton height={80} width={160} />}
        </TopLeftInfo>
        <TopRightInfo>
          <Copiable copiableContent={itemID ?? ""} info="Copy Item Id" iconPlacement="left">
            <StyledLabel>Item Id</StyledLabel>
          </Copiable>
          <StatusDisplay {...{ status, disputed, registryAddress, latestRequestSubmissionTime }} />
        </TopRightInfo>
      </TopInfo>
      <Divider />
      <BottomInfo>
        {registerer?.id ? (
          <AliasContainer>
            <small>Submitted by:</small>
            <Copiable copiableContent={registerer.id}>
              <AliasContainer>
                <AliasDisplay address={registerer.id} />
              </AliasContainer>
            </Copiable>
          </AliasContainer>
        ) : (
          <Skeleton height={24} />
        )}
        <ActionButton
          {...{
            status: mapFromSubgraphStatus(status, disputed),
            itemId: itemID,
            registryAddress,
            isItem: true,
          }}
        />
      </BottomInfo>
      <Policies policyURI={policyURI} isItem />
    </StyledCard>
  );
};
export default ItemInformationCard;
