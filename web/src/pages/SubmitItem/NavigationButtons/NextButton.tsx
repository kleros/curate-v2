import React, { useMemo } from "react";
import { Button } from "@kleros/ui-components-library";
import { useLocation, useNavigate } from "react-router-dom";
import { useSubmitItemContext } from "context/SubmitItemContext";
import { useRegistryDetailsContext } from "context/RegistryDetailsContext";

interface INextButton {
  nextRoute: string;
}

const NextButton: React.FC<INextButton> = ({ nextRoute }) => {
  const navigate = useNavigate();
  const { fields, isPolicyRead } = useSubmitItemContext();
  const { fieldProps } = useRegistryDetailsContext();

  const location = useLocation();

  const areFieldsFilled = useMemo(() => {
    if (!fields || !fieldProps) return false;

    for (const field of fieldProps) {
      if (!fields.values?.[field.label]) return false;
    }
    return true;
  }, [fields, fieldProps]);

  const isButtonDisabled =
    (location.pathname.includes("/submit-item/item-field") && areFieldsFilled) ||
    (location.pathname.includes("/submit-item/policy") && !isPolicyRead);

  return <Button disabled={isButtonDisabled} onClick={() => navigate(nextRoute)} text="Next" />;
};

export default NextButton;
