import React from "react";
import { Button } from "@kleros/ui-components-library";
import { useLocation, useNavigate } from "react-router-dom";
import { ListProgress, useSubmitListContext } from "context/SubmitListContext";
import { isEmpty } from "src/utils";
interface IReturnButton {
  prevRoute: string;
}

const ReturnButton: React.FC<IReturnButton> = ({ prevRoute }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isDeployPage = location.pathname.includes("/deploy");

  const { progress, isSubmittingList } = useSubmitListContext();

  const hideReturn = isDeployPage && progress === ListProgress.SubmitSuccess;
  return (
    !hideReturn && (
      <Button
        className={isEmpty(prevRoute) ? "hidden" : "flex"}
        onPress={() => navigate(prevRoute)}
        text="Return"
        variant="secondary"
        isDisabled={isSubmittingList}
      />
    )
  );
};

export default ReturnButton;
