import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { responsiveSize } from "styles/responsiveSize";
import Skeleton from "react-loading-skeleton";
import { Card, Copiable } from "@kleros/ui-components-library";
import EtherscanIcon from "svgs/icons/etherscan.svg";
import { Status } from "consts/status";
import { DEFAULT_CHAIN, SUPPORTED_CHAINS } from "consts/chains";
import { getIpfsUrl } from "utils/getIpfsUrl";
import { isUndefined } from "utils/index";
import AliasDisplay from "components/RegistryInfo/AliasDisplay";
import { getStatusColor, getStatusLabel } from "components/RegistryCard/StatusBanner";
import { Policies } from "./Policies";
import { DEFAULT_LIST_LOGO } from "consts/index";
import { landscapeStyle } from "styles/landscapeStyle";
import ActionButton from "../ActionButton";
import { Address } from "viem";

const StyledCard = styled(Card)`
  display: flex;
  width: 100%;
  height: auto;
  flex-direction: column;
  margin-bottom: 64px;
`;

const StatusContainer = styled.div<{ status: Status }>`
  display: flex;
  .dot {
    ::before {
      content: "";
      display: inline-block;
      height: 8px;
      width: 8px;
      border-radius: 50%;
      margin-right: 8px;
    }
  }
  ${({ theme, status }) => {
    const [frontColor] = getStatusColor(status, theme);
    return `
      .front-color {
        color: ${frontColor};
      }
      .dot {
        ::before {
          background-color: ${frontColor};
        }
      }
    `;
  }};
`;

const TopInfo = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  padding: ${responsiveSize(20, 24)} ${responsiveSize(24, 32)} 12px ${responsiveSize(24, 32)};
  ${landscapeStyle(
    () => css`
      flex-wrap: nowrap;
    `
  )}
`;

const LogoAndTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
`;

const TopLeftInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${responsiveSize(8, 16)} 0;
`;

const TopRightInfo = styled.div`
  display: flex;
  flex-direction: row;
  gap: 32px;
  flex-wrap: wrap;
  flex-shrink: 0;
  align-items: start;
  padding-top: 20px;
  ${landscapeStyle(
    () => css`
      gap: 0 ${responsiveSize(24, 32, 900)};
    `
  )}
`;

const StyledEtherscanIcon = styled(EtherscanIcon)`
  display: flex;
  height: 16px;
  width: 16px;
`;

const StyledLogo = styled.img<{ isListView: boolean }>`
  width: ${({ isListView }) => (isListView ? "40px" : "125px")};
  height: ${({ isListView }) => (isListView ? "40px" : "125px")};
  object-fit: contain;
  margin-bottom: ${({ isListView }) => (isListView ? "0px" : "8px")};
`;

const StyledTitle = styled.h1`
  margin: 0;
`;

const StyledP = styled.p`
  color: ${({ theme }) => theme.secondaryText};
  margin: 0;
`;

const StyledLabel = styled.label`
  color: ${({ theme }) => theme.primaryBlue};
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

const SkeletonLogo = styled(Skeleton)`
  width: 125px;
  height: 125px;
  border-radius: 62.5px;
  margin-bottom: 8px;
`;

const SkeletonTitle = styled(Skeleton)`
  width: 180px;
  height: 30px;
`;

const SkeletonDescription = styled(Skeleton)`
  width: 90%;
  height: 21px;
`;

interface IInformationCard {
  id?: string;
  title?: string;
  logoURI: string;
  description?: string;
  status: Status;
  registerer: string;
  policyURI: string;
  explorerAddress?: Address;
  itemId: string;
  registryAddress: Address;
  className?: string;
  refetch: () => {};
}

const InformationCard: React.FC<IInformationCard> = ({
  id,
  title,
  logoURI,
  description,
  registerer,
  status,
  policyURI,
  explorerAddress,
  className,
  itemId,
  registryAddress,
  refetch = () => {},
}) => {
  const [imageSrc, setImageSrc] = useState(getIpfsUrl(logoURI ?? ""));
  useEffect(() => setImageSrc(getIpfsUrl(logoURI)), [logoURI]);

  return (
    <StyledCard {...{ className }}>
      <TopInfo>
        <TopLeftInfo>
          <LogoAndTitle>
            {isUndefined(logoURI) ? (
              <SkeletonLogo />
            ) : (
              <StyledLogo
                src={imageSrc}
                onError={() => setImageSrc(getIpfsUrl(DEFAULT_LIST_LOGO))}
                alt="List Img"
                isListView={false}
              />
            )}
            {isUndefined(title) ? <SkeletonTitle /> : <StyledTitle>{title}</StyledTitle>}
          </LogoAndTitle>
          {isUndefined(description) ? <SkeletonDescription /> : <StyledP>{description}</StyledP>}
        </TopLeftInfo>
        <TopRightInfo>
          <Copiable copiableContent={id ?? ""} info="Copy Registry Address">
            <StyledLabel>Registry Address</StyledLabel>
          </Copiable>
          {explorerAddress ? (
            <a
              href={`${SUPPORTED_CHAINS[DEFAULT_CHAIN].blockExplorers?.default.url}/address/${explorerAddress}`}
              target="_blank"
              rel="noreferrer"
            >
              <StyledEtherscanIcon />
            </a>
          ) : null}
          <StatusContainer {...{ status }}>
            <label className="front-color dot">{getStatusLabel(status)}</label>
          </StatusContainer>
        </TopRightInfo>
      </TopInfo>
      <Divider />
      <BottomInfo>
        <Copiable copiableContent={registerer ?? ""}>
          <AliasDisplay address={registerer} />
        </Copiable>
        <ActionButton {...{ status, registryAddress, itemId, isItem: false, refetch }} />
      </BottomInfo>
      <Policies policyURI={policyURI} />
    </StyledCard>
  );
};

export default InformationCard;
