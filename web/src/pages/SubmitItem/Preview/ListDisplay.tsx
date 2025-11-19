import React, { useMemo } from "react";
import { responsiveSize } from "styles/responsiveSize";
import ItemInformationCard from "components/InformationCards/ItemInformationCard";
import { useSubmitItemContext } from "context/SubmitItemContext";
import { ItemDetailsFragment, Status } from "src/graphql/graphql";

interface IListDisplay {}

const ListDisplay: React.FC<IListDisplay> = ({}) => {
  const { fields } = useSubmitItemContext();

  const props = useMemo(
    () =>
      fields.columns.reduce<ItemDetailsFragment["props"]>((acc, current) => {
        acc.push({ ...current, value: fields?.values?.[current.label] });
        return acc;
      }, []),
    [fields]
  );

  return (
    <div className="flex flex-col" style={{ gap: responsiveSize(32, 24) }}>
      <p className="m-0 text-klerosUIComponentsPrimaryBlue">Check how the item is displayed on the Item page:</p>
      <ItemInformationCard
        props={props}
        policyURI="/ipfs/QmSxGYpXHBWBGvGnBeZD1pFxh8fRHj4Z7o3fBzrGiqNx4v/tokens-policy.pdf"
        status={Status.RegistrationRequested}
        id="1"
        disputed={false}
        isPreview
      />
    </div>
  );
};
export default ListDisplay;
