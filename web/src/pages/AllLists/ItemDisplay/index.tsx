import React from "react";
import { useParams } from "react-router-dom";
import History from "components/HistoryDisplay";
import { useItemDetailsQuery } from "queries/useItemDetailsQuery";
import { useRegistryDetailsQuery } from "queries/useRegistryDetailsQuery";
import ItemInformationCard from "components/InformationCards/ItemInformationCard";

const ItemDisplay: React.FC = () => {
  const { itemId } = useParams();
  const [, listAddress] = itemId?.split("@");
  const { data: itemDetails } = useItemDetailsQuery(itemId);
  const { data: registryDetails } = useRegistryDetailsQuery(listAddress);

  return (
    <div>
      <ItemInformationCard
        {...itemDetails?.item}
        policyURI={registryDetails?.registry.policyURI ?? ""}
        registryAddress={listAddress}
      />

      <History itemId={itemId ?? ""} isItem />
    </div>
  );
};

export default ItemDisplay;
