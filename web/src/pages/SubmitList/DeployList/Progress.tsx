import { Steps } from "@kleros/ui-components-library";
import React, { useMemo } from "react";
import { ListProgress, useSubmitListContext } from "context/SubmitListContext";
import useIsDesktop from "hooks/useIsDesktop";

const Progress: React.FC = () => {
  const { progress } = useSubmitListContext();
  const isDesktop = useIsDesktop();
  const progressValue = useMemo(() => {
    switch (progress) {
      case ListProgress.ConfirmingDeploy:
        return 1;
      case ListProgress.Deployed:
        return 2;
      case ListProgress.ConfirmingSubmit:
        return 3;
      case ListProgress.SubmitSuccess:
        return 4;
      default:
        return 0;
    }
  }, [progress]);

  const steps = [
    { title: "Start" },
    { title: "Confirm" },
    { title: "Deployed" },
    { title: "Confirm Submit" },
    { title: "Submitted" },
  ];

  return (
    <div className="w-full p-8">
      <Steps
        className="w-full h-auto pt-4 pb-4"
        items={steps}
        currentItemIndex={progressValue}
        horizontal={isDesktop}
      />
    </div>
  );
};
export default Progress;
