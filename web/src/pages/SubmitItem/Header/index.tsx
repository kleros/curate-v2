import React, { useEffect } from "react";
import styled, { css } from "styled-components";
import { landscapeStyle } from "styles/landscapeStyle";
import { responsiveSize } from "styles/responsiveSize";
import { Card } from "@kleros/ui-components-library";
import GnosisIcon from "svgs/chains/gnosis.svg";
import PileCoinsIcon from "svgs/icons/pile-coins.svg";
import { useRegistryDetailsContext } from "context/RegistryDetailsContext";
import Skeleton from "react-loading-skeleton";
import { useParams } from "react-router-dom";
import { useCurateV2GetArbitratorExtraData, useCurateV2SubmissionBaseDeposit } from "hooks/contracts/generated";
import { useSubmitItemContext } from "context/SubmitItemContext";
import { formatUnitsWei, formatValue } from "utils/format";
import { useArbitrationCost } from "hooks/useArbitrationCostFromKlerosCore";

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
  const { title } = useRegistryDetailsContext();
  const { submissionDeposit, setSubmissionDeposit } = useSubmitItemContext();
  const { id } = useParams();
  const [listAddress, _]: string[] = id?.split("-");

  const { data: deposit } = useCurateV2SubmissionBaseDeposit({ address: listAddress });
  const { data: arbitratorExtraData } = useCurateV2GetArbitratorExtraData({ address: listAddress });

  const { arbitrationCost } = useArbitrationCost(arbitratorExtraData);

  useEffect(() => {
    if (!deposit || !arbitrationCost) return;
    setSubmissionDeposit(((arbitrationCost as bigint) + deposit).toString());
  }, [deposit, arbitrationCost]);

  return (
    <Container>
      <StyledCard>
        <LeftContent>
          <Title>Submit Item to</Title>
          {title ? <ListName>{title}</ListName> : <Skeleton width={100} height={26} />}
        </LeftContent>
        <RightContent>
          <DepositRequired>
            <PileCoinsIcon />
            <StyledP>Deposit required:&nbsp;</StyledP>
            {submissionDeposit ? (
              <Amount>{formatValue(formatUnitsWei(BigInt(submissionDeposit)), 5, false)} ETH</Amount>
            ) : (
              <Skeleton width={60} height={24} />
            )}
          </DepositRequired>
        </RightContent>
      </StyledCard>
    </Container>
  );
};

export default Header;
