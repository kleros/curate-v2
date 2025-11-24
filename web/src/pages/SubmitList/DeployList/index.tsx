import React from "react";
import { responsiveSize } from "styles/responsiveSize";
import NavigationButtons from "../NavigationButtons";
import { AlertMessage, Card } from "@kleros/ui-components-library";
import Progress from "./Progress";
import ListDetails from "./ListDetails";
import { ListProgress, useSubmitListContext } from "context/SubmitListContext";
import { formatValue } from "utils/format";

const DeployList: React.FC = () => {
  const { progress, listData } = useSubmitListContext();
  const isSuccess = progress === ListProgress.SubmitSuccess;

  return (
    <div className="flex flex-col items-center gap-8 w-full py-0" style={{ paddingInline: responsiveSize(0, 108) }}>
      <Card className="flex flex-col w-full h-max">
        <ListDetails />
        <Progress />
      </Card>
      <AlertMessage
        className="w-full [&_svg]:shrink-0"
        variant={isSuccess ? "success" : "warning"}
        title={isSuccess ? "Well done!" : "Almost Ready!"}
        msg={
          isSuccess
            ? "The list was successfully created !"
            : `Creating a list requires 2 transactions. The total cost at the moment is approximately ${formatValue(
                listData.deployCost ?? "0",
                5,
                false
              )} ETH. We recommend that you familiarize yourself with all the parameters to avoid mistakes. When you are ready, click on Create List.`
        }
      />
      <NavigationButtons prevRoute="/submit-list/advanced" />
    </div>
  );
};
export default DeployList;
