import React, { useMemo } from "react";
import { responsiveSize } from "styles/responsiveSize";
import ItemCard from "components/ItemCard";
import { useSubmitItemContext } from "context/SubmitItemContext";
import { ItemDetailsFragment, Status } from "src/graphql/graphql";

interface IItemDisplay {}

const ItemDisplay: React.FC<IItemDisplay> = ({}) => {
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
      <p className="text-klerosUIComponentsPrimaryBlue">Check how the item is displayed on the List page:</p>
      <ItemCard props={props} status={Status.RegistrationRequested} />
    </div>
  );
};
export default ItemDisplay;
