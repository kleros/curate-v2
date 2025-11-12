import React from "react";
import { Card } from "@kleros/ui-components-library";
import { useIsListView } from "context/IsListViewProvider";
import StatusBanner from "./StatusBanner";
import RegistryInfo from "./RegistryInfo";
import { useNavigateAndScrollTop } from "hooks/useNavigateAndScrollTop";
import { GetRegistriesByIdsQuery } from "src/graphql/graphql";
import { Status } from "src/consts/status";

type List = GetRegistriesByIdsQuery["registries"][number];
interface IListCard extends List {
  overrideIsListView?: boolean;
  itemId?: string;
  totalItems: number;
  status: Status;
}

const RegistryCard: React.FC<IListCard> = ({ id, itemId, title, logoURI, totalItems, status, overrideIsListView }) => {
  const { isListView } = useIsListView();
  const navigateAndScrollTop = useNavigateAndScrollTop();

  const registryAddressAndItemId = `${id}-${itemId}`;

  return (
    <>
      {!isListView || overrideIsListView ? (
        <Card
          className="w-full h-[274px]"
          hover
          onClick={() => navigateAndScrollTop(`/lists/${registryAddressAndItemId}/display/1/desc/all`)}
        >
          <StatusBanner {...{ status }} />
          <RegistryInfo {...{ title, logoURI, totalItems, status }} />
        </Card>
      ) : (
        <Card
          className="flex grow w-full h-max lg:h-16"
          hover
          onClick={() => navigateAndScrollTop(`/lists/${registryAddressAndItemId}/display/desc/all`)}
        >
          <RegistryInfo {...{ title, logoURI, totalItems, status }} isListView />
        </Card>
      )}
    </>
  );
};

export default RegistryCard;
