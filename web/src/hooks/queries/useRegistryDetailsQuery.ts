import { graphql } from "src/graphql";
import { useQuery } from "@tanstack/react-query";
import { useGraphqlBatcher } from "context/GraphqlBatcher";
import { Item_Filter, OrderDirection, RegistryDetailsFragment, RegistryItemDetailsFragment } from "src/graphql/graphql";

export type RegistryDetailsQuery = { registry: RegistryDetailsFragment & { items: RegistryItemDetailsFragment[] } };

export const itemFragment = graphql(`
  fragment RegistryItemDetails on Item {
    id
    status
    disputed
    props {
      label
      description
      value
      isIdentifier
      type
    }
    key0
    key1
  }
`);

export const registryFragment = graphql(`
  fragment RegistryDetails on Registry {
    id
    title
    logoURI
    policyURI
    description
    totalItems
    numberOfAbsent
    numberOfPending
    numberOfRegistered
    numberOfDisputed
    metadata

    fieldProps(orderBy: position) {
      label
      description
      type
      isIdentifier
    }
    registerer {
      id
    }
  }
`);

export const registryDetailsQuery = graphql(`
  query RegistryDetails($id: ID!, $where: Item_filter, $orderDirection: OrderDirection) {
    registry(id: $id) {
      ...RegistryDetails
      items(orderBy: latestRequestSubmissionTime, orderDirection: $orderDirection, where: $where) {
        ...RegistryItemDetails
      }
    }
  }
`);

export const registryDetailsWithItemSearchQuery = graphql(`
  query RegistryDetailsWithItemSearch($id: ID!, $where: Item_filter, $keywords: String!) {
    registry(id: $id) {
      ...RegistryDetails
    }
    itemSearch(text: $keywords, where: $where) {
      ...RegistryItemDetails
    }
  }
`);

export const useRegistryDetailsQuery = (
  id?: string | number,
  where?: Item_Filter,
  sortOrder?: OrderDirection,
  keywords?: string | null
) => {
  const isEnabled = id !== undefined;
  const { graphqlBatcher } = useGraphqlBatcher();

  const gqlDocument = keywords ? registryDetailsWithItemSearchQuery : registryDetailsQuery;

  return useQuery<RegistryDetailsQuery>({
    queryKey: ["refetchOnBlock", `registryDetailsQuery${id} ${keywords} ${JSON.stringify(where)} ${sortOrder}`],
    enabled: isEnabled,
    queryFn: async () => {
      const result = await graphqlBatcher.fetch({
        id: crypto.randomUUID(),
        document: gqlDocument,
        variables: { id, orderDirection: sortOrder ?? "desc", keywords, where: { ...where, registry: id } },
      });

      return keywords ? { registry: { ...result.registry, items: [...result.itemSearch] } } : result;
    },
  });
};
