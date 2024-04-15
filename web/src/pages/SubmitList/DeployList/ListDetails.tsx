import React from "react";
import styled, { css } from "styled-components";
import { landscapeStyle } from "styles/landscapeStyle";
import { responsiveSize } from "styles/responsiveSize";
import Coin from "svgs/icons/pile-coins.svg";
import { getChainIcon, getChainName } from "components/ChainIcon";
import { ListProgress, useSubmitListContext } from "context/SubmitListContext";
import { formatValue } from "utils/format";
import Skeleton from "react-loading-skeleton";

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  border-bottom: 1px solid ${({ theme }) => theme.stroke};
  padding: ${responsiveSize(24, 32)};
  padding-bottom: 8px;
  gap: 19px;
  ${landscapeStyle(
    () => css`
      gap: 0px;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 16px;
    `
  )}
`;

const InnerContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0px 48px;
  flex-wrap: wrap;
`;

const TotalContainer = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
`;

const StyledHeader = styled.h1`
  margin: 0px;
  color: ${({ theme }) => theme.secondaryPurple};
  ::after {
    content: "list";
    margin-left: 8px;
    color: ${({ theme }) => theme.primaryText};
  }
`;

const StyledCost = styled.p`
  color: ${({ theme }) => theme.secondaryPurple};
  margin: 0px;
`;

const StyledP = styled.p`
  margin: 0px;
`;

const ChainContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: top;
  justify-content: center;
`;

const SVGContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    fill: ${({ theme }) => theme.secondaryPurple};
    height: 16px;
    width: 16px;
  }
`;

const ListDetails: React.FC = () => {
  const { listMetadata, listData, progress } = useSubmitListContext();
  return (
    <Container>
      <StyledHeader>{listMetadata.title}</StyledHeader>
      <InnerContainer>
        {progress !== ListProgress.SubmitSuccess && (
          <TotalContainer>
            <SVGContainer>
              <Coin />
            </SVGContainer>
            <>
              <StyledP>Total :</StyledP>
              {listData.deployCost ? (
                <StyledCost>~{formatValue(listData.deployCost, 5, false)} ETH</StyledCost>
              ) : (
                <Skeleton width={60} height={20} />
              )}
            </>
          </TotalContainer>
        )}
        <ChainContainer>
          <p>{getChainIcon(421614)}</p>
          <p>{getChainName(421614)}</p>
        </ChainContainer>
      </InnerContainer>
    </Container>
  );
};

export default ListDetails;
