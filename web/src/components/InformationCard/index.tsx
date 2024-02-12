import React from "react";
import { Button, Card } from "@kleros/ui-components-library";
import styled from "styled-components";
import { responsiveSize } from "styles/responsiveSize";
import { getChainIcon, getChainName } from "components/ChainIcon";
import { getStatusColor, getStatusLabel } from "components/RegistryCard/StatusBanner";
import AliasDisplay from "components/RegistryInfo/AliasDisplay";
import { Policies } from "./Policies";
import EtherscanIcon from "svgs/icons/etherscan.svg";
import { Status } from "consts/status";

const StyledCard = styled(Card)`
  display: flex;
  width: 100%;
  height: auto;
  flex-direction: column;
  margin-bottom: 64px;
`;

const StatusContainer = styled.div<{ status: Status; isList: boolean }>`
  display: flex;
  margin-top: 18px;
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
  padding: 12px 32px;
`;

const LogoAndTitle = styled.div`
  display: flex;
  align-items: center;
`;

const TopLeftInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const TopRightInfo = styled.div`
  display: flex;
  flex-direction: row;
  gap: 48px;
`;

const ChainContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: top;
  justify-content: center;
`;

const StyledEtherscanIcon = styled(EtherscanIcon)`
  display: flex;
  height: 16px;
  width: 16px;
  margin-top: 20px;
`;

const StyledLogo = styled.img<{ isList: boolean }>`
  width: ${({ isList }) => (isList ? "48px" : "125px")};
  height: ${({ isList }) => (isList ? "48px" : "125px")};
  object-fit: contain;
  margin-bottom: ${({ isList }) => (isList ? "0px" : "8px")};
`;

const StyledP = styled.p`
  color: ${({ theme }) => theme.secondaryText};
  margin: 0;
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

interface IInformationCard {
  title: string;
  logoURI: string;
  description: string;
  chainId: number;
  status: string;
  isItem?: boolean;
  // itemParams?: Object : item will haev dynamic params
}

const InformationCard: React.FC<IInformationCard> = ({
  title,
  logoURI,
  description,
  chainId = 100,
  status = Status.Included,
  isItem = false,
}) => {
  return (
    <StyledCard>
      <TopInfo>
        <TopLeftInfo>
          <LogoAndTitle>
            {!isItem && <StyledLogo src={logoURI} alt="List Img" isList={false} />}
            <h1>{title}</h1>
          </LogoAndTitle>
          <StyledP>{description}</StyledP>
        </TopLeftInfo>
        <TopRightInfo>
          <ChainContainer>
            <p>{getChainIcon(chainId)}</p>
            <p>{getChainName(chainId)}</p>
          </ChainContainer>
          <StyledEtherscanIcon />
          <StatusContainer {...{ status, isList: false }}>
            <label className="front-color dot">{getStatusLabel(status)}</label>
          </StatusContainer>
        </TopRightInfo>
      </TopInfo>
      <Divider />
      <BottomInfo>
        <AliasDisplay address="0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5" />
        <Button variant="secondary" text={isItem ? "Remove Item" : "Remove List"} />
      </BottomInfo>
      <Policies />
    </StyledCard>
  );
};
export default InformationCard;
