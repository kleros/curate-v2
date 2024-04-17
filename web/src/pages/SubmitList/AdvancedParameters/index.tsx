import React from "react";
import styled from "styled-components";
import NavigationButtons from "../NavigationButtons";
import { responsiveSize } from "styles/responsiveSize";
import Header from "../Header";
import LightButton from "components/LightButton";
import HistoryIcon from "svgs/icons/history.svg";
import BookIcon from "svgs/icons/book.svg";
import { Accordion } from "@kleros/ui-components-library";
import ChallengeParameters from "./ChallengeParameters";
import AppealParameters from "./AppealParameters";
import AbritrationParameters from "./ArbitrationParameters";
import { useSubmitListContext } from "context/SubmitListContext";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  width: 100%;
  padding: 0px ${responsiveSize(0, 108)};
`;

const LabelAndButtonContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 10px;
`;

const StyledLabel = styled.label`
  width: 100%;
  text-align: center;
`;

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 32px;
  .button-svg {
    fill: ${({ theme }) => theme.primaryBlue};
  }
  .button-text {
    color: ${({ theme }) => theme.primaryBlue};
  }
`;

const StyledAccordion = styled(Accordion)`
  width: 100%;
  > * > button {
    justify-content: unset;
    padding: 11.5px ${responsiveSize(8, 18)} !important;
    background-color: ${({ theme }) => theme.whiteBackground} !important;
    border: 1px solid ${({ theme }) => theme.stroke} !important;
    > svg {
      fill: ${({ theme }) => theme.primaryText} !important;
    }
    > p {
      color: ${({ theme }) => theme.primaryText};
    }
  }

  //adds padding to body container
  > * > div > div {
    padding: ${responsiveSize(16, 24)} ${responsiveSize(8, 16)};
  }
`;

const AdvancedParameters: React.FC = () => {
  const { listData, setListData } = useSubmitListContext();
  const reset = () =>
    setListData({
      ...listData,
      challengePeriodDuration: 2,
      removalChallengeBaseDeposit: "0.00001",
      submissionChallengeBaseDeposit: "0.00001",
      governor: "",
      courtId: "1",
      numberOfJurors: 3,
    });

  return (
    <Container>
      <Header text="Advanced Options" />
      <LabelAndButtonContainer>
        <StyledLabel>
          By default, the recommended parameters are selected. You can edit them or skip them by clicking on Next.
        </StyledLabel>
        <ButtonContainer>
          <LightButton text="Reset" Icon={HistoryIcon} onClick={reset} />{" "}
          <LightButton
            text="Learn more"
            Icon={BookIcon}
            onClick={() =>
              window.open(
                "https://docs.kleros.io/products/curate/kleros-curate-tutorial",
                "_blank",
                "rel=noopener noreferrer"
              )
            }
          />
        </ButtonContainer>
      </LabelAndButtonContainer>
      <StyledAccordion
        items={[
          { title: "Challenge Parameters", body: <ChallengeParameters /> },
          { title: "Arbitration Parameters", body: <AbritrationParameters /> },
        ]}
      />
      <NavigationButtons prevRoute="/submit-list/custom" nextRoute="/submit-list/deploy" />
    </Container>
  );
};
export default AdvancedParameters;
