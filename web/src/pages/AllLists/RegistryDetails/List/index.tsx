import React, { useMemo } from "react";
import Skeleton from "react-loading-skeleton";
import StatsAndFilters from "components/StatsAndFilters";
import ItemCard from "components/ItemCard";
import { ItemDetailsFragment, OrderDirection } from "src/graphql/graphql";
import Search from "components/Search";
import { useParams, useSearchParams } from "react-router-dom";
import { decodeItemURIFilter } from "utils/uri";
import { useRegistryDetailsQuery } from "hooks/queries/useRegistryDetailsQuery";
import { List_filters } from "consts/filters";
import { Address } from "viem";

interface IList {
  registryAddress: Address;
}

const List: React.FC<IList> = ({ registryAddress }) => {
  const { order, filter } = useParams();
  const [searchParmams] = useSearchParams();
  const keywords = searchParmams.get("keywords");
  const decodedFilter = decodeItemURIFilter(filter ?? "all");

  const { data: registryDetails } = useRegistryDetailsQuery(
    registryAddress?.toLowerCase(),
    {
      ...decodedFilter,
    },
    order === "asc" ? OrderDirection.Asc : OrderDirection.Desc,
    keywords
  );

  const totalItems = useMemo<number>(() => {
    if (!registryDetails || !registryDetails.registry) return 0;

    const registry = registryDetails.registry;

    if (keywords) return registry?.items?.length;

    switch (JSON.stringify(decodedFilter)) {
      case JSON.stringify(List_filters.Disputed):
        return registry.numberOfDisputed;
      case JSON.stringify(List_filters.Included):
        return registry.numberOfRegistered;
      case JSON.stringify(List_filters.Removed):
        return registry.numberOfAbsent;
      case JSON.stringify(List_filters.Pending):
        return registry.numberOfPending;
      case JSON.stringify(List_filters.Active):
        return registry.totalItems - registry.numberOfAbsent;
      default:
        return registry.totalItems;
    }
  }, [registryDetails, decodedFilter]);

  return (
    <>
      <Search />
      <StatsAndFilters fields={[{ label: "Items", value: totalItems?.toString() }]} />
      <div className="flex flex-col gap-2 justify-center">
        {registryDetails?.registry?.items
          ? registryDetails?.registry.items.map((item) => <ItemCard key={item.id} {...(item as ItemDetailsFragment)} />)
          : Array.from({ length: 3 }).map((_, index) => <Skeleton height={64} key={index} />)}
      </div>
    </>
  );
};

export default List;
