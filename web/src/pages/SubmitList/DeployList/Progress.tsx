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

  return <Steps className="w-full h-auto p-8" items={steps} currentItemIndex={progressValue} horizontal={isDesktop} />;
};
export default Progress;
