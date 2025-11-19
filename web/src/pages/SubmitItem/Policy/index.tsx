import React from "react";
import NavigationButtons from "../NavigationButtons";
import Title from "../Title";
import Info from "./Info";
import ConfirmationBox from "./ConfirmationBox";
import ReadPolicy from "./ReadPolicy";
import { useRegistryDetailsContext } from "context/RegistryDetailsContext";

const Policy: React.FC = () => {
  const { fieldProps } = useRegistryDetailsContext();

  return (
    <div className="flex flex-col">
      <Title text="Policy Review" />
      <ReadPolicy />
      <Info />
      <ConfirmationBox />
      <NavigationButtons
        prevRoute={`../item-field/${fieldProps?.length ? fieldProps.length - 1 : 0}`}
        nextRoute="../preview"
      />
    </div>
  );
};

export default Policy;
