import React from "react";
import { useTheme } from "styled-components";
import { useParams } from "react-router-dom";
import ClosedIcon from "svgs/icons/check-circle-outline.svg";
import InformationCard from "components/InformationCard";
import History from "components/HistoryDisplay";
import { useItemDetailsQuery } from "queries/useItemDetailsQuery";
import { useRegistryDetailsQuery } from "queries/useRegistryDetailsQuery";
import { mapFromSubgraphStatus } from "components/RegistryCard/StatusBanner";

const ItemDisplay: React.FC = () => {
  const { itemId } = useParams();
  const [, listAddress] = itemId?.split("@");
  const { data: itemDetails } = useItemDetailsQuery(itemId);
  const { data: registryDetails } = useRegistryDetailsQuery(listAddress);
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
    <div>
      <InformationCard
        title={itemDetails?.item?.key0}
        description={itemDetails?.item?.key1}
        status={mapFromSubgraphStatus(itemDetails?.item?.status, itemDetails?.item?.disputed)}
        registerer={itemDetails?.item?.registerer.id}
        policyURI={registryDetails?.registry.policyURI}
        isItem={true}
      />
      <History items={historyItems} />
    </div>
  );
};

export default ItemDisplay;
