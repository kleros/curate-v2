import React from "react";
import styled, { css } from "styled-components";
import { landscapeStyle } from "styles/landscapeStyle";
import { responsiveSize } from "styles/responsiveSize";
import Coin from "svgs/icons/pile-coins.svg";
import { getChainIcon, getChainName } from "components/ChainIcon";
import { useSubmitListContext } from "context/SubmitListContext";

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  border-bottom: 1px solid ${({ theme }) => theme.stroke};
  padding: ${responsiveSize(24, 32)};
  padding-bottom: 8px;
  ${landscapeStyle(
    () => css`
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
  gap: 48px;
`;

const TotalContainer = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
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

const StyledP = styled.p`
  color: ${({ theme }) => theme.secondaryPurple};
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
  const { listMetadata } = useSubmitListContext();
  return (
    <Container>
      <StyledHeader>{listMetadata.title}</StyledHeader>
      <InnerContainer>
        <TotalContainer>
          <SVGContainer>
            <Coin />
          </SVGContainer>
          <p>Total :</p>
          <StyledP>~0.03 ETH</StyledP>
        </TotalContainer>{" "}
        <ChainContainer>
          <p>{getChainIcon(100)}</p>
          <p>{getChainName(100)}</p>
        </ChainContainer>
      </InnerContainer>
    </Container>
  );
};

export default ListDetails;
