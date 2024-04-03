import React from "react";
import History from "~src/components/HistoryDisplay";
import { useTheme } from "styled-components";
import ClosedIcon from "assets/svgs/icons/check-circle-outline.svg";
import ItemInformationCard from "components/ItemInformationCard";
import { ItemDetailsFragment } from "src/graphql/graphql";

interface IItem extends ItemDetailsFragment {
  className?: string;
}

const ItemDisplay: React.FC<IItem> = ({ className, ...props }) => {
  const theme = useTheme();
  const historyItems = [
    {
      title: "Item Submitted",
      variant: theme.primaryBlue,
      subtitle: "April 06, 2022",
      rightSided: true,
    },
    {
      title: "Item Challenged",
      party: "- Case #1369 by Alice.eth",
      variant: theme.secondaryPurple,
      subtitle: "April 07, 2022",
      rightSided: true,
    },
    {
      title: "Item Submitted",
      subtitle: "April 06, 2022",
      rightSided: true,
      Icon: ClosedIcon,
    },
  ];

  return (
    <div {...{ className }}>
      <ItemInformationCard {...props} />
      <History items={historyItems} />
    </div>
  );
};

export default ItemDisplay;
