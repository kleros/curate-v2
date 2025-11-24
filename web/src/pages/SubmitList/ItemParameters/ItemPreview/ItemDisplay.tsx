import React from "react";
import { responsiveSize } from "styles/responsiveSize";
import ItemInformationCard from "components/InformationCards/ItemInformationCard";
import { useSubmitListContext } from "context/SubmitListContext";
import { constructItemWithMockValues } from "utils/submitListUtils";

interface IItemDisplay {}

const ItemDisplay: React.FC<IItemDisplay> = ({}) => {
  const { listMetadata } = useSubmitListContext();
  const item = constructItemWithMockValues(listMetadata);
  return (
    <div className="flex flex-col" style={{ gap: responsiveSize(32, 24) }}>
      <p className="text-klerosUIComponentsPrimaryBlue">Check how the item is displayed on the Item page:</p>
      <ItemInformationCard className="m-0" {...item} policyURI={listMetadata.policyURI ?? ""} isPreview />
    </div>
  );
};
export default ItemDisplay;
