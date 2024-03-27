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
  align-items: center;
  gap: 32px;
  width: 84vw;

  ${landscapeStyle(
    () => css`
      width: ${responsiveSize(442, 700, 900)};
    `
  )}
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
`;

const Deposit: React.FC = () => {
  const { listData, setListData } = useSubmitListContext();

  const handleChange = (val: number) => {
    setListData({ ...listData, submissionBaseDeposit: formatETH(BigInt(val), 5) });
  };

  return (
    <Container>
      <Header text="Item Deposit" />
      <StyledLabel>
        Item deposit is the value users need to deposit to submit a new item to the list. The deposit is sufficient to
        cover the costs involving a dispute, in case someone challenges the item. Note that, if the deposit is too low
        users may be less interested in challenging incorrect items, resulting in low-quality items included on the
        list. On the other hand, if the deposit is too high, users will rarely submit new items. Balance is key.
      </StyledLabel>
      <SliderContainer>
        <Slider
          callback={handleChange}
          min={Number(parseEther("0.00001"))}
          max={Number(parseEther("0.01"))}
          leftLabel="Too low"
          rightLabel="Too high"
          label={`${listData.submissionBaseDeposit} ETH`}
        />
      </SliderContainer>
      <NavigationButtons prevRoute="/submitList/listPreview" nextRoute="/submitList/fields" />
    </Container>
  );
};
export default Deposit;
