import React from "react";
import styled, { css } from "styled-components";
import NavigationButtons from "../NavigationButtons";
import { landscapeStyle } from "styles/landscapeStyle";
import { responsiveSize } from "styles/responsiveSize";
import { Slider } from "@kleros/ui-components-library";
import Header from "../Header";
import { useSubmitListContext } from "context/SubmitListContext";
import { parseEther } from "viem";
import { formatETH } from "utils/format";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  width: 84vw;

  ${landscapeStyle(
    () => css`
      width: ${responsiveSize(442, 700, 900)};
    `
  )}
`;

const DepositContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const MiddleContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 48px;
`;

const SliderContainer = styled.div`
  width: 100%;
  padding-left: 16px;
  > div {
    width: 100%;
  }
`;

const StyledLabel = styled.label`
  width: 100%;
  font-size: 16px;
  font-weight: 400;
`;

const Deposit: React.FC = () => {
  const { listData, setListData } = useSubmitListContext();

  return (
    <Container>
      <MiddleContainer>
        <DepositContainer>
          <Header text="Item Deposit" />
          <StyledLabel>
            Item deposit is the value users need to deposit to submit a new item to the list. The deposit is sufficient
            to cover the costs involving a dispute, in case someone challenges the item. Note that, if the deposit is
            too low users may be less interested in challenging incorrect items, resulting in low-quality items included
            on the list. On the other hand, if the deposit is too high, users will rarely submit new items. Balance is
            key.
          </StyledLabel>
          <SliderContainer>
            <Slider
              callback={(val) => setListData({ ...listData, submissionBaseDeposit: formatETH(BigInt(val), 5) })}
              min={parseEthToNumber("0.00001")}
              max={parseEthToNumber("0.01")}
              leftLabel="Too low"
              rightLabel="Too high"
              label={`${listData.submissionBaseDeposit} ETH`}
              value={parseEthToNumber(listData.submissionBaseDeposit)}
            />
          </SliderContainer>
        </DepositContainer>
        <DepositContainer>
          <Header text="Removal Base Deposit" />
          <StyledLabel>Removal base deposit is the value users need to deposit in order to remove an item.</StyledLabel>
          <SliderContainer>
            <Slider
              callback={(val) => setListData({ ...listData, removalBaseDeposit: formatETH(BigInt(val), 5) })}
              min={parseEthToNumber("0.00001")}
              max={parseEthToNumber("0.01")}
              leftLabel="Too low"
              rightLabel="Too high"
              label={`${listData.removalBaseDeposit} ETH`}
              value={parseEthToNumber(listData.removalBaseDeposit)}
            />
          </SliderContainer>
        </DepositContainer>
      </MiddleContainer>

      <NavigationButtons prevRoute="/submitList/policy" nextRoute="/submitList/fields" />
    </Container>
  );
};

const parseEthToNumber = (val: string) => Number(parseEther(val));

export default Deposit;
