import React from "react";
import NavigationButtons from "../NavigationButtons";
import Header from "../Header";
import LightButton from "components/LightButton";
import HistoryIcon from "svgs/icons/history.svg";
import BookIcon from "svgs/icons/book.svg";
import { Accordion } from "@kleros/ui-components-library";
import ChallengeParameters from "./ChallengeParameters";
import AbritrationParameters from "./ArbitrationParameters";
import { useSubmitListContext } from "context/SubmitListContext";

const lightButtonStyle = "flex gap-1 [&_.button-text]:text-klerosUIComponentsPrimaryBlue";

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
    <div className="flex flex-col items-center gap-8 w-full py-0 px-fluid-0-108">
      <Header text="Advanced Options" />
      <div className="flex flex-col w-full gap-4 mb-2.5">
        <label className="text-center w-full">
          By default, the recommended parameters are selected. You can edit them.
        </label>
        <div className="flex justify-center gap-8 w-full">
          <LightButton
            className={lightButtonStyle}
            text="Reset"
            Icon={() => <HistoryIcon className="fill-klerosUIComponentsPrimaryBlue" />}
            onPress={reset}
          />
          <LightButton
            className={lightButtonStyle}
            text="Learn more"
            Icon={() => <BookIcon className="fill-klerosUIComponentsPrimaryBlue" />}
            onPress={() =>
              window.open(
                "https://docs.kleros.io/products/curate/kleros-curate-tutorial",
                "_blank",
                "rel=noopener noreferrer"
              )
            }
          />
        </div>
      </div>
      <Accordion
        className="w-full"
        defaultExpanded={1}
        items={[
          { title: "Challenge Parameters", body: <ChallengeParameters /> },
          { title: "Arbitration Parameters", body: <AbritrationParameters /> },
        ]}
      />
      <NavigationButtons prevRoute="/submit-list/custom" nextRoute="/submit-list/deploy" />
    </div>
  );
};
export default AdvancedParameters;
