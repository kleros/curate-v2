import React from "react";
import styled, { css } from "styled-components";
import { landscapeStyle } from "styles/landscapeStyle";
import { responsiveSize } from "styles/responsiveSize";
import { Card } from "@kleros/ui-components-library";
import GnosisIcon from "svgs/chains/gnosis.svg";
import PileCoinsIcon from "svgs/icons/pile-coins.svg";

const Container = styled.div`
  display: flex;
  justify-content: center;
`;

const StyledCard = styled(Card)`
  display: flex;
  margin-top: 60px;
  margin-bottom: ${responsiveSize(36, 36)};
  padding: 24px ${responsiveSize(24, 32)};
  width: 80vw;
  height: auto;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;

  ${landscapeStyle(
    () => css`
      width: 91vw;
    `
  )}
`;

const LeftContent = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const Title = styled.p`
  font-size: 24px;
  font-weight: 600;
  margin: 0;
  color: ${({ theme }) => theme.primaryText};
`;

const ListName = styled.p`
  font-size: 24px;
  font-weight: 600;
  margin: 0;
  color: ${({ theme }) => theme.secondaryPurple};
`;

const RightContent = styled.div`
  display: flex;
  gap: 16px 48px;
  align-items: center;
  flex-wrap: wrap;
`;

const DepositRequired = styled.div`
  display: flex;
  flex-wrap: wrap;

  svg {
    fill: ${({ theme }) => theme.secondaryPurple};
    margin-right: 8px;
    width: 16px;
  }
`;

const StyledP = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.primaryText};
`;

const Amount = styled.p`
  margin: 0;
`;

const Chain = styled.div`
  display: flex;
  flex-direction: row;

  svg {
    margin-right: 8px;
    width: 24px;
  }
`;

interface IHeader {}

const Header: React.FC<IHeader> = ({}) => {
  return (
    <Container>
      <StyledCard>
        <LeftContent>
          <Title>Submit Item to</Title>
          <ListName>Address Tags List</ListName>
        </LeftContent>
        <RightContent>
          <DepositRequired>
            <PileCoinsIcon />
            <StyledP>Deposit required:&nbsp;</StyledP>
            <Amount>0.003 ETH</Amount>
          </DepositRequired>
          <Chain>
            <GnosisIcon />
            <StyledP>Gnosis</StyledP>
          </Chain>
        </RightContent>
      </StyledCard>
    </Container>
  );
};

export default Header;
