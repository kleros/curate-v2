import React from "react";
import { useParams } from "react-router-dom";
import History from "components/HistoryDisplay";
import { useItemDetailsQuery } from "queries/useItemDetailsQuery";
import { useRegistryDetailsQuery } from "queries/useRegistryDetailsQuery";
import { mapFromSubgraphStatus } from "components/RegistryCard/StatusBanner";
import ItemInformationCard from "components/ItemInformationCard";

const ItemDisplay: React.FC = () => {
  const { itemId } = useParams();
  const [, listAddress] = itemId?.split("@");
  const { data: itemDetails } = useItemDetailsQuery(itemId);
  const { data: registryDetails } = useRegistryDetailsQuery(listAddress);

  return (
    <div>
      <ItemInformationCard
        {...itemDetails?.item}
        status={mapFromSubgraphStatus(itemDetails?.item?.status ?? "", itemDetails?.item?.disputed ?? false)}
        policyURI={registryDetails?.registry.policyURI}
        isItem={true}
      />

      <History itemId={itemId ?? ""} isItem />
    </div>
  );
};

export default ItemDisplay;
