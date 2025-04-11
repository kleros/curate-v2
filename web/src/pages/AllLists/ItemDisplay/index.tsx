import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import History from "components/HistoryDisplay";
import { useItemDetailsQuery } from "queries/useItemDetailsQuery";
import { useRegistryDetailsQuery } from "queries/useRegistryDetailsQuery";
import ItemInformationCard from "components/InformationCards/ItemInformationCard";
import { MAIN_CURATE_ADDRESS } from "src/consts";

const ItemDisplay: React.FC = () => {
  const { itemId } = useParams();
  const [, listAddress] = itemId ? itemId?.split("@") : [undefined, undefined];
  const navigate = useNavigate();

  const { data: itemDetails } = useItemDetailsQuery(itemId);
  const { data: registryDetails } = useRegistryDetailsQuery(listAddress);

  // redirect to list page if the item belongs to main curate
  useEffect(() => {
    if (listAddress === MAIN_CURATE_ADDRESS && itemDetails?.item?.key0) {
      navigate(`/lists/${itemDetails.item.key0}-${itemId}/display/1/desc/all`);
    }
  }, [itemId, itemDetails]);

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
