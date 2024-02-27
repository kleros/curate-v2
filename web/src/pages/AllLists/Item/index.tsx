import React from "react";
import InformationCard from "components/InformationCard";
import History from "~src/components/HistoryDisplay";
import { useTheme } from "styled-components";
import ClosedIcon from "assets/svgs/icons/check-circle-outline.svg";

interface IItems {
  title: string;
  description: string;
  className?: string;
}

const ItemDisplay: React.FC<IItems> = ({
  title = "Address Tags",
  description = "A list of public name tags, associated with Ethereum mainnet contract addresses.",
  className,
}) => {
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
      <InformationCard title={title} description={description} isItem />
      <History items={historyItems} />
    </div>
  );
};

export default ItemDisplay;
