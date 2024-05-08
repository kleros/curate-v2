import React, { useMemo } from "react";
import { Button } from "@kleros/ui-components-library";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSubmitItemContext } from "context/SubmitItemContext";
import { useRegistryDetailsContext } from "context/RegistryDetailsContext";
import { isUndefined } from "utils/index";

interface INextButton {
  nextRoute: string;
}

const NextButton: React.FC<INextButton> = ({ nextRoute }) => {
  const navigate = useNavigate();
  const { fields, isPolicyRead } = useSubmitItemContext();
  const { fieldProps } = useRegistryDetailsContext();
  const { id } = useParams();

  const location = useLocation();

  const areFieldsFilled = useMemo(() => {
    if (!fields || !fieldProps) return false;

    for (const field of fieldProps) {
      if (!fields.values?.[field.label]) return false;
    }
    return true;
  }, [fields, fieldProps]);

  const isCurrentFieldFilled = useMemo(() => {
    if (!location.pathname.includes("item-field")) return false;
    if (!fields || !fieldProps || !id) return false;

    const value = fields.values?.[fieldProps[Number(id)].label];
    return !isUndefined(value) && value !== "";
  }, [id, fieldProps, fields, location]);

  const isButtonDisabled =
    (location.pathname.includes("/item-field") && !isCurrentFieldFilled) ||
    (location.pathname.includes("/submit-item/preview") && areFieldsFilled) ||
    (location.pathname.includes("/policy") && !isPolicyRead);

  return <Button disabled={isButtonDisabled} onClick={() => navigate(nextRoute)} text="Next" />;
};

export default NextButton;
