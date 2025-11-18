import React from "react";
import { Button, Card } from "@kleros/ui-components-library";
import { useNavigateAndScrollTop } from "hooks/useNavigateAndScrollTop";
import { responsiveSize } from "styles/responsiveSize";
import StatusBanner, { mapFromSubgraphStatus } from "../RegistryCard/StatusBanner";
import ArrowIcon from "svgs/icons/arrow.svg";
import { ItemDetailsFragment } from "src/graphql/graphql";
import ItemField from "./ItemField";
import { cn } from "~src/utils";
import clsx from "clsx";

const landscapeGridColsCalc =
  "lg:grid-cols-[1fr_calc(150px+(180-150)*(min(max(100vw,900px),1250px)-900px)/(1250-900))_max-content]";
const landscapeGapCalc = "lg:gap-[calc(16px+(36-16)*(min(max(100vw,900px),1250px)-900px)/(1250-900))]";

interface IItemCard extends ItemDetailsFragment {}

const ItemCard: React.FC<IItemCard> = ({ id, status, disputed, props }) => {
  const navigateAndScrollTop = useNavigateAndScrollTop();

  // sort the props
  const sortedProps = sortItemProps(props);

  return (
    <Card
      className="flex grow w-full h-max lg:h-16"
      hover
      onClick={() => navigateAndScrollTop(`/lists/item/${id?.toString()}`)}
    >
      <div
        className={cn(
          "grid grid-rows-[repeat(3,min-content)] grid-cols-[1fr_min-content]",
          "w-full h-max p-4 gap-y-2 items-center",
          "lg:h-16 lg:justify-between lg:grid-rows-[1fr] lg:py-0 lg:px-8",
          landscapeGridColsCalc
        )}
        style={{ columnGap: responsiveSize(12, 32, 900) }}
      >
        <div
          className={cn(
            "flex flex-col justify-between items-start gap-4 w-fit col-span-2",
            "lg:flex-row lg:items-center lg:col-span-1",
            landscapeGapCalc
          )}
        >
          {sortedProps.map((prop) => prop.isIdentifier && <ItemField key={prop.label} {...prop} />)}
        </div>
        <StatusBanner {...{ status: mapFromSubgraphStatus(status, disputed) }} isListView />
        <Button
          className={clsx(
            "bg-transparent p-0 flex-row-reverse gap-2",
            "[&_.button-text]:text-klerosUIComponentsPrimaryBlue [&_.button-text]:font-normal",
            "focus:bg-transparent hover:bg-transparent"
          )}
          text="Open"
          Icon={ArrowIcon}
        />
      </div>
    </Card>
  );
};

type ItemProp = ItemDetailsFragment["props"][number];

export const sortItemProps = (props: ItemDetailsFragment["props"]) => {
  const itemSort = (a: ItemProp, b: ItemProp) => {
    // props will show on the item card in this order
    const order = { image: 1, text: 2, address: 3, file: 4, link: 5 };

    const typeA = order[a.type] || Infinity;
    const typeB = order[b.type] || Infinity;

    if (typeA < typeB) {
      return -1;
    } else if (typeA > typeB) {
      return 1;
    } else {
      return a.label.localeCompare(b.label);
    }
  };
  return props.sort(itemSort);
};

export default ItemCard;
