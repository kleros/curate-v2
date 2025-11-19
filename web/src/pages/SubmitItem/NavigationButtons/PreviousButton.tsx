import React from "react";
import { Button } from "@kleros/ui-components-library";
import { useNavigate } from "react-router-dom";
import { isEmpty } from "src/utils";

interface IReturnButton {
  prevRoute: string;
}

const ReturnButton: React.FC<IReturnButton> = ({ prevRoute }) => {
  const navigate = useNavigate();

  return (
    <Button
      className={isEmpty(prevRoute) ? "hidden" : "flex"}
      onClick={() => navigate(prevRoute)}
      text="Return"
      variant="secondary"
    />
  );
};

export default ReturnButton;
